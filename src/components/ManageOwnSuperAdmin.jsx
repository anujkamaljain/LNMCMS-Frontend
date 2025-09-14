import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import axios from "axios";
import { BASE_URL, SUPERADMIN_BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {logout} from "../utils/authSlice";
import { useTranslation } from "../utils/useTranslation";

const ManageOwnSuperAdmin = () => {
  const user = useSelector((store) => store?.auth?.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setEmail(user?.email);
    setFullName(user?.name);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (fullName.trim() === user?.name && email.trim() === user?.email) {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        return;
      }
      const res = await axios.patch(
        SUPERADMIN_BASE_URL + "/superadmin",
        {
          name: fullName,
          email: email,
        },
        { withCredentials: true }
      );
      if (res.status === 200) {
        alert(
          "Details updated Successfully. You are being redirected to login page. Kindly login again!"
        );
        setTimeout(() => {
          const res2 = axios.post(BASE_URL + "/logout", {} , {
            withCredentials: true,
          });
          dispatch(logout());
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

  const handleDelete = async (e) => {
    try {
      const res = await axios.delete(SUPERADMIN_BASE_URL + "/superadmin", {
        withCredentials: true,
      });
      if (res.status === 200) {
        alert("Account Deleted Succesfully.");
        setTimeout(() => {
          const res2 = axios.post(BASE_URL + "/logout", {} , {
            withCredentials: true,
          });
          dispatch(logout());
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
      {showAlert && (
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
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
          <span>{t("editDetailsToUpdate")}</span>
        </div>
      )}
      <motion.h1
        className="text-2xl mb-10 mt-5 text-amber-400 text-center border"
        style={{ fontFamily: "'Bowlby One SC', sans-serif" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeIn" }}
      >
        {t("manageYourOwnAccount")}
      </motion.h1>
      <main>
        <section className="p-10">
          <div className="flex items-center justify-center">
            <div className={"card w-96 bg-base-100 shadow-sm "}>
              <div className="card-body">
                <span className="badge badge-xs badge-warning mb-3">
                  {t("yourDetails")}
                </span>
                <form onSubmit={handleSubmit}>
                  <label className="input mb-4">
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
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </g>
                    </svg>
                    <input
                      type="text"
                      required
                      placeholder={t("firstName")}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </label>
                  <div className="mb-4">
                    <label className="input join-item">
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
                          <rect
                            width="20"
                            height="16"
                            x="2"
                            y="4"
                            rx="2"
                          ></rect>
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                        </g>
                      </svg>
                      <input
                        type="email"
                        placeholder="abc@lnmiit.ac.in"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </label>
                  </div>
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
                      {t("updateDetails")}
                    </button>
                  </div>
                </form>
                <div
                  className="mt-3 tooltip"
                  data-tip="Permanently deletes your account"
                >
                  <button
                    className="btn btn-error btn-block"
                    onClick={() =>
                      document.getElementById("my_modal_5").showModal()
                    }
                  >
                    {t("deleteYourAccount")}
                  </button>
                </div>
                <div className="text-center mt-1">
                  <Link
                    className="link link-info"
                    to="/superAdmin/change-password"
                  >
                    {t("changePassword")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{t("deletingYourAccount")}</h3>
          <p className="py-4">{t("areYouSureDeleteAccount")}</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn mr-5" onClick={handleDelete}>
                {t("yes")}
              </button>
              <button className="btn">{t("no")}</button>
            </form>
          </div>
        </div>
      </dialog>
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

export default ManageOwnSuperAdmin;
