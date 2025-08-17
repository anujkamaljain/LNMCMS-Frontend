import axios from "axios";
import React, { useEffect } from "react";
import { STUDENT_BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addresComplaints } from "../utils/resolvedComplaintsSlice"; 
import ComplaintCard from "./ComplaintCard";
import { motion } from "motion/react";

const ViewResolvedComplaints = () => {
  const complaints = useSelector((store) => store.resolved);
  const dispatch = useDispatch();

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(STUDENT_BASE_URL + "/complaints/resolved", {
        withCredentials: true,
      });
      dispatch(addresComplaints(res?.data?.data || []));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  if (!complaints) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  if (complaints.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.h1
          className="text-4xl text-success text-center"
          style={{ fontFamily: "'Bowlby One SC', sans-serif" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No Resolved Complaints!
        </motion.h1>
      </div>
    );
  }

  return (
    <motion.div
      className="flex-1 py-3 px-5"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-2xl mb-10 mt-5 text-success text-center"
        style={{ fontFamily: "'Bowlby One SC', sans-serif" }}
      >
        Resolved Complaints
      </motion.h1>
      <div className="mt-5 flex flex-wrap justify-around">
        {complaints.map((complaint) => (
          <ComplaintCard complaint={complaint} key={complaint._id} />
        ))}
      </div>
    </motion.div>
  );
};

export default ViewResolvedComplaints;