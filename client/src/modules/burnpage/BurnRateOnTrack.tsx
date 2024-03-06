import { HStack, Text } from "@chakra-ui/react";

interface BurnRateOnTrackProps {
  projectedSavings: number;
  goalSavings: number;
}

const BurnRateOnTrack = ({
  projectedSavings,
  goalSavings,
}: BurnRateOnTrackProps) => {
  const difference = projectedSavings - goalSavings;
  const isPositive = difference >= 0;
  const onTrackText = isPositive ? "ON TRACK" : "NOT ON TRACK";

  return (
    <HStack
      justifyContent="space-between"
      pl={4}
      pr={4}
      color="white"
      w="full"
      mb={3}
    >
      <Text fontSize="md" color={isPositive ? "green.500" : "red.500"}>
        {onTrackText}
      </Text>
      <Text fontSize="md" color={isPositive ? "green.500" : "red.500"}>
        {isPositive ? "+" : "-"}${Math.abs(difference).toFixed(2)}
      </Text>
    </HStack>
  );
};

export default BurnRateOnTrack;
