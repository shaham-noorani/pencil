import { useContext } from "react";
import UserContext from "../contexts/UserProvider";

const useUser = () => {
  return useContext(UserContext) as {
    user: {
      id: string;
      email: string;
      name: string;
      burnRateGoal: number | null;
    };
    setUser: (user: any) => void;
  };
};

export default useUser;
