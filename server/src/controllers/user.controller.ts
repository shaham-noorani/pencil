import { Request, Response } from "express";
import { pool } from "../db";

//Get Users
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        const examples = result.rows;
        res.status(200).json(examples);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    return res.status(501).json({ message: "Not Implemented" });
};

//May potentially help with Oauth stuff
export const getUserByEmail = async (req: Request, res: Response) => {
    return res.status(501).json({ message: "Not Implemented" });
};

//Update Users
export const updateUser = async (req: Request, res: Response) => {
    return res.status(501).json({ message: "Not Implemented" });
};

//Delete Users
export const deleteUser = async (req: Request, res: Response) => {
    return res.status(501).json({ message: "Not Implemented" });
};

//Create Users
export const createUser = async (req: Request, res: Response) => {
    return res.status(501).json({ message: "Not Implemented" });
};