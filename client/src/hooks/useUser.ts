import { useContext } from "react";
import UserContext from "../contexts/UserProvider";

const useUser = () => {
  return useContext(UserContext) as {
    user: {
      id: string;
      email: string;
      name: string;
      burn_rate_goal: number | null;
      slope: number;
      intercept: number;
    };
    setUser: (user: any) => void;
  };
};

export default useUser;
