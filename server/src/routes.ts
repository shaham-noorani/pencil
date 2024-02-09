import express from "express";
import userRouter from "./routers/user.routes";
import exampleRouter from "./routers/example.routes";
import plaidRouter from "./routers/plaid.routes";

const router = express.Router();

// Define your routes here
router.use("/example", exampleRouter);
router.use("/plaid", plaidRouter);
router.use("/user", userRouter);

export default router;
