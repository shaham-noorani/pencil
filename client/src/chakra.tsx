import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";

export const ChakraWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <ChakraProvider>{children}</ChakraProvider>;
};
