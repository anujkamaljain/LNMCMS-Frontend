// ReflectionChart.jsx
import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const ReflectionChart = ({ title, labels, dataValues }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    const create3DGradient = (color1, color2) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, color1); // light top
      gradient.addColorStop(0.5, color2); // darker mid
      gradient.addColorStop(1, "#1f2937"); // dark base
      return gradient;
    };

    // Monthly base colors (12 months)
    const baseColors = [
      ["#fde68a", "#facc15"],
      ["#fca5a5", "#ef4444"],
      ["#a5f3fc", "#06b6d4"],
      ["#c4b5fd", "#8b5cf6"],
      ["#fcd34d", "#f59e0b"],
      ["#86efac", "#22c55e"],
      ["#fda4af", "#ec4899"],
      ["#93c5fd", "#3b82f6"],
      ["#ddd6fe", "#a78bfa"],
      ["#67e8f9", "#06b6d4"],
      ["#f87171", "#dc2626"],
      ["#fbbf24", "#b45309"],
    ];

    const gradientFills = baseColors.map(([top, mid]) =>
      create3DGradient(top, mid)
    );

    const data = {
      labels,
      datasets: [
        {
          label: "Complaints",
          data: dataValues,
          backgroundColor: gradientFills,
          borderRadius: 8,
          borderSkipped: false,
          hoverBackgroundColor: gradientFills,
          barThickness: "flex",
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
              color: "#9ca3af",
              font: { size: 12 },
            },
          },
          y: {
            beginAtZero: true,
            grid: { display: false },
            ticks: {
              color: "#9ca3af",
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
            backgroundColor: "#1e293b",
            titleColor: "#facc15",
            bodyColor: "#f1f5f9",
            padding: 10,
            borderColor: "#facc15",
            borderWidth: 1,
          },
        },
        animation: {
          duration: 1200,
          easing: "easeOutBounce",
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
