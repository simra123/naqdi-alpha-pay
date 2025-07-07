export type AmountType = "fiat" | "crypto";

const MIN_DISPLAY = {
  fiat: 0.001,
  crypto: 0.00000001,
};

const MAX_DECIMALS = {
  fiat: 3,
  crypto: 8,
};

const trimTrailingZeros = (value: string) => {
  if (!value.includes(".")) return value;
  return value.replace(/(\.\d*?[1-9])0+$/g, "$1").replace(/\.0+$/, "");
};

function truncateToFirstNonZero(raw: string, decimalPlaces: number): string {
  {
    const [num, float] = raw.split(".");

    let fixedDecimalsWithNonZeros = float?.slice(0, decimalPlaces);
    let firstNonZeroIndex: number;

    if (+fixedDecimalsWithNonZeros == 0) {
      let floatArray = float.split("");
      firstNonZeroIndex = floatArray.findIndex((item) => item != "0");
      fixedDecimalsWithNonZeros = float?.slice(0, firstNonZeroIndex + 1);
    }

    return `${num}.${fixedDecimalsWithNonZeros}`;
  }
}

export interface FormatAmountOptions {
  amount: number | string;
  type: AmountType;
  currency?: string;
  fullPrecision?: boolean; // optional, to always show all decimals
}

// utils/formatAmount.ts (UPDATED)

export const formatAmount = ({
  amount,
  type,
  currency,
  fullPrecision = false,
}: FormatAmountOptions): {
  display: string;
  raw: string;
  fixedRaw: string;
  main: string;
  extra: string;
  needsTooltip: boolean;
  precised: string;
} => {
  const num = amount
    ? typeof amount === "string"
      ? parseFloat(amount)
      : amount
    : 0;

  const min = MIN_DISPLAY[type];
  const decimals = MAX_DECIMALS[type];

  const needsTooltip = num < min && num !== 0;
  const raw = trimTrailingZeros(num.toFixed(18));

  let display = "";
  let main = "";
  let extra = "";

  if (needsTooltip && !fullPrecision) {
    display = `< ${min.toFixed(decimals)}`;
    main = display;
  } else {
    const fixed = num.toFixed(decimals);
    const trimmed = trimTrailingZeros(fixed);

    if (type === "crypto") {
      const [intPart, decimalPart = ""] = trimmed.split(".");
      const mainDecimal = decimalPart.slice(0, 3);
      const restDecimal = decimalPart.slice(3);

      main = decimalPart.length > 3 ? `${intPart}.${mainDecimal}` : trimmed;
      extra = restDecimal;
    } else {
      main = trimmed;
    }

    display = main + (currency ? ` ${currency}` : "");
  }

  let precised = truncateToFirstNonZero(raw, decimals);

  return {
    display,
    raw,
    main,
    extra,
    needsTooltip,
    fixedRaw: trimTrailingZeros(Number(raw)?.toFixed(decimals)?.toString()),
    precised,
  };
};
