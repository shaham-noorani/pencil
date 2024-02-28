import { pool } from "../db";
import PlaidItem from "../models/user.model";

export const createPlaidItem = async (token: string, user_id: number) => {
  const result = await pool.query(
    "INSERT INTO plaid_item (token, user_id) VALUES ($1, $2) RETURNING *",
    [token, user_id]
  );
  const item = result.rows[0];
  return item;
};

export const getPlaidItemsByUserId = async(user_id: number) => {
    const result = await pool.query(
      "SELECT * FROM plaid_item WHERE user_id = $1",
      [user_id]
    );
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows;
}