import moment from "moment-timezone";
import { getCountryForTimezone } from "countries-and-timezones";

// Function to get user's timezone
export const getUserTimezone = () => {
  return moment.tz.guess(); // Automatically detects the user's timezone
};

// Function to get country code from timezone
export const getCountryCodeFromTimezone = (timezone) => {
  const countryData = getCountryForTimezone(timezone);
  return countryData ? countryData.id : null; // Returns the first country associated with the timezone
};
