import { Request, Response } from "express";
import { pool } from "../db";

//Get PlaidItems
export const getAllSpendings = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM user_spendings");
    const users = result.rows;
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSpendingsById = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM user_spendings WHERE id = $1",
      [req.params.id]
    );
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ message: "User Spendings not found" });
    }
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSpendingsByUserId = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM user_spendings WHERE user_id = $1",
      [req.params.user_id]
    );
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ message: "User Spendings not found" });
    }
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

//Delete Spendings
export const deleteSpendings = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "DELETE FROM user_spendings WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    const user = result.rows[0];

    if (!user) {
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
      [req.params.user_id]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User Spendings not found" });
    }
    res.status(200).json({ message: "User Spendings deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

//Create Spendings
export const createSpendings = async (req: Request, res: Response) => {
  try {
    let start_date = req.body.start_date;
    let end_date = req.body.end_date;

    //Assume spending is money spent from 7 days ago until now
    if (req.body.start_date === undefined || req.body.end_date === undefined) {
      end_date = new Date();
      start_date = new Date(end_date.getTime() - 1000 * 60 * 60 * 24 * 7);
    }

    const result = await pool.query(
      "INSERT INTO user_spendings (start_date, end_date, spent_amount, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [start_date, end_date, req.body.spent_amount, req.body.user_id]
    );
    const user = result.rows[0];

    //Recompute linear regression
    const user_spent = await pool.query(
      "SELECT spent_amount FROM user_spendings WHERE user_id = $1",
      [req.body.user_id]
    );

    let numerator = 0;
    let denominator = 0;
    let accumulate_y = 0;
    let mu_x = (user_spent["rows"].length + 1) / 2;
    let mu_y = 0;

    //Determine means
    for (let i = 0; i < user_spent["rows"].length; i++) {
      accumulate_y += user_spent["rows"][i]["spent_amount"];
      mu_y += accumulate_y;
    }
    mu_y /= user_spent["rows"].length;

    //OLS
    accumulate_y = 0;
    for (let i = 0; i < user_spent["rows"].length; i++) {
      accumulate_y += user_spent["rows"][i]["spent_amount"];
      numerator += (i + 1 - mu_x) * (accumulate_y - mu_y);
      denominator += (i + 1 - mu_x) * (i + 1 - mu_x);
    }

    let slope = numerator / denominator;
    let intercept = mu_y - slope * mu_x;

    //Update User's slope and intercept
    const update_lr = await pool.query(
      "UPDATE users SET slope = $1, intercept = $2 WHERE id = $3 RETURNING *",
      [slope, intercept, req.body.user_id]
    );

    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
