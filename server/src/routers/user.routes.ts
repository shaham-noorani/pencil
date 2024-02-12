import express from "express";

import {
  getAllUsers,
  getUserById,
  deleteUser,
  createUser,
} from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/", createUser);
userRouter.delete("/:id", deleteUser);

export default userRouter;
