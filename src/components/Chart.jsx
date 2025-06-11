import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { motion } from "motion/react";

const ManualBarChart = ({ title, labels, dataValues }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    const data = {
      labels: labels,
      datasets: [
        {
          label: "Complaints",
          data: dataValues,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 205, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(153, 102, 255, 0.2)",
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
    <motion.div
      className="w-full md:w-[32%] shadow-md rounded p-4 hover:translate-y-0.5 transition-all duration-10 cursor-pointer bg-transparent"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.1,
      }}
    >
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div style={{ height: "300px" }}>
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </motion.div>
  );
};

export default ManualBarChart;
