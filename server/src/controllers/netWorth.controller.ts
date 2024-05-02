import { Request, Response } from "express";
import { pool } from "../db";

export const getAllNetWorths = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM user_net_worth");
    const nws = result.rows;
    res.status(200).json(nws);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getNetWorthById = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM user_net_worth WHERE id = $1",
      [req.params.id],
    );
    const nw = result.rows[0];
    if (!nw) {
      return res.status(404).json({ message: "User Net Worth not found" });
    }
    res.status(200).json(nw);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getNetWorthsByUserId = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM user_net_worth WHERE user_id = $1",
      [req.params.user_id],
    );
    const nw = result.rows[0];
    if (!nw) {
      return res.status(404).json({ message: "User Net Worth not found" });
    }
    res.status(200).json(nw);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getLatest7NetWorthsByUserId = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.user_id, 10);
    const result = await pool.query(
      "SELECT * FROM user_net_worth WHERE user_id = $1 ORDER BY start_date DESC LIMIT 7",
      [userId],
    );
    const netWorths = result.rows;
    if (netWorths.length === 0) {
      return res.status(404).json({ message: "User Net Worth entries not found" });
    }
    res.status(200).json(netWorths);
  } catch (error: any) {
    console.error('Error fetching user net worth entries:', error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteNetWorth = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "DELETE FROM user_net_worth WHERE id = $1 RETURNING *",
      [req.params.id],
    );
    const nw = result.rows[0];

    if (!nw) {
      return res.status(404).json({ message: "User Net Worth not found" });
    }
    res.status(200).json({ message: "User Net Worth deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNetWorthByUserId = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "DELETE FROM user_net_worth WHERE user_id = $1 RETURNING *",
      [req.params.user_id],
    );
    const nw = result.rows[0];

    if (!nw) {
      return res.status(404).json({ message: "User Net Worth not found" });
    }
    res.status(200).json({ message: "User Net Worth deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createNetWorth = async (req: Request, res: Response) => {
  try {
    let start_date = req.body.start_date;
    let end_date = req.body.end_date;

    //Assume spending is money spent from 7 days ago until now
    if (req.body.start_date === undefined || req.body.end_date === undefined) {
      end_date = new Date();
      start_date = new Date(end_date.getTime() - 1000 * 60 * 60 * 24 * 7);
    }

    const result = await pool.query(
      "INSERT INTO user_net_worth (start_date, end_date, amount, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [start_date, end_date, req.body.amount, req.body.user_id],
    );
    const nw = result.rows[0];

    res.status(201).json(nw);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
