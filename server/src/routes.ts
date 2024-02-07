import express from "express";
import exampleRouter from "./routers/example.routes";
import plaidRouter from "./routers/plaid.routes";

const router = express.Router();

// Define your routes here
router.use("/example", exampleRouter);
router.use("/plaid", plaidRouter);

export default router;
