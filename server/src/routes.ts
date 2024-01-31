import express from "express";
import exampleRouter from "./routers/example.routes";

const router = express.Router();

// Define your routes here
router.use("/example", exampleRouter);

export default router;
