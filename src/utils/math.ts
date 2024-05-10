export const roundToPrecision = (number: number, precision: number) => {
  return parseFloat(number.toFixed(precision));
};
