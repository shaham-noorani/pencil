import { AccountBase } from "plaid";

export default interface PlaidAccount extends AccountBase {
    instituion_name: string;
}