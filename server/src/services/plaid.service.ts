import {
    TransactionsGetRequest,
    AccountBase,
    AccountType,
    Configuration,
    CountryCode,
    PlaidApi,
    PlaidEnvironments,
    Products,
    Transaction,
    RemovedTransaction,
    TransactionsSyncRequest,
    LinkTokenCreateRequest,
  } from "plaid";
import { buildLinearRegression, createSpendings, createOrUpdateSpending } from "./spendings.service";
import { updatePlaidItemSynchToken } from "./plaidItem.service";

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || "sandbox";

// PLAID_PRODUCTS is a comma-separated list of products to use when initializing
// Link. Note that this list must contain 'assets' in order for the app to be
// able to create and retrieve asset reports.
const PLAID_PRODUCTS = (
    process.env.PLAID_PRODUCTS || Products.Transactions || Products.Auth || Products.Balance
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

export const createPlaidLinkToken = async (user_id: string) => {
    const request:LinkTokenCreateRequest = {
        user: {
          // This should correspond to a unique id for the current user.
          client_user_id: user_id,
        },
        client_name: "Pencil",
        products: [Products.Auth, Products.Transactions],
        language: "en",
        country_codes: [CountryCode.Us, CountryCode.Ca],
        transactions: {
            days_requested: 364
        }
    };
  
    const createTokenResponse = await client.linkTokenCreate(request);
    return createTokenResponse;
}

export const exchangePlaidPublicTokenForAccessToken = async (public_token: string) => {
    const response = await client.itemPublicTokenExchange({
        public_token: public_token,
    });
    return response.data.access_token;
}

export const getAccountsForPlaidToken = async (token: string) => {
    const response = await client.accountsGet({
        access_token: token
      });
    return response.data.accounts;
}

export const getInstitutionNameForPlaidToken = async (token: string) => {
    const getItemResponse = await client.itemGet({
        access_token: token
      });
    const instituion_id = getItemResponse.data.item.institution_id;
    if (instituion_id) {
        const institutionNameResponse = await client.institutionsGetById({
            institution_id: instituion_id,
            country_codes: [CountryCode.Us, CountryCode.Ca]
        });
        return institutionNameResponse.data.institution.name;
    }
    return "";
}

export const getSundayOfWeek = (date: Date): Date => {
    const dayOfWeek = date.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    const diff = date.getDate() - dayOfWeek; // Subtract the current day of the week to get Sunday
  
    // Create a new Date object with the corresponding Sunday
    const sunday = new Date(date);
    sunday.setDate(diff);
    sunday.setHours(0,0,0,0);
  
    return sunday;
}

export const getMostRecentAugust = (): Date => {
    let august_date = new Date();
    if (august_date.getMonth() < 7) {
      august_date.setFullYear(august_date.getFullYear() - 1);
    }
    august_date.setMonth(7);
    august_date.setDate(1);
    august_date.setHours(0,0,0,0);

    return august_date;
}

export const getTransactionsWithinDateRange = async(token:string, start_date: Date, end_date: Date) => {
    const start_date_string = start_date.toISOString().split('T')[0];
    const end_date_string = end_date.toISOString().split('T')[0];
    const request: TransactionsGetRequest = {
        access_token: token,
        start_date: start_date_string,
        end_date: end_date_string
    };
  
    const response = await client.transactionsGet(request);
    let transactions = response.data.transactions;
    const total_transactions = response.data.total_transactions;

    while (transactions.length < total_transactions) {
        const paginatedRequest: TransactionsGetRequest = {
            access_token: token,
            start_date: start_date_string,
            end_date: end_date_string,
            options: {
                offset: transactions.length,
            },
        };
        const paginatedResponse = await client.transactionsGet(paginatedRequest);
        transactions = transactions.concat(
            paginatedResponse.data.transactions,
        );
    };
    return transactions;
}

export const getSyncedTransactions = async(token: string, user_id: number, cursor: string|undefined) => {
    let added: Array<Transaction> = [];
    
    let hasMore = true;
    let curr_cursor: string|undefined = cursor;

    // Iterate through each page of new transaction updates for item
    while (hasMore) {
        const request: TransactionsSyncRequest = {
            access_token: token,
            cursor: curr_cursor,
            options: {
                days_requested: 270
            }
        };

        const response = await client.transactionsSync(request);
        const data = response.data;
        // Add this page of results
        added = added.concat(data.added);
        hasMore = data.has_more;
        // Update cursor to the next cursor
        curr_cursor = data.next_cursor;
    }

    let db_cursor: string|null = null;
    if (curr_cursor) {
        db_cursor = curr_cursor;
    }

    const updatedSyncTokenResponse = await updatePlaidItemSynchToken(user_id, db_cursor);

    return added;
}

export const addTransactionArrayToSpendings = async (user_id: number, transactions: Transaction[]) => {
    const groupedTransactions: Record<string, number> = {};

    let earliest_sunday = new Date();
    transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        //console.log(date);
        const sunday = getSundayOfWeek(date);
        if (sunday < earliest_sunday) {
            earliest_sunday = new Date(sunday);
        }

        if (!groupedTransactions[sunday.toDateString()]) {
            groupedTransactions[sunday.toDateString()] = 0;
        }
        groupedTransactions[sunday.toDateString()] += transaction.amount;
    });
    //console.log(groupedTransactions);

    let start_sunday = getSundayOfWeek(earliest_sunday);
    const curr_sunday = getSundayOfWeek(new Date());

    //console.log(groupedTransactions);
    while (curr_sunday >= start_sunday) {
        let amount: number = 0;
        if (curr_sunday.toDateString() in groupedTransactions) {
            amount = groupedTransactions[curr_sunday.toDateString()];
        }

        let next_sunday = new Date(curr_sunday);
        next_sunday.setDate(next_sunday.getDate() + 7);
        next_sunday.setTime(next_sunday.getTime() - 1);

        const spending = await createOrUpdateSpending({
            id: 0,
            start_date: new Date(curr_sunday),
            end_date: new Date(next_sunday),
            spent_amount: amount,
            user_id: user_id
        });
        curr_sunday.setDate(curr_sunday.getDate() - 7);
    }
    const regressionResult = await buildLinearRegression(user_id);
}