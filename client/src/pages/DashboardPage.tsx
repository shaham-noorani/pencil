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
import AccountsOverviewResponse from "../models/accountsOverviewResponse.model";
import CashAccount from "../models/cashAccount.model";
import NetWorthEntry from "../models/netWorthEntry.model";
import { getDayLabels } from '../utils/getDayLabels'; // Assume this is a utility function you've created
import NetWorthDataPoint from "../models/netWorthDataPoint.model";

const DashboardPage = () => {
  const { user }: any = useUser();
  const me = useMe();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(true);

  const [stage, setStage] = useState(0);
  const [cashAccounts, setCashAccounts] = useState<CashAccount[]>([]);
  const [totalCashBalance, setTotalCashBalance] = useState<number>(0);
  const [netWorthToday, setNetWorthToday] = useState<number>(0);
  const [netWorth1DaysAgo, setNetWorth1DaysAgo] = useState<number>(0);
  const [netWorth2DaysAgo, setNetWorth2DaysAgo] = useState<number>(0);
  const [netWorth3DaysAgo, setNetWorth3DaysAgo] = useState<number>(0);
  const [netWorth4DaysAgo, setNetWorth4DaysAgo] = useState<number>(0);
  const [netWorth5DaysAgo, setNetWorth5DaysAgo] = useState<number>(0);
  const [netWorth6DaysAgo, setNetWorth6DaysAgo] = useState<number>(0);
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

  useEffect(() => {
    const fetchUserNetWorthData = async () => {
      try {
        const { data } = await axiosPrivate.get(`/netWorth/user/last7/${user.id}`);
        processUserNetWorths(data);
      } catch (error) {
        console.error('Failed to fetch net worth data:', error);
      }
    };
  
    if (user?.id) { 
      fetchUserNetWorthData();
    }
  }, []);

  useEffect(() => {
    const netWorthValues = [
      netWorth6DaysAgo,
      netWorth5DaysAgo,
      netWorth4DaysAgo,
      netWorth3DaysAgo,
      netWorth2DaysAgo,
      netWorth1DaysAgo,
      netWorthToday,
    ];
    const dayLabels = getDayLabels();
  
    const netWorthData = dayLabels.map((label, index) => ({
      name: label,
      value: netWorthValues[index]
    }));
    setNetWorthData(netWorthData);
  }, [netWorthToday, netWorth1DaysAgo, netWorth2DaysAgo, netWorth3DaysAgo, netWorth4DaysAgo, netWorth5DaysAgo, netWorth6DaysAgo]); // TODO: fix dependencies?
  
  const processUserNetWorths = (netWorths: NetWorthEntry[]) => {
    const netWorthValues = netWorths.map(nw => nw.amount);
    const maxNetWorth = Math.max(...netWorthValues);
    const minNetWorth = Math.min(...netWorthValues);
    const maxNetWorthDifference = maxNetWorth - minNetWorth;  

    setNetWorthToday(netWorthValues[0] ?? 0);
    setNetWorth1DaysAgo(netWorthValues[1] ?? 0);
    setNetWorth2DaysAgo(netWorthValues[2] ?? 0);
    setNetWorth3DaysAgo(netWorthValues[3] ?? 0);
    setNetWorth4DaysAgo(netWorthValues[4] ?? 0);
    setNetWorth5DaysAgo(netWorthValues[5] ?? 0);
    setNetWorth6DaysAgo(netWorthValues[6] ?? 0);

    setMaxNetWorth(maxNetWorth);
    setMinNetWorth(minNetWorth);
    setMaxNetWorthDifference(maxNetWorthDifference);
  };
    
  const processAccountsOverview = (data: AccountsOverviewResponse) => {
    const cashAccountsList = data.accountsOverview.depository?.map(account => ({
      bankName: data.bankName,
      last4CCNumber: account.mask,
      bankNickname: account.name,
      value: account.balances.available,
    })) || [];

    const total = cashAccountsList.reduce((sum, account) => sum + account.value, 0);
    setTotalCashBalance(total);
    setCashAccounts(cashAccountsList);
  }

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
            netWorthYesterday={netWorth1DaysAgo}
            netWorthToday={netWorthToday}
          />
          <NetWorthValue netWorth={netWorthToday} />
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