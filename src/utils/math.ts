export const roundToPrecision = (number: number, precision: number) => {
  if (number) {
    let numb = +number;

    return parseFloat(numb.toFixed(precision));
  }
  return number;
};

export const clamp = (value: number, max: number, min: number = 0): string => {
  // Ensure proper type handling and precision for small decimal numbers
  const parsedValue = parseFloat(value.toString());

  if (isNaN(parsedValue)) {
    // If the value can't be parsed as a number, return an empty string or handle it as needed
    return "";
  }

  // Ensure min is less than or equal to max
  if (min > max) {
    throw new Error("Min cannot be greater than Max");
  }

  // Only clamp if the value exceeds the bounds
  if (parsedValue < min) {
    return min.toString();
  }
  if (parsedValue > max) {
    return max.toString();
  }

  // If the value is valid and within bounds, return it as is
  return parsedValue.toString();
};

export const parseQueueDelay = (): number => {
  const match = process.env.NEXT_PUBLIC_API_QUEUE_DELAY.match(/^(\d+)(s|m|h)$/);
  if (!match) {
    console.warn("Invalid QUEUE_DELAY format, defaulting to 2 minutes");
    return 1 * 60 * 1000;
  }

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case "s":
      return value * 1000; // Convert seconds to ms
    case "m":
      return value * 60 * 1000; // Convert minutes to ms
    case "h":
      return value * 60 * 60 * 1000; // Convert hours to ms
    default:
      return 2 * 60 * 1000; // Default: 2 minutes
  }
};
