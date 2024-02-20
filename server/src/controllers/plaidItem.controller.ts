import { Request, Response } from "express";
import { pool } from "../db";

//Get PlaidItems
export const getAllPlaidItems = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM plaid_item");
    const items = result.rows;
    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlaidItemById = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM plaid_item WHERE id = $1", [
      req.params.id,
    ]);
    const item = result.rows[0];
    if (!item) {
      return res.status(404).json({ message: "Plaid Item not found" });
    }
    res.status(200).json(item);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlaidItemsByUserId = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM plaid_item WHERE user_id = $1",
      [req.params.user_id]
    );
    const item = result.rows[0];
    if (!item) {
      return res.status(404).json({ message: "Plaid Items not found" });
    }
    res.status(200).json(item);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

//Delete Plaid Item
export const deletePlaidItem = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "DELETE FROM plaid_item WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    const item = result.rows[0];

    if (!item) {
      return res.status(404).json({ message: "Plaid Item not found" });
    }
    res.status(200).json({ message: "Plaid Item deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePlaidItemByUserId = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "DELETE FROM plaid_item WHERE user_id = $1 RETURNING *",
      [req.params.user_id]
    );
    const item = result.rows[0];

    if (!item) {
      return res.status(404).json({ message: "Plaid Item not found" });
    }
    res.status(200).json({ message: "Plaid Item deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

//Create Plaid Item
export const createPlaidItem = async (req: Request, res: Response) => {
  try {
    //Check if token already exists
    const existingTokens = await pool.query(
      "SELECT COUNT(*) FROM plaid_item WHERE token = $1",
      [req.body.token]
    );
    const nExistingTokens = Number(existingTokens.rows[0].count);
    if (nExistingTokens > 0) {
      return res.status(409).json({ message: "Token already registered" });
    }

    const result = await pool.query(
      "INSERT INTO plaid_item (token, user_id) VALUES ($1, $2) RETURNING *",
      [req.body.token, req.body.user_id]
    );
    const item = result.rows[0];

    res.status(201).json(item);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
