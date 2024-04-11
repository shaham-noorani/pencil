import Account from "./account.model";

export default interface AccountsOverview {
  depository: Account[];
  loan: Account[];
  investment: Account[];
  credit: Account[];
}
