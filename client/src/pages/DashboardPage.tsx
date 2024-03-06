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
import CashAccount from "../models/cashAccount.model";
import NetWorthEntry from "../models/netWorthEntry.model";
import { getDayLabels } from "../utils/getDayLabels"; // Assume this is a utility function you've created
import NetWorthDataPoint from "../models/netWorthDataPoint.model";
import AccountsOverview from "../models/accountsOverview.model";

const DashboardPage = () => {
  const me = useMe();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(true);

  const [stage, setStage] = useState(0);
  const [cashAccounts, setCashAccounts] = useState<CashAccount[]>([]);
  const [totalCashBalance, setTotalCashBalance] = useState<number>(0);
  const [netWorthForLast7Days, setNetWorthForLast7Days] = useState<number[]>([
    0, 0, 0, 0, 0, 0, 0,
  ]);
  const [maxNetWorth, setMaxNetWorth] = useState<number>(0);
  const [minNetWorth, setMinNetWorth] = useState<number>(0);
  const [maxNetWorthDifference, setMaxNetWorthDifference] = useState<number>(0);
  const [netWorthData, setNetWorthData] = useState<NetWorthDataPoint[]>([]);

  useEffect(() => {
    me().then((user) => {
      axiosPrivate
        .get(`/plaidItem/user/${user.id}`)
        .catch(() => {
          navigate("/connect-account");
        })
        .then(() => {
          fetchAccountsOverview();
          fetchUserNetWorthData(user);
          setLoading(false);
        });
    });
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
    try {
      const { data } = await axiosPrivate.get(
        `/netWorth/user/last7/${user.id}`,
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
        bankName: account.institution_name,
        last4CCNumber: account.mask,
        bankNickname: account.name,
        value: account.balances.available,
      })) || [];

    const totalUserCash = cashAccountsList.reduce(
      (sum: number, account: { value: number }) => sum + account.value,
      0,
    );
    setTotalCashBalance(totalUserCash);
    setCashAccounts(cashAccountsList);
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
        <HeaderNetWorth />
      </Box>
      <Box className={`dashboard-box-middle stage${stage}`} width="full">
        <Box className={`dashboard-box-net-worth stage${stage}`} width="100vw">
          <NetWorthChange
            netWorthYesterday={netWorthForLast7Days[5]}
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
