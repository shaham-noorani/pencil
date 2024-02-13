import { HStack, Text } from "@chakra-ui/react";

interface BurnRateChangeProps {
  projectedSavings: number;
  targetSavings: number;
}

const BurnRateChange = ({
  projectedSavings,
  targetSavings,
}: BurnRateChangeProps) => {
  const difference = projectedSavings - targetSavings;
  const projectedVsTargetAsPercent = (difference / targetSavings) * 100;
  const isPositive = difference >= 0;

  return (
    <HStack justifyContent="space-between" pl={4} pr={4} color="white" w="full">
      <Text fontSize="md" fontWeight="bold">
        Projected Savings
      </Text>
      <HStack>
        <Text fontSize="md">
          {isPositive ? "+" : "-"}${Math.abs(difference).toFixed(2)}
        </Text>
        <Text fontSize="md" color={isPositive ? "green.500" : "red.500"}>
          ({Math.abs(projectedVsTargetAsPercent).toFixed(2)}%)
        </Text>
      </HStack>
    </HStack>
  );
};

export default BurnRateChange;
