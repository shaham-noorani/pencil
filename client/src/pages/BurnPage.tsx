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
import {
  differenceInCalendarDays,
  differenceInCalendarMonths,
  max,
  min,
  setMonth,
} from "date-fns";

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
  ] = useState<{ name: string; value: number }[]>([]);
  const [minBalanceData, setMinBalanceData] = useState<number>(0);
  const [maxBalanceData, setMaxBalanceData] = useState<number>(0);
  const [maxDataDifference, setMaxDataDifference] = useState<number>(0);

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

  useEffect(() => {
    me().then((user) => {
      if (user.burn_rate_goal === null) {
        navigate("/burn-rate-goal");
      } else {
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    const fetchAccountsOverview = async () => {
      try {
        const { data } = await axiosPrivate.get("/plaid/get_accounts_overview");
        processAccountsOverview(data);
      } catch (error) {
        console.error("Failed to fetch accounts overview:", error);
      }
    };

    fetchAccountsOverview();
  }, []);

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
  };

  useEffect(() => {
    if (!loading) {
      const startOfMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      );

      axiosPrivate
        .get("/plaid/get_account_balances_over_time")
        .then((response) => {
          const balanceChanges = response.data as { [key: string]: number };

          const balanceChangeThisMonth = Object.entries(balanceChanges)
            .filter(([date]) => new Date(date) >= startOfMonth)
            .reduce((acc, [, value]) => acc + value, 0);
          setAmountSpentThisMonth(balanceChangeThisMonth);

          const usersBalanceAtStartOfMonth =
            userBalanceToday - balanceChangeThisMonth;
          setUserBalanceAtStartOfMonth(usersBalanceAtStartOfMonth);

          const monthlyBudgetAmount =
            (usersBalanceAtStartOfMonth - goalSavings) / monthsFromTodayToMay;
          setMonthlyBudget(monthlyBudgetAmount);

          const remainingBudgetThisMonth =
            monthlyBudgetAmount + balanceChangeThisMonth;
          setRemainingBudget(remainingBudgetThisMonth);

          const totalBalanceChange = Object.values(balanceChanges).reduce(
            (acc, value) => acc + value,
            0
          );
          setUserBalanceChangeSinceAugust(totalBalanceChange);

          const userBalanceInAugustCalculation =
            userBalanceToday - totalBalanceChange;
          setUserBalanceInAugust(userBalanceInAugustCalculation);

          let runningTotal = userBalanceInAugustCalculation;
          const balanceDataPoints = Object.entries(balanceChanges)
            .sort(
              ([dateA], [dateB]) =>
                new Date(dateA).getTime() - new Date(dateB).getTime()
            )
            .map(([date, change]) => {
              runningTotal += change;
              return {
                name: new Date(date).toLocaleDateString(),
                value: runningTotal,
              };
            });

          let userBalanceDataPointsFromAugustToToday = [
            { name: "8/1/2023", value: userBalanceInAugustCalculation },
            ...balanceDataPoints,
          ];
          userBalanceDataPointsFromAugustToToday.push({
            name: new Date(today).toLocaleDateString("en-US"),
            value: userBalanceToday,
          });

          setUserBalanceDataFromAugustToToday(
            userBalanceDataPointsFromAugustToToday
          );
          console.log("\n\nuserBalanceDataFromAugustToToday\n\n");
          console.log(userBalanceDataFromAugustToToday);
          console.log("\n\nuserBalanceDataFromAugustToToday\n\n");

          const balanceValues = userBalanceDataPointsFromAugustToToday.map(
            (dataPoint) => dataPoint.value
          );
          balanceValues.push(projectedUserBalanceInMay, goalSavings);
          const minValue = Math.min(...balanceValues);
          const maxValue = Math.max(...balanceValues);
          const maxDifference = maxValue - minValue;
          setMinBalanceData(minValue);
          setMaxBalanceData(maxValue);
          setMaxDataDifference(maxDifference);
        })
        .catch((error) => {
          console.error("Failed to fetch transactions:", error);
        });
    }
  }, [loading, user, userBalanceInAugust]);

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
      <Box className={`burn-rate-header`} width="full">
        <BurnRateHeader />
      </Box>
      <Box className={`burn-rate-middle`} width="full" bg="black" py={3}>
        <BurnRateOnTrack
          projectedSavings={projectedUserBalanceInMay}
          goalSavings={goalSavings}
        />
        <BurnRateLinechart
          data={userBalanceDataFromAugustToToday}
          maxDifference={maxDataDifference}
          maxValue={maxBalanceData}
          minValue={minBalanceData}
          projectedMayData={{
            name: schoolEndDate.toLocaleDateString("en-US"),
            value: projectedUserBalanceInMay,
          }}
          goalMayData={{
            name: schoolEndDate.toLocaleDateString("en-US"),
            value: goalSavings,
          }}
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
};

export default BurnPage;
