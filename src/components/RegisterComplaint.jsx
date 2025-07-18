import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Location_Wise_List, Department_Wise_List, STUDENT_BASE_URL} from "../utils/constants";

const RegisterComplaint = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    department: "",
    freeLocation: "",
    contact: "",
    availableFrom: "",
    availableTo: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };

    if (name === "contact") {
      if (!/^\d{10}$/.test(value)) {
        newErrors.contact = "Contact number must be a 10-digit number.";
      } else {
        delete newErrors.contact;
      }
    }

    setErrors(newErrors);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (!formData.location) newErrors.location = "Location tag is required";
    if (!formData.department) newErrors.department = "Department tag is required";
    if (!formData.freeLocation) newErrors.freeLocation = "Specific location is required";
    if (!formData.contact) newErrors.contact = "Contact number is required";
    else if (!/^\d{10}$/.test(formData.contact)) newErrors.contact = "Enter a valid 10-digit number";
    if (!formData.availableFrom) newErrors.availableFrom = "Available from time is required";
    if (!formData.availableTo) newErrors.availableTo = "Available to time is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  const tags = [formData.location, formData.department];
  const payload = {
    title: formData.title,
    description: formData.description,
    tags,
    location: formData.freeLocation,
    availableTimeFrom: formData.availableFrom,
    availableTimeTo: formData.availableTo,
    contactNumber: formData.contact,
  };

  try {
    await axios.post(`${STUDENT_BASE_URL}/complaint`, payload, { withCredentials: true });
    toast.success("Complaint registered successfully");

    // Reset form after submission
    setFormData({
      title: "",
      description: "",
      location: "",
      department: "",
      freeLocation: "",
      contact: "",
      availableFrom: "",
      availableTo: "",
    });
  } catch (err) {
    const message = err?.response?.data?.message || "Something went wrong while submitting.";
    toast.error(message);
    console.error("Submission error:", err.response?.data || err.message);
  }
};


  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-4 py-10 bg-base-200">
      <form
        className="w-full max-w-3xl p-8 bg-base-100 shadow-xl border border-base-300 rounded-xl space-y-5"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold text-center text-amber-600 mb-4 underline">Register a Complaint</h2>

        <div>
          <label className="label">Title</label>
          <input
            type="text"
            name="title"
            className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            name="description"
            className="textarea textarea-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            rows="4"
            value={formData.description}
            minLength="100"
            onChange={handleChange}
            placeholder="minimum 100 characters"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Location Tag</label>
            <select
              name="location"
              className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer"
              value={formData.location}
              onChange={handleChange}
            >
              <option value="">Select Location</option>
              {Location_Wise_List.map((loc, idx) => (
                <option key={idx} value={loc}>{loc}</option>
              ))}
            </select>
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>

          <div>
            <label className="label">Department Tag</label>
            <select
              name="department"
              className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              {Department_Wise_List.map((dep, idx) => (
                <option key={idx} value={dep}>{dep}</option>
              ))}
            </select>
            {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
          </div>
        </div>

        <div>
          <label className="label">Specific Location</label>
          <input
            type="text"
            name="freeLocation"
            className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            value={formData.freeLocation}
            onChange={handleChange}
          />
          {errors.freeLocation && <p className="text-red-500 text-sm mt-1">{errors.freeLocation}</p>}
        </div>

        <div>
          <label className="label">Contact Number</label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            onBlur={handleBlur}
            className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Enter 10-digit contact number"
          />
          {errors.contact && (
            <p className="text-red-500 text-sm mt-1">{errors.contact}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Available From</label>
            <input
              type="time"
              name="availableFrom"
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              value={formData.availableFrom}
              onChange={handleChange}
            />
            {errors.availableFrom && <p className="text-red-500 text-sm mt-1">{errors.availableFrom}</p>}
          </div>

          <div>
            <label className="label">Available To</label>
            <input
              type="time"
              name="availableTo"
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              value={formData.availableTo}
              onChange={handleChange}
            />
            {errors.availableTo && <p className="text-red-500 text-sm mt-1">{errors.availableTo}</p>}
          </div>
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary px-10">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default RegisterComplaint;
