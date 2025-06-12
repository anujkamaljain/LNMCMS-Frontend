import React from "react";
import { motion } from "motion/react";

const ManageSuperAdmin = () => {
  return (
    <motion.div
      className="flex flex-col min-h-screen py-3 px-5"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <motion.h1
        className="text-2xl mb-10 mt-5 underline"
        style={{ fontFamily: "'Bowlby One SC', sans-serif" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeIn" }}
      >
        Manage Super Admins
      </motion.h1>
      <main>
        <section className="bg-gray-600"> Hello</section>
      </main>

    </motion.div>
  );
};

export default ManageSuperAdmin;
