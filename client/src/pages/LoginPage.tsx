import { Box, Button, Spacer } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import LoginButton from "../modules/auth/LoginButton";

const LoginPage = () => {
  return (
    <Box mt="10px">
      <LoginButton />
      <Spacer mt={10} />
      <Button as={Link} to="/dashboard" size="lg">
        Go to Dashboard
      </Button>
    </Box>
  );
};

export default LoginPage;
