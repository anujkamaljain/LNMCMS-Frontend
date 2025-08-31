import React from "react";
import { motion } from "motion/react";

const Discover = () => {
  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-4 py-10 bg-base-200">
      <motion.h1
        className="text-4xl text-amber-400 text-center"
        style={{ fontFamily: "'Bowlby One SC', sans-serif" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        Discover section coming soon!
      </motion.h1>
    </div>
  );
};

export default Discover;
