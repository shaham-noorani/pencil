import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PersistAuth from "./modules/auth/PersistAuth";
import RequireAuth from "./modules/auth/RequireAuth";
import PlaidLink from "./modules/auth/PlaidLink";
import Layout from "./components/Layout";
import BurnPage from "./pages/BurnPage";
import BurnRateGoal from "./pages/BurnRateGoalPage";
import ConnectAccountPage from "./pages/ConnectAccountPage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/plaid" element={<PlaidLink type="connect-first-account"/>} />
          <Route element={<PersistAuth />}>
            <Route element={<RequireAuth />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/burn" element={<BurnPage />} />
                <Route path="/burn-rate-goal" element={<BurnRateGoal />} />
                <Route
                  path="/connect-account"
                  element={<ConnectAccountPage />}
                />
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
