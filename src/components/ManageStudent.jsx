import React, { useState } from "react";
import { motion } from "motion/react";
import axios from "axios";
import { Department_List, SUPERADMIN_BASE_URL } from "../utils/constants";

const ManageStudent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [deleteRollNumber, setDeleteRollNumber] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchFullName, setSearchFullName] = useState("");
  const [searchRollNumber, setSearchRollNumber] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchClick, setSearchClick] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [fileDel, setFileDel] = useState(null);
  const [messageDel, setMessageDel] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        SUPERADMIN_BASE_URL + "/student",
        {
          name: fullName,
          email: email,
          password: password,
          rollNumber: rollNumber,
        },
        { withCredentials: true }
      );

      if (res.status === 201) {
        setToastMessage("Student added successfully!");
        setToastType("success");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
      setEmail("");
      setFullName("");
      setPassword("");
      setRollNumber("");
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
    e.preventDefault();
    try {
      const res = await axios.delete(
        SUPERADMIN_BASE_URL + "/student/" + deleteRollNumber,
        { withCredentials: true }
      );

      if (res.status === 200) {
        setToastMessage("Student deleted successfully!");
        setToastType("success");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
      setDeleteRollNumber("");
      setSearchEmail("");
      setSearchRollNumber("");
      setSearchFullName("");
      setSearchId("");
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || "Something went wrong!";
      setToastMessage(errorMessage);
      setToastType("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setSearchClick(true);
      const res = await axios.get(
        SUPERADMIN_BASE_URL + "/student/" + searchRollNumber,
        { withCredentials: true }
      );

      if (res.status === 200) {
        setToastMessage("Student found successfully!");
        setToastType("success");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
      setSearchFullName(res?.data?.data?.name);
      setSearchEmail(res?.data?.data?.email);
      setSearchRollNumber(res?.data?.data?.rollNumber);
      setSearchId(res?.data?.data?._id);
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || "Something went wrong!";
      setToastMessage(errorMessage);
      setToastType("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        SUPERADMIN_BASE_URL + "/student/" + searchId,
        {
          email: searchEmail,
          name: searchFullName,
          rollNumber: searchRollNumber,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setToastMessage("Student Details Updated Successfully!");
        setToastType("success");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
      setSearchEmail("");
      setSearchRollNumber("");
      setSearchFullName("");
      setSearchId("");
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || "Something went wrong!";
      setToastMessage(errorMessage);
      setToastType("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleDFileChange = (e) => {
    setFileDel(e.target.files[0]);
    setMessage("");
  };

  const handleBulkAdd = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("Please select a CSV file.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await axios.post(
        SUPERADMIN_BASE_URL + "/students",
        formData,
        { withCredentials: true }
      );
      if (res.status === 201) {
        setToastMessage(res?.data?.message);
        setToastType("success");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
      setMessage(
        res?.data?.message ||
          "Students Added successfully and emails were sent!"
      );
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Something went wrong. Try again."
      );
      const errorMessage =
        err?.response?.data?.message || "Something went wrong!";
      setToastMessage(errorMessage);
      setToastType("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } finally {
      setUploading(false);
    }
  };

  const handleBulkDelete = async (e) => {
    e.preventDefault();
    if (!fileDel) return setMessageDel("Please select a CSV file.");

    const formData = new FormData();
    formData.append("file", fileDel);

    try {
      setDeleting(true);
      const res = await axios.delete(SUPERADMIN_BASE_URL + "/students", {
        data: formData,
        withCredentials: true,
      });
      if (res.status === 200) {
        setToastMessage(res?.data?.message);
        setToastType("success");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
      setMessageDel(res?.data?.message || "Deletion started.");
      setTimeout(() => setMessageDel(""), 3000);
    } catch (err) {
      setMessageDel(
        err.response?.data?.message || "Something went wrong. Try again."
      );
      const errorMessage =
        err?.response?.data?.message || "Something went wrong!";
      setToastMessage(errorMessage);
      setToastType("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } finally {
      setDeleting(false);
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
        Manage Student
      </motion.h1>
      <main>
        <section className="p-10">
          <div className="flex flex-col xl:flex-row items-center justify-center gap-4">
            <div>
              <motion.div
                className={
                  "card w-96 bg-base-100 shadow-sm my-5 hover:-translate-y-1 transition-all duration-150 ease-in cursor-pointer "
                }
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
              >
                <div className="card-body">
                  <span className="badge badge-xs badge-warning mb-3">
                    Add Student
                  </span>
                  <form onSubmit={handleSubmit} className="w-80">
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
                        placeholder="Roll Number (ex. 23UCS100)"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
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
                    <label className="input">
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
                    <label className="flex items-center mt-3">
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
                    <div className="mt-6">
                      <button
                        className="btn btn-primary btn-block"
                        type="submit"
                      >
                        Add Student
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
              <motion.div
                className="card w-96 bg-base-100 shadow-sm my-5 hover:-translate-y-1 transition-all duration-150 ease-in cursor-pointer"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
              >
                <div className="card-body">
                  <span className="badge badge-xs badge-warning mb-3">
                    Add Students in Bulk
                  </span>
                  <form
                    onSubmit={handleBulkAdd}
                    className="w-80 flex flex-col gap-3"
                  >
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="file-input file-input-bordered w-full"
                    />
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={uploading}
                    >
                      {uploading ? "Uploading..." : "Upload CSV"}
                    </button>
                    {message && (
                      <p
                        className={`text-sm ${
                          message.toLowerCase().includes("sent")
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {message}
                      </p>
                    )}
                  </form>
                </div>
              </motion.div>
            </div>
            <motion.div
              className={
                "card w-96 bg-base-100 shadow-sm my-5 hover:-translate-y-1 transition-all duration-150 ease-in cursor-pointer"
              }
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
            >
              <div className="card-body">
                <span className="badge badge-xs badge-error mb-3">
                  Delete Student
                </span>
                <form onSubmit={handleDelete}>
                  <div className="mb-4">
                    <label className="input">
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
                        placeholder="Roll Number (ex. 23UCS100)"
                        value={deleteRollNumber}
                        onChange={(e) => setDeleteRollNumber(e.target.value)}
                      />
                    </label>
                  </div>
                  <div className="mt-6">
                    <button className="btn btn-primary btn-block" type="submit">
                      Delete Student
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
            <div>
              <motion.div
                className={
                  "card w-96 bg-base-100 shadow-sm my-5 hover:-translate-y-1 transition-all duration-150 ease-in cursor-pointer  mt-15"
                }
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
              >
                <div className="card-body">
                  <span className="badge badge-xs badge-success mb-3">
                    Search/Edit Student
                  </span>
                  <form onSubmit={handleEdit}>
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
                        value={searchFullName}
                        onChange={(e) => setSearchFullName(e.target.value)}
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
                          value={searchEmail}
                          onChange={(e) => setSearchEmail(e.target.value)}
                        />
                      </label>
                    </div>
                    <div className="join mb-4">
                      <div>
                        {" "}
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
                              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </g>
                          </svg>
                          <input
                            type="text"
                            required
                            placeholder="Roll Number"
                            value={searchRollNumber}
                            onChange={(e) =>
                              setSearchRollNumber(e.target.value)
                            }
                          />
                        </label>
                      </div>
                      <button
                        className="btn btn-neutral join-item"
                        onClick={handleSearch}
                      >
                        Search
                      </button>
                    </div>
                    <div>
                      <button
                        className={`btn btn-block ${
                          searchClick && searchId
                            ? "btn-primary"
                            : "btn-disabled"
                        }`}
                        type="submit"
                      >
                        Update Student Details
                      </button>
                    </div>
                  </form>
                </div>
                {searchClick && searchId ? null : (
                  <div className="text-center mb-10">
                    <p className="text-xs text-red-600 font-bold">
                      *Kindly Search the student
                    </p>
                    <p className="text-xs text-red-600 font-bold">
                      using Roll Number before updating the details.
                    </p>
                  </div>
                )}
              </motion.div>
              <motion.div
                className="card w-96 bg-base-100 shadow-sm my-5 hover:-translate-y-1 transition-all duration-150 ease-in cursor-pointer"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
              >
                <div className="card-body">
                  <span className="badge badge-xs badge-error mb-3">
                    Delete Students in Bulk
                  </span>
                  <form
                    onSubmit={handleBulkDelete}
                    className="w-80 flex flex-col gap-3"
                  >
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleDFileChange}
                      className="file-input file-input-bordered w-full"
                    />
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={deleting}
                    >
                      {deleting ? "Deleting..." : "Delete CSV"}
                    </button>
                    {messageDel && (
                      <p
                        className={`text-sm ${
                          messageDel.toLowerCase().includes("deletion")
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {messageDel}
                      </p>
                    )}
                  </form>
                </div>
              </motion.div>
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

export default ManageStudent;
