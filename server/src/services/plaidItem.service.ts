import { pool } from "../db";
import PlaidItem from "../models/user.model";

export const createPlaidItem = async (token: string, user_id: number, synch_token: string|null) => {
  const result = await pool.query(
    "INSERT INTO plaid_item (token, synch_token, user_id) VALUES ($1, $2, $3) RETURNING *",
    [token, synch_token, user_id]
  );
  const item = result.rows[0];
  return item;
};

export const updatePlaidItemSynchToken = async (user_id: number, synch_token: string|null) => {
  const update_plaid_item = await pool.query(
    "UPDATE plaid_item SET synch_token = $1 WHERE id = $2 RETURNING *",
    [synch_token, user_id]
  );
  return update_plaid_item;
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