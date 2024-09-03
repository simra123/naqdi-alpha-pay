export const roundToPrecision = (number: number, precision: number) => {
  let numb = +number;

  return parseFloat(numb.toFixed(precision));
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
