import Balances from "./balances.model";

export default interface Account {
  account_id: string;
  balances: Balances;
  mask: string;
  name: string;
  official_name: string;
  persistent_account_id: string;
  subtype: string;
  type: string;
  institution_name: string;
}
