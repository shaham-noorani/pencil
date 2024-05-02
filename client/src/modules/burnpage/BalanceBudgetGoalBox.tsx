import { Box, Flex, Grid, Text, Circle } from "@chakra-ui/react";

interface BalanceBudgetGoalBoxProps {
  currentBalance: number;
  monthlyBudget: number;
  remainingBudget: number;
  goalSavings: number;
  projectedUserBalanceInMay: number;
}

const BalanceBudgetGoalBox = ({
  currentBalance,
  monthlyBudget,
  remainingBudget,
  goalSavings,
  projectedUserBalanceInMay,
}: BalanceBudgetGoalBoxProps) => {
  let goalColor: string = "green.500";
  if (projectedUserBalanceInMay < goalSavings) {
    goalColor = "red.500";
  }

  return (
    <Box
      backgroundColor="#000000"
      borderRadius="lg"
      padding={4}
      color="white"
      mx={3}
    >
      <Grid templateRows="repeat(4, 1fr)" gap={2}>
        {/* Current Balance */}
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <Circle size="8px" bg={"yellow"} mr={2} />
            <Text fontWeight="semibold">Current Balance</Text>
          </Flex>
          <Text fontWeight="bold">${currentBalance.toFixed(2)}</Text>
        </Flex>

        {/* Monthly Budget */}
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <Circle size="8px" bg={"#000000"} mr={2} />
            <Text fontWeight="semibold">Monthly Budget</Text>
          </Flex>{" "}
          <Text fontWeight="bold">${monthlyBudget.toFixed(2)}</Text>
        </Flex>

        {/* Remaining Budget */}
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <Circle size="8px" bg={"#000000"} mr={2} />
            <Text fontWeight="semibold">Remaining Budget</Text>
          </Flex>{" "}
          <Text fontWeight="bold">${remainingBudget.toFixed(2)}</Text>
        </Flex>

        {/* Goal Savings */}
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <Circle size="8px" bg={goalColor} mr={2} />
            <Text fontWeight="semibold">Goal Savings</Text>
          </Flex>
          <Text fontWeight="bold">${goalSavings.toFixed(2)}</Text>
        </Flex>
      </Grid>
    </Box>
  );
};

export default BalanceBudgetGoalBox;
