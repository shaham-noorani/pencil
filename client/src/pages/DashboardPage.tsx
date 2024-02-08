import { Box, Flex, Text, Button, VStack, Heading } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import DashboardHeader from "../modules/dashboard/DashboardHeader";
import DashboardMiddleComponentProjectedSavingsChangeComponent from "../modules/dashboard/DashboardMiddleComponentProjectedSavingsChangeComponent";
import DashboardMiddleComponentProjectedSavingsValueComponent from "../modules/dashboard/DashboardMiddleComponentProjectedSavingsValueComponent";
import LinechartProjectedSavings from "../modules/dashboard/LinechartProjectedSavings";
import CashTabComponent from "../modules/dashboard/CashTabComponent";

const DashboardPage = () => {
  const [stage, setStage] = useState(0);

  // Hardcoded values for now
  const projectedSavings = 5000; 
  const targetSavings = 4000; 
  const cashAccounts = [
    {
      bankName: 'Bank of America',
      last4CCNumber: '8008',
      bankNickname: 'ADV SafeBalance Banking',
      value: 10200.87,
    },
    {
      bankName: 'Chase Bank',
      last4CCNumber: '6969',
      bankNickname: 'High School Checking',
      value: 3141.59,
    }
  ];
  const totalCashToday = cashAccounts.reduce((sum, account) => sum + account.value, 0);

  // handle stage transition
  useEffect(() => {
    const initialTimeout = setTimeout(() => {
      setStage(1);

      const stage1Timeout = setTimeout(() => {
        setStage(2);

        const stage2Timeout = setTimeout(() => {
          setStage(3);
        }, 1500);

        return () => clearTimeout(stage2Timeout);
      }, 1500);

      return () => clearTimeout(stage1Timeout);
    }, 2000); 

    return () => clearTimeout(initialTimeout);
  }, []);

  return (
    <VStack height="100vh" width="100vw" bg="#222222" justifyContent="flex-start">
      <Box className={`dashboard-box stage${stage}`}  width="full">
        <DashboardHeader />
      </Box>
      <Box className={`dashboard-box stage${stage}`}  width="full">
        <DashboardMiddleComponentProjectedSavingsChangeComponent projectedSavings={projectedSavings} targetSavings={targetSavings} />
        <DashboardMiddleComponentProjectedSavingsValueComponent projectedSavings={projectedSavings} />
        <LinechartProjectedSavings />
      </Box>
      <Box className={`dashboard-box stage${stage}`} width="full" pt="20px">
        <CashTabComponent accounts={cashAccounts} label="Cash" totalValue={totalCashToday} />
        <CashTabComponent accounts={cashAccounts} label="Investments" totalValue={totalCashToday} />
        <CashTabComponent accounts={cashAccounts} label="Credit Cards" totalValue={totalCashToday} />
        <CashTabComponent accounts={cashAccounts} label="Loans" totalValue={totalCashToday} />
      </Box>
    </VStack>    
  );
};

export default DashboardPage;