import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ChakraWrapper } from "./chakra";

ReactDOM.render(
  <ChakraWrapper>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ChakraWrapper>,
  document.getElementById("root")
);
