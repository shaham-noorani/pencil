import express from "express";

import {
    createLinkToken, plaidItemInitialSetup, getAccountsOverview, refreshPlaidTransactionData, refreshPlaidNetWorth
} from "../controllers/plaid.controller";

const plaidRouter = express.Router();

plaidRouter.get("/create_link_token", createLinkToken);
plaidRouter.post("/item_inital_setup", plaidItemInitialSetup);
plaidRouter.post("/refresh_transaction_data", refreshPlaidTransactionData);
plaidRouter.post("/refresh_net_worth", refreshPlaidNetWorth);
plaidRouter.get("/get_accounts_overview", getAccountsOverview);

export default plaidRouter;
