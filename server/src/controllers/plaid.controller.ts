import { Request, Response } from "express";
import {
  TransactionsGetRequest,
  AccountBase,
  AccountType,
  Configuration,
  CountryCode,
  PlaidApi,
  PlaidEnvironments,
  Products,
} from "plaid";
import { insertPlaidItem } from "./plaidItem.controller";

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || "sandbox";

// PLAID_PRODUCTS is a comma-separated list of products to use when initializing
// Link. Note that this list must contain 'assets' in order for the app to be
// able to create and retrieve asset reports.
const PLAID_PRODUCTS = (
  process.env.PLAID_PRODUCTS || Products.Transactions
).split(",");

// PLAID_COUNTRY_CODES is a comma-separated list of countries for which users
// will be able to select institutions from.
const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || "US").split(
  ",",
);

// Parameters used for the OAuth redirect Link flow.
//
// Set PLAID_REDIRECT_URI to 'http://localhost:3000'
// The OAuth redirect flow requires an endpoint on the developer's website
// that the bank website should redirect to. You will need to configure
// this redirect URI for your client ID through the Plaid developer dashboard
// at https://dashboard.plaid.com/team/api.
const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || "";

// Parameter used for OAuth in Android. This should be the package name of your app,
// e.g. com.plaid.linksample
const PLAID_ANDROID_PACKAGE_NAME = process.env.PLAID_ANDROID_PACKAGE_NAME || "";

// We store the access_token in memory - in production, store it in a secure
// persistent data store
let ACCESS_TOKEN: string = "";
let PUBLIC_TOKEN = null;
let ITEM_ID = null;
let ACCOUNT_ID = null;
// The payment_id is only relevant for the UK/EU Payment Initiation product.
// We store the payment_id in memory - in production, store it in a secure
// persistent data store along with the Payment metadata, such as userId .
let PAYMENT_ID = null;
// The transfer_id and authorization_id are only relevant for Transfer ACH product.
// We store the transfer_id in memory - in production, store it in a secure
// persistent data store
let AUTHORIZATION_ID = null;
let TRANSFER_ID = null;

// Initialize the Plaid client
// Find your API keys in the Dashboard (https://dashboard.plaid.com/account/keys)
const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": PLAID_CLIENT_ID,
      "PLAID-SECRET": PLAID_SECRET,
      "Plaid-Version": "2020-09-14",
    },
  },
});

const client = new PlaidApi(configuration);

export const createLinkToken = async (req: Request, res: Response) => {
  try {
    // should be changed for current user
    // const user = await User.find(...);
    const clientUserId = "generic_id";
    const request = {
      user: {
        // This should correspond to a unique id for the current user.
        client_user_id: clientUserId,
      },
      client_name: "Plaid Test App",
      products: [Products.Auth, Products.Transactions],
      language: "en",
      country_codes: [CountryCode.Us, CountryCode.Ca],
    };

    const createTokenResponse = await client.linkTokenCreate(request);
    res.status(200).json(createTokenResponse.data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const exchangePublicToken = async (req: Request, res: Response) => {
  try {
    const publicToken = req.body.public_token;
    const response = await client.itemPublicTokenExchange({
      public_token: publicToken,
    });

    // These values should be saved to a persistent database and
    // associated with the currently signed-in user
    // currently storing them locally
    ACCESS_TOKEN = response.data.access_token;
    ITEM_ID = response.data.item_id;
    console.log("req.params are\n", req.params, "\n");
    // const userId: number = Number(req.params.user_id); 
    const userId: number = 19;
    console.log("exchangePublicToken method: userID is", userId);
    await insertPlaidItem(userId, ACCESS_TOKEN);

    res.status(200).json({ public_token_exchange: "complete" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

async function fetchBankNameFromInstitutionId(institutionId: string): Promise<string> {
  try {
    const response = await client.institutionsGetById({
      institution_id: institutionId,
      country_codes: [CountryCode.Us],
    });

    const bankName = response.data.institution.name;
    return bankName;
  } catch (error) {
    console.error('Error fetching bank name for institutionId:', institutionId, error);
    return 'Unknown Bank';
  }
}

export const getAccountsOverview = async (req: Request, res: Response) => {
  try {
    const response = await client.accountsGet({
      access_token: "access-sandbox-a71749d2-ee2e-47f4-9efc-1e291a10e94a",
      // access_token: ACCESS_TOKEN,
    });

    console.log("\n\nRESPONSE DATA\n\n");
    console.log(response.data);
    console.log("\n\nRESPONSE DATA\n\n");

    const institutionId = response.data.item.institution_id ? response.data.item.institution_id : "";
    const bankName = await fetchBankNameFromInstitutionId(institutionId);
    const accounts = response.data.accounts;
    const accountsOverview: { [key: string]: AccountBase[] } = {};
    for (let i = 0; i < accounts.length; i++) {
      const account = accounts[i];
      const type: string = account.type;
      if (!(type in accountsOverview)) {
        accountsOverview[type] = [];
      }
      accountsOverview[type].push(account);
    }

    const overviewResponse = {
      bankName,
      accountsOverview
    };

    console.log("\n\nRESPONSE\n\n");
    console.log(overviewResponse);
    console.log("\n\nRESPONSE\n\n");
    res.status(200).json(overviewResponse);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


function getCorrespondingSunday(date: Date): string {
  const dayOfWeek = date.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
  const diff = date.getDate() - dayOfWeek; // Subtract the current day of the week to get Sunday

  // Create a new Date object with the corresponding Sunday
  const sunday = new Date(date);
  sunday.setDate(diff);

  return sunday.toDateString();
}

export const getTransactionsSinceAugust = async (req: Request, res: Response) => {
  try {
    let currentDate = new Date();
    const startDateString = '2023-08-01';
    const currentDateString = currentDate.toISOString().split('T')[0]

    const request: TransactionsGetRequest = {
      access_token: "access-sandbox-9d4831b0-1736-46d9-902b-0e93dfebeced",
      start_date: startDateString,
      end_date: currentDateString
    };

    const response = await client.transactionsGet(request);
    let transactions = response.data.transactions;
    const total_transactions = response.data.total_transactions;

    while (transactions.length < total_transactions) {
      const paginatedRequest: TransactionsGetRequest = {
        access_token: "access-sandbox-9d4831b0-1736-46d9-902b-0e93dfebeced",
        start_date: startDateString,
        end_date: currentDateString,
        options: {
          offset: transactions.length,
        },
      };
      const paginatedResponse = await client.transactionsGet(paginatedRequest);
      transactions = transactions.concat(
        paginatedResponse.data.transactions,
      );
    };

    const groupedTransactions: Record<string, number> = {};

    transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const sunday = getCorrespondingSunday(date);

        if (!groupedTransactions[sunday]) {
            groupedTransactions[sunday] = 0;
        }

        groupedTransactions[sunday] += transaction.amount;
    });

    res.status(200).json(groupedTransactions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
