import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { ADMIN_BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addComplaints } from "../utils/pendingComplaintsSlice";
import ComplaintCard from "./ComplaintCard";
import { motion } from "motion/react";
import { useTranslation } from "../utils/useTranslation";

const PendingComplaints = () => {
  const complaints = useSelector((store) => store.pending);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  const fetchComplaints = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(ADMIN_BASE_URL + "/complaints/pending", {
        withCredentials: true,
      });
      dispatch(addComplaints(res?.data?.data));
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-bars loading-xl"></span>
      </div>
    );
  }

  if (!complaints || complaints.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.h1
          className="text-4xl text-amber-400 text-center"
          style={{ fontFamily: "'Bowlby One SC', sans-serif" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          {t("noComplaintsFound")}
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
        {t("pendingComplaints")}
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

export default PendingComplaints;
