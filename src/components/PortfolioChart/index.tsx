"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Chart as ChartJS, registerables } from "chart.js";
import { Chart } from "react-chartjs-2";
import moment from "moment";
import { callApiHook } from "@/utils/apifuncs";
import { getPortfolioActivityChartApi } from "@/services/wallet";
import { useApi } from "@/hooks/useApi";
import ErrorApiText from "../common/ErrorApiText";
import LoadingApi from "../common/LoadindApi";
import { unitName } from "@/constants/blockchains";
import Image from "next/image";
import IconSelectBox from "../common/IconSelectBox";

ChartJS.register(...registerables);

const makeChartData = (data: {
  sent: [];
  received: [];
  balances: [];
  labels: [];
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
}: {
  interval: string;
  setInterval: any;
  unit: string;
}) => {
  // State for selected interval

  const [chartData, setChartData] = useState<{}>({});
  const [
    isPortfolioActivityLoading,
    isPortfolioActivityError,
    callPortfolioActivityApi,
  ] = useApi({
    initailLoading: true,
  });

  useEffect(() => {
    getChartData();
  }, [interval, unit]);

  const getChartData = useCallback(async () => {
    await callApiHook({
      apiCall: callPortfolioActivityApi(
        getPortfolioActivityChartApi({ duration: interval, unit })
      ),
      successCallBack: (response: any) => {
        setChartData(makeChartData(response));
      },
    });
  }, [unit, interval]);

  const handleChange = (e) => {
    const { value } = e.target;
    setInterval(value);
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        labels: {
          usePointStyle: true, // This will use small circle icons for the legend
          pointStyle: "circle", // Specify the point style as circle
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
      tooltip: {
        mode: "index" as const,
        intersect: false,
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
        ticks: { stepSize: 0.1 },
      },
    },
  };

  return (
    <div className="p-6 rounded-[28px] border border-purple-10">
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
            className="w-[35px] h-[35px] md:w-[40px] md:h-[40px] rounded-full"
          />
          <h2 className="text-button 2xl:text-p120 3xl:text-p122 3.75xl:text-h4 font-semibold leading-4">
            {unitName[unit?.toLowerCase()] || "Portfolio"} History
          </h2>
        </div>
        <div className="hidden gap-2 md:gap-4 lg:flex ">
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
        <div className="block lg:hidden w-32">
          <IconSelectBox
            options={[
              { label: "Daily", value: "daily" },
              { label: "Weekly", value: "weekly" },
              { label: "Monthly", value: "monthly" },
              { label: "Lifetime", value: "lifetime" },
            ]}
            onChange={handleChange}
            value={interval}
          />
        </div>
      </div>
      <LoadingApi loading={isPortfolioActivityLoading}>
        <Chart data={chartData as any} type="line" options={options} />
      </LoadingApi>
      <ErrorApiText error={isPortfolioActivityError} />
    </div>
  );
};

export default PortfolioChart;
