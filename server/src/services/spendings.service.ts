import { updateExample } from "../controllers/example.controller";
import { pool } from "../db";
import Spendings from "../models/spendings.model";

//Create Spendings
export const createSpendings = async (
  spending: Spendings
): Promise<Spendings> => {
  let start_date = spending.start_date;
  let end_date = spending.end_date;

  //Assume spending is money spent from 7 days ago until now
  if (spending.start_date === undefined || spending.end_date === undefined) {
    end_date = new Date();
    start_date = new Date(end_date.getTime() - 1000 * 60 * 60 * 24 * 7);
  }

  const result = await pool.query(
    "INSERT INTO user_spendings (start_date, end_date, spent_amount, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
    [start_date, end_date, spending.spent_amount, spending.user_id]
  );
  const spent = result.rows[0];

  return spent;
};

export const buildLinearRegression = async (user_id: number) => {
  //Recompute linear regression
  const user_spent = await pool.query(
    "SELECT spent_amount FROM user_spendings WHERE user_id = $1",
    [user_id]
  );

  let numerator = 0;
  let denominator = 0;
  let accumulate_y = 0;
  let mu_x = user_spent["rows"].length / 2;
  let mu_y = 0;

  //Determine means
  for (let i = 0; i < user_spent["rows"].length; i++) {
    accumulate_y -= user_spent["rows"][i]["spent_amount"];
    mu_y += accumulate_y;
  }
  mu_y /= user_spent["rows"].length;

  //OLS
  accumulate_y = 0;
  for (let i = 0; i < user_spent["rows"].length; i++) {
    accumulate_y -= user_spent["rows"][i]["spent_amount"];
    numerator += (i - mu_x) * (accumulate_y - mu_y);
    denominator += (i - mu_x) * (i - mu_x);
  }

  //Get burn_rate_goal
  const brg = await pool.query(
    "SELECT burn_rate_goal FROM users WHERE id = $1",
    [user_id]
  );

  //Shift LR up by burn_rate_goal
  let burn_rate_goal = brg.rows[0]["burn_rate_goal"];
  let slope = numerator / (denominator + Number.EPSILON);
  let intercept = mu_y - slope * mu_x + burn_rate_goal;

  //Update User's slope and intercept
  const update_lr = await pool.query(
    "UPDATE users SET slope = $1, intercept = $2 WHERE id = $3 RETURNING *",
    [slope, intercept, user_id]
  );

  return update_lr.rows[0];
};