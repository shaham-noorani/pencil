import { Flex, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import DeleteUserButton from "./DeleteUserButton";

interface HeaderNetWorthProps {
  userId: string;
}

const HeaderNetWorth: React.FC<HeaderNetWorthProps> = ({ userId }) => {
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
      <Flex w="full" justifyContent="space-between" alignItems="center">
        <Text fontSize="3xl" fontWeight="bold">
          Home
        </Text>
        <DeleteUserButton userId={userId} />
      </Flex>
      <Text fontSize="md">{today}</Text>
    </Flex>
  );
};

export default HeaderNetWorth;
