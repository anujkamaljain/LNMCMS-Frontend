import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { createPortal } from "react-dom";
import { useTranslation } from "../utils/useTranslation";

const RejectModal = ({ isOpen, onClose, onReject, complaintTitle }) => {
  const [rejectionReason, setRejectionReason] = useState("");
  const [submitBtnTxt, setSubmitBtnTxt] = useState("Submit Rejection");
  const { t } = useTranslation();

  const charCount = rejectionReason.trim().length;
  const minChars = 10;
  const maxChars = 200;
  const isValid = charCount >= minChars && charCount <= maxChars;

  const handleSubmit = async () => {
    if (isValid && submitBtnTxt === "Submit Rejection") {
      setSubmitBtnTxt("Submitting...");
      try {
        await onReject(rejectionReason.trim());
        setRejectionReason("");
      } catch (error) {
        // Handle error if needed
      } finally {
        setSubmitBtnTxt("Submit Rejection");
      }
    }
  };

  const handleClose = () => {
    setRejectionReason("");
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-orange-900/30 to-red-900/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          
          <motion.div
            className="relative bg-gradient-to-br from-white via-gray-50 to-red-50 rounded-3xl p-6 sm:p-8 mx-4 max-w-md w-full shadow-2xl border border-gray-100 z-[10000]"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.3 
            }}
            style={{ position: 'relative', zIndex: 10000 }}
          >
            
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-1 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            
            <div className="text-center">
              
              <motion.h2
                className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {t("rejectComplaint")}
              </motion.h2>

              
              <motion.div
                className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-3 mb-6 border border-red-100"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-gray-700 text-xs sm:text-sm font-medium">
                  "{complaintTitle}"
                </p>
              </motion.div>

              
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-left text-sm font-semibold text-gray-700 mb-2">
                  {t("rejectionReason")} <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder={t("enterRejectionReason")}
                  className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-sm"
                  rows="5"
                  maxLength={maxChars}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className={`text-xs ${charCount < minChars ? 'text-red-500' : isValid ? 'text-green-600' : 'text-gray-500'}`}>
                    {charCount < minChars 
                      ? `${t("minimum")} ${minChars} ${t("charactersRequired")}`
                      : isValid
                      ? `${t("valid")}`
                      : `${t("maximum")} ${maxChars} ${t("characters")}`
                    }
                  </span>
                  <span className={`text-xs font-medium ${charCount > maxChars ? 'text-red-500' : 'text-gray-500'}`}>
                    {charCount}/{maxChars}
                  </span>
                </div>
              </motion.div>

              
              <motion.button
                onClick={handleSubmit}
                disabled={!isValid || submitBtnTxt === "Submitting..."}
                className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-300 ${
                  isValid && submitBtnTxt === "Submit Rejection"
                    ? "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-1 border border-red-300"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed rounded-2xl"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={isValid && submitBtnTxt === "Submit Rejection" ? { scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" } : {}}
                whileTap={isValid && submitBtnTxt === "Submit Rejection" ? { scale: 0.95 } : {}}
              >
                {submitBtnTxt === "Submitting..." ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="loading loading-spinner loading-sm"></span>
                    {submitBtnTxt}
                  </span>
                ) : isValid ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    {t("submitRejection")}
                  </span>
                ) : (
                  t("submitRejection")
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default RejectModal;

