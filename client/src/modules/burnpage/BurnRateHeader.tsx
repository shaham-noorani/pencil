import { Box, Button, Flex, Text } from "@chakra-ui/react";

import { EditIcon } from "@chakra-ui/icons";

import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const BurnRateHeader = () => {
  const today = format(new Date(), "EEEE, MMMM do");
  const navigate = useNavigate();

  return (
    <Flex direction="row" p={4} color="white" w="full" marginTop="5%">
      <Box>
        <Text fontSize="3xl" fontWeight="bold">
          Burn Rate
        </Text>
        <Text fontSize="md">{today}</Text>
      </Box>
      <Button
        leftIcon={<EditIcon />}
        onClick={() => navigate("/burn-rate-goal")}
        fontSize={"sm"}
        ml={24}
        mt={4}
      >
        Edit Goal
      </Button>
    </Flex>
  );
};

export default BurnRateHeader;
