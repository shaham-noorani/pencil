import { Request, Response } from "express";
import { pool } from "../db";

//Get Users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    const users = result.rows;
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      req.params.id,
    ]);
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

//Delete Users
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

//Create Users
export const createUser = async (req: Request, res: Response) => {
  try {
    //Check if email already exists
    const existingEmails = await pool.query(
      "SELECT COUNT(*) FROM users WHERE email = $1",
      [req.body.email]
    );
    const nExistingEmails = Number(existingEmails.rows[0].count);
    if (nExistingEmails > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    let dateTime = new Date();

    const result = await pool.query(
      'INSERT INTO users (name, email, "burnRateGoal", slope, intercept, date_joined) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.body.name, req.body.email, req.body.burnRateGoal, 0, 0, dateTime]
    );
    const user = result.rows[0];

    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUserBurnRateGoal = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'UPDATE users SET "burnRateGoal" = $1 WHERE email = $2 RETURNING *',
      [req.body.burnRateGoal, req.params.email]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
