export default interface User {
  id?: number;
  name: string;
  email: string;
  burn_rate_goal: number | null;
  date_joined: Date;
  slope: number;
  intercept: number;
}
