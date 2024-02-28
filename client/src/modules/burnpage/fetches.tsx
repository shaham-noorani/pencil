export const fetchAccountsOverview = async (axiosPrivate: any) => {
  try {
    const { data } = await axiosPrivate.get("/plaid/get_accounts_overview");
    return data;
  } catch (error) {
    console.error("Failed to fetch accounts overview:", error);
  }
};

export const fetchAccountBalancesOverTime = async (axiosPrivate: any) => {
  try {
    return axiosPrivate
      .get("/plaid/get_account_balances_over_time")
      .then((response: any) => response.data);
  } catch (error) {
    console.error("Failed to fetch account balances over time:", error);
  }
};
