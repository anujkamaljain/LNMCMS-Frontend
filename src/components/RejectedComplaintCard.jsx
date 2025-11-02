import React, { useState } from "react";
import { STUDENT_BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { removerejComplaint } from "../utils/rejectedComplaintsSlice";
import { removeComplaint as removeFromDiscover } from "../utils/discoverSlice";
import { useTranslation } from "../utils/useTranslation";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";

const RejectedComplaintCard = ({ complaint }) => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [deleting, setDeleting] = useState(false);
  const { t } = useTranslation();

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleDelete = async () => {
    if (!complaint?._id) {
      console.error("Complaint ID is missing");
      return;
    }

    // Confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to delete this complaint? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    try {
      const res = await axios.delete(
        `${STUDENT_BASE_URL}/complaint/${complaint._id}`,
        { withCredentials: true }
      );

      if (res.status === 200) {
        // Remove from rejected complaints Redux store
        dispatch(removerejComplaint(complaint._id));
        // If complaint was public, also remove from discover slice
        if (complaint.visibility === "public") {
          dispatch(removeFromDiscover(complaint._id));
        }
        toast.success("Complaint deleted successfully");
      } else {
        toast.error(res.data?.message || "Failed to delete complaint");
        setDeleting(false);
      }
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || "Failed to delete complaint";
      toast.error(errorMessage);
      setDeleting(false);
      console.error("Error deleting complaint:", {
        message: err.message,
        response: err.response?.data,
      });
    }
  };

  return (
    <div
      className={`mx-3 h-140 mb-6 relative bg-error ${
        "hover:translate-y-1"
      } transition-all ease-in duration-100`}
    >
      {/* Delete Cross Icon */}
      {user?.role === "student" && (
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete complaint"
        >
          <X className="w-5 h-5" />
        </button>
      )}
      <div className="card w-full max-w-sm bg-base-100 shadow-md rounded-xl overflow-x-hidden overflow-y-auto h-140 flex flex-col border border-base-300 border-error">
        <div className="card-body p-6 flex flex-col flex-grow overflow-y-auto">
          <h2 className="text-2xl font-bold text-center mb-4 px-2">
            {complaint.title}
          </h2>
          
          <div className="space-y-3 text-sm flex-grow">
            <div className="flex">
              <span className="font-semibold min-w-[100px]">
                {t("complaintDescription")}:
              </span>
              <span className="flex-1 break-words overflow-hidden">
                {complaint.description}
              </span>
            </div>

            <div className="flex">
              <span className="font-semibold min-w-[100px]">
                {t("rejectedBy")}:
              </span>
              <span className="flex-1">
                {complaint.rejectedBy?.name || "N/A"}
              </span>
            </div>

            <div className="flex">
              <span className="font-semibold min-w-[100px]">
                {t("contact")}:
              </span>
              <span className="flex-1">{complaint.contactNumber}</span>
            </div>

            <div className="flex flex-col">
              <span className="font-semibold mb-2">
                {t("rejectionReason")}:
              </span>
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r">
                <p className="text-red-800 text-sm break-words">
                  {complaint.rejectionReason || "No reason provided"}
                </p>
              </div>
            </div>

            <div className="flex">
              <span className="font-semibold min-w-[100px]">
                {t("rejectedOn")}:
              </span>
              <span className="flex-1">
                {complaint.updatedAt
                  ? formatDate(complaint.updatedAt.split("T")[0])
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectedComplaintCard;

