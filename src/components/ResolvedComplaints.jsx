import axios from "axios";
import React, { useEffect } from "react";
import { ADMIN_BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import ComplaintCard from "./ComplaintCard";
import { motion } from "motion/react";
import { addresComplaints } from "../utils/resolvedComplaintsSlice";

const ResolvedComplaints = () => {
  const complaints = useSelector((store) => store.resolved);
  const dispatch = useDispatch();

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(ADMIN_BASE_URL + "/complaints/resolved", {
        withCredentials: true,
      });
      dispatch(addresComplaints(res?.data?.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  if (!complaints || complaints.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.h1
          className="text-4xl text-amber-400 text-center"
          style={{ fontFamily: "'Bowlby One SC', sans-serif" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          No History found of resolved Complaints of your department!
        </motion.h1>
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
        Resolved Complaints
      </motion.h1>
      <main>
        <div className="mt-5 flex flex-wrap justify-around flex-1 overflow-x-hidden">
          {complaints.map((complaint) => {
            return <ComplaintCard complaint={complaint} key={complaint._id} />;
          })}
        </div>
      </main>
    </motion.div>
  );
};

export default ResolvedComplaints;
