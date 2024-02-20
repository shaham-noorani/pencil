import express from "express";
import userRouter from "./routers/user.routes";
import exampleRouter from "./routers/example.routes";
import plaidRouter from "./routers/plaid.routes";
import spendingsRouter from "./routers/spendings.routes";
import netWorthRouter from "./routers/netWorth.routes";
import plaidItemRouter from "./routers/plaidItems.routes";
const router = express.Router();

// Define your routes here
router.use("/example", exampleRouter);
router.use("/plaid", plaidRouter);
router.use("/user", userRouter);
router.use("/spendings", spendingsRouter);
router.use("/plaidItem", plaidItemRouter);
router.use("/netWorth", netWorthRouter);

export default router;
