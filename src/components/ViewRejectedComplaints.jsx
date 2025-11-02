import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { STUDENT_BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addrejComplaints } from "../utils/rejectedComplaintsSlice";
import RejectedComplaintCard from "./RejectedComplaintCard";
import { motion } from "motion/react";
import { useTranslation } from "../utils/useTranslation";

const ViewRejectedComplaints = () => {
  const { complaints, pagination } = useSelector((store) => store.rejected); 
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState(1);

  const fetchComplaints = useCallback(async (pageNum = page) => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${STUDENT_BASE_URL}/complaints/rejected?page=${pageNum}&limit=12`, {
        withCredentials: true,
      });
      dispatch(addrejComplaints({
        complaints: res?.data?.data,
        pagination: res?.data?.pagination
      }));
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, page]);

  // Handle page adjustment when current page becomes empty
  useEffect(() => {
    if (pagination.totalPages > 0 && page > pagination.totalPages) {
      const newPage = pagination.totalPages;
      setPage(newPage);
      setPageInput(newPage);
      fetchComplaints(newPage);
    }
  }, [pagination.totalPages, page, fetchComplaints]);

  useEffect(() => {
      fetchComplaints();
  }, [fetchComplaints]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
      setPageInput(newPage);
      fetchComplaints(newPage);
    }
  };

  const handlePageInputChange = (e) => {
    setPageInput(parseInt(e.target.value) || 1);
  };

  const handlePageInputBlur = () => {
    const newPage = Math.max(1, Math.min(pagination.totalPages, pageInput));
    if (newPage !== page) {
      handlePageChange(newPage);
    } else {
      setPageInput(page);
    }
  };

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
          className="text-4xl text-error text-center"
          style={{ fontFamily: "'Bowlby One SC', sans-serif" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-2xl mb-10 mt-5 text-error text-center border"
        style={{ fontFamily: "'Bowlby One SC', sans-serif" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeIn" }}
      >
        {t("rejectedComplaints")}
      </motion.h1>
      <div className="mt-5 flex flex-wrap justify-around">
        {complaints.map((complaint) => (
          <RejectedComplaintCard complaint={complaint} key={complaint._id} />
        ))}
      </div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="join">
            <button
              className="join-item btn"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
            >
              « {t("previous")}
            </button>

            <input
              type="number"
              className="input input-bordered join-item w-24 text-center focus:outline-none"
              min={1}
              max={pagination.totalPages}
              value={pageInput}
              onChange={handlePageInputChange}
              onBlur={handlePageInputBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handlePageInputBlur();
                }
              }}
            />

            <button
              className="join-item btn"
              disabled={page === pagination.totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              {t("next")} »
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ViewRejectedComplaints;

