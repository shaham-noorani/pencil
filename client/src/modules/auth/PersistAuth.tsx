import { useEffect, useState } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import useMe from "./useMe";
import { Outlet } from "react-router";
import { Spinner } from "@chakra-ui/react";

const PersistAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const refresh = useRefreshToken();
  const { auth }: any = useAuth();
  const me = useMe();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
        await me();
      } catch {
        console.error("An error occurred refreshing id token");
      }
    };

    setTimeout(() => {
      setIsLoading(false);
    }, 800);

    !auth?.idToken ? verifyRefreshToken() : setIsLoading(false);
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return <Outlet />;
};

export default PersistAuth;
