import { Box, Text } from '@chakra-ui/react';

interface NetWorthValueProps {
  netWorth: number;
}

const NetWorthValue = ({ netWorth }: NetWorthValueProps) => {
  return (
    <Box pl={4} pr={4} pb={4}>
      <Text color="white" fontSize="2xl" fontWeight="bold">
        ${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </Text>
    </Box>
  );
};

export default NetWorthValue;