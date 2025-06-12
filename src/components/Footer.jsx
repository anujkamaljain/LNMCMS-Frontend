import React from "react";
import { motion } from "motion/react";

const Footer = () => {
  return (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5,  ease: "easeIn" }}>
      <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
        <aside>
          <p>
            <b>
              {" "}
              Copyright © {new Date().getFullYear()} LNMIIT | All right reserved
              | For web support, reach us at : web.support@lnmiit.ac.in{" "}
            </b>
          </p>
        </aside>
      </footer>
    </motion.div>
  );
};

export default Footer;
