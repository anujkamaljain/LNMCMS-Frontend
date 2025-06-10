import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">AdminDashboard</main>
      <Link to={"/admin/complaints"}>
      <p>complaints</p>
      </Link>
    </div>
  );
};

export default AdminDashboard;
