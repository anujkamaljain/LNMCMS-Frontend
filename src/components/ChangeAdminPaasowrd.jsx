import React, { useState } from "react";
import { motion } from "motion/react";
import axios from "axios";
import {
  ADMIN_BASE_URL,
  BASE_URL,
  SUPERADMIN_BASE_URL,
} from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../utils/authSlice";
import { clearComplaints } from "../utils/pendingComplaintsSlice";
import { removeaccComplaints } from "../utils/acceptedComplaintsSlice";
import { removeresComplaint } from "../utils/resolvedComplaintsSlice";

const ChangeAdminPaasowrd = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        ADMIN_BASE_URL + "/changepassword",
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        alert("Password Changed Successfully. Login Again using new Password.");
        setTimeout(() => {
          const res2 = axios.post(
            BASE_URL + "/logout",
            {},
            {
              withCredentials: true,
            }
          );
          dispatch(logout());
          dispatch(clearComplaints());
          dispatch(removeaccComplaints());
          dispatch(removeresComplaint());
          navigate("/login");
        }, 0);
      }
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || "Something went wrong!";
      setToastMessage(errorMessage);
      setToastType("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  return (
    <motion.div
      className="flex-1 py-3 px-5"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <motion.h1
        className="text-2xl mb-10 mt-5 text-amber-400 text-center border"
        style={{ fontFamily: "'Bowlby One SC', sans-serif" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeIn" }}
      >
        Manage Admin
      </motion.h1>
      <main>
        <section className="p-10">
          <div className="flex items-center justify-center">
            <div className={"card w-96 bg-base-100 shadow-sm "}>
              <div className="card-body">
                <span className="badge badge-xs badge-warning mb-3">
                  Change Password
                </span>
                <form onSubmit={handleSubmit}>
                  <label className="input mb-3">
                    <svg
                      className="h-[1em] opacity-50"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                        <circle
                          cx="16.5"
                          cy="7.5"
                          r=".5"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Old Password"
                      minLength="8"
                      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                      title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                  </label>

                  <label className="input mb-3">
                    <svg
                      className="h-[1em] opacity-50"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                        <circle
                          cx="16.5"
                          cy="7.5"
                          r=".5"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="New Password"
                      minLength="8"
                      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                      title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </label>
                  <label className="input mb-3">
                    <svg
                      className="h-[1em] opacity-50"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                        <circle
                          cx="16.5"
                          cy="7.5"
                          r=".5"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Confirm Password"
                      minLength="8"
                      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                      title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </label>
                  <label className="flex items-center ">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary h-4 w-4 mr-2"
                      checked={showPassword}
                      onChange={() => setShowPassword(!showPassword)}
                    />
                    Show Password
                  </label>
                  {showToast ? (
                    <p
                      className={`${
                        toastType === "error"
                          ? "text-red-500"
                          : "text-green-500"
                      } mt-4`}
                    >
                      {toastType === "error"
                        ? "ERROR :" + " " + toastMessage
                        : "SUCCESS :" + " " + toastMessage}
                    </p>
                  ) : null}
                  <div className="mt-6">
                    <button className="btn btn-primary btn-block" type="submit">
                      Change Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      {showToast && (
        <div className="toast toast-top toast-center fixed z-50">
          <div
            className={`alert ${
              toastType === "error" ? "alert-error" : "alert-success"
            } rounded-xl`}
          >
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ChangeAdminPaasowrd;
