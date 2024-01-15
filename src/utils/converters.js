import { differenceInYears } from "date-fns";
import { INFINITE_RECIPE_TIME } from "./constants";

export const minutesToHoursMinutesString = (timeInMinutes) => {
  if (timeInMinutes >= INFINITE_RECIPE_TIME) {
    return "> 2 days";
  }
  const hours = parseInt(timeInMinutes / 60);
  const minutes = timeInMinutes % 60;
  return `${hours > 0 ? hours + "h " : ""}${minutes}m`;
};

export const getAgeFromBirthdate = (birthdate) => {
  return differenceInYears(new Date(), birthdate);
};

export const rounded = (value, digitsAfterPointCount) => {
  return Math.round(value * 10 ** digitsAfterPointCount) / 100;
};

export const kjToKcal = (value) => {
  return value / 4.1868;
};
