import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AccountsOverviewResponse from "../models/accountsOverviewResponse.model";
import LineChartData from "../models/burnpageLinechartData.model";

import { schoolEndDate, today } from "../utils/constants";

import useMe from "../modules/auth/useMe";
import useUser from "../hooks/useUser";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

import { Box, Center, Flex, Spinner, VStack } from "@chakra-ui/react";

import BurnRateHeader from "../modules/burnpage/BurnRateHeader";
import BurnRateOnTrack from "../modules/burnpage/BurnRateOnTrack";
import BurnRateLinechart from "../modules/burnpage/BurnRateLinechart";
import BalanceBudgetGoalBox from "../modules/burnpage/BalanceBudgetGoalBox";
import {
  monthsFromTodayToMay,
  remainingDaysUntilSchoolEnd,
  startOfMonth,
} from "../modules/burnpage/utils";
import {
  fetchAccountBalancesOverTime,
  fetchAccountsOverview,
} from "../modules/burnpage/fetches";
import AccountsOverview from "../models/accountsOverview.model";

const BurnPage: React.FC = () => {
  // Hooks and context usage
  const { user }: any = useUser();
  const me = useMe();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  // User-related state variables
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState({
    userBalanceToday: 0,
    amountSpentThisMonth: 0,
    userBalanceAtStartOfMonth: 0,
    monthlyBudget: 0,
    remainingBudget: 0,
    linechartData: [],
    minBalanceData: 0,
    maxBalanceData: 0,
    maxDataDifference: 0,
  });
  const [userBalanceToday, setUserBalanceToday] = useState<number>(0);
  const [userBalanceChangeSinceAugust, setUserBalanceChangeSinceAugust] =
    useState<number>(0);
  const [userBalanceInAugust, setUserBalanceInAugust] = useState<number>(0);
  const [projectedUserBalanceInMay, setProjectedUserBalanceInMay] =
    useState<number>(0);
  const [balanceChanges, setBalanceChanges] = useState<{
    [key: string]: number;
  }>({});

  // Budget-related state variables
  const [amountSpentThisMonth, setAmountSpentThisMonth] = useState<number>(0);
  const [userBalanceAtStartOfMonth, setUserBalanceAtStartOfMonth] =
    useState<number>(0);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(0);
  const [remainingBudget, setRemainingBudget] = useState<number>(0);

  // Linechart state variables
  const [
    userBalanceDataFromAugustToToday,
    setUserBalanceDataFromAugustToToday,
  ] = useState<{ date: string; value: number }[]>([]);
  const [minBalanceData, setMinBalanceData] = useState<number>(0);
  const [maxBalanceData, setMaxBalanceData] = useState<number>(0);
  const [maxDataDifference, setMaxDataDifference] = useState<number>(0);
  const [linechartData, setLinechartData] = useState<LineChartData[]>([]);

  // User's savings goal and spending slope
  const goalSavings = user?.burn_rate_goal ?? 0;
  const projectedUserSpendingPerDay = (user?.slope ?? 0) / 7;

  // TODO: clean this up
  const processAllData = (
    overviewData: AccountsOverview,
    balanceData: any,
    user: any
  ) => {
    const cashAccountsList =
      overviewData.depository?.map((account) => ({
        bankName: account.institution_name,
        last4CCNumber: account.mask,
        bankNickname: account.name,
        value: account.balances.available,
      })) || [];

    const totalUserCash = cashAccountsList.reduce(
      (sum, account) => sum + account.value,
      0
    );
    const projectedSavingsInMay =
      totalUserCash + ((user?.slope ?? 0) / 7) * remainingDaysUntilSchoolEnd;

    const transformedBalanceChanges = balanceData.reduce(
      (acc: any, curr: any) => {
        const startDateStr = new Date(curr.start_date).toLocaleDateString();
        acc[startDateStr] = (acc[startDateStr] || 0) + curr.spent_amount;
        return acc;
      },
      {}
    );

    const balanceChangeThisMonth = Object.entries(transformedBalanceChanges)
      .filter(([date]) => new Date(date) >= startOfMonth)
      .reduce((acc, [, value]) => acc + (value as number), 0);

    const usersBalanceAtStartOfMonth = totalUserCash - balanceChangeThisMonth;
    const monthlyBudgetAmount =
      (usersBalanceAtStartOfMonth - (user?.burn_rate_goal ?? 0)) /
      monthsFromTodayToMay;
    const remainingBudgetThisMonth =
      monthlyBudgetAmount - balanceChangeThisMonth;
    const totalBalanceChange = Object.values(transformedBalanceChanges).reduce(
      (acc, value) => (acc as number) + (value as number),
      0
    );
    const userBalanceInAugustCalculation =
      totalUserCash - (totalBalanceChange as number);

    let runningTotal = userBalanceInAugustCalculation;
    const balanceDataPoints = Object.entries(transformedBalanceChanges)
      .sort(
        ([dateA], [dateB]) =>
          new Date(dateA).getTime() - new Date(dateB).getTime()
      )
      .map(([date, change]) => {
        runningTotal -= change as number;
        return {
          date: new Date(date).toLocaleDateString(),
          value: runningTotal,
        };
      });

    let userBalanceDataPointsFromAugustToToday = [
      { date: "8/1/2023", value: userBalanceInAugustCalculation },
      ...balanceDataPoints,
      {
        date: new Date().toLocaleDateString("en-US"),
        value: totalUserCash,
      },
    ];

    return {
      totalUserCash,
      projectedSavingsInMay,
      transformedBalanceChanges,
      balanceChangeThisMonth,
      usersBalanceAtStartOfMonth,
      monthlyBudgetAmount,
      remainingBudgetThisMonth,
      totalBalanceChange,
      userBalanceInAugustCalculation,
      userBalanceDataPointsFromAugustToToday,
    };
  };

  const prepareLinechartData = (
    userBalanceDataFromAugustToToday: any,
    projectedBalanceOnMay1: any,
    goalSavingsOnMay1: any,
    schoolEndDate: any
  ) => {
    const today = new Date().toLocaleDateString("en-US");
    const updatedLineChartData = userBalanceDataFromAugustToToday.map(
      (data: any) => {
        const isToday =
          new Date(data.date).toLocaleDateString("en-US") === today;

        return {
          date: data.date,
          actualUserBalance: data.value,
          goalUserBalance: isToday ? data.value : null,
          projectedUserBalance: isToday ? data.value : null,
        };
      }
    );

    updatedLineChartData.push({
      date: new Date(schoolEndDate).toLocaleDateString("en-US"),
      actualUserBalance: null,
      projectedUserBalance: projectedBalanceOnMay1,
      goalUserBalance: goalSavingsOnMay1,
    });

    const balanceValues = userBalanceDataFromAugustToToday.map(
      (data: any) => data.value
    );
    balanceValues.push(projectedBalanceOnMay1, goalSavingsOnMay1);
    const minBalanceData = Math.min(...balanceValues);
    const maxBalanceData = Math.max(...balanceValues);
    const maxDataDifference = maxBalanceData - minBalanceData;

    // Return both the line chart data and the min/max balance data for chart scaling
    return {
      lineChartData: updatedLineChartData,
      minBalanceData,
      maxBalanceData,
      maxDataDifference,
    };
  };

  const updateAllStates = (processedData: any) => {
    const {
      totalUserCash,
      projectedSavingsInMay,
      transformedBalanceChanges,
      balanceChangeThisMonth,
      usersBalanceAtStartOfMonth,
      monthlyBudgetAmount,
      remainingBudgetThisMonth,
      totalBalanceChange,
      userBalanceInAugustCalculation,
      userBalanceDataPointsFromAugustToToday,
    } = processedData;

    setUserBalanceToday(totalUserCash);
    setProjectedUserBalanceInMay(projectedSavingsInMay);
    setBalanceChanges(transformedBalanceChanges);
    setAmountSpentThisMonth(balanceChangeThisMonth);
    setUserBalanceAtStartOfMonth(usersBalanceAtStartOfMonth);
    setMonthlyBudget(monthlyBudgetAmount);
    setRemainingBudget(remainingBudgetThisMonth);
    setUserBalanceChangeSinceAugust(totalBalanceChange);
    setUserBalanceInAugust(userBalanceInAugustCalculation);
    setUserBalanceDataFromAugustToToday(userBalanceDataPointsFromAugustToToday);


    const {lineChartData, minBalanceData, maxBalanceData, maxDataDifference} = prepareLinechartData(
      userBalanceDataPointsFromAugustToToday,
      projectedSavingsInMay,
      user?.burn_rate_goal ?? 0, schoolEndDate
    );
    setMinBalanceData(minBalanceData);
    setMaxBalanceData(maxBalanceData);
    setMaxDataDifference(maxDataDifference);
    setLinechartData(lineChartData);
  };

  // Helper Functions
  const loadData = async () => {
    setLoading(true);
    try {
      const userData = await me();
      if (!userData || userData.burn_rate_goal === null) {
        navigate("/burn-rate-goal");
        return;
      }

      const overviewData = await fetchAccountsOverview(axiosPrivate);
      console.log("\n\noverviewData\n\n");
      console.log(overviewData);
      console.log("\n\noverviewData\n\n");
      const balanceData = await fetchAccountBalancesOverTime(
        axiosPrivate,
        userData.id
      );
      console.log("\n\nbalanceData\n\n");
      console.log(balanceData);
      console.log("\n\nbalanceData\n\n");
      // Process data
      const processedData = processAllData(overviewData, balanceData, me); // Assume this function processes all your data and returns an object with all the state you need to update

      // Update all relevant states here at once
      updateAllStates(processedData);
    } catch (error) {
      console.error("error loading data: ", error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect for loading data before page renders
  useEffect(() => {
    loadData().finally(() => setLoading(false));
    // loadData();
    // setLoading(false);
  }, []);

  if (loading) {
    return (
      <Center width="100vw" height="100vh" bg="#222222">
        <Spinner size="xl" color="white" />
      </Center>
    );
  } else {
    return (
      <VStack
        height="100vh"
        width="100vw"
        bg="#222222"
        justifyContent="flex-start"
      >
        <Flex className={`burn-rate-header`} width="full">
          <BurnRateHeader />
        </Flex>
        <Box
          className={`burn-rate-middle`}
          borderRadius="lg"
          padding={4}
          mx={5}
          w={"93%"}
          bg="black"
        >
          <BurnRateOnTrack
            projectedSavings={projectedUserBalanceInMay}
            goalSavings={goalSavings}
          />
          <BurnRateLinechart
            loadingChart={loading}
            data={linechartData}
            maxDifference={maxDataDifference}
            maxValue={maxBalanceData}
            minValue={minBalanceData}
            projectedMayBalance={projectedUserBalanceInMay}
            goalMayBalance={goalSavings}
          />
        </Box>
        <Box className={`burn-rate-bottom`} width="full" paddingTop="5%">
          <BalanceBudgetGoalBox
            currentBalance={userBalanceToday}
            remainingBudget={remainingBudget}
            monthlyBudget={monthlyBudget}
            goalSavings={goalSavings}
          />
        </Box>
      </VStack>
    );
  }
};

export default BurnPage;
