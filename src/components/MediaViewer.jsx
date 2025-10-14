import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MediaViewer = ({ isOpen, onClose, mediaFiles }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? mediaFiles.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === mediaFiles.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft") handlePrevious();
    if (e.key === "ArrowRight") handleNext();
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, currentIndex]);

  if (!isOpen || !mediaFiles || mediaFiles.length === 0) return null;

  const currentFile = mediaFiles[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <motion.div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{ 
              position: 'relative',
              zIndex: 10000,
              pointerEvents: 'auto'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gray-100 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                {currentFile.filename} ({currentIndex + 1} of {mediaFiles.length})
              </h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Media Content */}
            <div className="relative">
              {currentFile.type === "image" ? (
                <img
                  src={currentFile.url}
                  alt={currentFile.filename}
                  className="max-w-full max-h-[70vh] object-contain mx-auto"
                />
              ) : (
                <video
                  src={currentFile.url}
                  controls
                  className="max-w-full max-h-[70vh] mx-auto"
                >
                  Your browser does not support the video tag.
                </video>
              )}

              {/* Navigation Arrows */}
              {mediaFiles.length > 1 && (
                <>
                  <button
                    onClick={handlePrevious}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    ←
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    →
                  </button>
                </>
              )}
            </div>

            {/* File List */}
            {mediaFiles.length > 1 && (
              <div className="p-4 bg-gray-50 border-t">
                <div className="flex gap-2 overflow-x-auto">
                  {mediaFiles.map((file, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                        index === currentIndex
                          ? "border-blue-500"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {file.type === "image" ? (
                        <img
                          src={file.url}
                          alt={file.filename}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs">📹</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* File Info */}
            <div className="p-4 bg-gray-100 border-t text-sm text-gray-600">
              <div className="flex justify-between items-center">
                <span>
                  <strong>Type:</strong> {currentFile.type}
                </span>
                <span>
                  <strong>Size:</strong> {(currentFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
                <span>
                  <strong>Uploaded:</strong> {new Date(currentFile.uploadedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MediaViewer;