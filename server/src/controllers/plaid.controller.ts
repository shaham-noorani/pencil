import { Request, Response } from "express";
import { getUserByEmail } from "../services/user.service";
import { createPlaidItem, getPlaidItemsByUserId } from "../services/plaidItem.service";
import { createPlaidLinkToken, exchangePlaidPublicTokenForAccessToken, getAccountsForPlaidToken, getSyncedTransactions, addTransactionArrayToSpendings, getTransactionsWithinDateRange, getMostRecentAugust, getInstitutionNameForPlaidToken } from "../services/plaid.service";
import { AccountBase, AccountType } from "plaid";
import PlaidAccount from "../models/plaidAccount.model";
import PlaidItem from "../models/plaidItem.model";
import { createOrUpdateNetWorth } from "../services/netWorth.service";

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
    const access_token = await exchangePlaidPublicTokenForAccessToken(public_token);
    const createPlaidItemResponse = await createPlaidItem(access_token, user.id, null);

    //const transactions_date = await getTransactionsWithinDateRange(access_token, getMostRecentAugust(), new Date());
    //console.log(transactions_date.length);

    const transactions = await getSyncedTransactions(access_token, user.id, undefined);
    console.log("plaidItemInitialSetup: transactions.length was: ", transactions.length);
    const addTransactionResult = await addTransactionArrayToSpendings(user.id, transactions);
    res.status(200).json({ result: addTransactionResult});
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const refreshPlaidTransactionData = async (req: Request, res: Response) => {
  try {
    const user = await getUserByEmail(req.body.email);
    let plaid_items = await getPlaidItemsByUserId(user.id);
    console.log("refreshPlaidTransactionData: plaid_items is: ", plaid_items);
    if (!plaid_items) {
      plaid_items = []
    }

    for (const plaid_item of plaid_items) {
      console.log("refreshPlaidTransactionData: plaid_item.synch_token BEFORE was: ", plaid_item.synch_token);
      const transactions = await getSyncedTransactions(plaid_item.token, user.id, plaid_item.synch_token);
      console.log("refreshPlaidTransactionData: transactions.length was: ", transactions.length);
      console.log("refreshPlaidTransactionData: plaid_item.synch_token AFTER was: ", plaid_item.synch_token);
      await addTransactionArrayToSpendings(user.id, transactions);
    }
    res.status(200);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export const refreshPlaidNetWorth = async (req: Request, res: Response) => {
  try {
    const user = await getUserByEmail(req.body.email);
    let plaid_items = await getPlaidItemsByUserId(user.id);
    if (!plaid_items) {
      plaid_items = []
    }
    
    let net_worth = 0.0;

    for (const plaid_item of plaid_items) {
      const accounts = await getAccountsForPlaidToken(plaid_item.token);
      const institution_name = await getInstitutionNameForPlaidToken(plaid_item.token);

      for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i] as PlaidAccount;

        if (account.type == AccountType.Credit || account.type == AccountType.Loan) {
          if (account.balances.current) {
            net_worth -= account.balances.current;
          }
        } else {
          if (account.balances.current) {
            net_worth += account.balances.current;
          }
        }
      }
    };

    const date = new Date();
    date.setTime(0);
    const netWorthResult = await createOrUpdateNetWorth({
      id: 0,
      user_id: user.id,
      spent_amount: net_worth,
      start_date: date,
      end_date: date,
    });

    res.status(200).json({net_worth_update: netWorthResult});
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

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
