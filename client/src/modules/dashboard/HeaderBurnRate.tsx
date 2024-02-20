import { Flex, Text } from "@chakra-ui/react";
import { format } from "date-fns";

const HeaderBurnRate = () => {
  const today = format(new Date(), "EEEE, MMMM do");

  return (
    <Flex
      direction="column"
      p={4}
      color="white"
      w="full"
      justifyContent="flex-start"
      alignItems="flex-start"
      marginTop="5%"
    >
      <Text fontSize="3xl" fontWeight="bold">
        Burn Rate
      </Text>
      <Text fontSize="md">{today}</Text>
    </Flex>
  );
};

export default HeaderBurnRate;
