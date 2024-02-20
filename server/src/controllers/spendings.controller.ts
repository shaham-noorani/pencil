import { Request, Response } from "express";
import { pool } from "../db";
import {
  createSpendings,
  buildLinearRegression,
} from "../services/spendings.service";

//Get PlaidItems
export const getAllSpendings = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM user_spendings");
    const spent = result.rows;
    res.status(200).json(spent);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSpendingsById = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM user_spendings WHERE id = $1",
      [req.params.id],
    );
    const spent = result.rows[0];
    if (!spent) {
      return res.status(404).json({ message: "User Spendings not found" });
    }
    res.status(200).json(spent);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSpendingsByUserId = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM user_spendings WHERE user_id = $1",
      [req.params.user_id],
    );
    const spent = result.rows[0];
    if (!spent) {
      return res.status(404).json({ message: "User Spendings not found" });
    }
    res.status(200).json(spent);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

//Delete Spendings
export const deleteSpendings = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "DELETE FROM user_spendings WHERE id = $1 RETURNING *",
      [req.params.id],
    );
    const spent = result.rows[0];

    if (!spent) {
      return res.status(404).json({ message: "User Spendings not found" });
    }
    res.status(200).json({ message: "User Spendings deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSpendingsByUserId = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "DELETE FROM user_spendings WHERE user_id = $1 RETURNING *",
      [req.params.user_id],
    );
    const spent = result.rows[0];

    if (!spent) {
      return res.status(404).json({ message: "User Spendings not found" });
    }
    res.status(200).json({ message: "User Spendings deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

//Create Spendings
export const createSpendingsController = async (
  req: Request,
  res: Response
) => {
  try {
    const spending = await createSpendings(req.body);
    const lr = await buildLinearRegression(req.body.user_id);

    res.status(201).json(spending);

  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
