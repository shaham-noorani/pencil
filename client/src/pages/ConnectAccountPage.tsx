import { Box, Text, Flex } from '@chakra-ui/react';
import PlaidLink from '../modules/auth/PlaidLink';
import useUser from '../hooks/useUser';

const ConnectAccountPage = () => { 
  const { user }: any = useUser();
  const userFirstName = user.name.split(' ')[0];

  return (
    <Flex
      direction="column"
      align="center"
      justify="flex-start"
      h="100%" 
      bg="#222222"
      color="white"
      p={4}
    >
      <Box width="100%" pt="5%">
        <Text fontSize="4xl" fontWeight="bold">
          Nice to meet you, {userFirstName}!
        </Text>
      </Box>
      <Flex width="100%" px="10%" mt="65vh">
        {<PlaidLink/>}
      </Flex>
    </Flex>
  );
};

export default ConnectAccountPage;