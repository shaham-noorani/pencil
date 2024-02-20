export default interface User {
  id: number;
  name: string;
  email: string;
  burnRateGoal: number;
  date_joined: Date;
  slope: number;
  intercept: number;
}
