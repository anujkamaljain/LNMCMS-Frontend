import { useEffect, useState } from "react";
import { motion } from "motion/react";
import ManualBarChart from "./Chart";
import axios from "axios";
import { SUPERADMIN_BASE_URL } from "../utils/constants";

const getLast6Months = () => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const now = new Date();
  const months = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(monthNames[date.getMonth()]);
  }

  return months;
};

const SuperAdminDashboard = () => {
  const [labels, setLabels] = useState([]);
  const [dataValues, setDataValues] = useState([]);
  const [departmentData, setDepartmentData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const months = getLast6Months();
      setLabels(months);

      try {
        const res = await axios.get(
          SUPERADMIN_BASE_URL + "/complaints/monthly",
          { withCredentials: true }
        );
        const result = res?.data;
        const counts = months.map((month) => result[month] || 0); // align order
        setDataValues(counts);
      } catch (err) {
        console.error("Failed to fetch complaints data:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          SUPERADMIN_BASE_URL + "/complaints/by-department",
          { withCredentials: true }
        );
        await setDepartmentData(res?.data);
      } catch (err) {
        console.error("Failed to fetch complaints data:", err);
      }
    };
    fetchData();
  }, []);

  if (!departmentData || !dataValues) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1, transition: { duration: 0.5 } }}
          className="py-3 px-5"
        >
          <h1 className="stat-value underline mb-10 hover:text-gray-400 transition-all duration-10">
            Analytics Dashboard
          </h1>

          <div className="flex flex-wrap gap-4 justify-center">
            <ManualBarChart
              title="Complaints of past 6 months"
              labels={labels}
              dataValues={dataValues}
            />
          </div>
          <div className="flex justify-around mt-15 items-center">
            {Object.keys(departmentData).map((department, index) => (
              <div className="stats stats-vertical lg:stats-horizontal shadow" key={index}>
                <div className="stat">
                  <div className="stat-title">Total Complaints for</div>
                  <div className="stat-value">{departmentData[department]}</div>
                  <div className="stat-desc font-bold">{department + " " + "department"}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
