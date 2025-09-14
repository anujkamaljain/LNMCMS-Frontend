import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { useTranslation } from "../utils/useTranslation";

const PieChart = ({ title, labels, dataValues }) => {
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
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
          ],
          hoverOffset: 4,
        },
      ],
    };

    const config = {
      type: "pie",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
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
    <div className="w-full md:w-[32%] shadow-sm shadow-amber-500 rounded p-4 hover:translate-y-0.5 transition-all duration-75 ease-in cursor-pointer bg-transparent">
      <h2 className="text-lg font-semibold mb-2 text-center text-orange-500 underline">{title}</h2>
      <div style={{ height: "300px" }}>
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  );
};

export default PieChart;
