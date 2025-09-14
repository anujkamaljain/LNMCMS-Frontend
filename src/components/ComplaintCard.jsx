import React, { useState, useRef, useEffect } from "react";
import {
  ADMIN_BASE_URL,
  Location_Wise_List,
  STUDENT_BASE_URL,
} from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { removeComplaint } from "../utils/pendingComplaintsSlice";
import { removeaccComplaint } from "../utils/acceptedComplaintsSlice";
import { updateComplaintUpvote } from "../utils/discoverSlice";
import { useTranslation } from "../utils/useTranslation";

const ComplaintCard = ({ complaint }) => {
  const user = useSelector((store) => store.auth.user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [showScrollUp, setShowScrollUp] = useState(false);
  const cardBodyRef = useRef(null);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (complaint.upvotes && user) {
      const hasUpvoted = complaint.upvotes.some(
        (upvote) => upvote._id === user._id || upvote === user._id
      );
      setIsUpvoted(hasUpvoted);
    }
  }, [complaint.upvotes, user]);

  useEffect(() => {
    const checkOverflow = () => {
      if (cardBodyRef.current) {
        const hasOverflow =
          cardBodyRef.current.scrollHeight > cardBodyRef.current.clientHeight;
        setShowScrollDown(hasOverflow);
        setShowScrollUp(false);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => window.removeEventListener("resize", checkOverflow);
  }, [complaint]);

  useEffect(() => {
    const handleScroll = () => {
      if (cardBodyRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = cardBodyRef.current;
        const isAtBottom = scrollHeight - (scrollTop + clientHeight) < 5;
        const isAtTop = scrollTop < 5;

        setShowScrollDown(!isAtBottom);
        setShowScrollUp(!isAtTop && !isAtBottom);
      }
    };

    const currentRef = cardBodyRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const handleScrollDown = () => {
    if (cardBodyRef.current) {
      cardBodyRef.current.scrollTo({
        top: cardBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleScrollUp = () => {
    if (cardBodyRef.current) {
      cardBodyRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleClick = async () => {
    if (!complaint?._id) {
      console.error("Complaint ID is missing");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.patch(
        ADMIN_BASE_URL + "/complaint/accept/" + complaint._id,
        {},
        { withCredentials: true }
      );

      if (res.status == 200) {
        dispatch(removeComplaint(complaint._id));
      } else {
        console.error("Acceptance failed:", res.data?.message);
      }
    } catch (err) {
      console.error("Error accepting complaint:", {
        message: err.message,
        response: err.response?.data,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!complaint?._id) {
      console.error("Complaint ID is missing");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.patch(
        STUDENT_BASE_URL + "/complaint/resolve/" + complaint._id,
        {},
        { withCredentials: true }
      );
      if (res.status == 200) {
        dispatch(removeaccComplaint(complaint._id));
      } else {
        console.error("Resolving failed:", res.data?.message);
      }
    } catch (err) {
      console.error("Error resolving complaint:", {
        message: err.message,
        response: err.response?.data,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpvote = async () => {
    if (!complaint?._id) {
      console.error("Complaint ID is missing");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.patch(
        STUDENT_BASE_URL + "/complaint/upvote/" + complaint._id,
        {},
        { withCredentials: true }
      );

      if (res.status === 200) {
        const { upvoted, upvoteCount } = res.data.data;
        setIsUpvoted(upvoted);
        dispatch(
          updateComplaintUpvote({
            complaintId: complaint._id,
            upvoted,
            upvoteCount,
          })
        );
      } else {
        console.error("Upvote failed:", res.data?.message);
      }
    } catch (err) {
      console.error("Error upvoting complaint:", {
        message: err.message,
        response: err.response?.data,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`mx-3 h-135 mb-6 relative ${
        complaint.status === "pending"
          ? "bg-error"
          : complaint.status === "accepted"
          ? "bg-warning"
          : "bg-success"
      } hover:translate-y-1 transition-all ease-in duration-100`}
    >
      <div className="card w-full max-w-sm bg-base-100 shadow-md rounded-xl overflow-x-hidden overflow-y-auto h-135 flex flex-col border border-base-300">
        <div
          className="card-body p-6 flex flex-col flex-grow overflow-y-auto"
          ref={cardBodyRef}
        >
          <div className="flex flex-wrap gap-2 mb-4">
            {complaint.tags.map((tag, index) => (
              <span
                key={index}
                className={`badge badge-sm ${
                  Location_Wise_List.includes(tag)
                    ? "badge-success"
                    : "badge-warning"
                } font-medium px-3 py-1 rounded-md`}
              >
                {tag}
              </span>
            ))}
          </div>
          <h2 className="text-2xl font-bold text-center mb-4 px-2">
            {complaint.title}
          </h2>
          <div className="space-y-3 text-sm flex-grow">
            <div className="flex">
              <span className="font-semibold min-w-[100px]">{t("complaintDescription")}:</span>
              <span className="flex-1 break-words overflow-hidden">
                {complaint.description}
              </span>
            </div>

            <div className="flex">
              <span className="font-semibold min-w-[100px]">{t("complaintStatus")}:</span>
              <span
                className={`flex-1 font-semibold ${
                  complaint.status === "pending"
                    ? "text-error"
                    : complaint.status === "accepted"
                    ? "text-warning"
                    : "text-success"
                }`}
              >
                {t(complaint.status)}
              </span>
            </div>
            {complaint.status === "pending" ? (
              <div className="flex">
                <span className="font-semibold min-w-[100px]">
                  {t("acceptedBy")}:
                </span>
                <span className="flex-1"> - </span>
              </div>
            ) : (
              <div className="flex">
                <span className="font-semibold min-w-[100px]">
                  {t("acceptedBy")}:
                </span>
                <span className="flex-1">{complaint.acceptedBy.name}</span>
              </div>
            )}
            {complaint.status === "pending" ? (
              <div className="flex">
                <span className="font-semibold min-w-[100px]">{t("email")}:</span>
                <span className="flex-1"> - </span>
              </div>
            ) : (
              <div className="flex">
                <span className="font-semibold min-w-[100px]">{t("email")}:</span>
                <span className="flex-1">{complaint.acceptedBy.email}</span>
              </div>
            )}
            <div className="flex">
              <span className="font-semibold min-w-[100px]">{t("location")}:</span>
              <span className="flex-1 break-words overflow-hidden">
                {complaint.location}
              </span>
            </div>

            <div className="flex">
              <span className="font-semibold min-w-[100px]">{t("rollNumber")}:</span>
              <span className="flex-1">{complaint.studentId.rollNumber}</span>
            </div>

            <div className="flex">
              <span className="font-semibold min-w-[100px]">{t("availability")}:</span>
              <span className="flex-1">
                {`${complaint.availableTimeFrom}-${complaint.availableTimeTo}`}
              </span>
            </div>

            <div className="flex">
              <span className="font-semibold min-w-[100px]">{t("contact")}:</span>
              <span className="flex-1">{complaint.contactNumber}</span>
            </div>

            <div className="flex">
              <span className="font-semibold min-w-[100px]">{t("createdOn")}:</span>
              <span className="flex-1">
                {formatDate(complaint.createdAt.split("T")[0])}
              </span>
            </div>
          </div>
          {complaint.status === "pending" && user.role === "admin" && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                className={`btn btn-warning w-full py-2 rounded-lg font-medium text-base-100 ${
                  isLoading ? "loading" : ""
                }`}
                onClick={handleClick}
                disabled={isLoading}
              >
                {isLoading ? t("processing") : t("accept")}
              </button>
            </div>
          )}
          {complaint.status === "accepted" && user.role === "student" && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                className={`btn btn-success w-full py-2 rounded-lg font-medium text-base-100 ${
                  isLoading ? "loading" : ""
                }`}
                onClick={handleResolve}
                disabled={isLoading}
              >
                {isLoading ? t("processing") : t("resolve")}
              </button>
            </div>
          )}
          {complaint.visibility === "public" &&
            complaint.status === "pending" &&
            user.role === "student" && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{t("upvotes")}:</span>
                    <span className="badge badge-primary">
                      {complaint.upvoteCount || 0}
                    </span>
                  </div>
                  <button
                    className={`btn btn-sm ${
                      isUpvoted ? "btn-primary" : "btn-outline btn-primary"
                    } ${isLoading ? "loading" : ""}`}
                    onClick={handleUpvote}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      t("processing")
                    ) : isUpvoted ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {t("upvoted")}
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {t("upvote")}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>

      {showScrollDown && (
        <button
          onClick={handleScrollDown}
          className="absolute bottom-8 right-8 btn btn-circle btn-sm opacity-70 hover:opacity-100 transition-opacity shadow-md border border-base-200"
          aria-label="Scroll down"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}

      {showScrollUp && (
        <button
          onClick={handleScrollUp}
          className="absolute top-8 right-8 btn btn-circle btn-sm opacity-70 hover:opacity-100 transition-opacity shadow-md border border-base-200"
          aria-label="Scroll up"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ComplaintCard;
