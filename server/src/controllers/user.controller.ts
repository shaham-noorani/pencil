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

//May potentially help with Oauth stuff
export const getUserByEmail = async (req: Request, res: Response) => {
    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [
            req.params.email,
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

//Update Users
export const updateUserName = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
          "UPDATE users SET name = $1 WHERE id = $2 RETURNING *",
          [req.body.name, req.params.id]
        );
        const user = result.rows[0];
    
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
      } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateUserEmail = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
          "UPDATE users SET email = $1 WHERE id = $2 RETURNING *",
          [req.body.email, req.params.id]
        );
        const user = result.rows[0];
    
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
      } catch (error: any) {
        res.status(400).json({ message: error.message });
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
        const result = await pool.query(
          "INSERT INTO users (name) VALUES ($1) RETURNING *",
          [req.body.name]
        );
        const user = result.rows[0];
    
        res.status(201).json(user);
      } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};