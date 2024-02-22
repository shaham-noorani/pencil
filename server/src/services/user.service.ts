import { pool } from "../db";
import User from "../models/user.model";

export const createUser = async (user: User): Promise<User> => {
  const req = await pool.query(
    "INSERT INTO users (email, name, burn_rate_goal, slope, intercept, date_joined) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [
      user.email,
      user.name,
      user.burn_rate_goal,
      user.slope,
      user.intercept,
      new Date(),
    ],
  );

  return req.rows[0];
};

export const getUserByEmail = async (email: string) => {
  const user = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (user.rows.length === 0) return null;

  return user.rows[0];
};
