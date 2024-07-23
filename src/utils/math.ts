export const roundToPrecision = (number: number, precision: number) => {
  return parseFloat(number.toFixed(precision));
};

export const clamp = (value: number, max: number, min: number = 0): string => {
  if (value < min) {
    return min.toString();
  }
  if (value > max) {
    return max.toString();
  }
  return value.toString();
};
