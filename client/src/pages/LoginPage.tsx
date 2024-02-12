import { Box, Center, Text, Button, VStack, Heading } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import "./LoginPage.css"; // Assuming you have your initial CSS set up
import LoginButton from "../modules/auth/LoginButton";

const LoginPage = () => {
  const [stage, setStage] = useState(0);

  // handle stage transition
  useEffect(() => {
    // Set a timeout for the initial delay
    const initialTimeout = setTimeout(() => {
      setStage(1); // Transition to stage 1 after 2s

      // Set subsequent timeouts for the other stages
      const stage1Timeout = setTimeout(() => {
        setStage(2); // Transition to stage 2 after 0.5s

        const stage2Timeout = setTimeout(() => {
          setStage(3); // Transition to stage 3 after 0.5s
        }, 1500); // Delay for stage 2 to stage 3

        return () => clearTimeout(stage2Timeout); // Clean up timeout when component unmounts or updates
      }, 1500); // Delay for stage 1 to stage 2

      return () => clearTimeout(stage1Timeout); // Clean up timeout when component unmounts or updates
    }, 2000); // Initial delay for stage 0 to stage 1

    // Clean up the initial timeout when the component unmounts or updates
    return () => clearTimeout(initialTimeout);
  }, []); // Empty dependency array to run effect only once after initial render

  return (
    <Center height="100vh" width="100vw" bg="#222222">
      <Box line-height="0px" width="full">
        {/* Circle container for the 3 circles */}
        <Box className={`circle-container stage${stage}`}>
          <Box className={`circle red-circle stage${stage}`} />
          <Box className={`circle gray-circle stage${stage}`} />
          <Box className={`circle yellow-circle stage${stage}`} />
        </Box>

        <Text className={`pencil-text stage${stage}`}>
          <span className={`logoLetterP stage${stage}`}>P</span>
          <span className={`logoLetterE stage${stage}`}>E</span>
          <span className={`logoLetterN stage${stage}`}>N</span>
          <span className={`logoLetterC stage${stage}`}>C</span>
          <span className={`logoLetterI stage${stage}`}>I</span>
          <span className={`logoLetterL stage${stage}`}>L</span>
        </Text>

        <Box width="full" className={`login-button stage${stage}`}>
          <LoginButton />
        </Box>
      </Box>
    </Center>
  );
};

export default LoginPage;
