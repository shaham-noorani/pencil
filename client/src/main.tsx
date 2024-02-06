import React from "react";

import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App";
import { ChakraWrapper } from "./chakra";
import { createRoot } from "react-dom/client";

import { AuthProvider } from "./modules/auth/AuthProvider";
import { UserProvider } from "./contexts/UserProvider";

const clientId =
  "1001884435131-9rt55svhet3mkcuuh4fp8mqcu3thcver.apps.googleusercontent.com";

const container = document.getElementById("root");
const root = createRoot(container as any);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <UserProvider>
          <ChakraWrapper>
            <App />
          </ChakraWrapper>
        </UserProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
