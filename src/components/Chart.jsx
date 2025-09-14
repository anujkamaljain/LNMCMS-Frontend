import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { useTranslation } from "../utils/useTranslation";

const ManualBarChart = ({ title, labels, dataValues }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    const data = {
      labels: labels,
      datasets: [
        {
          label: t("complaints"),
          data: dataValues,
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(255, 159, 64)",
            "rgb(255, 205, 86)",
            "rgb(75, 192, 192)",
            "rgb(54, 162, 235)",
            "rgb(153, 102, 255)",
          ],
          borderColor: [
            "rgb(255, 99, 132)",
            "rgb(255, 159, 64)",
            "rgb(255, 205, 86)",
            "rgb(75, 192, 192)",
            "rgb(54, 162, 235)",
            "rgb(153, 102, 255)",
          ],
          borderWidth: 1,
        },
      ],
    };

    const config = {
      type: "bar",
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, config);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [labels, dataValues]);

  return (
    <div className="w-full md:w-[32%] shadow-md rounded p-4 hover:translate-y-0.5 transition-all duration-75 ease-in cursor-pointer bg-transparent">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div style={{ height: "300px" }}>
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  );
};

export default ManualBarChart;
