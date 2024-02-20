import { Request, Response } from "express";
import { pool } from "../db";
import { getUserByEmail } from "../services/user.service";
import { createUser } from "../services/user.service";

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

// Create Users
export const createUserController = async (req: Request, res: Response) => {
  try {
    if (await getUserByEmail(req.body.email)) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await createUser(req.body);

    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUserBurnRateGoal = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "UPDATE users SET burn_rate_goal = $1 WHERE id = $2 RETURNING *",
      [req.body.burn_rate_goal, req.params.id]
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
