import React, { useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setError, setComplaints } from "../utils/discoverSlice";
import { STUDENT_BASE_URL } from "../utils/constants";
import axios from "axios";
import ComplaintCard from "./ComplaintCard";
import { useTranslation } from "../utils/useTranslation";

const Discover = () => {
  const dispatch = useDispatch();
  const { complaints, loading, error, pagination } = useSelector((store) => store.discover);
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState(1);

  const fetchPublicComplaints = useCallback(async (pageNum = page) => {
    dispatch(setLoading(true));
    try {
      const res = await axios.get(`${STUDENT_BASE_URL}/complaints/public?page=${pageNum}&limit=12`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        dispatch(setComplaints({
          complaints: res.data.data,
          pagination: res.data.pagination
        }));
      } else {
        dispatch(setError(res.data?.message || "Failed to fetch complaints"));
      }
    } catch (err) {
      console.error("Error fetching public complaints:", err);
      dispatch(
        setError(err.response?.data?.message || "Failed to fetch complaints")
      );
    }
  }, [dispatch, page]);

  // Handle page adjustment when current page becomes empty
  useEffect(() => {
    if (pagination.totalPages > 0 && page > pagination.totalPages) {
      const newPage = pagination.totalPages;
      setPage(newPage);
      setPageInput(newPage);
      fetchPublicComplaints(newPage);
    }
  }, [pagination.totalPages, page, fetchPublicComplaints]);

  useEffect(() => {
    fetchPublicComplaints();
  }, [fetchPublicComplaints]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
      setPageInput(newPage);
      fetchPublicComplaints(newPage);
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
        {t("discoverComplaints")}
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
              {t("retry")}
            </button>
          </div>
        ) : complaints.length === 0 ? (
          <div className="flex items-center justify-center h-screen">
            <motion.h1
              className="text-4xl text-primary text-center"
              style={{ fontFamily: "'Bowlby One SC', sans-serif" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {t("noComplaintsFound")}
            </motion.h1>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap justify-center gap-4">
              {complaints.map((complaint) => (
                <ComplaintCard key={complaint._id} complaint={complaint} />
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
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Discover;
