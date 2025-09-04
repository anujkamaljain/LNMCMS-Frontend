import React, { useEffect } from "react";
import { motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setError, setComplaints } from "../utils/discoverSlice";
import { STUDENT_BASE_URL } from "../utils/constants";
import axios from "axios";
import ComplaintCard from "./ComplaintCard";

const Discover = () => {
  const dispatch = useDispatch();
  const { complaints, loading, error } = useSelector((store) => store.discover);

  const fetchPublicComplaints = async () => {
    dispatch(setLoading(true));
    try {
      const res = await axios.get(STUDENT_BASE_URL + "/complaints/public", {
        withCredentials: true,
      });

      if (res.status === 200) {
        dispatch(setComplaints(res.data.data));
      } else {
        dispatch(setError(res.data?.message || "Failed to fetch complaints"));
      }
    } catch (err) {
      console.error("Error fetching public complaints:", err);
      dispatch(
        setError(err.response?.data?.message || "Failed to fetch complaints")
      );
    }
  };

  useEffect(() => {
    fetchPublicComplaints();
  }, []);

  return (
    <motion.div
      className="flex-1 py-3 px-5"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-2xl mb-10 mt-5 text-cyan-500 text-center border"
        style={{ fontFamily: "'Bowlby One SC', sans-serif" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeIn" }}
      >
        Public Complaints
      </motion.h1>

      <div className="mt-5">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <span className="loading loading-bars loading-xl"></span>
          </div>
        ) : error ? (
          <div className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
            <button
              className="btn btn-sm btn-outline"
              onClick={fetchPublicComplaints}
            >
              Retry
            </button>
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-gray-500 text-lg">
              No public complaints available at the moment.
            </div>
            <div className="text-gray-400 text-sm mt-2">
              Check back later for new complaints from other students.
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            {complaints.map((complaint) => (
              <ComplaintCard key={complaint._id} complaint={complaint} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Discover;
