import axios from "axios";
import React, { useEffect } from "react";
import { ADMIN_BASE_URL, STUDENT_BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addComplaints } from "../utils/pendingComplaintsSlice";
import ComplaintCard from "./ComplaintCard";
import { motion } from "motion/react";
import { addingComplaints } from "../utils/ViewComplaintsSlice";

const ViewYourComplaints = () => {
  const complaints = useSelector((store) => store.view);
  const dispatch = useDispatch();

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(STUDENT_BASE_URL + "/complaints", {
        withCredentials: true,
      });
      dispatch(addingComplaints(res?.data?.data));
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
          className="text-4xl text-amber-400 text-center"
          style={{ fontFamily: "'Bowlby One SC', sans-serif" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          No Complaints Found!
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
        Your Complaints
      </motion.h1>
      <main>
        <h1
          className="text-2xl mb-10 mt-5 text-error underline"
          style={{ fontFamily: "'Bowlby One SC', sans-serif" }}
        >
          Pending Complaints
        </h1>
        <div className="mt-5 flex flex-wrap justify-around flex-1 overflow-x-hidden border-b-1 border-base-300">
          {complaints.map((complaint) => {
            if (complaint.status === "pending")
              return (
                <ComplaintCard complaint={complaint} key={complaint._id} />
              );
          })}
        </div>
        <h1
          className="text-2xl mb-10 mt-5 text-warning underline"
          style={{ fontFamily: "'Bowlby One SC', sans-serif" }}
        >
          Accepted Complaints
        </h1>
        <div className="mt-5 flex flex-wrap justify-around flex-1 overflow-x-hidden border-b-1 border-base-300">
          {complaints.map((complaint) => {
            if (complaint.status === "accepted")
              return (
                <ComplaintCard complaint={complaint} key={complaint._id} />
              );
          })}
        </div>
        <h1
          className="text-2xl mb-10 mt-5 text-success underline"
          style={{ fontFamily: "'Bowlby One SC', sans-serif" }}
        >
          Resolved Complaints
        </h1>
        <div className="mt-5 flex flex-wrap justify-around flex-1 overflow-x-hidden">
          {complaints.map((complaint) => {
            if (complaint.status === "resolved")
              return (
                <ComplaintCard complaint={complaint} key={complaint._id} />
              );
          })}
        </div>
      </main>
    </motion.div>
  );
};

export default ViewYourComplaints;
