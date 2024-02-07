import express from "express";

import {
  getExampleById,
  getAllExamples,
  createExample,
  updateExample,
  deleteExample,
} from "../controllers/example.controller";

const exampleRouter = express.Router();

exampleRouter.get("/", getAllExamples);
exampleRouter.get("/:id", getExampleById);
exampleRouter.post("/", createExample);
exampleRouter.put("/:id", updateExample);

exampleRouter.delete("/:id", deleteExample);

export default exampleRouter;
