import express from "express";

import {
  googleSignIn,
  googleRefreshToken,
  getMe,
} from "../controllers/auth.controller";

const authRouter = express.Router();

authRouter.post("/google", googleSignIn);
authRouter.post("/google/refresh-token", googleRefreshToken);
authRouter.get("/me", getMe);

export default authRouter;
