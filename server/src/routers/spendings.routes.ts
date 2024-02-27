import express from "express";

import {
  getAllSpendings,
  getSpendingsById,
  getSpendingsByUserId,
  getSpendingsByUserIdAndDateRange,
  deleteSpendings,
  deleteSpendingsByUserId,
  createSpendingsController,
} from "../controllers/spendings.controller";

const spendingsRouter = express.Router();

spendingsRouter.get("/", getAllSpendings);
spendingsRouter.get("/:id", getSpendingsById);
spendingsRouter.get("/user/:user_id", getSpendingsByUserId);
spendingsRouter.get("/user/range/:user_id", getSpendingsByUserIdAndDateRange)
spendingsRouter.delete("/:id", deleteSpendings);
spendingsRouter.delete("/user/:user_id", deleteSpendingsByUserId);
spendingsRouter.post("/", createSpendingsController);

export default spendingsRouter;
