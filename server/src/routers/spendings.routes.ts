import express from "express";

import { createSpendings } from "../controllers/spendings.controller";

const spendingsRouter = express.Router();

// spendingsRouter.get("/", getAllExamples);
// spendingsRouter.get("/:id", getExampleById);
spendingsRouter.post("/", createSpendings);
// spendingsRouter.put("/:id", updateExample);

// spendingsRouter.delete("/:id", deleteExample);

export default spendingsRouter;
