import React, { useState, useRef, useEffect } from "react";
import {
  ADMIN_BASE_URL,
  Location_Wise_List,
  STUDENT_BASE_URL,
} from "../utils/constants";
import axios from "axios";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeComplaint } from "../utils/pendingComplaintsSlice";
import { removeaccComplaint } from "../utils/acceptedComplaintsSlice";
import { updateComplaintUpvote } from "../utils/discoverSlice";
import { useTranslation } from "../utils/useTranslation";
import StarRatingModal from "./StarRatingModal";
import MediaViewer from "./MediaViewer";
import{ Sparkles, MessageSquareText } from "lucide-react";
import { useUnreadMessages } from "../utils/useUnreadMessages";

const ComplaintCard = ({ complaint }) => {
  const { isAuthenticated, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [showScrollUp, setShowScrollUp] = useState(false);
  const cardBodyRef = useRef(null);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showMediaViewer, setShowMediaViewer] = useState(false);
  const { t } = useTranslation();

  // Get target user ID for chat
  const targetUserId = user?.role === "student" ? complaint?.acceptedBy?._id : complaint?.studentId?._id;
  
  // Check for unread messages
  const { hasUnread, unreadCount } = useUnreadMessages(targetUserId);

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

  const handleResolve = () => {
    setShowRatingModal(true);
  };

  const handleRatingSubmit = async (rating) => {
    if (!complaint?._id) {
      console.error("Complaint ID is missing");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.patch(
        STUDENT_BASE_URL + "/complaint/resolve/" + complaint._id,
        { rating },
        { withCredentials: true }
      );
      if (res.status == 200) {
        dispatch(removeaccComplaint(complaint._id));
        setShowRatingModal(false);
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
      } ${!showRatingModal && !showMediaViewer ? "hover:translate-y-1" : ""} transition-all ease-in duration-100`}
    >
      <div className="card w-full max-w-sm bg-base-100 shadow-md rounded-xl overflow-x-hidden overflow-y-auto h-135 flex flex-col border border-base-300">
        <div
          className="card-body p-6 flex flex-col flex-grow overflow-y-auto"
          ref={cardBodyRef}
        >
          <div className="flex justify-between items-center">
            <div className="flex flex-wrap gap-2">
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
            <div
              className={`${complaint.status === "accepted" ? "" : "hidden"}`}
            >
              <Link
                to={
                  (user?.role === "admin" || user?.role === "student") &&
                  isAuthenticated
                    ? `/${user?.role}/chat/${user?.role === "student" ? complaint?.acceptedBy?._id : complaint?.studentId?._id}`
                    : "/login"
                }
              >
                <button className="relative bg-orange-500 h-12 w-12 rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform ease-in-out duration-350 cursor-pointer">
                  <MessageSquareText className="text-white w-6 h-6" />
                  <Sparkles className="absolute top-2 right-2 text-white w-3 h-3" />
                  {/* Red dot for unread messages */}
                  {hasUnread && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </div>
                  )}
                </button>
              </Link>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-4 px-2">
            {complaint.title}
          </h2>
          {complaint.status === "resolved" && complaint.rating && (
            <div className="flex justify-center mb-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      star <= complaint.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-xs sm:text-sm text-gray-600">
                  ({complaint.rating}/5)
                </span>
              </div>
            </div>
          )}
          <div className="space-y-3 text-sm flex-grow">
            <div className="flex">
              <span className="font-semibold min-w-[100px]">
                {t("complaintDescription")}:
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className="break-words transition-all duration-300"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: isDescriptionExpanded ? "none" : 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    lineHeight: "1.5em",
                    maxHeight: isDescriptionExpanded ? "none" : "3em",
                    width: "100%",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {complaint.description}
                </p>
                {complaint.description.length > 100 && (
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="cursor-pointer mt-2 text-sm font-medium text-red-400 hover:text-green-700 transition-colors duration-200"
                  >
                    {isDescriptionExpanded ? "Read Less" : "Read More"}
                  </button>
                )}
              </div>
            </div>

            <div className="flex">
              <span className="font-semibold min-w-[100px]">
                {t("complaintStatus")}:
              </span>
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
                <span className="font-semibold min-w-[100px]">
                  {t("email")}:
                </span>
                <span className="flex-1"> - </span>
              </div>
            ) : (
              <div className="flex">
                <span className="font-semibold min-w-[100px]">
                  {t("email")}:
                </span>
                <span className="flex-1">{complaint.acceptedBy.email}</span>
              </div>
            )}
            <div className="flex">
              <span className="font-semibold min-w-[100px]">
                {t("location")}:
              </span>
              <span className="flex-1 break-words overflow-hidden">
                {complaint.location}
              </span>
            </div>

            <div className="flex">
              <span className="font-semibold min-w-[100px]">
                {t("rollNumber")}:
              </span>
              <span className="flex-1">{complaint.studentId.rollNumber}</span>
            </div>

            <div className="flex">
              <span className="font-semibold min-w-[100px]">
                {t("availability")}:
              </span>
              <span className="flex-1">
                {`${complaint.availableTimeFrom}-${complaint.availableTimeTo}`}
              </span>
            </div>

            <div className="flex">
              <span className="font-semibold min-w-[100px]">
                {t("contact")}:
              </span>
              <span className="flex-1">{complaint.contactNumber}</span>
            </div>

            <div className="flex">
              <span className="font-semibold min-w-[100px]">
                {t("createdOn")}:
              </span>
              <span className="flex-1">
                {formatDate(complaint.createdAt.split("T")[0])}
              </span>
            </div>

            {/* Media Files Section */}
            {complaint.media && complaint.media.length > 0 && (
              <div className="flex">
                <span className="font-semibold min-w-[100px]">Media:</span>
                <div className="flex-1">
                  <button
                    onClick={() => setShowMediaViewer(true)}
                    className="btn btn-sm btn-outline btn-primary"
                  >
                    📎 Media ({complaint.media.length} file{complaint.media.length > 1 ? 's' : ''})
                  </button>
                </div>
              </div>
            )}
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

      {/* Star Rating Modal */}
      <StarRatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onRate={handleRatingSubmit}
        complaintTitle={complaint.title}
      />

      {/* Media Viewer Modal */}
      <MediaViewer
        isOpen={showMediaViewer}
        onClose={() => setShowMediaViewer(false)}
        mediaFiles={complaint.media || []}
      />
    </div>
  );
};

export default ComplaintCard;
