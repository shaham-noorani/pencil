export default interface Account {
    account_id: string;
    balances: {
      available: number;
      current: number;
      iso_currency_code: string;
      limit: null | number;
      unofficial_currency_code: null | string;
    };
    mask: string;
    name: string;
    official_name: string;
    persistent_account_id: string;
    subtype: string;
    type: string;
}