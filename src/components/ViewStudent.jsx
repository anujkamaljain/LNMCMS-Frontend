import React, { useEffect, useState } from "react";
import axios from "axios";
import { SUPERADMIN_BASE_URL } from "../utils/constants";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchRoll, setSearchRoll] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [limit] = useState(20); // 4 columns x 5 rows
  const [pageInput, setPageInput] = useState(1); // for editable input

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${SUPERADMIN_BASE_URL}/students?page=${page}&limit=${limit}`,
        { withCredentials: true }
      );
      setStudents(res.data.students || []);
      setTotalPages(res.data.totalPages || 1);
      setSearchResult(null);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchRoll.trim()) return;
    setSearchLoading(true);
    try {
      const res = await axios.get(
        `${SUPERADMIN_BASE_URL}/student/${searchRoll.trim().toUpperCase()}`,
        { withCredentials: true }
      );
      setSearchResult(res.data.data);
    } catch (err) {
      console.error("Search failed:", err);
      toast.error("Student not found.");
      setSearchResult(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const handlePageInputChange = (e) => {
    const value = Number(e.target.value);
    setPageInput(value);
  };

  const validateAndSetPage = () => {
    if (pageInput >= 1 && pageInput <= totalPages) {
      setPage(pageInput);
    } else {
      toast.error("Page number does not exist!");
      setPageInput(page); // Reset input to current page
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page]);

  return (
    <div className="flex flex-col items-center px-4 pt-6 pb-10 flex-grow">
      {/* Search */}
      <div className="w-full max-w-xl flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter Roll Number"
          className="input input-bordered flex-grow focus:outline-none"
          value={searchRoll}
          onChange={(e) => setSearchRoll(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
            e.preventDefault(); // optional: prevent default form submission behavior
            handleSearch();
            }
          }}
        />
        <button className="btn btn-primary" onClick={handleSearch} disabled={searchLoading}>
          {searchLoading ? "Searching..." : "Search"}
        </button>

        {searchResult && (
          <button
            className="btn btn-secondary"
            onClick={() => {
              setSearchResult(null);
              setSearchRoll("");
            }}
          >
            Clear
          </button>
        )}
      </div>

      {searchLoading ? (
        <span className="loading loading-spinner loading-md text-primary mb-6"></span>
      ) : null}

      {/* Cards */}
      {loading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(searchResult ? [searchResult] : students).map((student, idx) => (
            <div
              key={idx}
              className="card bg-base-100 shadow-lg border border-base-300 p-4 w-72 transition hover:scale-[1.02]"
            >
              <h2 className="text-lg font-semibold text-amber-600">
                {student.name}
              </h2>
              <p className="text-sm text-neutral-500 font-bold">
                {student.email}
              </p>
              <p className="text-sm text-neutral-500 font-bold">
                {student.rollNumber}
              </p>
               <Link
                to={`/superAdmin/edit-student/${student._id}`}
                className="btn btn-sm btn-outline btn-primary mt-4"
              >
                Edit
              </Link>
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
            onClick={() => {
              setPage(page - 1);
              setPageInput(page - 1);
            }}
          >
            « Prev
          </button>

          <input
            type="number"
            className="input input-bordered join-item w-24 text-center focus:outline-none"
            min={1}
            max={totalPages}
            value={pageInput}
            onChange={handlePageInputChange}
            onBlur={validateAndSetPage}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                validateAndSetPage();
              }
            }}
          />

          <button
            className="join-item btn"
            disabled={page === totalPages}
            onClick={() => {
              setPage(page + 1);
              setPageInput(page + 1);
            }}
          >
            Next »
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewStudents;
