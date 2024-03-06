import { Box, Flex, Grid, Text, Circle } from "@chakra-ui/react";

interface BalanceBudgetGoalBoxProps {
  currentBalance: number;
  monthlyBudget: number;
  remainingBudget: number;
  goalSavings: number;
}

const BalanceBudgetGoalBox = ({
  currentBalance,
  monthlyBudget,
  remainingBudget,
  goalSavings,
}: BalanceBudgetGoalBoxProps) => {
  return (
    <Box
      backgroundColor="#000000"
      borderRadius="lg"
      padding={4}
      color="white"
      mx={3}
    >
      <Grid templateColumns="auto 1fr auto" gap={4}>
        <Flex alignItems="center" justifyContent="center" height="100%">
          <Circle size="8px" bg="red.500" />
        </Flex>
        <Flex alignItems="center">
          <Text fontWeight="semibold">Current Balance</Text>
        </Flex>
        <Flex alignItems="center" justifyContent="flex-end">
          <Text fontWeight="bold">${currentBalance.toFixed(2)}</Text>
        </Flex>

        <Flex alignItems="center" justifyContent="center" height="100%">
          <Circle size="8px" bg="green.500" />
        </Flex>
        <Flex alignItems="center">
          <Text fontWeight="semibold">Monthly Budget</Text>
        </Flex>
        <Flex alignItems="center" justifyContent="flex-end">
          <Text fontWeight="bold">${monthlyBudget.toFixed(2)}</Text>
        </Flex>

        <Box />
        <Flex direction="column">
          <Text fontWeight="semibold">Remaining Budget</Text>
        </Flex>
        <Text textAlign="right" fontWeight="bold">
          ${remainingBudget.toFixed(2)}
        </Text>

        <Box />
        <Text fontWeight="semibold">Goal Savings</Text>
        <Text textAlign="right" fontWeight="bold">
          ${goalSavings.toFixed(2)}
        </Text>
      </Grid>
    </Box>
  );
};

export default BalanceBudgetGoalBox;
