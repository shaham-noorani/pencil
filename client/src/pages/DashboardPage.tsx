import { Box, VStack } from "@chakra-ui/react";
import { useState } from "react";
import HeaderNetWorth from "../modules/dashboard/HeaderNetWorth";
import HeaderBurnRate from "../modules/dashboard/HeaderBurnRate";
import BurnRateChange from "../modules/dashboard/BurnRateChange";
import BurnRateValue from "../modules/dashboard/BurnRateValue";
import NetWorthChange from "../modules/dashboard/NetWorthChange";
import NetWorthValue from "../modules/dashboard/NetWorthValue";
import CashTabComponent from "../modules/dashboard/CashTabComponent";
import LinechartBurnRate from "../modules/dashboard/LinechartBurnRate";
import LinechartNetWorth from "../modules/dashboard/LinechartNetWorth";

const DashboardPage = () => {
  const [stage, setStage] = useState(0);

  // Hardcoded values for now
  // const projectedSavings = 5000;
  // const targetSavings = 4000;
  const netWorthToday = 10000;
  const netWorthYesterday = 9000;
  const cashAccounts = [
    {
      bankName: "Bank of America",
      last4CCNumber: "8008",
      bankNickname: "ADV SafeBalance Banking",
      value: 10200.87,
    },
    {
      bankName: "Chase Bank",
      last4CCNumber: "6969",
      bankNickname: "High School Checking",
      value: 3141.59,
    },
  ];
  const totalCashToday = cashAccounts.reduce(
    (sum, account) => sum + account.value,
    0
  );

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
          totalValue={totalCashToday}
        />
        <CashTabComponent
          accounts={cashAccounts}
          label="Investments"
          totalValue={totalCashToday}
        />
        <CashTabComponent
          accounts={cashAccounts}
          label="Credit Cards"
          totalValue={totalCashToday}
        />
        <CashTabComponent
          accounts={cashAccounts}
          label="Loans"
          totalValue={totalCashToday}
        />
      </Box>
    </VStack>
  );
};

export default DashboardPage;
