// ReflectionChart.jsx
import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const ReflectionChart = ({ title, labels, dataValues }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    const data = {
      labels,
      datasets: [
        {
          label: "Complaints",
          data: dataValues,
          backgroundColor: [
            "#f97316", "#ef4444", "#10b981", "#3b82f6", "#a855f7", "#eab308",
            "#14b8a6", "#8b5cf6", "#ec4899", "#6366f1", "#22c55e", "#f43f5e",
          ],
          borderRadius: 6,
          borderWidth: 0, // No border
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
          x: {
            grid: { display: false },
            ticks: {
              color: "#d1d5db",
              font: { size: 12 },
            },
          },
          y: {
            beginAtZero: true,
            grid: { display: false },
            ticks: {
              color: "#d1d5db",
              font: { size: 12 },
              stepSize: 1,
              precision: 0,
            },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            backgroundColor: "#111827",
            titleColor: "#facc15",
            bodyColor: "#fff",
            padding: 10,
            borderColor: "#facc15",
            borderWidth: 1,
          },
        },
        animation: {
          duration: 1200,
          easing: "easeOutQuart",
        },
        hover: {
          mode: "index",
          intersect: false,
        },
      },
    };

    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(ctx, config);

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [labels, dataValues]);

  return (
    <div className="w-full md:w-[58%] shadow-md rounded p-4 bg-base-100">
      <h2 className="text-xl font-semibold mb-4 text-center text-amber-600 underline underline-offset-4 decoration-amber-600">
        {title}
      </h2>
      <div
        className="relative group"
        style={{
          height: "320px",
          WebkitBoxReflect:
            "below 4px -webkit-gradient(linear, left top, left bottom, from(transparent), color-stop(40%, transparent), to(rgba(0, 0, 0, 0.3)))",
        }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-[1.02]"
        />
      </div>
    </div>
  );
};

export default ReflectionChart;
