import moment from "moment";
import momentTZ from "moment-timezone";

// Function to format the date
export function formatCustomDate(date) {
  const now = moment();
  if (date) {
    const targetDate = moment(date);

    // If the date is today
    if (now.isSame(targetDate, "day")) {
      return targetDate.format("hh:mm a") + " Today";
    }

    // If the date is within the last 7 days
    if (now.diff(targetDate, "days") < 7) {
      return targetDate.format("hh:mm a") + ` ${targetDate.fromNow()}`;
    }

    // If the date is more than 7 days ago
    return targetDate.format("hh:mm a") + ` ${targetDate.fromNow()}`;
  }
}

export const formatDateToUserTimeZone = (value: string): [string, string] => {
  const currentTimeZone = momentTZ.tz.guess();

  console.log({ currentTimeZone });

  let date: string | string[] = momentTZ(value)
    .tz(currentTimeZone)
    .format("DD-MM-YYYY.hh:mm A");

  console.log({ date });

  let [day, time] = date.split(".");
  return [day, time];
};

export const formatLocalDate = (utcDate: string) => {
  if (!utcDate) return "";

  const userTimeZone = moment.tz.guess(); // Get user's timezone
  return moment.utc(utcDate).tz(userTimeZone).format("DD MMM YYYY HH:mm z");
};
