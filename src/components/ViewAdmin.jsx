import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { SUPERADMIN_BASE_URL } from "../utils/constants";

const ViewAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [limit] = useState(16);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${SUPERADMIN_BASE_URL}/admins?page=${page}&limit=${limit}`,
        { withCredentials: true }
      );
      setAdmins(res.data.admins || []);
      setTotalPages(res.data.totalPages || 1);
      setSearchResult(null);
    } catch (err) {
      toast.error("Failed to fetch admins.");
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchEmail.trim()) return;
    setSearchLoading(true);
    try {
      const res = await axios.get(
        `${SUPERADMIN_BASE_URL}/admin/${searchEmail.trim().toLowerCase()}`,
        { withCredentials: true }
      );
      setSearchResult(res.data.data);
    } catch (err) {
      toast.error("Admin not found.");
      setSearchResult(null);
    } finally {
      setSearchLoading(false);
    }
  };

    const handleDelete = async (email) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this admin?");
    if (!confirmDelete) return;
    try {
        await axios.delete(`${SUPERADMIN_BASE_URL}/admin/${email}`, {
        withCredentials: true,
        });
        toast.success("Admin deleted successfully");
        fetchAdmins(); // Refresh the list after deletion
    } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to delete admin");
    }
    };

  useEffect(() => {
    fetchAdmins();
  }, [page]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col items-center px-4 pt-6 pb-10 flex-grow">
      {/* Search */}
      <div className="w-full max-w-xl flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter Admin Email"
          className="input focus:outline-none focus:ring-1 focus:ring-primary flex-grow"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn btn-primary" onClick={handleSearch} disabled={searchLoading}>
          {searchLoading ? "Searching..." : "Search"}
        </button>
        {searchResult && (
          <button className="btn btn-secondary" onClick={() => {
            setSearchResult(null);
            setSearchEmail("");
          }}>
            Clear
          </button>
        )}
      </div>

      {/* Cards */}
      {loading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(searchResult ? [searchResult] : admins).map((admin, idx) => (
            <div
              key={idx}
              className="card bg-base-100 border border-base-300 shadow-md p-5 w-72"
            >
              <h2 className="text-lg font-semibold text-amber-600">{admin.name}</h2>
              <p className="text-sm font-bold text-neutral-500">{admin.email}</p>
              <p className="text-sm font-bold text-neutral-500">{admin.department}</p>
              <div className="flex gap-2 mt-4">
                <Link
                  to={`/superAdmin/edit-admin/${admin._id}`}
                  className="btn btn-sm btn-primary"
                >
                  Edit
                </Link>
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => handleDelete(admin.email)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!searchResult && (
        <div className="mt-8 join">
          <button
            className="join-item btn"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            « Prev
          </button>
          <button className="join-item btn">Page {page}</button>
          <button
            className="join-item btn"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next »
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewAdmin;
