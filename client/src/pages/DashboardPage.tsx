import { Box, Center, Spinner, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import HeaderNetWorth from "../modules/dashboard/HeaderNetWorth";
import NetWorthChange from "../modules/dashboard/NetWorthChange";
import NetWorthValue from "../modules/dashboard/NetWorthValue";
import CashTabComponent from "../modules/dashboard/CashTabComponent";
import LinechartNetWorth from "../modules/dashboard/LinechartNetWorth";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useMe from "../modules/auth/useMe";
import NetWorthEntry from "../models/netWorthEntry.model";
import { getDayLabels } from "../utils/getDayLabels";
import NetWorthDataPoint from "../models/netWorthDataPoint.model";
import AccountsOverview from "../models/accountsOverview.model";
import BankAccountBase from "../models/bankAccountBase.model";
import PlaidLink from "../modules/auth/PlaidLink";

const DashboardPage = () => {
  const me = useMe();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");

  const [stage, setStage] = useState(0);
  const [cashAccounts, setCashAccounts] = useState<BankAccountBase[]>([]);
  const [loanAccounts, setLoanAccounts] = useState<BankAccountBase[]>([]);
  const [investmentAccounts, setInvestmentAccounts] = useState<
    BankAccountBase[]
  >([]);
  const [creditCardAccounts, setCreditCardAccounts] = useState<
    BankAccountBase[]
  >([]);
  const [totalCashBalance, setTotalCashBalance] = useState<number>(0);
  const [totalLoanBalance, setTotalLoanBalance] = useState<number>(0);
  const [totalInvestmentsBalance, setTotalInvestmentsBalance] =
    useState<number>(0);
  const [totalCreditCardBalance, setTotalCreditCardBalance] =
    useState<number>(0);
  const [netWorthForLast7Days, setNetWorthForLast7Days] = useState<number[]>([
    0, 0, 0, 0, 0, 0, 0,
  ]);
  const [maxNetWorth, setMaxNetWorth] = useState<number>(0);
  const [minNetWorth, setMinNetWorth] = useState<number>(0);
  const [maxNetWorthDifference, setMaxNetWorthDifference] = useState<number>(0);
  const [netWorthData, setNetWorthData] = useState<NetWorthDataPoint[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await me();
        setUserId(user.id as string);
        // Attempt to get the Plaid item for the user
        await axiosPrivate.get(`/plaidItem/user/${user.id}`);
        // update transactions and net worth tables each time dashboard page loads, in case the user added another account
        await axiosPrivate.post(`/plaid/refresh_transaction_data`);
        // await axiosPrivate.post(`/plaid/refresh_net_worth`);


        // If successful, proceed with fetching account overview and net worth data
        await Promise.all([
          fetchAccountsOverview(),
          fetchUserNetWorthData(user),
        ]);
      } catch (error) {
        console.error("Error fetching users plaid item entry: ", error);
        navigate("/connect-account");
        return;
      }
      setLoading(false);
    };

    loadData();
  }, []);

  const fetchAccountsOverview = async () => {
    try {
      const { data } = await axiosPrivate.get("/plaid/get_accounts_overview");
      processAccountsOverview(data);
    } catch (error) {
      console.error("Failed to fetch accounts overview:", error);
    }
  };
  const fetchUserNetWorthData = async (user: any) => {
    let netWorthUserId = 30;
    if (user.email == "anirudh.margam@tamu.edu") {
      netWorthUserId = 33;
    }
    try {
      const { data } = await axiosPrivate.get(
        `/netWorth/user/last7/${netWorthUserId}`
      );
      processUserNetWorths(data);
    } catch (error) {
      console.error("Failed to fetch net worth data:", error);
    }
  };

  useEffect(() => {
    const netWorthValues = netWorthForLast7Days;
    const dayLabels = getDayLabels();

    const netWorthData = dayLabels.map((label, index) => ({
      name: label,
      value: netWorthValues[index],
    }));
    setNetWorthData(netWorthData);
  }, [netWorthForLast7Days]);

  const processUserNetWorths = (netWorths: NetWorthEntry[]) => {
    const netWorthValues = netWorths.map((nw) => nw.amount).reverse();
    const maxNetWorth = Math.max(...netWorthValues);
    const minNetWorth = Math.min(...netWorthValues);
    const maxNetWorthDifference = maxNetWorth - minNetWorth;

    // Fill in missing days with 0 if there are less than 7 days
    if (netWorthValues.length < 7) {
      for (let i = 0; i < 7; i++) {
        if (i > netWorthValues.length - 1) {
          netWorthValues.unshift(0);
        }
      }
    }
    setNetWorthForLast7Days(netWorthValues);

    setMaxNetWorth(maxNetWorth);
    setMinNetWorth(minNetWorth);
    setMaxNetWorthDifference(maxNetWorthDifference);
  };

  const processAccountsOverview = (data: AccountsOverview) => {
    const cashAccountsList =
      data.depository?.map((account) => ({
        institutionName: account.institution_name,
        last4AccountNumber: account.mask,
        bankNickname: account.official_name,
        balance: account.balances.available,
      })) || [];
    const totalUserCash = cashAccountsList.reduce(
      (sum: number, account: { balance: number }) => sum + account.balance,
      0
    );
    setTotalCashBalance(totalUserCash);
    setCashAccounts(cashAccountsList);

    const loanAccountsList = data.loan?.map((account) => ({
      institutionName: account.institution_name,
      last4AccountNumber: account.mask,
      bankNickname: account.official_name,
      balance: account.balances.available,
    }));
    const totalUserLoans = loanAccountsList.reduce(
      (sum: number, account: { balance: number }) => sum + account.balance,
      0
    );
    setTotalLoanBalance(totalUserLoans);
    setLoanAccounts(loanAccountsList);

    const investmentAccountsList = data.investment?.map((account) => ({
      institutionName: account.institution_name,
      last4AccountNumber: account.mask,
      bankNickname: account.official_name,
      balance: account.balances.available,
    }));
    const totalUserInvestments = investmentAccountsList.reduce(
      (sum: number, account: { balance: number }) => sum + account.balance,
      0
    );
    setTotalInvestmentsBalance(totalUserInvestments);
    setInvestmentAccounts(investmentAccountsList);

    const creditCardsAccountsList = data.credit?.map((account) => ({
      institutionName: account.institution_name,
      last4AccountNumber: account.mask,
      bankNickname: account.official_name,
      balance: account.balances.available,
    }));
    const totalUserCreditCardsBalance = creditCardsAccountsList.reduce(
      (sum: number, account: { balance: number }) => sum + account.balance,
      0
    );
    setTotalCreditCardBalance(totalUserCreditCardsBalance);
    setCreditCardAccounts(creditCardsAccountsList);
  };

  if (loading) {
    return (
      <Center width="100vw" height="100vh" bg="#222222">
        <Spinner size="xl" color="white" />
      </Center>
    );
  }

  return (
    <VStack
      height="100vh"
      width="100vw"
      bg="#222222"
      justifyContent="flex-start"
    >
      <Box className={`dashboard-box-header stage${stage}`} width="full">
        <HeaderNetWorth userId={userId}/>
      </Box>
      <Box className={`dashboard-box-middle stage${stage}`} width="full">
        <Box className={`dashboard-box-net-worth stage${stage}`} width="100vw">
          <NetWorthChange
            netWorth1WeekAgo={netWorthForLast7Days[0]}
            netWorthToday={netWorthForLast7Days[6]}
          />
          <NetWorthValue netWorth={netWorthForLast7Days[6]} />
          <LinechartNetWorth
            data={netWorthData}
            maxNetWorthDifference={maxNetWorthDifference}
            maxNetWorth={maxNetWorth}
            minNetWorth={minNetWorth}
          />
        </Box>
      </Box>
      <Box
        className={`dashboard-box-tabs stage${stage}`}
        width="98vw"
        pt="20px"
        pb="100px"
      >
        <CashTabComponent
          accounts={cashAccounts}
          label="Cash"
          totalValue={totalCashBalance}
        />
        <CashTabComponent
          accounts={investmentAccounts}
          label="Investments"
          totalValue={totalInvestmentsBalance}
        />
        <CashTabComponent
          accounts={creditCardAccounts}
          label="Credit Cards"
          totalValue={totalCreditCardBalance}
        />
        <CashTabComponent
          accounts={loanAccounts}
          label="Loans"
          totalValue={totalLoanBalance}
        />
        <PlaidLink type="connect-another-account" />
      </Box>
    </VStack>
  );
};

export default DashboardPage;
