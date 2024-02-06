import { useEffect, useMemo } from "react";
import { AxiosPrivateClient } from "../utils/axios";
import useRefreshToken from "../modules/auth/useRefreshToken";
import useAuth from "../modules/auth/useAuth";

const useAxiosPrivate = () => {
  const { auth } = useAuth();
  const refresh = useRefreshToken();

  // Memoize the refresh function to prevent unnecessary re-renders
  const memoizedRefresh = useMemo(() => refresh, [refresh]);

  useEffect(() => {
    const requestInterceptor = AxiosPrivateClient.interceptors.request.use(
      async (config) => {
        if (auth?.idToken) {
          config.headers["Authorization"] = `Bearer ${auth.idToken}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      AxiosPrivateClient.interceptors.request.eject(requestInterceptor);
    };
  }, [auth, memoizedRefresh]);

  return AxiosPrivateClient;
};

export default useAxiosPrivate;
