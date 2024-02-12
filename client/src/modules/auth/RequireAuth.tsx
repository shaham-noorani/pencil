import { Outlet, useLocation, Navigate } from "react-router";
import useAuth from "./useAuth";

const RequireAuth = () => {
  const { auth }: any = useAuth();
  const location = useLocation();

  // commented out for testing
  // return auth?.idToken ? (
  //   <Outlet />
  // ) : (
  //   <Navigate to="/login" state={{ from: location.pathname }} replace />
  // );

  return <Outlet />;
};

export default RequireAuth;
