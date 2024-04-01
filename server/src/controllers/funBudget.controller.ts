import { Request, Response } from "express";

export const getUserFunBudget = async (req: Request, res: Response) => {
  const user_id = req.params.user_id;

  // Get the user's fun budget

  res.status(200).json({
    hasSurplus: false,
    funBudget: 0,
    funBudgetLeft: 50,
    overspent: 86,
  });

  // res.status(200).json({
  //   hasSurplus: true,
  //   funBudget: 86,
  //   funBudgetLeft: 65,
  //   overspent: 0,
  // });
};
