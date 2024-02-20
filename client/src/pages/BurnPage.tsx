import React, { useEffect, useState } from "react";
import { Box, Center, Heading, Spinner, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import useMe from "../modules/auth/useMe";

const BurnPage: React.FC = () => {
  const me = useMe();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    me().then((user) => {
      if (user.burn_rate_goal === null) {
        navigate("/burn-rate-goal");
      } else {
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return (
      <Center width="100vw" height="100vh" bg="#222222">
        <Spinner size="xl" color="white" />
      </Center>
    );
  }

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
