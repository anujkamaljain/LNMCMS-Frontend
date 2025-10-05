import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { createPortal } from "react-dom";
import { useTranslation } from "../utils/useTranslation";

const StarRatingModal = ({ isOpen, onClose, onRate, complaintTitle }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const { t } = useTranslation();

  const handleStarClick = (starRating) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating) => {
    setHoveredRating(starRating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmit = () => {
    if (rating > 0) {
      onRate(rating);
      setRating(0);
      setHoveredRating(0);
    }
  };

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    onClose();
  };

  const StarIcon = ({ filled, size = "w-6 h-6 sm:w-8 sm:h-8" }) => (
    <svg
      className={`${size} transition-all duration-200 ease-out ${
        filled 
          ? "text-yellow-400 drop-shadow-lg" 
          : "text-gray-300 hover:text-yellow-200"
      } cursor-pointer filter drop-shadow-sm`}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

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
            className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/30 to-indigo-900/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          
          <motion.div
            className="relative bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-3xl p-6 sm:p-8 mx-4 max-w-md w-full shadow-2xl border border-gray-100 z-[10000]"
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
                className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {t("rateYourExperience")}
              </motion.h2>

              
              <motion.div
                className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 mb-6 border border-green-100"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-gray-700 text-xs sm:text-sm font-medium">
                  "{complaintTitle}"
                </p>
              </motion.div>

              
              <motion.div
                className="flex justify-center gap-3 mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-100"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= (hoveredRating || rating);
                  return (
                    <motion.div
                      key={star}
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => handleStarHover(star)}
                      onMouseLeave={handleStarLeave}
                      whileHover={{ 
                        scale: 1.2, 
                        rotate: 5,
                        transition: { 
                          type: "spring", 
                          stiffness: 400, 
                          damping: 25,
                          duration: 0.2 
                        }
                      }}
                      whileTap={{ 
                        scale: 0.9,
                        transition: { 
                          type: "spring", 
                          stiffness: 600, 
                          damping: 30,
                          duration: 0.1 
                        }
                      }}
                      className="p-1 rounded-full hover:bg-yellow-100"
                    >
                      <StarIcon filled={isFilled} />
                    </motion.div>
                  );
                })}
              </motion.div>

             
              <motion.div
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {rating > 0 ? (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border border-green-200">
                    <span className="text-green-700 font-semibold text-sm">
                      ⭐ {rating} {rating === 1 ? t("star") : t("stars")} - {t("thankYou")}
                    </span>
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm font-medium">
                    {t("pleaseRateOutOf5")}
                  </p>
                )}
              </motion.div>

              
              <motion.button
                onClick={handleSubmit}
                disabled={rating === 0}
                className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-300 ${
                  rating > 0
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-1 border border-green-300"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed rounded-2xl"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={rating > 0 ? { scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" } : {}}
                whileTap={rating > 0 ? { scale: 0.95 } : {}}
              >
                {rating > 0 ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {t("submitRating")}
                  </span>
                ) : (
                  t("submitRating")
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

export default StarRatingModal;
