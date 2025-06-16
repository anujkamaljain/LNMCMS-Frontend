import { useEffect, useState } from "react";
import { motion } from "motion/react";
import ManualBarChart from "./Chart";
import axios from "axios";
import {
  Department_List,
  Department_Wise_List,
  Location_Wise_List,
  SUPERADMIN_BASE_URL,
} from "../utils/constants";
import ManualDoughnutChart from "./DoughnutChart";

const SuperAdminDashboard = () => {
  const [labels, setLabels] = useState([]);
  const [dataValues, setDataValues] = useState([]);
  const [departmentData, setDepartmentData] = useState({});
  const [sumofValues, setSumOfValues] = useState(null);

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
        let sum = 0;
        for (let count of counts) {
          sum += count;
        }
        setSumOfValues(sum);
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
        setDepartmentData(res?.data);
      } catch (err) {
        console.error("Failed to fetch complaints data:", err);
      }
    };
    fetchData();
  }, []);

  if (!departmentData || !dataValues) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-bars loading-xl"></span>
      </div>
    );
  }

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
          <ManualBarChart
            title="Complaints of past 6 months"
            labels={labels}
            dataValues={dataValues}
          />
          <ManualDoughnutChart
            title="Complaints of past 6 months"
            labels={labels}
            dataValues={dataValues}
          />
        </div>
        <motion.h1
          className="text-2xl mb-10 mx-5 mt-15 text-amber-400 "
          style={{ fontFamily: "'Bowlby One SC', sans-serif" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeIn" }}
        >
          Location Wise Complaints
        </motion.h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {Object.keys(departmentData).map((department, index) =>
            Location_Wise_List.includes(department.toUpperCase()) ? (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="stats stats-vertical lg:stats-horizontal shadow hover:translate-y-0.5 transition-all duration-150 ease-in"
                key={index}
              >
                <div className="stat">
                  <div className="stat-title">Total Complaints for</div>
                  <div className="stat-value">{departmentData[department]}</div>
                  <div className="stat-desc font-bold">
                    {department + " department"}
                  </div>
                </div>
              </motion.div>
            ) : null
          )}
        </div>
        <motion.h1
          className="text-2xl mb-10 mx-5 mt-15 text-amber-400 "
          style={{ fontFamily: "'Bowlby One SC', sans-serif" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeIn" }}
        >
          Department Wise Complaints
        </motion.h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-3">
          {Object.keys(departmentData).map((department, index) =>
            Department_Wise_List.includes(department.toUpperCase()) ? (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="stats stats-vertical lg:stats-horizontal shadow hover:translate-y-0.5 transition-all duration-150 ease-in"
                key={index}
              >
                <div className="stat">
                  <div className="stat-title">Total Complaints for</div>
                  <div className="stat-value">{departmentData[department]}</div>
                  <div className="stat-desc font-bold">
                    {department + " department"}
                  </div>
                </div>
              </motion.div>
            ) : null
          )}
        </div>
        <div className="flex flex-wrap gap-4 justify-around border-t-1 mt-10 border-base-300">
          <div className="w-full md:w-[32%] p-4 flex justify-center items-center">
            <div>
              <motion.h1
                className="text-2xl text-amber-400 text-center"
                style={{ fontFamily: "'Bowlby One SC', sans-serif" }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
              >
                Total Complaints in last 6 months
              </motion.h1>
              <motion.h1
                className="text-6xl mt-3 text-red-500 text-center"
                style={{ fontFamily: "'Bowlby One SC', sans-serif" }}
                initial={{ x: "-25vh", y: "0" }}
                animate={{ x: "0", y: "0" }}
                transition={{ duration: 0.5, ease: "easeIn" }}
              >
                {sumofValues}
              </motion.h1>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
};

export default SuperAdminDashboard;
