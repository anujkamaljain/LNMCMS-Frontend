import axios from "axios";
import React, { useEffect } from "react";
import { STUDENT_BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addComplaints } from "../utils/pendingComplaintsSlice";
import ComplaintCard from "./ComplaintCard";
import { motion } from "motion/react";

const ViewPendingComplaints = () => {
  const complaints = useSelector((store) => store.pending);
  const dispatch = useDispatch();

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(STUDENT_BASE_URL + "/complaints/pending", {
        withCredentials: true,
      });
      dispatch(addComplaints(res?.data?.data || []));
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
          className="text-4xl text-error text-center"
          style={{ fontFamily: "'Bowlby One SC', sans-serif" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No Pending Complaints!
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
        className="text-2xl mb-10 mt-5 text-error text-center border"
        style={{ fontFamily: "'Bowlby One SC', sans-serif" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeIn" }}
      >
        Pending Complaints
      </motion.h1>
      <div className="mt-5 flex flex-wrap justify-around">
        {complaints.map((complaint) => (
          <ComplaintCard complaint={complaint} key={complaint._id} />
        ))}
      </div>
    </motion.div>
  );
};

export default ViewPendingComplaints;
