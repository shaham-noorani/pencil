export default interface Balances {
  available: number;
  current: number;
  iso_currency_code: string;
  limit: null | number;
  unofficial_currency_code: null | string;
}
