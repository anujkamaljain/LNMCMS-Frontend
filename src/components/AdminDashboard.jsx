import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "motion/react";
import { ADMIN_BASE_URL } from "../utils/constants";
import LineChart from "./LineChart";
import PieChart from "./PieChart";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [labels, setLabels] = useState([]);
  const [dataValues, setDataValues] = useState([]);
  const [statusData, setStatusData] = useState({
    pending: 0,
    accepted: 0,
    resolved: 0,
  });

  const fetchStatusData = async () => {
    try {
      const res = await axios.get(
        ADMIN_BASE_URL + "/complaints/status-complaints-30-days",
        { withCredentials: true }
      );
      if (res.status === 200) {
        setStatusData(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching complaint status summary", error);
    }
  };

  const fetchComplaintChart = async () => {
    try {
      const res = await axios.get(ADMIN_BASE_URL + "/complaints/last-30-days", {
        withCredentials: true,
      });

      const complaintData = res.data.data;

      setLabels(Object.keys(complaintData));
      setDataValues(Object.values(complaintData));
    } catch (err) {
      console.error("Error fetching chart data:", err);
    }
  };

  useEffect(() => {
    fetchComplaintChart();
    fetchStatusData();
  }, []);

  const pieLabels = ["Pending", "Accepted", "Resolved"];
  const pieData = [
    statusData.pending,
    statusData.accepted,
    statusData.resolved,
  ];

  return (
    <motion.div
      className="flex-1 py-3 px-5"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, ease: "easeIn" }}
    >
      <motion.h1
        className="text-2xl mb-10 mt-5 text-amber-400 text-center border"
        style={{ fontFamily: "'Bowlby One SC', sans-serif" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeIn" }}
      >
        Analytics Dashboard
      </motion.h1>
      <main>
        <div className="flex flex-wrap gap-4 justify-around">
          <LineChart
            title="Complaints in Last 30 Days"
            labels={labels}
            dataValues={dataValues}
          />
        </div>
        <div className="flex flex-wrap gap-4 justify-around my-7">
          <PieChart
            title="Complaints Status (Last 30 Days)"
            labels={pieLabels}
            dataValues={pieData}
          />
          <div>
            <Link
              to="/admin/pending-complaints"
              className="card border mb-3 border-base-300 bg-base-100 shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300 w-full max-w-xs dark:hover:shadow-amber-500/30"
            >
              <div className="card-body items-center text-center">
                <div className="text-4xl mb-2">📝</div>
                <h2 className="card-title text-base-content">
                  View/Accept Pending Complaints
                </h2>
                <p className="text-sm text-base-content/70">
                  Accept the pending complaints and start taking action
                </p>
              </div>
            </Link>
            <Link
              to="/admin/accepted-complaints"
              className="card border border-base-300 bg-base-100 shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300 w-full max-w-xs dark:hover:shadow-amber-500/30"
            >
              <div className="card-body items-center text-center">
                <div className="text-4xl mb-2">📋</div>
                <h2 className="card-title text-base-content">
                  View Accepted Complaints
                </h2>
                <p className="text-sm text-base-content/70">
                  View the complaints which you have accepted
                </p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </motion.div>
  );
};

export default AdminDashboard;
