import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Location_Wise_List,
  Department_Wise_List,
  STUDENT_BASE_URL,
  BASE_URL,
} from "../utils/constants";
import { useDispatch } from "react-redux";
import { appendComplaint } from "../utils/pendingComplaintsSlice";
import { useTranslation } from "../utils/useTranslation";

const RegisterComplaint = () => {
  const [selected, setSelected] = useState("private");
  const [sbtBtnTxt, setsbtBtnTxt] = useState("Submit");
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
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const { t } = useTranslation();

  const getCharacterCount = (text) => {
    return text.length;
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file count
    if (files.length > 3) {
      toast.error("Maximum 3 files allowed");
      return;
    }

    // Validate file types and sizes
    const validFiles = [];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'video/mp4', 'video/mov', 'video/avi'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    files.forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Invalid file type: ${file.name}. Only images (JPEG, PNG, GIF) and videos (MP4, MOV, AVI) are allowed.`);
        return;
      }
      
      if (file.size > maxSize) {
        toast.error(`File too large: ${file.name}. Maximum size is 10MB.`);
        return;
      }
      
      validFiles.push(file);
    });

    setSelectedFiles(validFiles);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return [];

    setUploadingFiles(true);
    const formData = new FormData();
    
    selectedFiles.forEach(file => {
      formData.append('media', file);
    });

    try {
      const response = await axios.post(`${BASE_URL}/media/upload`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.data.files || [];
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to upload files";
      toast.error(message);
      throw error;
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle title character limit
    if (name === "title") {
      const charCount = getCharacterCount(value);
      if (charCount > 20) {
        // Don't allow more than 20 characters
        return;
      }
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };

    if (name === "title") {
      const charCount = getCharacterCount(value);
      if (charCount > 0 && charCount < 5) {
        newErrors.title = "Title must have at least 5 characters";
      } else if (charCount > 20) {
        newErrors.title = "Title cannot exceed 20 characters";
      } else {
        delete newErrors.title;
      }
    }

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
    if (!formData.title) {
      newErrors.title = "Title is required";
    } else {
      const charCount = getCharacterCount(formData.title);
      if (charCount < 5) {
        newErrors.title = "Title must have at least 5 characters";
      } else if (charCount > 20) {
        newErrors.title = "Title cannot exceed 20 characters";
      }
    }
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.location) newErrors.location = "Location tag is required";
    if (!formData.department)
      newErrors.department = "Department tag is required";
    if (!formData.freeLocation)
      newErrors.freeLocation = "Specific location is required";
    if (!formData.contact) newErrors.contact = "Contact number is required";
    else if (!/^\d{10}$/.test(formData.contact))
      newErrors.contact = "Enter a valid 10-digit number";
    if (!formData.availableFrom)
      newErrors.availableFrom = "Available from time is required";
    if (!formData.availableTo)
      newErrors.availableTo = "Available to time is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setsbtBtnTxt("Submitting...");
    
    try {
      // Upload files first if any
      let uploadedMedia = [];
      if (selectedFiles.length > 0) {
        uploadedMedia = await uploadFiles();
      }

      const tags = [formData.location, formData.department];
      const payload = {
        title: formData.title,
        description: formData.description,
        tags,
        location: formData.freeLocation,
        availableTimeFrom: formData.availableFrom,
        availableTimeTo: formData.availableTo,
        contactNumber: formData.contact,
        visibility: selected,
        media: uploadedMedia
      };

      const res = await axios.post(`${STUDENT_BASE_URL}/complaint`, payload, {
        withCredentials: true,
      });
      dispatch(appendComplaint(res.data.data));
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
      setSelectedFiles([]);
      setsbtBtnTxt("Submit");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Something went wrong while submitting.";
      toast.error(message);
      setsbtBtnTxt("Submit");
      console.error("Submission error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-4 py-10 bg-base-200">
      <form
        className="w-full max-w-3xl p-8 bg-base-100 shadow-xl border border-base-300 rounded-xl space-y-5"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold text-center text-amber-600 mb-4 underline">
          {t("registerNewComplaint")}
        </h2>

        <div className="flex justify-around mb-6 mt-10">
            <label className="cursor-pointer label gap-2">
              <input
              type="radio"
              value="private"
              checked={selected === "private"}
              onChange={(e) => setSelected(e.target.value)}
              className="radio radio-secondary text-amber-600"
            />
            <div className="tooltip" data-tip="Complaint won't be visible in Discover section!">
            <span className="label-text font-semibold">{t("private")}</span>
            </div>
          </label>

          <label className="cursor-pointer label gap-2">
              <input
              type="radio"
              value="public"
              checked={selected === "public"}
              onChange={(e) => setSelected(e.target.value)}
              className="radio radio-secondary text-amber-600"
            />
            <div className="tooltip" data-tip="Complaint will be visible in Discover section!">
            <span className="label-text font-semibold">{t("public")}</span>
            </div>
          </label>
        </div>

         <div>
           <label className="label">{t("complaintTitle")}</label>
           <div className="relative">
             <input
               type="text"
               name="title"
               className="input input-bordered w-full pr-16 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
               value={formData.title}
               onChange={handleChange}
               onBlur={handleBlur}
               placeholder="Enter 5-20 characters for the title"
             />
             <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-700 pointer-events-none z-10">
               {getCharacterCount(formData.title)}/20
             </span>
           </div>
           {errors.title && (
             <p className="text-red-500 text-sm mt-1">{errors.title}</p>
           )}
         </div>

        <div>
          <label className="label">{t("complaintDescription")}</label>
          <div className="relative">
            <textarea
              name="description"
              className="textarea textarea-bordered w-full pr-14 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              rows="4"
              value={formData.description}
              minLength="45"
              maxLength={150}
              onChange={handleChange}
              placeholder="Minimum 45 Characters required"
            />
            <span className="absolute bottom-2 right-3 text-xs text-gray-500">
              {formData.description.length}/150
            </span>
          </div>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">{t("location")}</label>
            <select
              name="location"
              className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer"
              value={formData.location}
              onChange={handleChange}
            >
              <option value="">Select Location</option>
              {Location_Wise_List.map((loc, idx) => (
                <option key={idx} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location}</p>
            )}
          </div>

          <div>
            <label className="label">{t("department")}</label>
            <select
              name="department"
              className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              {Department_Wise_List.map((dep, idx) => (
                <option key={idx} value={dep}>
                  {dep}
                </option>
              ))}
            </select>
            {errors.department && (
              <p className="text-red-500 text-sm mt-1">{errors.department}</p>
            )}
          </div>
        </div>

        <div>
          <label className="label">{t("specificLocation")}</label>
          <input
            type="text"
            name="freeLocation"
            className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            value={formData.freeLocation}
            onChange={handleChange}
            maxLength={50}
          />
          {errors.freeLocation && (
            <p className="text-red-500 text-sm mt-1">{errors.freeLocation}</p>
          )}
        </div>

        <div>
          <label className="label">{t("contactNumber")}</label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            onBlur={handleBlur}
            onInput={(e) => {
              // Remove any non-digit characters
              e.target.value = e.target.value.replace(/\D/g, "");
              // Limit to 10 digits
              if (e.target.value.length > 10) {
                e.target.value = e.target.value.slice(0, 10);
              }
            }}
            maxLength="10"
            className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Enter 10-digit contact number"
          />
          {errors.contact && (
            <p className="text-red-500 text-sm mt-1">{errors.contact}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">{t("availableFrom")}</label>
            <input
              type="time"
              name="availableFrom"
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              value={formData.availableFrom}
              onChange={handleChange}
            />
            {errors.availableFrom && (
              <p className="text-red-500 text-sm mt-1">
                {errors.availableFrom}
              </p>
            )}
          </div>

          <div>
            <label className="label">{t("availableTo")}</label>
            <input
              type="time"
              name="availableTo"
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              value={formData.availableTo}
              onChange={handleChange}
            />
            {errors.availableTo && (
              <p className="text-red-500 text-sm mt-1">{errors.availableTo}</p>
            )}
          </div>
        </div>

        {/* File Upload Section */}
        <div>
          <label className="label">Upload Media Files (Optional)</label>
          <div className="space-y-3">
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full"
              disabled={uploadingFiles}
            />
            <p className="text-sm text-gray-600">
              Maximum 3 files, 10MB each. Supported formats: Images (JPEG, PNG, GIF) and Videos (MP4, MOV, AVI)
            </p>
            
            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected Files:</p>
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">
                        {file.type.startsWith('image/') ? '🖼️' : '🎥'}
                      </span>
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                      disabled={uploadingFiles}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {uploadingFiles && (
              <div className="flex items-center space-x-2 text-blue-600">
                <span className="loading loading-spinner loading-sm"></span>
                <span className="text-sm">Uploading files...</span>
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="btn btn-primary px-10"
            disabled={sbtBtnTxt === "Submitting..." || uploadingFiles}
          >
            {sbtBtnTxt === "Submit" ? t("submit") : sbtBtnTxt}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterComplaint;
