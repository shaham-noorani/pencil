import express, { Request, Response, Router } from "express";
import { getUserFunBudget } from "../controllers/funBudget.controller";

const FunBudgetRouter: Router = express.Router();

FunBudgetRouter.get("/user/:user_id", getUserFunBudget);

export default FunBudgetRouter;
