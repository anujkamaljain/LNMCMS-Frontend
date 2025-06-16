import React, { useState } from "react";
import { ADMIN_BASE_URL, Location_Wise_List } from "../utils/constants";
import axios from "axios";
import { useDispatch } from "react-redux";
import { removeComplaint } from "../utils/pendingComplaintsSlice";

const ComplaintCard = ({ complaint }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
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
        `${ADMIN_BASE_URL}/complaint/accept/${complaint._id}`,
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

  return (
    <div
      className={`mx-3 h-full mb-6 ${
        complaint.status === "pending"
          ? "bg-error"
          : complaint.status === "accepted"
          ? "bg-warning"
          : "bg-success"
      } hover:translate-y-1 transition-all ease-in duration-100`}
    >
      <div className="card w-full max-w-sm bg-base-100 shadow-md rounded-xl overflow-hidden h-full flex flex-col">
        <div className="card-body p-6 flex flex-col flex-grow">
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
              <span className="font-semibold min-w-[100px]">Description:</span>
              <span className="flex-1">{complaint.description}</span>
            </div>

            <div className="flex">
              <span className="font-semibold min-w-[100px]">Status:</span>
              <span className={`flex-1 font-semibold ${complaint.status === "pending" ? "text-error" : complaint.status === "accepted" ? "text-warning" : "text-success"}`}>{complaint.status}</span>
            </div>
            {complaint.status === "pending" ? null : (
              <div className="flex">
                <span className="font-semibold min-w-[100px]">
                  Accepted By:
                </span>
                <span className="flex-1">{complaint.acceptedBy.name}</span>
              </div>
            )}
            {complaint.status === "pending" ? null : (
              <div className="flex">
                <span className="font-semibold min-w-[100px]">
                  Email:
                </span>
                <span className="flex-1">{complaint.acceptedBy.email}</span>
              </div>
            )}
            <div className="flex">
              <span className="font-semibold min-w-[100px]">Location:</span>
              <span className="flex-1">{complaint.location}</span>
            </div>

            <div className="flex">
              <span className="font-semibold min-w-[100px]">Roll Number:</span>
              <span className="flex-1">{complaint.studentId.rollNumber}</span>
            </div>

            <div className="flex">
              <span className="font-semibold min-w-[100px]">Availability:</span>
              <span className="flex-1">
                {`${complaint.availableTimeFrom}-${complaint.availableTimeTo}`}
              </span>
            </div>

            <div className="flex">
              <span className="font-semibold min-w-[100px]">Contact:</span>
              <span className="flex-1">{complaint.contactNumber}</span>
            </div>

            <div className="flex">
              <span className="font-semibold min-w-[100px]">Created On:</span>
              <span className="flex-1">
                {formatDate(complaint.createdAt.split("T")[0])}
              </span>
            </div>
          </div>
          {complaint.status === "pending" && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                className={`btn btn-warning w-full py-2 rounded-lg font-medium text-base-100 ${
                  isLoading ? "loading" : ""
                }`}
                onClick={handleClick}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Accept"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;
