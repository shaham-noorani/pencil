import { useContext } from "react";
import AuthContext from "./AuthProvider";

const useAuth = () => {
  return useContext(AuthContext) as {
    auth: {
      idToken: string | null;
      refreshToken: string | null;
    };
    setAuth: () => void;
  };
};

export default useAuth;
