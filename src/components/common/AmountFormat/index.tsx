"use client";

import { FC } from "react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import clsx from "clsx";
import { v4 as uid } from "uuid";
import { formatAmount, FormatAmountOptions } from "./utils";

interface AmountFormatProps extends FormatAmountOptions {
  className?: string;
}

const AmountFormat: FC<AmountFormatProps> = ({
  amount,
  type,
  className,
  currency,
}) => {
  const { main, extra, raw, needsTooltip } = formatAmount({
    amount,
    type,
    currency,
  });

  const tooltipId = `tooltip-${uid()}`;

  return (
    <>
      <span
        className={clsx("inline-block leading-tight", className)}
        {...(needsTooltip
          ? {
              "data-tooltip-id": tooltipId,
              "data-tooltip-content": raw,
            }
          : {})}
      >
        <div className="flex gap-[4px]">
          <div>
            <span>{main}</span>

            {extra && (
              <div className="text-muted-foreground text-xs text-right">
                {extra}
              </div>
            )}
          </div>
          <div>{currency ? ` ${currency}` : ""}</div>
        </div>
      </span>
      {needsTooltip && <Tooltip id={tooltipId} place="top" />}
    </>
  );
};

export default AmountFormat;
