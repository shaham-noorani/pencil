import { AccountBase } from "plaid";

export default interface PlaidAccount extends AccountBase {
    institution_name: string;
}