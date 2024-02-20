import { useEffect, useState } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import useMe from "./useMe";
import { Outlet } from "react-router";
import { Center, Spinner } from "@chakra-ui/react";

const PersistAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
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
    return (
      <Center width="100vw" height="100vh" bg="#222222">
        <Spinner size="xl" color="white" />
      </Center>
    );
  }

  return <Outlet />;
};

export default PersistAuth;
