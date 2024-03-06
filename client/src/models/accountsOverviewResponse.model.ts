import AccountsOverview from "./accountsOverview.model";

export default interface AccountsOverviewResponse {
  bankName: string;
  accountsOverview: AccountsOverview;
}
