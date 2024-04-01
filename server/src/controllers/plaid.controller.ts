import { Request, Response } from "express";
import { getUserByEmail } from "../services/user.service";
import {
  createPlaidItem,
  getPlaidItemsByUserId,
} from "../services/plaidItem.service";
import {
  createPlaidLinkToken,
  exchangePlaidPublicTokenForAccessToken,
  getAccountsForPlaidToken,
  getSyncedTransactions,
  addTransactionArrayToSpendings,
  getTransactionsWithinDateRange,
  getMostRecentAugust,
  getInstitutionNameForPlaidToken,
} from "../services/plaid.service";
import { AccountBase } from "plaid";
import PlaidAccount from "../models/plaidAccount.model";

export const createLinkToken = async (req: Request, res: Response) => {
  try {
    const user_id = req.body.email.split("@")[0];
    const createTokenResponse = await createPlaidLinkToken(user_id);
    res.status(200).json(createTokenResponse.data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const plaidItemInitialSetup = async (req: Request, res: Response) => {
  try {
    const user = await getUserByEmail(req.body.email);
    const public_token = req.body.public_token;
    const access_token = await exchangePlaidPublicTokenForAccessToken(
      public_token
    );
<<<<<<< HEAD
    const createPlaidItemResponse = await createPlaidItem(
      access_token,
      user.id,
      null
    );
=======
    // const createPlaidItemResponse = await createPlaidItem(access_token, user.id);
    // Why is this throwing an error?
>>>>>>> origin/main

    //const transactions = await getTransactionsWithinDateRange(access_token, getMostRecentAugust(), new Date());
    const transactions = await getSyncedTransactions(access_token, "");
    await addTransactionArrayToSpendings(user.id, transactions);
    res.status(200).json({ public_token_exchange: "complete" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAccountsOverview = async (req: Request, res: Response) => {
  try {
    const user = await getUserByEmail(req.body.email);
    let plaid_items = await getPlaidItemsByUserId(user.id);
    if (!plaid_items) {
      plaid_items = [];
    }

    const accountsOverview: { [key: string]: PlaidAccount[] } = {};

    for (const plaid_item of plaid_items) {
      const accounts = await getAccountsForPlaidToken(plaid_item.token);
      const institution_name = await getInstitutionNameForPlaidToken(
        plaid_item.token
      );

      for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i] as PlaidAccount;

        if (institution_name) {
          account.institution_name = institution_name;
        }

        const type: string = account.type;
        if (!(type in accountsOverview)) {
          accountsOverview[type] = [];
        }
        accountsOverview[type].push(account);
      }
    }

    res.status(200).json(accountsOverview);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
