import {
  Box,
  Text,
  Heading,
  Card,
  Flex,
  Spinner,
  Center,
} from "@chakra-ui/react";

import { useQuery } from "react-query";

// import useAxiosPrivate from "../hooks/useAxiosPrivate";
// import useUser from "../hooks/useUser";

const AnalyticsPage = () => {
  // const axiosPrivate = useAxiosPrivate();
  // const { user }: any = useUser();

  const { status, data } = useQuery<number>("funBudget", async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay of 1000ms
    return 25;
  });

  if (status === "loading") {
    return (
      <Center width="100vw" height="100vh" bg="#222222">
        <Spinner size="xl" color="white" />
      </Center>
    );
  }

  return (
    <Box p={4} bg={"#222222"} mt={4}>
      <Heading as="h1" size="xl" mt={4} color={"white"}>
        Insights
      </Heading>
      <Card bg={"#363636"} p={4} mt={4}>
        <Flex direction={"row"} gap={"8"}>
          <Text fontSize={"30px"} ml={4}>
            🎉
          </Text>
          <Text fontSize="md" color={"white"} fontWeight={"light"}>
            Woohoo! You can spend up to <b>${data}</b> on something different!
          </Text>
        </Flex>
      </Card>
    </Box>
  );
};

export default AnalyticsPage;
