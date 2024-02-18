import express from "express";

import {
  getAllSpendings,
  getSpendingsById,
  getSpendingsByUserId,
  deleteSpendings,
  deleteSpendingsByUserId,
  createSpendings,
} from "../controllers/spendings.controller";

const spendingsRouter = express.Router();

spendingsRouter.get("/", getAllSpendings);
spendingsRouter.get("/:id", getSpendingsById);
spendingsRouter.get("/user/:user_id", getSpendingsByUserId);
spendingsRouter.delete("/:id", deleteSpendings);
spendingsRouter.delete("/user/:user_id", deleteSpendingsByUserId);
spendingsRouter.post("/", createSpendings);

export default spendingsRouter;
