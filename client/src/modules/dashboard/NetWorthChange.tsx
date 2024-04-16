import { HStack, Text } from "@chakra-ui/react";

interface NetWorthChangeProps {
  netWorth1WeekAgo: number;
  netWorthToday: number;
}

const NetWorthChange = ({
  netWorth1WeekAgo,
  netWorthToday,
}: NetWorthChangeProps) => {
  const difference = netWorthToday - netWorth1WeekAgo;
  const todayVs1WeekAgoAsPercent = (difference / netWorth1WeekAgo) * 100;
  const isPositive = difference >= 0;

  return (
    <HStack justifyContent="space-between" pl={4} pr={4} color="white" w="full">
      <Text fontSize="md" fontWeight="bold">
        Net Worth
      </Text>
      <HStack>
        <Text fontSize="md">
          {isPositive ? "+" : "-"}${Math.abs(difference).toFixed(2)}
        </Text>
        <Text fontSize="md" color={isPositive ? "green.500" : "red.500"}>
          ({Math.abs(todayVs1WeekAgoAsPercent).toFixed(2)}%)
        </Text>
      </HStack>
    </HStack>
  );
};

export default NetWorthChange;
