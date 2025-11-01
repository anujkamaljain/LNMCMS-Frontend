import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { SUPERADMIN_BASE_URL } from "../utils/constants";
import { useDialogStore } from "../stores/DialogStore";
import { useTranslation } from "../utils/useTranslation";

const DeleteStudent = () => {
  const [view, setView] = useState("single");
  const [rollNumber, setRollNumber] = useState("");
  const [file, setFile] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [notFoundList, setNotFoundList] = useState([]);
  const [failedList, setFailedList] = useState([]);
  const [showSampleImage, setShowSampleImage] = useState(false);
  const { t } = useTranslation();

  const handleDeleteSingle = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.get(
        `${SUPERADMIN_BASE_URL}/student/${rollNumber}`,
        { withCredentials: true }
      );
      const confirmed = window.confirm(
        `Are you sure you want to delete student: \n Name: ${result?.data?.data?.name} \n Roll Number: ${rollNumber} \n Email: ${result?.data?.data?.email}?`
      );
      if (!confirmed) {
        setDeleting(false);
        return;
      }
      setDeleting(true);
      const res = await axios.delete(
        `${SUPERADMIN_BASE_URL}/student/${rollNumber}`,
        { withCredentials: true }
      );
      setToastMessage("Student deleted successfully!");
      setToastType("success");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setRollNumber("");
      setDeleting(false);
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong!";
      setToastMessage(msg);
      setToastType("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
      setDeleting(false);
    }
  };

  const handleBulkDelete = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);

    try {
      setDeleting(true);
      setNotFoundList([]);
      setFailedList([]);

      const res = await axios.delete(`${SUPERADMIN_BASE_URL}/students`, {
        data: formData,
        withCredentials: true,
      });

      setToastMessage(res?.data?.message || "Bulk deletion completed.");
      setToastType("success");
      setShowToast(true);
      useDialogStore
        .getState()
        .setDialogData({
          notFoundList: res?.data?.notFound || [],
          failedList: res?.data?.failedDeletions || [],
          type: "delete",
        });
      setNotFoundList(res?.data?.notFound || []);
      setFailedList(res?.data?.failedDeletions || []);

      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong!";
      setToastMessage(msg);
      setToastType("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } finally {
      setDeleting(false);
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
          <h2 className="text-xl font-bold text-red-400 mb-7 text-center">
            {t("deleteStudent")}
          </h2>

          {/* Radio Switch */}
          <div className="flex justify-around mb-6">
            <label className="cursor-pointer label gap-2">
              <input
                type="radio"
                name="deleteMode"
                value="single"
                checked={view === "single"}
                onChange={() => {
                  setView("single");
                  setShowToast(false);
                  setNotFoundList([]);
                  setFailedList([]);
                }}
                className="radio radio-error"
              />
              <span className="label-text font-semibold">{t("single")}</span>
            </label>

            <label className="cursor-pointer label gap-2">
              <input
                type="radio"
                name="deleteMode"
                value="bulk"
                checked={view === "bulk"}
                onChange={() => {
                  setView("bulk");
                  setShowToast(false);
                }}
                className="radio radio-error"
              />
              <span className="label-text font-semibold">{t("bulk")} (CSV)</span>
            </label>
          </div>

          {/* Delete Form Transition */}
          <AnimatePresence mode="wait">
            {view === "single" ? (
              <motion.form
                key="delete-single"
                onSubmit={handleDeleteSingle}
                className="flex flex-col gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder={t("rollNumber")}
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="btn btn-error btn-block mt-2"
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : t("deleteStudent")}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="delete-bulk"
                onSubmit={handleBulkDelete}
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
                <div className="flex justify-around items-center gap-4 text-sm">
                  <p
                    onClick={() => setShowSampleImage(true)}
                    className="text-sm text-blue-500 underline cursor-pointer text-center"
                  >
                    {t("viewSampleCSV")}
                  </p>
                  <a
                    href="/sample_students_delete.csv"
                    download
                    className="text-blue-500 underline"
                  >
                    {t("downloadSampleCSV")}
                  </a>
                </div>
                <button
                  type="submit"
                  className="btn btn-error btn-block"
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : t("deleteStudents")}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {(notFoundList.length > 0 || failedList.length > 0) && (
            <div className="mt-6 space-y-4">
              {notFoundList.length > 0 && (
                <div className="border border-warning rounded-lg p-4 bg-yellow-50">
                  <h3 className="font-bold text-yellow-700 mb-2">
                    {t("studentsNotFound")}:
                  </h3>
                  <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
                    {notFoundList.map((s, idx) => (
                      <li key={idx}>
                        {s.rollNumber} – {s.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {failedList.length > 0 && (
                <div className="border border-error rounded-lg p-4 bg-red-50">
                  <h3 className="font-bold text-red-700 mb-2">
                    {t("failedDeletions")}:
                  </h3>
                  <ul className="list-disc list-inside text-sm text-red-800 space-y-1">
                    {failedList.map((s, idx) => (
                      <li key={idx}>
                        {s.rollNumber} – {s.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Toast */}
          {showToast && (
            <div className="flex mt-4">
              <div
                className={`alert w-full max-w-3/5 rounded-md shadow px-4 py-1 text-sm ${
                  toastType === "error"
                    ? "alert-error bg-red-100 text-red-700 border border-red-300"
                    : "alert-success bg-green-100 text-green-700 border border-green-300"
                }`}
              >
                <span className="text-sm">{toastMessage}</span>
              </div>
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
                <img src="/deleteStudents_csv.png" alt="Sample CSV Format" />
                <p className="text-center text-sm text-gray-500 mt-2">
                  {t("sampleCSVFormat")}
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteStudent;
