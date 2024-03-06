export const fetchAccountsOverview = async (axiosPrivate: any) => {
  try {
    const { data } = await axiosPrivate.get("/plaid/get_accounts_overview");
    return data;
  } catch (error) {
    console.error("Failed to fetch accounts overview:", error);
  }
};

export const fetchAccountBalancesOverTime = async (
  axiosPrivate: any,
  user_id: any,
) => {
  try {
    const startDate = "2023-08-01T00:00:00.000";
    const endDate = new Date().toISOString();

    const params = {
      start_date: startDate,
      end_date: endDate,
    };

    return axiosPrivate
      .get(`/spendings/user/range/${user_id}`, { params })
      .then((response: any) => response.data.rows);
  } catch (error) {
    console.error("Failed to fetch account balances over time:", error);
  }
};
