import { Button, Flex, Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const HeaderNetWorth = () => {
  const today = format(new Date(), "EEEE, MMMM do");
  const navigate = useNavigate();

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
      <Flex w="full" justifyContent="space-between" alignItems="center">
        <Text fontSize="3xl" fontWeight="bold">
          Home
        </Text>
        <Button
          leftIcon={<AddIcon color="white" />}
          onClick={() => navigate("/connect-account")}
          fontSize={"sm"}
          bg="#222222"
        />
      </Flex>
      <Text fontSize="md">{today}</Text>
    </Flex>
  );
};

export default HeaderNetWorth;
