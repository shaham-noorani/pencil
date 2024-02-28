import React, { useEffect, useState } from "react";
import { Box, Center, Spinner, VStack } from "@chakra-ui/react";
import BurnRateHeader from "../modules/burnpage/BurnRateHeader";
import BurnRateOnTrack from "../modules/burnpage/BurnRateOnTrack";
import BurnRateLinechart from "../modules/burnpage/BurnRateLinechart";
import BalanceBudgetGoalBox from "../modules/burnpage/BalanceBudgetGoalBox";
import { useNavigate } from "react-router-dom";
import useMe from "../modules/auth/useMe";
import useUser from "../hooks/useUser";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import AccountsOverviewResponse from "../models/accountsOverviewResponse.model";
import { differenceInCalendarDays, differenceInCalendarMonths } from "date-fns";
import LineChartData from "../models/burnpageLinechartData.model";

const schoolEndDate = new Date("2024-05-01");
const augustStartDate = new Date("2023-08-01");
const today = new Date().setHours(0, 0, 0, 0);

const BurnPage: React.FC = () => {
  // Hooks and context usage
  const { user }: any = useUser();
  const me = useMe();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  // User-related state variables
  const [loading, setLoading] = useState(true);
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

  // Time-related calculations
  const remainingDaysUntilSchoolEnd = Math.ceil(
    (schoolEndDate.getTime() - today) / (1000 * 60 * 60 * 24)
  );
  const daysFromAugustToToday = Math.abs(
    differenceInCalendarDays(new Date(today), augustStartDate)
  );
  const monthsFromTodayToMay =
    1 + differenceInCalendarMonths(schoolEndDate, new Date(today));
  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );

  // Helper Functions
  const processAccountsOverview = (data: AccountsOverviewResponse) => {
    const cashAccountsList =
      data.accountsOverview.depository?.map((account) => ({
        bankName: data.bankName,
        last4CCNumber: account.mask,
        bankNickname: account.name,
        value: account.balances.available,
      })) || [];

    const totalUserCash = cashAccountsList.reduce(
      (sum, account) => sum + account.value,
      0
    );
    setUserBalanceToday(totalUserCash);
    const projectedSavingsInMay =
      totalUserCash + projectedUserSpendingPerDay * remainingDaysUntilSchoolEnd;
    setProjectedUserBalanceInMay(projectedSavingsInMay);
    // console.log("User Balance Today: ", userBalanceToday);
    // console.log(
    //   "Projected User Spending Per Day: ",
    //   projectedUserSpendingPerDay
    // );
    // console.log(
    //   "Remaining Days Until School End: ",
    //   remainingDaysUntilSchoolEnd
    // );
    // console.log("Projected User Balance In May: ", projectedUserBalanceInMay);
  };

  const calculateAmountSpentThisMonth = (balanceChanges: {
    [key: string]: number;
  }) => {
    const balanceChangeThisMonth = Object.entries(balanceChanges)
      .filter(([date]) => new Date(date) >= startOfMonth)
      .reduce((acc, [, value]) => acc + value, 0);
    setAmountSpentThisMonth(balanceChangeThisMonth);
    // console.log("Amount Spent This Month: ", amountSpentThisMonth); // is negative if we made money this month
  };

  const calculateUserBalanceAtStartOfMonth = () => {
    const usersBalanceAtStartOfMonth = userBalanceToday - amountSpentThisMonth;
    setUserBalanceAtStartOfMonth(usersBalanceAtStartOfMonth);
  };

  const calculateMonthlyAndRemainingBudget = () => {
    const monthlyBudgetAmount =
      (userBalanceAtStartOfMonth - goalSavings) / monthsFromTodayToMay;
    setMonthlyBudget(monthlyBudgetAmount);

    const remainingBudgetThisMonth = monthlyBudgetAmount - amountSpentThisMonth;
    setRemainingBudget(remainingBudgetThisMonth);
  };

  const calculateUserBalanceInAndUserBalanceChangeSinceAugust =
    (balanceChanges: { [key: string]: number }) => {
      const totalBalanceChange = Object.values(balanceChanges).reduce(
        (acc, value) => acc + value,
        0
      );
      setUserBalanceChangeSinceAugust(totalBalanceChange);

      const userBalanceInAugustCalculation =
        userBalanceToday - totalBalanceChange;
      setUserBalanceInAugust(userBalanceInAugustCalculation);
    };

  const processUserBalanceDataFromAugustToToday = (balanceChanges: {
    [key: string]: number;
  }) => {
    let runningTotal = userBalanceInAugust;
    const balanceDataPoints = Object.entries(balanceChanges)
      .sort(
        ([dateA], [dateB]) =>
          new Date(dateA).getTime() - new Date(dateB).getTime()
      )
      .map(([date, change]) => {
        runningTotal += change;
        return {
          date: new Date(date).toLocaleDateString(),
          value: runningTotal,
        };
      });

    let userBalanceDataPointsFromAugustToToday = [
      { date: "8/1/2023", value: userBalanceInAugust },
      ...balanceDataPoints,
    ];
    userBalanceDataPointsFromAugustToToday.push({
      date: new Date(today).toLocaleDateString("en-US"),
      value: userBalanceToday,
    });

    setUserBalanceDataFromAugustToToday(userBalanceDataPointsFromAugustToToday);
    console.log("\n\nuserBalanceDataFromAugustToToday\n\n");
    console.log(userBalanceDataFromAugustToToday);
    console.log("\n\nuserBalanceDataFromAugustToToday\n\n");
  };

  const createLinechartData = (
    userBalanceDataFromAugustToToday: { date: string; value: number }[],
    projectedBalanceOnMay1: number,
    goalSavingsOnMay1: number
  ) => {
    const today = new Date().toLocaleDateString("en-US");

    const updatedLineChartData: LineChartData[] =
      userBalanceDataFromAugustToToday.map((data) => {
        // Check if the data's date is today
        const isToday =
          new Date(data.date).toLocaleDateString("en-US") === today;

        return {
          date: data.date,
          actualUserBalance: isToday ? data.value : data.value,
          goalUserBalance: isToday ? data.value : null,
          projectedUserBalance: isToday ? data.value : null,
        };
      });
    updatedLineChartData.push({
      date: new Date(schoolEndDate).toLocaleDateString("en-US"),
      actualUserBalance: null,
      projectedUserBalance: projectedBalanceOnMay1,
      goalUserBalance: goalSavingsOnMay1,
    });

    const balanceValues = userBalanceDataFromAugustToToday.map(
      (data) => data.value
    );
    balanceValues.push(projectedBalanceOnMay1, goalSavingsOnMay1);

    const minValue = Math.min(...balanceValues);
    const maxValue = Math.max(...balanceValues);
    const maxDifference = maxValue - minValue;
    setMinBalanceData(minValue);
    setMaxBalanceData(maxValue);
    setMaxDataDifference(maxDifference);

    setLinechartData(updatedLineChartData);
    console.log("\n\nupdatedLineChartData\n\n");
    console.log(updatedLineChartData);
    console.log("\n\nupdatedLineChartData\n\n");
  };

  const fetchAccountsOverview = async () => {
    try {
      const { data } = await axiosPrivate.get("/plaid/get_accounts_overview");
      processAccountsOverview(data);
      return;
    } catch (error) {
      console.error("Failed to fetch accounts overview:", error);
    }
  };

  const fetchAccountBalancesOverTime = async () => {
    try {
      return axiosPrivate
        .get("/plaid/get_account_balances_over_time").then((response) => response.data);
    } catch (error) {
      console.error("Failed to fetch account balances over time:", error);
    }
  };

  // useEffect for loading data before page renders
  useEffect(() => {
    me().then((user) => {
      if (user.burn_rate_goal === null) {
        navigate("/burn-rate-goal");
      } else {
        fetchAccountsOverview()
          .then(() => fetchAccountBalancesOverTime())
          .then((data) => {
              setBalanceChanges(data as { [key: string]: number });
              calculateAmountSpentThisMonth(balanceChanges);
              calculateUserBalanceAtStartOfMonth();
              calculateMonthlyAndRemainingBudget();
              calculateUserBalanceInAndUserBalanceChangeSinceAugust(balanceChanges);
              processUserBalanceDataFromAugustToToday(balanceChanges);
              createLinechartData(
                userBalanceDataFromAugustToToday,
                projectedUserBalanceInMay,
                goalSavings
              );              
            setLoading(false);
            console.log("loading = ", loading);
          });
      }
    });
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
        <Box className={`burn-rate-header`} width="full">
          <BurnRateHeader />
        </Box>
        <Box className={`burn-rate-middle`} width="full" bg="black" py={3}>
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
