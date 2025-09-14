import React, { useState } from "react";
import axios from "axios";
import { Department_List, SUPERADMIN_BASE_URL } from "../utils/constants";
import { motion } from "framer-motion";
import { useTranslation } from "../utils/useTranslation";

const AddAdmin = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("BH1");
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        SUPERADMIN_BASE_URL + "/admin",
        {
          name: fullName,
          email,
          password,
          department,
        },
        { withCredentials: true }
      );
      if (res.status === 201) {
        setToast({ message: "Admin added successfully!", type: "success" });
        setFullName("");
        setEmail("");
        setPassword("");
        setDepartment("BH1");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong!";
      setToast({ message: msg, type: "error" });
    } finally {
      setTimeout(() => setToast({ message: "", type: "" }), 3000);
    }
  };

  return (
    <motion.div
      className="flex justify-center flex-grow px-4 pt-16 pb-24"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="card w-full max-w-md bg-base-100 shadow-md p-6 border border-base-300 self-start">
        <h2 className="text-xl font-bold text-center mb-4 text-warning">
          {t("addAdmin")}
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="input mb-4 w-full">
            <input
              type="text"
              required
              placeholder={t("fullName")}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </label>

          <label className="input mb-4 w-full">
            <input
              type="email"
              placeholder={t("email")}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="input mb-3 w-full">
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder={t("password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <legend className="text-xs font-semibold m-1">{t("department")}</legend>
          <select
            className="select select-bordered w-full mb-3"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            {Department_List.map((dep, idx) => (
              <option key={idx} value={dep}>
                {dep}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            {t("showPassword")}
          </label>

          <button type="submit" className="btn btn-primary btn-block">
            {t("addAdmin")}
          </button>
        </form>

        {toast.message && (
          <div
            className={`mt-4 alert ${
              toast.type === "error" ? "alert-error" : "alert-success"
            }`}
          >
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AddAdmin;
