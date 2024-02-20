import express from "express";

import {
  getAllPlaidItems,
  getPlaidItemById,
  getPlaidItemsByUserId,
  deletePlaidItem,
  deletePlaidItemByUserId,
  createPlaidItem,
} from "../controllers/plaidItem.controller";

const plaidItemRouter = express.Router();

plaidItemRouter.get("/", getAllPlaidItems);
plaidItemRouter.get("/:id", getPlaidItemById);
plaidItemRouter.get("/user/:user_id", getPlaidItemsByUserId);
plaidItemRouter.delete("/:id", deletePlaidItem);
plaidItemRouter.delete("/user/:user_id", deletePlaidItemByUserId);
plaidItemRouter.post("/", createPlaidItem);

export default plaidItemRouter;
