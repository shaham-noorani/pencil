import { Box, Text } from "@chakra-ui/react";

interface NetWorthValueProps {
  netWorth: number;
}

const NetWorthValue = ({ netWorth }: NetWorthValueProps) => {
  const nw = netWorth.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedNetWorth = netWorth < 0 ? `-$${nw.substring(1)}` : `$${nw}`;

  return (
    <Box pl={4} pr={4} pb={4}>
      <Text color="white" fontSize="2xl" fontWeight="bold">
        {formattedNetWorth}
      </Text>
    </Box>
  );
};

export default NetWorthValue;
