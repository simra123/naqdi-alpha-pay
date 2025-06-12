import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useMemo } from "react";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip
);

type MiniLineChartProps = {
  data: {
    time_period_start: string;
    rate_close: number;
  }[];

  color?: string;
  className?: string;
};

const MiniLineChart = ({
  data,
  color = "#3E1753",
  className,
}: MiniLineChartProps) => {
  const chartData = useMemo(() => {
    const labels = data.map((_, idx) => idx.toString()); // Simple index-based x-axis
    const values = data.map((entry) => entry.rate_close);

    return {
      labels,
      datasets: [
        {
          data: values,
          borderColor: color,
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.4, // smooth line
          fill: false,
        },
      ],
    };
  }, [data, color]);

  const values = chartData.datasets[0].data;
  const minY = Math.min(...values);
  const maxY = Math.max(...values);
  const rangePadding = (maxY - minY || 1) * 0.5;

  const chartOptions: ChartOptions<"line"> = {
    // const chartOptions = {
    responsive: true,

    animation: {
      duration: 700,
      easing: "easeOutQuart",
    },
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
      datalabels: { display: false },
    },
    elements: {
      point: {
        radius: 0, // no dots
      },
    },
    scales: {
      x: {
        display: false,
        grid: { display: false, drawTicks: false },
        ticks: { display: false },
      },
      y: {
        display: false,
        grid: { display: false, drawTicks: false },
        ticks: { display: false },
        min: minY - rangePadding,
        max: maxY + rangePadding,
      },
    },
  };

  return (
    <div className={className}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default MiniLineChart;
