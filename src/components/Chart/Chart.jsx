import { AgChartsReact } from "ag-charts-react";

const Chart = ({ data }) => {
  const options = {
    theme: {
      palette: {
        fills: ["#869aa6", "#f2f1eb"],
        strokes: ["#283c57"],
      },
      overrides: {
        bar: {
          series: {
            highlightStyle: {
              item: {
                fill: "rgba(0, 0, 0, 0.2)",
              },
            },
          },
        },
      },
    },
    data,
    series: [
      {
        type: "bar",
        xKey: "macronutrientType",
        yKey: "consumed",
        normalizedTo: 100,
        stacked: true,
      },
      {
        type: "bar",
        xKey: "macronutrientType",
        yKey: "left",
        normalizedTo: 100,
        stacked: true,
      },
    ],
    axes: [
      {
        type: "number",
        position: "bottom",
        label: {
          formatter: (params) => Math.round(params.value) + "%",
        },
      },
      {
        type: "category",
        position: "left",
      },
    ],
  };

  return <AgChartsReact options={options} />;
};

export default Chart;
