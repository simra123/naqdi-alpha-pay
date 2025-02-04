// components/SmoothLineChart.tsx
const SmoothLineChart = ({
  dataPoints,
  className,
}: {
  dataPoints: number[];
  className?: string;
}) => {
  const width = 112; // Chart width
  const height = 50; // Chart height
  const padding = 5; // Padding around the chart

  const maxValue = dataPoints ? Math.max(...dataPoints) : 0;
  const minValue = dataPoints ? Math.min(...dataPoints) : 0;

  // Scale data points to fit the chart dimensions
  const scaledData = dataPoints
    ? dataPoints.map(
        (value) =>
          height -
          padding -
          ((value - minValue) / (maxValue - minValue)) * (height - 2 * padding)
      )
    : [];

  // Generate the SVG path with smooth cubic Bézier curves
  const path = scaledData.reduce((acc, currY, index, array) => {
    const currX = index * (width / (dataPoints.length - 1));
    if (index === 0) {
      // Move to the starting point
      return `M ${currX} ${currY}`;
    }

    const prevX = (index - 1) * (width / (dataPoints.length - 1));
    const prevY = array[index - 1];

    // Calculate control points for the cubic Bézier curve
    const controlX1 = (prevX + currX) / 2; // Midpoint for the first control point
    const controlY1 = prevY;
    const controlX2 = (prevX + currX) / 2; // Midpoint for the second control point
    const controlY2 = currY;

    return `${acc} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${currX} ${currY}`;
  }, "");

  return (
    <svg
      width={width}
      className={className}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <path
        d={path}
        fill="none"
        className="stroke-purple-500 stroke-2 stroke-"
        strokeLinecap="round" // Rounded line ends
      />
    </svg>
  );
};

export default SmoothLineChart;
