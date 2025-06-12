import React, { useState } from "react";
import { motion } from "motion/react";
import axios from "axios";
import { SUPERADMIN_BASE_URL } from "../utils/constants";

const ManageAdmin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("Anuj Kamal Jain");
  const [email, setEmail] = useState("anujgjain@lnmiit.ac.in");
  const [password, setPassword] = useState("Ak301277#");
  const [department, setDepartment] = useState("BH5");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [deleteEmail, setDeleteEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        SUPERADMIN_BASE_URL + "/admin",
        {
          name: fullName,
          email: email,
          password: password,
          department: department,
        },
        { withCredentials: true }
      );

      if (res.status === 201) {
        setToastMessage("Super Admin added successfully!");
        setToastType("success");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
      setEmail("");
      setFullName("");
      setPassword("");
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
          <div className="flex flex-wrap items-center justify-around">
            <div
              className={
                "card w-96 bg-base-100 shadow-sm my-5 hover:-translate-y-1 transition-all duration-150 ease-in cursor-pointer "
              }
            >
              <div className="card-body">
                <span className="badge badge-xs badge-warning mb-3">
                  Add Admin
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
                      placeholder="First Name"
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
                  <fieldset className="fieldset mb-3">
                    <select
                      className="select cursor-pointer"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Choose Department
                      </option>
                      <option value="admin">Admin</option>
                      <option value="superAdmin">SuperAdmin</option>
                    </select>
                  </fieldset>
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
                      placeholder="Password"
                      minLength="8"
                      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                      title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </label>

                  <label className="flex items-center ">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary h-4 w-4 mr-2"
                      checked={showPassword}
                      onChange={() => setShowPassword(!showPassword)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSubmit(e);
                        }
                      }}
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
                      Add Admin
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div
              className={
                "card w-96 bg-base-100 shadow-sm my-5 hover:-translate-y-1 transition-all duration-150 ease-in cursor-pointer"
              }
            >
              <div className="card-body">
                <span className="badge badge-xs badge-warning mb-3">
                  Delete Admin
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
                      placeholder="First Name"
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
                  <fieldset className="fieldset mb-3">
                    <select
                      className="select cursor-pointer"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Choose Department
                      </option>
                      <option value="admin">Admin</option>
                      <option value="superAdmin">SuperAdmin</option>
                    </select>
                  </fieldset>
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
                      placeholder="Password"
                      minLength="8"
                      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                      title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </label>

                  <label className="flex items-center ">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary h-4 w-4 mr-2"
                      checked={showPassword}
                      onChange={() => setShowPassword(!showPassword)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSubmit(e);
                        }
                      }}
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
                      Delete Admin
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div
              className={
                "card w-96 bg-base-100 shadow-sm my-5 hover:-translate-y-1 transition-all duration-150 ease-in cursor-pointer"
              }
            >
              <div className="card-body">
                <span className="badge badge-xs badge-warning mb-3">
                  Search/Edit Admin
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
                      placeholder="First Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </label>
                  <div className="join mb-4">
                    <div>
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
                    <button className="btn btn-neutral join-item ml-14">
                      Join
                    </button>
                  </div>
                  <fieldset className="fieldset mb-3">
                    <select
                      className="select cursor-pointer"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Choose Department
                      </option>
                      <option value="admin">Admin</option>
                      <option value="superAdmin">SuperAdmin</option>
                    </select>
                  </fieldset>
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
                      placeholder="Password"
                      minLength="8"
                      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                      title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </label>

                  <label className="flex items-center ">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary h-4 w-4 mr-2"
                      checked={showPassword}
                      onChange={() => setShowPassword(!showPassword)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSubmit(e);
                        }
                      }}
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
                      Add Super Admin
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

export default ManageAdmin;
