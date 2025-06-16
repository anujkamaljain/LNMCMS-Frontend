import React from "react";
import { motion } from "motion/react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ViewStudentProfile = () => {
  const user = useSelector((store) => store?.auth?.user);

  return (
    <motion.div
      className="flex-1 py-3 px-5"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, ease: "easeIn" }}
    >
      <motion.h1
        className="text-2xl mb-10 mt-5 text-amber-400 text-center border"
        style={{ fontFamily: "'Bowlby One SC', sans-serif" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeIn" }}
      >
        Your Profile
      </motion.h1>
      <main>
        <section className="p-10">
          <div className="flex items-center justify-center">
            <div className="card w-96 bg-base-100 border border-base hover:shadow-md shadow-orange-500">
              <div className="card-body">
                <span className="badge badge-xs badge-warning mb-3">
                  Your Details
                </span>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Name :</legend>
                  <input
                    type="text"
                    className="input hover:-translate-y-0.5 transition-all duration-100 ease-in"
                    value={user.name}
                    disabled
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Email :</legend>
                  <input
                    type="email"
                    className="input hover:-translate-y-0.5 transition-all duration-100 ease-in"
                    value={user.email}
                    disabled
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Roll Number :</legend>
                  <input
                    type="text"
                    className="input hover:-translate-y-0.5 transition-all duration-100 ease-in"
                    value={user.rollNumber}
                    disabled
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Role :</legend>
                  <input
                    type="text"
                    className="input hover:-translate-y-0.5 transition-all duration-100 ease-in"
                    value={user.role}
                    disabled
                  />
                </fieldset>
                <Link
                  to="/student/change-password"
                  className="link link-warning text-center"
                >
                  Change Password
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </motion.div>
  );
};

export default ViewStudentProfile;
