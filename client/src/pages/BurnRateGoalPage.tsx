import { Box, Heading, Text, Button, Center } from "@chakra-ui/react";
import { NumberInput, NumberInputField } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

function BurnRateGoal() {
  const { user }: any = useUser();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const [burn_rate_goal, setBurnRateGoal] = useState<number>(0);
  const [showSubmit, setShowSubmit] = useState<boolean>(false);

  useEffect(() => {
    if (user.burn_rate_goal !== null) {
      navigate("/burn");
    }
  }, [user]);

  const updateUser = async () => {
    try {
      await axiosPrivate.put("/user/update-burn-rate-goal/" + user.email, {
        burn_rate_goal: burn_rate_goal,
      });

      setShowSubmit(true);

      setTimeout(() => {
        navigate("/burn");
      }, 1000);
    } catch (error: any) {}
  };

  return (
    <>
      {showSubmit ? (
        <Center h={"100vh"} bg={"#222222"}>
          <Heading as="h1" size="xl" mb={4} color={"white"}>
            You're all set!
          </Heading>
        </Center>
      ) : (
        <Box p={4} bg={"#222222"} mt={4}>
          <Heading as="h1" size="xl" mb={4} color={"white"}>
            Burn Rate
          </Heading>
          <Text mb={4} color={"white"}>
            How much money would you like to have by the end of the school year?
          </Text>

          <NumberInput
            color={"white"}
            mb={4}
            value={burn_rate_goal as number}
            onChange={(value) => {
              setBurnRateGoal(value ? parseInt(value) : 0);
            }}
          >
            <NumberInputField />
          </NumberInput>
          <Button
            bg={"white"}
            textColor={"black"}
            w={"100%"}
            onClick={() => updateUser()}
            mt={"60vh"}
            isDisabled={burn_rate_goal === 0}
          >
            Submit
          </Button>
        </Box>
      )}
    </>
  );
}

export default BurnRateGoal;
