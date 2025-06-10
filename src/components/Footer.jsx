import React from "react";

const Footer = () => {
  return (
    <div>
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
    </div>
  );
};

export default Footer;
