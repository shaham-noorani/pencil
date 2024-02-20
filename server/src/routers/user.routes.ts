import express from "express";

import {
  getAllUsers,
  getUserById,
  deleteUser,
  createUser,
  updateUserBurnRateGoal,
} from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/", createUser);
userRouter.delete("/:id", deleteUser);
userRouter.put("/update-burn-rate-goal/:email", updateUserBurnRateGoal);

export default userRouter;
