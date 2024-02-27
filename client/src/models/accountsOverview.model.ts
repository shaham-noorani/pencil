import Account from "./account.model";

export default interface AccountsOverview {
    depository: Account[];
    investment: Account[];
    creditCard: Account[];
    loans: Account[];
}