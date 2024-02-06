import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import useAuth from "./useAuth";
import axios from "axios";
import { Button, useToast } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";

const LoginButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth }: any = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const url = import.meta.env.PROD ? "" : "http://localhost:3000";

  const googleLogin = useGoogleLogin({
    onSuccess: async ({ code }: any) => {
      setIsLoading(true);
      const tokens = await axios.post(url + "/auth/google", {
        code,
      });
      const refreshToken = tokens.data.tokens.refresh_token;
      const idToken = tokens.data.tokens.id_token;

      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("idToken", idToken);

      setAuth({
        idToken: idToken,
        refreshToken: refreshToken,
      });

      setIsLoading(false);

      navigate("/dashboard");
    },
    flow: "auth-code",
    scope:
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
    onError: () => {
      useToast({
        description: "Unable to sign you in. Please try again",
        status: "error",
      });
    },
  });

  return (
    <Button onClick={googleLogin} isLoading={isLoading} size={"lg"}>
      Sign In with Google SSO
    </Button>
  );
};

export default LoginButton;
