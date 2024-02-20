import { Request, Response } from "express";
import { pool } from "../db";

// Get all examples
export const getAllExamples = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM examples");
    const examples = result.rows;
    res.status(200).json(examples);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single example
export const getExampleById = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM examples WHERE id = $1", [
      req.params.id,
    ]);
    const example = result.rows[0];
    if (!example) {
      return res.status(404).json({ message: "Example not found" });
    }
    res.status(200).json(example);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new example
export const createExample = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "INSERT INTO examples (name) VALUES ($1) RETURNING *",
      [req.body.name],
    );
    const example = result.rows[0];

    res.status(201).json(example);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Update an example
export const updateExample = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "UPDATE examples SET name = $1 WHERE id = $2 RETURNING *",
      [req.body.name, req.params.id],
    );
    const example = result.rows[0];

    if (!example) {
      return res.status(404).json({ message: "Example not found" });
    }
    res.status(200).json(example);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an example
export const deleteExample = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "DELETE FROM examples WHERE id = $1 RETURNING *",
      [req.params.id],
    );
    const example = result.rows[0];

    if (!example) {
      return res.status(404).json({ message: "Example not found" });
    }
    res.status(200).json({ message: "Example deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
