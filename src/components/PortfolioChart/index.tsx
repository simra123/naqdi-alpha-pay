import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const PortfolioChart = () => {
  // State for selected interval
  const [interval, setInterval] = useState<
    "daily" | "weekly" | "monthly" | "lifetime"
  >("monthly");

  // Data for each interval
  const chartData = {
    daily: {
      labels: ["9 AM", "12 PM", "3 PM", "6 PM", "9 PM"],
      datasets: [
        {
          type: "line",
          label: "Balance",
          data: [10, 20, 15, 30, 20],
          borderColor: "#7c3aed",
          tension: 0.4,
        },
        {
          type: "bar",
          label: "Received",
          data: [5, 15, 10, 20, 10],
          backgroundColor: "#bbf7d0",
          borderRadius: {
            topLeft: 5, // Top-left radius
            topRight: 5, // Top-right radius
            bottomLeft: 0,
            bottomRight: 0,
          },
        },
        {
          type: "bar",
          label: "Sent",
          data: [10, 5, 15, 10, 20],
          backgroundColor: "#fecaca",
          borderRadius: {
            topLeft: 5, // Top-left radius
            topRight: 5, // Top-right radius
            bottomLeft: 0,
            bottomRight: 0,
          },
        },
      ],
    },
    weekly: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          type: "line",
          label: "Balance",
          data: [40, 55, 50, 60, 60, 60, 75],
          borderColor: "#7c3aed",
          tension: 0.4,
        },
        {
          type: "bar",
          label: "Received",
          data: [50, 60, 40, 80, 70, 50, 90],
          backgroundColor: "#bbf7d0",
          borderRadius: {
            topLeft: 5, // Top-left radius
            topRight: 5, // Top-right radius
            bottomLeft: 0,
            bottomRight: 0,
          },
        },
        {
          type: "bar",
          label: "Sent",
          data: [30, 50, 60, 40, 50, 70, 60],
          backgroundColor: "#fecaca",
          borderRadius: {
            topLeft: 5, // Top-left radius
            topRight: 5, // Top-right radius
            bottomLeft: 0,
            bottomRight: 0,
          },
        },
      ],
    },
    monthly: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          type: "line",
          label: "Balance",
          data: [25, 45, 35, 55, 65, 45, 75, 35, 55, 85, 65, 45],
          borderColor: "#7c3aed",
          tension: 0.4,
        },
        {
          type: "bar",
          label: "Received",
          data: [30, 50, 40, 60, 70, 50, 80, 40, 60, 90, 70, 50],
          backgroundColor: "#bbf7d0",
          borderRadius: {
            topLeft: 5, // Top-left radius
            topRight: 5, // Top-right radius
            bottomLeft: 0,
            bottomRight: 0,
          },
        },
        {
          type: "bar",
          label: "Sent",
          data: [20, 40, 30, 50, 60, 40, 70, 30, 50, 80, 60, 40],
          backgroundColor: "#fecaca",
          borderRadius: {
            topLeft: 5, // Top-left radius
            topRight: 5, // Top-right radius
            bottomLeft: 0,
            bottomRight: 0,
          },
        },
      ],
    },
    lifetime: {
      labels: ["2018", "2019", "2020", "2021", "2022", "2023"],
      datasets: [
        {
          type: "line",
          label: "Balance",
          data: [400, 600, 700, 550, 800, 1000],
          borderColor: "#7c3aed",
          tension: 0.4,
        },
        {
          type: "bar",
          label: "Received",
          data: [500, 700, 800, 600, 900, 1000],
          backgroundColor: "#bbf7d0",
          borderRadius: {
            topLeft: 5, // Top-left radius
            topRight: 5, // Top-right radius
            bottomLeft: 0,
            bottomRight: 0,
          },
        },
        {
          type: "bar",
          label: "Sent",
          data: [300, 400, 600, 500, 700, 800],
          backgroundColor: "#fecaca",
          borderRadius: {
            topLeft: 5, // Top-left radius
            topRight: 5, // Top-right radius
            bottomLeft: 0,
            bottomRight: 0,
          },
        },
      ],
    },
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
        ticks: { stepSize: 25 },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Portfolio History</h2>
        <div className="flex gap-4">
          {["daily", "weekly", "monthly", "lifetime"].map((int) => (
            <button
              key={int}
              onClick={() =>
                setInterval(int as "daily" | "weekly" | "monthly" | "lifetime")
              }
              className={`px-4 py-2 rounded ${
                interval === int
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {int.charAt(0).toUpperCase() + int.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <Chart data={chartData[interval] as any} type="line" options={options} />
    </div>
  );
};

export default PortfolioChart;
