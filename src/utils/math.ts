export const roundToPrecision = (number: number, precision: number) => {
  let numb = +number;

  return parseFloat(numb.toFixed(precision));
};

export const clamp = (value: number, max: number, min: number = 0): string => {
  // Ensure proper type handling and precision for small decimal numbers
  const parsedValue = parseFloat(value.toString());

  if (isNaN(parsedValue)) {
    // If the value can't be parsed as a number, return an empty string or handle it as needed
    return '';
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

