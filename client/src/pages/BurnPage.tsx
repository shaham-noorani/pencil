import React, { useEffect } from "react";
import { Box, Heading, VStack } from "@chakra-ui/react";
import useUser from "../hooks/useUser";
import { useNavigate } from "react-router-dom";
import useMe from "../modules/auth/useMe";

const BurnPage: React.FC = () => {
  const { user }: any = useUser();
  const me = useMe();
  const navigate = useNavigate();

  useEffect(() => {
    const refreshUser = async () => {
      await me();
    };

    refreshUser();

    if (user.burnRateGoal === null) {
      navigate("/burn-rate-goal");
    }
  }, []);

  return (
    <VStack
      height="100vh"
      width="100vw"
      bg="#222222"
      justifyContent="flex-start"
    >
      <Heading color="white" textAlign="center" paddingTop="5%">
        Burn Rate
      </Heading>
      <Box
        width="80%"
        height="500px"
        bg="white"
        borderRadius="md"
        marginTop="5%"
      ></Box>
    </VStack>
  );
};

export default BurnPage;
