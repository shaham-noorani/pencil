import { Button } from "@chakra-ui/react";

const LoginPage = () => {
  const handleGoogleLogin = () => {
    // Handle Google OAuth login logic here
  };

  return (
    <div>
      <h1>Login Page</h1>
      <Button onClick={handleGoogleLogin} colorScheme="red">
        Login with Google
      </Button>
    </div>
  );
};

export default LoginPage;
