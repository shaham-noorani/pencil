import express from "express";

import {
    getAllUsers,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser,
    createUser,
} from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.get("/:email", getUserByEmail);
userRouter.post("/", createUser);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);


export default userRouter;
