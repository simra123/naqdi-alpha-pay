export const roundToPrecision = (number: number, precision: number) => {
  return parseFloat(number.toFixed(precision));
};

export const clamp = (value: number, max: number, min: number = 0) => {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
};
