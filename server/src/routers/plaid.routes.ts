import express from "express";

import {
    createLinkToken, exchangePublicToken
} from "../controllers/plaid.controller";

const plaidRouter = express.Router();

plaidRouter.get("/create_link_token", createLinkToken);
plaidRouter.post("/exhange_public_token", exchangePublicToken);

export default plaidRouter;