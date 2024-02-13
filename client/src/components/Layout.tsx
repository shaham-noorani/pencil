import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <Outlet />
      <Navbar />
    </div>
  );
};

export default Layout;
