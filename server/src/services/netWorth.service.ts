import { updateExample } from "../controllers/example.controller";
import { pool } from "../db";
import NetWorth from "../models/netWorth.model";

export const createOrUpdateNetWorth = async (
  networth: NetWorth
): Promise<NetWorth> => {

  const curr_amount = await pool.query(
    "SELECT spent_amount,id FROM user_net_worth WHERE user_id = $1 AND start_date = $2 AND end_date = $3, ",
    [networth.user_id, networth.start_date, networth.end_date]
  );

  //If found nothing, this must be the first account added for this user
  if (curr_amount.rows.length === 0){
    return createNetWorths(networth);
  }

  const curr_id = curr_amount.rows[0]["id"];
  let new_amount = networth.spent_amount;

  const update_spend = await pool.query(
    "UPDATE user_net_worth SET spent_amount = $1 WHERE id = $2 RETURNING *",
    [new_amount, curr_id]
  );

  return update_spend.rows[0];

}


//Create netWorths
export const createNetWorths = async (
  networth: NetWorth
): Promise<NetWorth> => {
  let start_date = networth.start_date;
  let end_date = networth.end_date;

  //Assume netWorth is money spent from 7 days ago until now
  if (networth.start_date === undefined || networth.end_date === undefined) {
    end_date = new Date();
    start_date = new Date(end_date.getTime() - 1000 * 60 * 60 * 24 * 7);
  }

  const result = await pool.query(
    "INSERT INTO user_net_worth (start_date, end_date, spent_amount, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
    [start_date, end_date, networth.spent_amount, networth.user_id]
  );
  const spent = result.rows[0];

  return spent;
};