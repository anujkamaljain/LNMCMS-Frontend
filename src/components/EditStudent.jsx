import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { SUPERADMIN_BASE_URL } from "../utils/constants";

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(false);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    rollNumber: "",
  });

  const fetchStudent = async () => {
    try {
      const res = await axios.get(`${SUPERADMIN_BASE_URL}/students?page=1&limit=1000`, {
        withCredentials: true,
      });
      const match = res.data.students.find((s) => s._id === id);
      if (!match) {
        toast.error("Student not found.");
        navigate("/superAdmin/view-student");
        return;
      }
      setStudent(match);
      setForm({
        name: match.name || "",
        email: match.email || "",
        rollNumber: match.rollNumber || "",
      });
    } catch (err) {
      toast.error("Failed to fetch student.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

    const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
        const res = await axios.patch(
        `${SUPERADMIN_BASE_URL}/student/${id}`,
        form,
        { withCredentials: true }
        );
        toast.success("Student updated successfully");
        navigate("/superAdmin/view-student");
    } catch (err) {
        if (err?.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        navigate("/login");
        } else {
        toast.error(err?.response?.data?.message || "Update failed");
        }
    } finally {
        setUpdating(false);
    }};

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const isChanged = 
  form.name !== student?.name || 
  form.email !== student?.email || 
  form.rollNumber !== student?.rollNumber;

  return (
    <div className="flex justify-center items-center flex-grow px-4">
      <div className="card w-full max-w-xl bg-base-100 shadow-lg border border-base-300 p-6">
        <h2 className="text-2xl font-bold text-center text-amber-600 mb-6">
          Edit Student Details
        </h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Full Name"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Email"
            required
          />
          <input
            type="text"
            name="rollNumber"
            value={form.rollNumber}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Roll Number"
            required
          />
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={!isChanged || updating}
           >
            {updating ? "Updating..." : "Update"}
           </button>
        </form>
      </div>
    </div>
  );
};

export default EditStudent;
