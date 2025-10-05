import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import ReflectionChart from "./ReflectionChart";
import { STUDENT_BASE_URL } from "../utils/constants";
import { Link } from "react-router-dom";
import { useTranslation } from "../utils/useTranslation";


const StudentDashboard = () => {
  const [labels, setLabels] = useState([]);
  const [dataValues, setDataValues] = useState([]);
  const { t } = useTranslation();

  const getAllMonths = () => [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  useEffect(() => {
    const fetchData = async () => {
      const months = getAllMonths();
      setLabels(months);

      try {
        const res = await axios.get(`${STUDENT_BASE_URL}/complaints/monthly`, {
          withCredentials: true,
        });

        const monthlyData = res?.data || {};
        const counts = months.map((month) => monthlyData[month] || 0);
        setDataValues(counts);
      } catch (err) {
        console.error("Failed to fetch student complaints:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen px-4 py-6 space-y-6">
      <motion.h1
        className="text-3xl md:text-4xl text-center text-amber-400 font-extrabold border"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {t("dashboard")}
      </motion.h1>
      <motion.div
        className="card bg-base-100 shadow-lg border border-base-300 mx-auto max-w-7xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="card-body">
          <h2 className="card-title text-amber-600 text-center text-2xl md:text-3xl font-bold">
           😊 {t("welcomeMessage")}
          </h2>
          <p className="text-base md:text-lg text-gray-700 mt-4 leading-relaxed text-justify">
            {t("welcomeDescription")}
          </p>
          <p className="text-base md:text-lg text-gray-700 mt-3 leading-relaxed text-justify">
            {t("responsibleUse")}
          </p>
          <p className="text-base md:text-lg text-gray-700 mt-3 leading-relaxed text-justify">
            {t("clearDescription")}
          </p>
          <p className="text-lg font-semibold text-emerald-700 text-center mt-4">
            {t("workTogether")}
          </p>
        </div>
      </motion.div>
      <div className="flex justify-center">
        <ReflectionChart
          title={t("complaintsPerMonth")}
          labels={labels}
          dataValues={dataValues}
        />
      </div>
      <div className="mt-16 flex justify-center gap-x-60 flex-wrap">
        <Link
          to="/student/register-complaint"
          className="card border border-base-300 bg-base-100 shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300 w-full max-w-xs dark:hover:shadow-amber-500/30"
        >
          <div className="card-body items-center text-center">
            <div className="text-4xl mb-2">📝</div>
            <h2 className="card-title text-base-content">{t("registerComplaint")}</h2>
            <p className="text-sm text-base-content/70">
              Share your day-to-day issues so we can resolve them quickly.
            </p>
          </div>
        </Link>
        <Link
          to="/student/view-complaints"
          className="card border border-base-300 bg-base-100 shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300 w-full max-w-xs dark:hover:shadow-amber-500/30"
        >
          <div className="card-body items-center text-center">
            <div className="text-4xl mb-2">📋</div>
            <h2 className="card-title text-base-content">{t("myComplaints")}</h2>
            <p className="text-sm text-base-content/70">
              Check your complaint status anytime and stay updated.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default StudentDashboard;
