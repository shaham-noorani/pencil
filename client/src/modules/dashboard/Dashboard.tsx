import {
  Box,
  Flex,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";

const Dashboard = () => {
  return (
    <Box p={4}>
      <Heading as="h1" mb={4}>
        Pencil
      </Heading>
      <Flex justifyContent="space-between">
        <Stat>
          <StatLabel>Total Income</StatLabel>
          <StatNumber>$5000</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Total Expenses</StatLabel>
          <StatNumber>$3000</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Net Worth</StatLabel>
          <StatNumber>$2000</StatNumber>
        </Stat>
      </Flex>
    </Box>
  );
};

export default Dashboard;
