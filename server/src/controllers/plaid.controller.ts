import { Request, Response } from "express";
import { getUserByEmail, getUserByIdService } from "../services/user.service";
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
    const transactions = await getSyncedTransactions(access_token, user.id, undefined);
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
    if (!plaid_items) {
      plaid_items = []
    }

    for (const plaid_item of plaid_items) {
      const transactions = await getSyncedTransactions(plaid_item.token, user.id, plaid_item.synch_token);
      await addTransactionArrayToSpendings(user.id, transactions);
    }
    res.status(200).json({message: "complete"});
    return;
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
            net_worth -= account.balances.available ?? 0;
          }
        } else {
          if (account.balances.current) {
            net_worth += account.balances.available ?? 0;
          }
        }
      }
    };

    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const netWorthResult = await createOrUpdateNetWorth({
      id: 0,
      user_id: user.id,
      amount: net_worth,
      start_date: date,
      end_date: date
    });

    res.status(200).json({net_worth_update: netWorthResult});
    return;
  } catch (error: any) {
    console.log(error.message);
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

    // res.status(200).json(accountsOverview);
    const accountsOverviewResponse = {
      "depository": [
          {
              "account_id": "1EjGvDdVpxhaWgVyZvknso8DqNKnB1TpPlW76",
              "balances": {
                  "available": 1512.45,
                  "current": 1512.45,
                  "iso_currency_code": "USD",
                  "limit": null,
                  "unofficial_currency_code": null
              },
              "mask": "3466",
              "name": "Checking",
              "official_name": "Plaid Checking",
              "persistent_account_id": "df8857955be82b9b88ddb077aa4e86b4d6ed6853c4735c01034a1051",
              "subtype": "checking",
              "type": "depository",
              "institution_name": "Wells Fargo"
          },
          {
              "account_id": "LD7W1zvaZ3fdjgAWQw9vFoXDVLvBP9TkWGD8D",
              "balances": {
                  "available": 600,
                  "current": 600,
                  "iso_currency_code": "USD",
                  "limit": null,
                  "unofficial_currency_code": null
              },
              "mask": "5184",
              "name": "Savings",
              "official_name": "Plaid Savings",
              "persistent_account_id": "32f659a2089c72a4141d80a441af1d86f37f6bdcc4de56d6a9782464",
              "subtype": "savings",
              "type": "depository",
              "institution_name": "Wells Fargo"
          }
      ],
  "investment": [
          {
              "account_id": "1EjGvDdVpxhaWgVyZvknso8DqNKnB1TpPlW76",
              "balances": {
                  "available": 4789.51,
                  "current": 4789.51,
                  "iso_currency_code": "USD",
                  "limit": null,
                  "unofficial_currency_code": null
              },
              "mask": "7289",
              "name": "Checking",
              "official_name": "Plaid Investment",
              "persistent_account_id": "df8857955be82b9b88ddb077aa4e86b4d6ed6853c4735c01034a1051",
              "subtype": "checking",
              "type": "depository",
              "institution_name": "Wells Fargo"
          }
      ],
  "credit": [
          {
              "account_id": "1EjGvDdVpxhaWgVyZvknso8DqNKnB1TpPlW76",
              "balances": {
                  "available": 314.15,
                  "current": 314.15,
                  "iso_currency_code": "USD",
                  "limit": null,
                  "unofficial_currency_code": null
              },
              "mask": "9482",
              "name": "Checking",
              "official_name": "Plaid Credit",
              "persistent_account_id": "df8857955be82b9b88ddb077aa4e86b4d6ed6853c4735c01034a1051",
              "subtype": "checking",
              "type": "depository",
              "institution_name": "Wells Fargo"
          }
      ],
  "loan": [
          {
              "account_id": "1EjGvDdVpxhaWgVyZvknso8DqNKnB1TpPlW76",
              "balances": {
                  "available": 9825.50,
                  "current": 9825.50,
                  "iso_currency_code": "USD",
                  "limit": null,
                  "unofficial_currency_code": null
              },
              "mask": "2564",
              "name": "Checking",
              "official_name": "Plaid Student Loan",
              "persistent_account_id": "df8857955be82b9b88ddb077aa4e86b4d6ed6853c4735c01034a1051",
              "subtype": "checking",
              "type": "depository",
              "institution_name": "Wells Fargo"
          }
      ]
  };
    res.status(200).json(accountsOverviewResponse);

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAccountsOverviewService = async (id: number) => {
  const user = await getUserByIdService(id);
  let plaid_items = await getPlaidItemsByUserId(id);
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

  return accountsOverview;
};
