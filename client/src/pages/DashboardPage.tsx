import {
  Box,
  Flex,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  Button,
  Spacer,
} from "@chakra-ui/react";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

const DashboardPage = () => {
  const axiosPrivate = useAxiosPrivate();

  const getAllExamples = async () => {
    try {
      const response = await axiosPrivate.get("/example");
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch examples:", error);
    }
  };

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
      <Box mt={5}>
        <Button onClick={getAllExamples}>Get Examples</Button>
      </Box>

      <Spacer mt={10} />
    </Box>
  );
};

export default DashboardPage;
