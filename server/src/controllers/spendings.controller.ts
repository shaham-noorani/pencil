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
      [req.params.id]
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
      [req.params.user_id]
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

export const getSpendingsByUserIdAndDateRange = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(
      "SELECT * FROM user_spendings WHERE user_id = $1 AND end_date >= $2 AND start_date <= $3 ORDER BY start_date",
      [req.params.user_id, req.query.start_date, req.query.end_date]
    );
    const spent = result.rows;

    if (!spent) {
      return res.status(404).json({ message: "User Spendings not found" });
    }

    res.status(200).json(result);
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
      [req.params.user_id]
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

export const getFunBudget = async (req: Request, res: Response) => {
  try {
    //Get curr month
    let date = new Date();
    let month = date.getMonth();
    let year = date.getFullYear();
    const AUGUST = 7;
    const milliseconds_to_days = 1000 * 60 * 60 * 24;

    let beginMonth = new Date(year, month, 1);

    if (month < AUGUST) {
      year -= 1;
    }

    let diff = beginMonth.getTime() - new Date(year, AUGUST, 1).getTime();
    diff = Math.ceil(diff / milliseconds_to_days);

    //Get current amount
    let curr_amount = 10000; //FIX
    let starting_amount = curr_amount;
    let last_month = curr_amount;

    //Calculate Starting Amount
    const result = await pool.query(
      "SELECT * FROM user_spendings WHERE user_id = $1 AND end_date >= $2 AND start_date <= $3 ORDER BY start_date",
      [req.params.user_id, req.query.start_date, req.query.end_date]
    );
    const spent = result.rows;

    for (let i = 0; i < spent.length; i++) {
      starting_amount += spent[i]["spent_amount"];
      if (new Date(spent[i]["end_date"]).getMonth() == month) {
        last_month += spent[i]["spent_amount"];
      }
    }

    //Get Goal Budget
    const result_burn_rate = await pool.query(
      "SELECT burn_rate_goal FROM users WHERE user_id = $1",
      [req.params.user_id]
    );
    const brg = result_burn_rate.rows[0]["burn_rate_goal"];

    const desired_amount = ((starting_amount - brg) / 10) * month;

    res.status(201).json({ fun_budget: last_month - desired_amount });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
