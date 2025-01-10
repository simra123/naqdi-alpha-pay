import moment from "moment";

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
