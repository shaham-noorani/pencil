import express from "express";
import router from "./routes";
import cors from "cors";
import path from "path";
import util from "util";
import authRouter from "./routers/auth.routes";
import { authMiddleware } from "./services/auth.service";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api", authMiddleware, router);
app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
