import { Request, Response } from "express";
import { getUserByEmail } from "../services/user.service";
import { createPlaidItem, getPlaidItemsByUserId } from "../services/plaidItem.service";
import { createPlaidLinkToken, exchangePlaidPublicTokenForAccessToken, getAccountsForPlaidToken, getSundayOfWeek, getTransactionsWithinDateRange } from "../services/plaid.service";
import { AccountBase } from "plaid";

export const createLinkToken = async (req: Request, res: Response) => {
  try {
    const createTokenResponse = await createPlaidLinkToken(req.params.email);
    res.status(200).json(createTokenResponse.data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const exchangePublicToken = async (req: Request, res: Response) => {
  try {
    const user = await getUserByEmail(req.params.email);
    const public_token = req.body.public_token;
    const access_token = await exchangePlaidPublicTokenForAccessToken(public_token);

    createPlaidItem(access_token, user.id);
    // ITEM_ID = response.data.item_id;

    res.status(200).json({ public_token_exchange: "complete" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAccountsOverview = async (req: Request, res: Response) => {
  try {
    const user = await getUserByEmail(req.params.email);
    let plaid_items = await getPlaidItemsByUserId(user.id);
    if (!plaid_items) {
      plaid_items = []
    }
    
    const accountsOverview: { [key: string]: AccountBase[] } = {};

    for (const plaid_item of plaid_items) {
      const accounts = await getAccountsForPlaidToken(plaid_item.token);

      for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        const type: string = account.type;
        if (!(type in accountsOverview)) {
          accountsOverview[type] = [];
        }
        accountsOverview[type].push(account);
      }
    };

    res.status(200).json(accountsOverview);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getTransactionsSinceAugust = async (req: Request, res: Response) => {
  try {
    const current_date = new Date();
    let august_date = new Date();
    if (august_date.getMonth() < 7) {
      august_date.setFullYear(august_date.getFullYear() - 1);
    }
    august_date.setMonth(7);
    august_date.setDate(1);

  
    const groupedTransactions: Record<string, number> = {};
    /*
    transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const sunday = getSundayOfWeek(date);

        if (!groupedTransactions[sunday]) {
            groupedTransactions[sunday] = 0;
        }

        groupedTransactions[sunday] += transaction.amount;
    });
    */
    res.status(200).json(groupedTransactions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
