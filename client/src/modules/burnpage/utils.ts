import { differenceInCalendarMonths } from "date-fns";
import { schoolEndDate, today } from "../../utils/constants";

export const remainingDaysUntilSchoolEnd = Math.ceil(
  (schoolEndDate.getTime() - today) / (1000 * 60 * 60 * 24)
);

export const monthsFromTodayToMay =
  1 + differenceInCalendarMonths(schoolEndDate, new Date(today));

export const startOfMonth = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  1
);