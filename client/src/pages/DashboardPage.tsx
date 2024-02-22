import { Box, Center, Spinner, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import HeaderNetWorth from "../modules/dashboard/HeaderNetWorth";
import NetWorthChange from "../modules/dashboard/NetWorthChange";
import NetWorthValue from "../modules/dashboard/NetWorthValue";
import CashTabComponent from "../modules/dashboard/CashTabComponent";
import LinechartNetWorth from "../modules/dashboard/LinechartNetWorth";
import useUser from "../hooks/useUser";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useMe from "../modules/auth/useMe";

interface Account {
  account_id: string;
  balances: {
    available: number;
    current: number;
    iso_currency_code: string;
    limit: null | number;
    unofficial_currency_code: null | string;
  };
  mask: string;
  name: string;
  official_name: string;
  persistent_account_id: string;
  subtype: string;
  type: string;
}

interface AccountsOverview {
  depository: Account[];
  investment: Account[];
  creditCard: Account[];
  loans: Account[];
}

interface AccountsOverviewResponse {
  bankName: string;
  accountsOverview: AccountsOverview;
}

interface CashAccount {
  bankName: string;
  last4CCNumber: string;
  bankNickname: string;
  value: number;
}

const DashboardPage = () => {
  const { user }: any = useUser();
  const me = useMe();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(true);

  const [stage, setStage] = useState(0);
  const [cashAccounts, setCashAccounts] = useState<CashAccount[]>([]);


  useEffect(() => {
    me().then((user) => {
      axiosPrivate
        .get(`/plaid/user/${user.id}`)
        .catch(() => {
          navigate("/connect-account");
        })
        .then(() => {
          setLoading(false);
        });
    });
  }, []);

  useEffect(() => {
    const fetchAccountsOverview = async () => {
      try {
        const { data } = await axiosPrivate.get('/plaid/get_accounts_overview');
        processAccountsOverview(data);
      } catch (error) {
        console.error('Failed to fetch accounts overview:', error);
      }
    };
  
    fetchAccountsOverview();
  }, []);

  const processAccountsOverview = (data: AccountsOverviewResponse) => {
    const cashAccountsList = data.accountsOverview.depository?.map(account => ({
      bankName: data.bankName,
      last4CCNumber: account.mask,
      bankNickname: account.name,
      value: account.balances.available,
    })) || [];

    setCashAccounts(cashAccountsList);
    console.log("\n\ncashAccountsList\n\n");
    console.log(cashAccountsList);
    console.log("\n\ncashAccountsList\n\n");
  }

  if (loading) {
    return (
      <Center width="100vw" height="100vh" bg="#222222">
        <Spinner size="xl" color="white" />
      </Center>
    );
  }

  // TODO
  // now that we have users cash accounts retrieved from API call, and we are ready to display in CashTabComponent, 
  //   how do we store the user + plaiditem in the plaid_item table?

  const totalCashBalance = 0;
  const totalInvestmentsBalance = 0;
  const totalCreditCardsBalance = 0;
  const totalLoansBalance = 0;
  const netWorthToday = (totalCashBalance + totalInvestmentsBalance) - (totalCreditCardsBalance + totalLoansBalance); 
  const netWorthYesterday = 9000; // how to calculate this?
  const goalSavingsAmount = 0;
  const monthlyBudget = 0;
  const remainingBudgetThisMonth = 0;
  const projectedSavingsAmount = 0;

  return (
    <VStack
      height="100vh"
      width="100vw"
      bg="#222222"
      justifyContent="flex-start"
    >
      <Box className={`dashboard-box-header stage${stage}`} width="full">
        <HeaderNetWorth />
        {/* <HeaderBurnRate /> */}
      </Box>
      <Box className={`dashboard-box-middle stage${stage}`} width="full">
        {/* <Box className={`dashboard-box-projected-savings stage${stage}`}  width="100vw">
          <BurnRateChange projectedSavings={projectedSavings} targetSavings={targetSavings} />
          <BurnRateValue projectedSavings={projectedSavings} />
          <LinechartBurnRate />
        </Box> */}
        <Box className={`dashboard-box-net-worth stage${stage}`} width="100vw">
          <NetWorthChange
            netWorthYesterday={netWorthYesterday}
            netWorthToday={netWorthToday}
          />
          <NetWorthValue netWorth={netWorthToday} />
          <LinechartNetWorth />
        </Box>
      </Box>
      <Box
        className={`dashboard-box-tabs stage${stage}`}
        width="full"
        pt="20px"
      >
        <CashTabComponent
          accounts={cashAccounts}
          label="Cash"
          totalValue={totalCashBalance}
        />
        <CashTabComponent
          accounts={cashAccounts}
          label="Investments"
          totalValue={totalCashBalance}
        />
        <CashTabComponent
          accounts={cashAccounts}
          label="Credit Cards"
          totalValue={totalCashBalance}
        />
        <CashTabComponent
          accounts={cashAccounts}
          label="Loans"
          totalValue={totalCashBalance}
        />
      </Box>
    </VStack>
  );
};

export default DashboardPage;
