import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const LineChart = ({ title, labels, dataValues }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    // Gradient fill for the line (optional visual effect)
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, "rgba(75,192,192,0.4)");
    gradient.addColorStop(1, "rgba(75,192,192,0)");

    const data = {
      labels: labels,
      datasets: [
        {
          label: "Complaints",
          data: dataValues,
          fill: true,
          backgroundColor: gradient,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.4,
          pointBackgroundColor: "#fff",
          pointHoverRadius: 6,
          pointRadius: 4,
        },
      ],
    };

    const config = {
      type: "line",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animations: {
          tension: {
            duration: 1000,
            easing: "easeOutQuart",
            from: 0.2,
            to: 0.4,
            loop: false,
          },
        },
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            labels: {
              color: "#00ffff",
              font: {
                size: 14,
                weight: "bold",
              },
            },
          },
          tooltip: {
            backgroundColor: "#222",
            titleColor: "#f97316",
            bodyColor: "#fff",
            borderColor: "#f59e0b",
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            ticks: {
              color: "#ccc",
            }
          },
          y: {
            ticks: {
              color: "#ccc",
            }
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
    <div className="w-full shadow-sm rounded p-4 transition-transform duration-300 ease-in-out transform hover:scale-[1.01] bg-transparent shadow-amber-500">
      <h2 className="text-xl font-semibold mb-4 text-center text-orange-500 underline tracking-wide">
        {title}
      </h2>
      <div style={{ height: "400px" }} className="overflow-x-auto w-full">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  );
};

export default LineChart;
