import React from "react";

import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App";
import { ChakraWrapper } from "./chakra";

import { createRoot } from "react-dom/client";

import { QueryClient, QueryClientProvider } from "react-query";

import { AuthProvider } from "./modules/auth/AuthProvider";
import { UserProvider } from "./contexts/UserProvider";
import "./main.css";

const clientId =
  "1001884435131-9rt55svhet3mkcuuh4fp8mqcu3thcver.apps.googleusercontent.com";

const queryClient = new QueryClient();

const container = document.getElementById("root");
const root = createRoot(container as any);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={clientId}>
        <AuthProvider>
          <UserProvider>
            <ChakraWrapper>
              <App />
            </ChakraWrapper>
          </UserProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
