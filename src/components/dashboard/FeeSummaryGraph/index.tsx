"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
  ChartOptions,
  ChartTypeRegistry,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";
import { useRef, useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  ChartDataLabels
);

const FeeSummaryGraph = () => {
  const chartRef = useRef<any>(null);

  const data = {
    labels: ["Total Fee", "Withdrawn Fee", "Balance Fee"],
    datasets: [
      {
        data: [195, 115, 55],
        backgroundColor: ["#471F5E", "#623680", "#803EE5"],
        hoverBackgroundColor: ["#7735E3", "#6F29CF", "#8A45F7"],
        borderRadius: 12,
        barThickness: 9,
        datalabels: {
          align: "end",
          anchor: "end",
          backgroundColor: ["#471F5E", "#623680", "#803EE5"],
          borderRadius: 12,
          color: "#fff",
          padding: {
            left: 8,
            right: 8,
            top: 4,
            bottom: 4,
          },
          font: {
            weight: "bold",
            size: 10,
          },
        },
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false, // allow fixed height
    layout: {
      padding: {
        right: 40, // or 50 if needed
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {},
      tooltip: {
        enabled: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          drawTicks: false,

          color: "#f0f0f5",
        },
        ticks: {
          color: "#999",
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#4D2C91",
          font: {
            size: 15
          },
        },
      },
    },
  };

  return (
    <div className="px-5 pt-[30px] pb-[12px] border rounded-[28px]">
      <div className="flex justify-between items-center pb-[22px] border-b">
      <h3 className="font-nunito text-p120 2xl:text-h4">Fee Summary</h3>
      </div>
      <div style={{ width: "100%", height: "245px" }}>
        <Bar ref={chartRef} data={data as any} options={options} height={300} />
      </div>
    </div>
  );
};

export default FeeSummaryGraph;
