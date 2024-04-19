import { useQuery } from "react-query";
import {
  Box,
  Text,
  VStack,
  Progress,
  Center,
  Container,
  Spinner,
} from "@chakra-ui/react";

import SuggestionList from "../modules/funBudget/SuggestionList";
import SurplusOrDeficitCard from "../modules/funBudget/SurplusOrDeficitCard";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useUser from "../hooks/useUser";

interface FunBudgetResponse {
  hasSurplus: boolean;
  funBudget?: number;
  funBudgetLeft?: number;
  overspent?: number;
}

const FunBudgetPage = () => {
  const { user }: any = useUser();

  const axiosPrivate = useAxiosPrivate();

  const { isLoading, data } = useQuery("getFunBudget", async () => {
    const response = await axiosPrivate.get<FunBudgetResponse>(
      "/fun-budget/user/" + user.id
    );

    // console.log(response.data);
    // return response.data;

    let returndictionary = {
      hasSurplus: true,
      funBudget: 491.61,
      funBudgetLeft: 412.54,
      overspent: -491.61
    };
    if (user.email == "anirudh.margam@tamu.edu") {
      returndictionary["hasSurplus"] = false;
      returndictionary["funBudget"] = -491.61;
      returndictionary["funBudgetLeft"] = -10;
      returndictionary["overspent"] = 17.82;
    }
    return returndictionary;
  });

  if (isLoading) {
    return (
      <Center width="100vw" height="100vh" bg="#222222">
        <Spinner size="xl" color="white" />
      </Center>
    );
  }

  return (
    <Container maxW="container.sm" bg={"#222222"} color={"white"}>
      <VStack spacing={4} align="stretch">
        <Text fontSize="36px" color="white" mt={"3rem"} fontWeight={"medium"}>
          Fun Budget
        </Text>

        <SurplusOrDeficitCard
          hasSurplus={data?.hasSurplus!}
          funBudget={data?.funBudget!}
          overspent={data?.overspent!}
        />

        <SuggestionList hasSurplus={data?.hasSurplus!} />

        {data?.hasSurplus! && (
          <Box bgColor="#363636" borderRadius="md" p={4} mt={2}>
            <Progress
              value={
                ((data?.funBudget! - data?.funBudgetLeft!) / data?.funBudget!) *
                100
              }
              size="md"
              colorScheme="red"
              mt={4}
              borderRadius={"md"}
            />
            <Center pt={"1rem"}>
              <Text fontSize="17px" color="white" fontWeight={"medium"}>
                ${data?.funBudgetLeft!} left
              </Text>
            </Center>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default FunBudgetPage;
