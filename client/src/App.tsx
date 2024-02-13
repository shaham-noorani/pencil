import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PersistAuth from "./modules/auth/PersistAuth";
import RequireAuth from "./modules/auth/RequireAuth";
import PlaidLink from "./modules/auth/PlaidLink";
import Layout from "./components/Layout";
import BurnPage from "./pages/BurnPage";
import BurnRateGoal from "./pages/BurnRateGoalPage";

function App() {
  const [linkToken, setLinkToken] = useState(null);
  const generateToken = async () => {
    const url = import.meta.env.PROD ? "" : "http://localhost:3000";
    const response = await axios.get(url + "/api/plaid/create_link_token");
    console.log(response.data);
    setLinkToken(response.data.link_token);
  };
  useEffect(() => {
    generateToken();
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/plaid" element={<PlaidLink linkToken={linkToken} />} />
          <Route element={<PersistAuth />}>
            <Route element={<RequireAuth />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/burn" element={<BurnPage />} />
                <Route path="/burn-rate-goal" element={<BurnRateGoal />} />
                <Route path="*" element={<DashboardPage />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
