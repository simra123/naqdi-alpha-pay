"use client";

import { FC } from "react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import clsx from "clsx";
import { v4 as uid } from "uuid";

type AmountType = "fiat" | "crypto";

interface AmountFormatProps {
  amount: number | string;
  type: AmountType;
  className?: string;
  currency?: string;
}

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

const AmountFormat: FC<AmountFormatProps> = ({
  amount,
  type,
  className,
  currency,
}) => {
  const num = amount
    ? typeof amount === "string"
      ? parseFloat(amount)
      : amount
    : 0;

  const min = MIN_DISPLAY[type];
  const decimals = MAX_DECIMALS[type];

  const needsTooltip = num < min && num !== 0;
  const tooltipId = `tooltip-${uid()}`;

  let display: string;

  if (needsTooltip) {
    display = `< ${min.toFixed(decimals)}`;
  } else {
    const fixed = num.toFixed(decimals); // up to max decimals
    display = trimTrailingZeros(fixed);
  }

  return (
    <>
      <span
        className={clsx(className)}
        {...(needsTooltip
          ? {
              "data-tooltip-id": tooltipId,
              "data-tooltip-content": trimTrailingZeros(num.toFixed(20)),
            }
          : {})}
      >
        {display} {currency}
      </span>
      {needsTooltip && <Tooltip id={tooltipId} place="top" />}
    </>
  );
};

export default AmountFormat;
