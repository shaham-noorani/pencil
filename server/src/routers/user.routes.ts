import express from "express";

import {
    getAllUsers,
    getUserById,
    getUserByEmail,
    updateUserName,
    updateUserEmail,
    deleteUser,
    createUser,
} from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.get("/email/:id", getUserByEmail);
userRouter.post("/", createUser);
userRouter.put("/:id", updateUserName);
userRouter.put("/email/:id", updateUserEmail);
userRouter.delete("/:id", deleteUser);


export default userRouter;
