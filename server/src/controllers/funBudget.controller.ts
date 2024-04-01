import { Request, Response } from "express";
import { pool } from "../db";
import { getAccountsOverviewService } from "../services/plaid.service";

export const getUserFunBudget = async (req: Request, res: Response) => {
  try {
    //Get curr month
    let date = new Date();
    let month = date.getMonth();
    let year = date.getFullYear();
    const AUGUST = 7;
    const milliseconds_to_days = 1000 * 60 * 60 * 24;

    let beginMonth = new Date(year, month, 1);

    if (month < AUGUST) {
      year -= 1;
    }

    let diff = beginMonth.getTime() - new Date(year, AUGUST, 1).getTime();
    diff = Math.ceil(diff / milliseconds_to_days);

    //Get current amount
    let acct_ov = await getAccountsOverviewService(Number(req.params.user_id));
    let curr_amount = 0;

    for (let acc of acct_ov["depository"]) {
      let amt = acc.balances.current;
      curr_amount += amt!;
    }
    let today_amt = curr_amount;

    let starting_amount = curr_amount;
    let last_month = curr_amount;

    //Calculate Starting Amount
    const result = await pool.query(
      "SELECT * FROM user_spendings WHERE user_id = $1 AND end_date >= $2 AND start_date <= $3 ORDER BY start_date",
      [req.params.user_id, req.query.start_date, req.query.end_date]
    );
    const spent = result.rows;

    for (let i = 0; i < spent.length; i++) {
      starting_amount += spent[i]["spent_amount"];
      if (new Date(spent[i]["end_date"]).getMonth() == month - 1) {
        last_month += spent[i]["spent_amount"];
      }
    }

    //Get Goal Budget
    const result_burn_rate = await pool.query(
      "SELECT burn_rate_goal FROM users WHERE user_id = $1",
      [req.params.user_id]
    );
    const brg = result_burn_rate.rows[0]["burn_rate_goal"];

    const desired_amount = ((starting_amount - brg) / 10) * month;

    res.status(200).json({
      hasSurplus: last_month - desired_amount > 0,
      funBudget: Math.max(last_month - desired_amount, 0),
      funBudgetLeft: Math.max(last_month - desired_amount, 0),
      overspent: Math.min(last_month - desired_amount, 0),
    });

    res.status(201).json({ fun_budget: last_month - desired_amount });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
