import express from "express";

import {
    createLinkToken, exchangePublicToken, getAccountsOverview, getAccountBalancesOverTime
} from "../controllers/plaid.controller";

const plaidRouter = express.Router();

plaidRouter.get("/create_link_token", createLinkToken);
plaidRouter.post("/exchange_public_token", exchangePublicToken);
plaidRouter.get("/get_accounts_overview", getAccountsOverview);
plaidRouter.get("/get_account_balances_over_time", getAccountBalancesOverTime);


export default plaidRouter;
