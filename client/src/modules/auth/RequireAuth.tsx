import { Outlet, useLocation, Navigate } from "react-router";
import useAuth from "./useAuth";

const RequireAuth = () => {
  const { auth }: any = useAuth();
  const location = useLocation();

  return auth?.idToken ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} replace />
  );
};

export default RequireAuth;
