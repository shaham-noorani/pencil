import { HStack, Text } from "@chakra-ui/react";

interface NetWorthChangeProps {
  netWorthYesterday: number;
  netWorthToday: number;
}

const NetWorthChange = ({
  netWorthYesterday,
  netWorthToday,
}: NetWorthChangeProps) => {
  const difference = netWorthToday - netWorthYesterday;
  const todayVsYesterdayAsPercent = (difference / netWorthYesterday) * 100;
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
          ({Math.abs(todayVsYesterdayAsPercent).toFixed(2)}%)
        </Text>
      </HStack>
    </HStack>
  );
};

export default NetWorthChange;
