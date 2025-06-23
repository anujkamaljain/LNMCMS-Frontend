import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { SUPERADMIN_BASE_URL } from "../utils/constants";

const AddStudent = () => {
  const [view, setView] = useState("single"); // 'single' or 'bulk'
  const [fullName, setFullName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [alreadyCreatedList, setAlreadyCreatedList] = useState([]);
  const [failedList, setFailedList] = useState([]);
  const [showSampleImage, setShowSampleImage] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlreadyCreatedList([]);
    setFailedList([]);

    try {
      const res = await axios.post(
        SUPERADMIN_BASE_URL + "/student",
        { name: fullName, email, password, rollNumber },
        { withCredentials: true }
      );
      if (res.status === 201) {
        setToastMessage("Student added successfully!");
        setToastType("success");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setFullName("");
        setRollNumber("");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong!";
      setToastMessage(msg);
      setToastType("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
  };


  const handleBulkAdd = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setFailedList([]);
      setAlreadyCreatedList([]);

      const res = await axios.post(SUPERADMIN_BASE_URL + "/students", formData, {
        withCredentials: true,
      });

      const failed = Array.isArray(res?.data?.failedToCreate) ? res.data.failedToCreate : [];
      const existing = Array.isArray(res?.data?.alreadyCreated) ? res.data.alreadyCreated : [];

      setFailedList(failed);
      setAlreadyCreatedList(existing);

      if (failed.length === 0 && existing.length === 0) {
        setToastMessage("All students added successfully!");
      }  else {
        const existingCount = existing.length;
        const failedCount = failed.length;
        const msgParts = [];
        if (existingCount > 0) msgParts.push(`${existingCount} already existed`);
        if (failedCount > 0) msgParts.push(`${failedCount} failed to add`);
        setToastMessage(`Bulk upload done. ${msgParts.join(", ")}.`);
      }

      setToastType("success");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
      setFile(null);
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong!";
      setToastMessage(msg);
      setToastType("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } finally {
      setUploading(false);
    }
  };


  return (
    <div className="flex justify-center items-center flex-grow px-4">
      <motion.div
        className="flex justify-center flex-grow px-4 pt-16 pb-24"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="card w-full max-w-lg bg-base-100 shadow-md p-6 border border-base-300">
          <h2 className="text-xl font-bold text-amber-500 mb-7 text-center">
            Add Student
          </h2>

          {/* Radio Switch */}
          <div className="flex justify-around mb-6">
            <label className="cursor-pointer label gap-2">
              <input
                type="radio"
                name="mode"
                value="single"
                checked={view === "single"}
                onChange={() => {
                  setView("single");
                  setAlreadyCreatedList([]);
                  setFailedList([]);
                  setShowToast(false);
                }}
                className="radio radio-primary"
              />
              <span className="label-text font-semibold">Single</span>
            </label>
            <label className="cursor-pointer label gap-2">
              <input
                type="radio"
                name="mode"
                value="bulk"
                checked={view === "bulk"}
                onChange={() => {
                  setView("bulk");
                  setAlreadyCreatedList([]);
                  setFailedList([]);
                  setShowToast(false);
                }}
                className="radio radio-primary"
              />
              <span className="label-text font-semibold">Bulk (CSV)</span>
            </label>
          </div>

          {/* Form Transition */}
          <AnimatePresence mode="wait">
            {view === "single" ? (
              <motion.form
                key="single"
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Roll Number"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  required
                />
                <input
                  type="email"
                  className="input input-bordered w-full"
                  placeholder="Email (abc@lnmiit.ac.in)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label className="label cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm checkbox-primary mr-2"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                  />
                  <span className="label-text text-sm">Show Password</span>
                </label>
                <button type="submit" className="btn btn-primary btn-block mt-2" disabled={uploading}>
                  {uploading ? "Adding..." : "Add Student"}
                </button>

              </motion.form>
            ) : (
              <motion.form
                key="bulk"
                onSubmit={handleBulkAdd}
                className="flex flex-col gap-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="file-input file-input-bordered w-full"
                  required
                />
                <p
                  onClick={() => setShowSampleImage(true)}
                  className="text-sm text-blue-500 underline cursor-pointer text-center"
                >
                  View Sample CSV Format
                </p>
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={uploading}
                >
                  {uploading ? "Adding..." : "Add Students"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Toast Message */}
          {showToast && (
            <div
              className={`mt-6 alert ${
                toastType === "error" ? "alert-error" : "alert-success"
              }`}
            >
              <span>{toastMessage}</span>
            </div>
          )}

          {alreadyCreatedList.length > 0 && (
            <div className="mt-4">
              <h3 className="text-yellow-600 font-semibold mb-1">
                Already Created Students:
              </h3>
              <ul className="list-disc list-inside text-sm text-yellow-700">
                {alreadyCreatedList.map((stu, idx) => (
                  <li key={idx}>{stu.rollNumber} - {stu.email}</li>
                ))}
              </ul>
            </div>
          )}

          {failedList.length > 0 && (
            <div className="mt-4">
              <h3 className="text-red-600 font-semibold mb-1">
                Failed to Add:
              </h3>
              <ul className="list-disc list-inside text-sm text-red-700">
                {failedList.map((stu, idx) => (
                  <li key={idx}>
                    {stu.rollNumber || "Unknown"} - {stu.email || "Unknown"} 
                    {stu.reason ? ` (${stu.reason})` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {showSampleImage && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[1px]"
              onClick={() => setShowSampleImage(false)}
            >
              <div
                className="bg-white p-4 rounded-lg shadow-lg max-w-1/3 mx-4"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
              >
                <img
                  src="/addStudents_csv.png" 
                  alt="Sample CSV Format"
                />
                <p className="text-center text-sm text-gray-500 mt-2">Sample CSV Format</p>
              </div>
            </div>
          )}
          
        </div>
      </motion.div>
    </div>
  );
};

export default AddStudent;
