import express from "express";

import {
  getAllNetWorths,
  getNetWorthById,
  getNetWorthsByUserId,
  deleteNetWorth,
  deleteNetWorthByUserId,
  createNetWorth,
  getLatest7NetWorthsByUserId,
} from "../controllers/netWorth.controller";

const netWorthRouter = express.Router();

netWorthRouter.get("/", getAllNetWorths);
netWorthRouter.get("/:id", getNetWorthById);
netWorthRouter.get("/user/:user_id", getNetWorthsByUserId);
netWorthRouter.get("/user/last7/:user_id", getLatest7NetWorthsByUserId);
netWorthRouter.delete("/:id", deleteNetWorth);
netWorthRouter.delete("/user/:user_id", deleteNetWorthByUserId);
netWorthRouter.post("/", createNetWorth);

export default netWorthRouter;
