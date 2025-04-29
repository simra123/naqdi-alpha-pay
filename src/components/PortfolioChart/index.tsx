"use client";

import React, { useEffect } from "react";
import { Chart as ChartJS, ChartOptions, registerables } from "chart.js";
import { Chart } from "react-chartjs-2";
import ErrorApiText from "../common/ErrorApiText";
import LoadingApi from "../common/LoadindApi";
import { unitName } from "@/constants/blockchains";
import Image from "next/image";
import IconSelectBox from "../common/IconSelectBox";
import { Role } from "@/constants/roles";
import useLocalStorage from "@/hooks/useLocalStorage";

// Custom plugin for the vertical dashed line
const crosshairLinePlugin = {
  id: "crosshairLine",
  beforeDraw: (chart) => {
    const { ctx, tooltip, chartArea } = chart;

    if (tooltip && tooltip.opacity) {
      const x = tooltip.caretX;

      ctx.save();
      ctx.strokeStyle = "#D1D1D1"; // Dashed line color
      ctx.lineWidth = 1; // Line width
      ctx.setLineDash([5, 5]); // Dash pattern (5px dash, 5px gap)
      ctx.beginPath();
      ctx.moveTo(x, chartArea.top); // Start at the top of the chart
      ctx.lineTo(x, chartArea.bottom); // Draw to the bottom
      ctx.stroke();
      ctx.restore();
    }
  },
};

ChartJS.register(...registerables, crosshairLinePlugin);

export const makeChartData = (data: {
  sent: any[];
  received: any[];
  balances: any[];
  labels: any[];
}) => {
  let greenColor = "#CFECE1";
  let redColor = "#F7CAD8";
  let purpleColor = "#643882";

  let borderRadius = {
    topLeft: 5, // Top-left radius
    topRight: 5, // Top-right radius
    bottomLeft: 0,
    bottomRight: 0,
  };
  return {
    labels: data?.labels,
    datasets: [
      {
        type: "line",
        label: "Balance",
        data: data?.balances,
        borderColor: purpleColor,
        tension: 0.4,
        pointRadius: 5, // Size of the point
        hoverRadius: 12,
        hoverBorderWidth: 3,
        pointBackgroundColor: "#fff", // Point color
        pointBorderColor: purpleColor, // Point border color
        pointBorderWidth: 2, // Border width of the point
      },
      {
        type: "bar",
        label: "Received",
        data: data?.received,
        backgroundColor: greenColor,
        borderRadius,
      },
      {
        type: "bar",
        label: "Sent",
        data: data?.sent,
        backgroundColor: redColor,
        borderRadius,
      },
    ],
  };
};

const PortfolioChart = ({
  interval,
  setInterval,
  unit,
  isAdmin,
  merchantsList,
  merchant,
  setMerchant,
  getChartData,
  chartData,
  loading,
  error,
}: {
  interval: string;
  setInterval: any;
  unit: string;
  isAdmin?: boolean;
  merchantsList?: any[];
  merchant?: string;
  setMerchant?: any;
  getChartData: () => void;
  loading?: boolean;
  error?: boolean | string;
  chartData: {
    sent?: any[];
    received?: any[];
    balances?: any[];
    labels?: any[];
  };
}) => {
  const user = useLocalStorage("user");
  useEffect(() => {
    getChartData();
  }, [interval, unit, merchant]);

  console.log({ chartData, message: "Charts data" });

  const handleChange = (e) => {
    const { value } = e.target;
    setInterval(value);
  };

  const handleChangeMerchant = (e) => {
    const { value } = e.target;
    setMerchant(value);
  };

  const options = {
    responsive: true,
    plugins: {
      datalabels: {
        display: false, // Turn off for this chart
      },
      legend: {
        display: true,
        position: "bottom" as const,
        padding: 30,
        labels: {
          usePointStyle: true, // This will use small circle icons for the legend
          // pointStyle: "circle", // Specify the point style as circle
          pointStyleWidth: 10, // Control the size of the point
          boxHeight: 7,
          generateLabels: function (chart) {
            // Get the default legend labels
            const labels =
              ChartJS.defaults.plugins.legend.labels.generateLabels(chart);

            // Move 'Balance' label to the last position
            const balanceLabel = labels.find(
              (label) => label.text === "Balance"
            );
            if (balanceLabel) {
              // Remove it from the original position
              labels.splice(labels.indexOf(balanceLabel), 1);
              // Add it to the end
              labels.push(balanceLabel);
            }

            return labels;
          },
        },
      },
      crosshairLine: {
        lineColor: "#D9CCEE", // Dashed line color
        lineWidth: 2, // Line width
        dashPattern: [5, 5], // Dash pattern (5px dash, 5px gap)
      },
      tooltip: {
        // mode: "index" as const,
        // intersect: false,
        enabled: false, // Disable default tooltip
        external: (context) => {
          let tooltipEl = document.getElementById("custom-tooltip");

          // Create the tooltip element if it doesn't exist
          if (!tooltipEl) {
            tooltipEl = document.createElement("div");
            tooltipEl.id = "custom-tooltip";
            tooltipEl.style.position = "absolute";
            tooltipEl.style.background = "#EBD1F1"; // Light purple background
            tooltipEl.style.color = "#1F243B"; // Black-grey text
            tooltipEl.style.borderRadius = "12px"; // Rounded corners
            tooltipEl.style.padding = "8px 12px"; // Padding for content
            tooltipEl.style.pointerEvents = "none";
            tooltipEl.style.fontSize = "12px";
            tooltipEl.style.fontFamily = "'Inter', sans-serif"; // Consistent font
            tooltipEl.style.boxShadow = "0px 2px 4px rgba(0, 0, 0, 0.1)"; // Subtle shadow
            tooltipEl.style.zIndex = "100";
            tooltipEl.style.textAlign = "center"; // Center-align text
            tooltipEl.style.opacity = "0"; // Initially hidden
            tooltipEl.style.minWidth = "112px";
            tooltipEl.style.minHeight = "45px";

            document.body.appendChild(tooltipEl);
          }

          const tooltip = context.tooltip;

          // Hide the tooltip if it's not visible
          if (!tooltip || tooltip.opacity === 0) {
            tooltipEl.style.opacity = "0";
            return;
          }

          // Get chart position in the viewport
          const chartRect = context.chart.canvas.getBoundingClientRect();

          // Update tooltip position and style
          tooltipEl.style.opacity = "1";
          tooltipEl.style.left = `${chartRect.left + tooltip.caretX}px`;
          tooltipEl.style.top = `${chartRect.top + tooltip.caretY - 15}px`;
          tooltipEl.style.transform = "translate(-50%, -100%)"; // Adjust position above the caret

          // Add content to the tooltip
          if (tooltip.body && tooltip.body.length) {
            tooltipEl.innerHTML = `
             <div style="font-size: 12px; color: #000;">
              ${
                tooltip.dataPoints[0].label
              } <!-- Display the label for the current index -->
              </div>
              <div style="font-weight: 600; font-size: 18px;">
                ${tooltip.dataPoints[0].raw.toLocaleString()} <!-- Format the number -->
              </div>
                <span class="tooltip-arrow" 
                 style="position: absolute; 
                 width: 0; 
                 height: 0; 
                 border-left: 6px solid transparent; 
                 border-right: 6px solid transparent; 
                 border-top: 6px solid #EBD1F1; 
                 bottom: -6px; 
                 left: 50%; 
                 transform: translateX(-50%);">
                </span>
            `;
            // Append the arrow again after overwriting the content
            const arrowEl = document.getElementById("custom-tooltip-arrow");
            if (arrowEl) tooltipEl.appendChild(arrowEl);
          }
        },
      },
    },

    scales: {
      x: {
        stacked: false,
        grid: { display: false },
      },
      y: {
        stacked: false,
        grid: { color: "#e5e7eb" },
        ticks: { stepSize: 0.5, autoSkip: true, maxTicksLimit: 10 },
      },
    },
  };

  console.log({ PortiflioChart: unitName[unit?.toLowerCase()], unit: unit });

  return (
    <div className="p-6 border border-purple-10 rounded-[28px]">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Image
            src={
              unitName[unit?.toLowerCase()]
                ? `/currencies/${unitName[
                    unit?.toLowerCase()
                  ]?.toLowerCase()}.png`
                : `/avatar.png`
            }
            alt="Currency"
            height={50}
            width={50}
            className="rounded-full w-[35px] md:w-[40px] h-[35px] md:h-[40px]"
          />
          <h3 className="font-nunito text-p120 2xl:text-h4">
            {user?.role == Role.USER
              ? unitName[unit?.toLowerCase()] || "Portfolio"
              : merchant == "ALL"
              ? "Crypto Wallets"
              : "Merchant Wallets"}{" "}
            History
          </h3>
        </div>
        <div className="lg:hidden block w-32">
          <IconSelectBox
            options={[
              { label: "Daily", value: "daily" },
              { label: "Weekly", value: "weekly" },
              { label: "Monthly", value: "monthly" },
              { label: "Lifetime", value: "lifetime" },
            ]}
            onChange={handleChange}
            wrapperClassName="!m-0"
            inputContainerClassName="!rounded-full py-3"
            optionsClassName="!right-0 w-[240px]"
            value={interval}
          />
        </div>
        <div className="flex justify-end gap-2">
          <div className="hidden lg:flex gap-2 md:gap-4">
            {["daily", "weekly", "monthly", "lifetime"].map((int) => (
              <button
                key={int}
                onClick={() => setInterval(int)}
                className={`px-4 py-2 text-subtitle lg:text-base  rounded-full ${
                  interval === int
                    ? "bg-purple-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {int.charAt(0).toUpperCase() + int.slice(1)}
              </button>
            ))}
          </div>
          {isAdmin && (
            <IconSelectBox
              searchable
              wrapperClassName="!m-0"
              inputContainerClassName="!rounded-full py-3 min-w-[100px]"
              optionsClassName="!right-0 !w-[240px]"
              options={[
                { label: "All", value: "ALL" },
                ...merchantsList?.map((item) => {
                  return {
                    // label: `${item?.first_name} ${item?.last_name}`,
                    label: item?.username,
                    value: item?.userId,
                  };
                }),
              ]}
              onChange={handleChangeMerchant}
              value={merchant}
            />
          )}
        </div>
      </div>
      <LoadingApi loading={loading}>
        {chartData &&
          (user?.role == Role.USER ? (
            <Chart data={chartData as any} type="line" options={options} />
          ) : (
            <Chart
              data={chartData as any}
              type="line"
              options={options}
              className="max-h-[300px] 2.5xl:max-h-[370px]"
            />
          ))}
      </LoadingApi>
      <ErrorApiText error={error} />
    </div>
  );
};

export default PortfolioChart;
