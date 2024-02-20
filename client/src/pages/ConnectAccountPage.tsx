import React from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';
import PlaidLink from '../modules/auth/PlaidLink';
import useUser from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

interface ConnectAccountPageProps {
    linkToken: string | null;
}

const ConnectAccountPage: React.FC<ConnectAccountPageProps> = ({ linkToken }) => { 
  const { user }: any = useUser();
  const userFirstName = user.name.split(' ')[0];

  return (
    <Flex
      direction="column"
      align="center"
      justify="flex-start"
      h="100vh" 
      bg="#222222"
      color="white"
      p={4}
    >
      <Box width="100%" pt="5%">
        <Text fontSize="4xl" fontWeight="bold">
          Nice to meet you, {userFirstName}!
        </Text>
      </Box>
      <Flex width="100%" px="10%" position="absolute" bottom="8">
        {linkToken && <PlaidLink linkToken={linkToken} />}
      </Flex>
    </Flex>
  );
};

export default ConnectAccountPage;