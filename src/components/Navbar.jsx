import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../utils/themeSlice";
import { Link, useNavigate } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { logout } from "../utils/authSlice";
import { removeaccComplaints } from "../utils/acceptedComplaintsSlice";
import { removeresComplaint } from "../utils/resolvedComplaintsSlice";
import { clearComplaints } from "../utils/pendingComplaintsSlice";

const Navbar = () => {
  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((store) => store.auth);

  const handleClick = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      dispatch(logout());
      dispatch(removeaccComplaints());
      dispatch(removeresComplaint());
      dispatch(clearComplaints());
      navigate("/login");
    }
  };

  const closeDrawer = () => {
    const drawerCheckbox = document.getElementById("my-drawer");
    if (drawerCheckbox) drawerCheckbox.checked = false;
    const openDetails = document.querySelectorAll(".drawer-side details[open]");
    openDetails.forEach((detail) => detail.removeAttribute("open"));
  };

  const handleSummaryClick = (e) => {
    const currentDetails = e.target.closest("details");
    const allDetails = document.querySelectorAll(".drawer-side details");
    allDetails.forEach((detail) => {
      if (detail !== currentDetails) {
        detail.removeAttribute("open");
      }
    });
  };

  return (
    <div
      className={`navbar h-18 flex justify-between sticky top-0 p-0 ${
        isAuthenticated ? "bg-base-100" : "bg-base-200"
      } overflow-hidden z-10 border-b-1 border-base-300`}
    >
      <div className="flex justify-between items-center">
        <label className="swap swap-rotate ml-2 hover:shadow-xs">
          <input
            type="checkbox"
            className="theme-controller"
            onChange={() => dispatch(toggleTheme())}
            checked={theme === "black"}
          />
          {/* sun icon */}
          <svg
            className="swap-off h-8 w-8 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>

          {/* moon icon */}
          <svg
            className="swap-on h-8 w-8 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        </label>
        {isAuthenticated && (
          <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
              <label
                htmlFor="my-drawer"
                className="btn bg-transparent border-0 drawer-button shadow-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-8 w-8 stroke-current"
                >
                  {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>{" "}
                </svg>
              </label>
            </div>
            <div className="drawer-side">
              <label
                htmlFor="my-drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                <li className="text-lg font-semibold hover:bg-white/10 rounded-xl transition px-3 py-2 mb-3">
                  <Link
                    to={
                      user?.role && isAuthenticated
                        ? `/${user.role}/dashboard`
                        : "/login"
                    }
                    onClick={closeDrawer}
                    className="flex items-center gap-3"
                  >
                    <svg
                      className="w-5 h-5 stroke-current"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M3 12h18M3 6h18M3 18h18"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Dashboard
                  </Link>
                </li>
                {user?.role === "superAdmin" ? (
                  <div>
                    {" "}
                    <li className="text-lg font-semibold hover:bg-neutral/10 rounded-xl transition px-3 py-2 mb-5">
                      <Link
                        className="flex items-center gap-3"
                        onClick={closeDrawer}
                        to={
                          user?.role === "superAdmin"
                            ? "/superAdmin/manage-superAdmins"
                            : "/login"
                        }
                      >
                        Add Super Admin
                      </Link>
                    </li>
                    {/* Manage Admins Dropdown */}
                    <li className="text-lg font-semibold">
                      <details className="px-3 py-2 rounded-xl hover:bg-neutral/10 transition duration-200 cursor-pointer mb-5">
                        <summary
                          className="flex items-center"
                          onClick={handleSummaryClick}
                        >
                          Manage Admins
                        </summary>
                        <ul className="pl-3 pt-2 space-y-1">
                          <li>
                            <Link
                              to="/superAdmin/add-admin"
                              onClick={closeDrawer}
                              className="block px-2 py-2 rounded-lg hover:bg-neutral/15 transition duration-200"
                            >
                              Add Admin
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/superAdmin/view-admin"
                              onClick={closeDrawer}
                              className="block px-2 py-2 rounded-lg hover:bg-neutral/15 transition duration-200"
                            >
                              View Admin
                            </Link>
                          </li>
                        </ul>
                      </details>
                    </li>
                    {/* Manage Students Dropdown */}
                    <li className="text-lg font-semibold">
                      <details className="px-3 py-2 rounded-xl hover:bg-neutral/10 transition duration-200 cursor-pointer mb-5">
                        <summary
                          className="flex items-center"
                          onClick={handleSummaryClick}
                        >
                          Manage Students
                        </summary>
                        <ul className="pl-3 pt-2 space-y-1">
                          <li>
                            <Link
                              to="/superAdmin/add-student"
                              onClick={closeDrawer}
                              className="block px-2 py-2 rounded-lg hover:bg-neutral/15 transition duration-200"
                            >
                              Add Student
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/superAdmin/delete-student"
                              onClick={closeDrawer}
                              className="block px-2 py-2 rounded-lg hover:bg-neutral/15 transition duration-200"
                            >
                              Delete Student
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/superAdmin/view-student"
                              onClick={closeDrawer}
                              className="block px-2 py-2 rounded-lg hover:bg-neutral/15 transition duration-200"
                            >
                              View Students
                            </Link>
                          </li>
                        </ul>
                      </details>
                    </li>
                    <li className="text-lg font-semibold hover:bg-neutral/10 rounded-xl transition px-3 py-2 mb-5">
                      <Link
                        className="flex items-center gap-3"
                        onClick={closeDrawer}
                        to={
                          user?.role === "superAdmin"
                            ? "/superAdmin/manage-profile"
                            : "/login"
                        }
                      >
                        Manage Your Profile
                      </Link>
                    </li>{" "}
                  </div>
                ) : user?.role === "admin" ? (
                  <div>
                    {" "}
                    <li className="text-lg font-semibold hover:bg-white/10 rounded-xl transition px-3 py-2 mb-5">
                      <Link
                        className="flex items-center gap-3"
                        onClick={closeDrawer}
                        to={
                          user?.role === "admin"
                            ? "/admin/pending-complaints"
                            : "/login"
                        }
                      >
                        Pending Complaints
                      </Link>
                    </li>
                    <li className="text-lg font-semibold hover:bg-white/10 rounded-xl transition px-3 py-2 mb-5">
                      <Link
                        className="flex items-center gap-3"
                        onClick={closeDrawer}
                        to={
                          user?.role === "admin"
                            ? "/admin/accepted-complaints"
                            : "/login"
                        }
                      >
                        Accepted Complaints
                      </Link>
                    </li>
                    <li className="text-lg font-semibold hover:bg-white/10 rounded-xl transition px-3 py-2 mb-5">
                      <Link
                        className="flex items-center gap-3"
                        onClick={closeDrawer}
                        to={
                          user?.role === "admin"
                            ? "/admin/resolved-complaints"
                            : "/login"
                        }
                      >
                        Resolved Complaints
                      </Link>
                    </li>
                    <li className="text-lg font-semibold hover:bg-white/10 rounded-xl transition px-3 py-2 mb-5">
                      <Link
                        className="flex items-center gap-3"
                        onClick={closeDrawer}
                        to={
                          user?.role === "admin"
                            ? "/admin/view-profile"
                            : "/login"
                        }
                      >
                        View Your Profile
                      </Link>
                    </li>{" "}
                  </div>
                ) : user?.role === "student" ? (
                  <div>
                    <li className="text-lg font-semibold hover:bg-neutral/10 rounded-xl transition px-3 py-2 mb-5">
                      <Link
                        className="flex items-center gap-3"
                        onClick={closeDrawer}
                        to={
                          user?.role === "student"
                            ? "/student/complaints/discover"
                            : "/login"
                        }
                      >
                        Discover Complaints
                      </Link>
                    </li>{" "}
                    <li className="text-lg font-semibold hover:bg-neutral/10 rounded-xl transition px-3 py-2 mb-5">
                      <Link
                        className="flex items-center gap-3"
                        onClick={closeDrawer}
                        to={
                          user?.role === "student"
                            ? "/student/register-complaint"
                            : "/login"
                        }
                      >
                        Register Complaint
                      </Link>
                    </li>
                    {/* Complaints Dropdown */}
                    <li className="text-lg font-semibold">
                      <details className="px-3 py-2 rounded-xl hover:bg-neutral/10 transition duration-200 cursor-pointer mb-5 ">
                        <summary
                          className="flex items-center"
                          onClick={handleSummaryClick}
                        >
                          Complaints
                        </summary>
                        <ul className="pl-3 pt-2 space-y-1">
                          <li>
                            <Link
                              to={
                                user?.role === "student"
                                  ? "/student/pending-complaints"
                                  : "/login"
                              }
                              onClick={closeDrawer}
                              className="block px-2 py-2 rounded-lg hover:bg-neutral/15 transition duration-200"
                            >
                              Pending Complaints
                            </Link>
                          </li>
                          <li>
                            <Link
                              to={
                                user?.role === "student"
                                  ? "/student/accepted-complaints"
                                  : "/login"
                              }
                              onClick={closeDrawer}
                              className="block px-2 py-2 rounded-lg hover:bg-neutral/15 transition duration-200"
                            >
                              Accepted Complaints
                            </Link>
                          </li>
                          <li>
                            <Link
                              to={
                                user?.role === "student"
                                  ? "/student/resolved-complaints"
                                  : "/login"
                              }
                              onClick={closeDrawer}
                              className="block px-2 py-2 rounded-lg hover:bg-neutral/15 transition duration-200"
                            >
                              Resolved Complaints
                            </Link>
                          </li>
                        </ul>
                      </details>
                    </li>
                    <li className="text-lg font-semibold hover:bg-neutral/10 rounded-xl transition px-3 py-2 mb-5">
                      <Link
                        className="flex items-center gap-3"
                        onClick={closeDrawer}
                        to={
                          user?.role === "student"
                            ? "/student/view-profile"
                            : "/login"
                        }
                      >
                        View Your Profile
                      </Link>
                    </li>
                  </div>
                ) : null}
                <li className="text-lg font-semibold hover:bg-white/10 transition px-3 py-2 absolute bottom-0 w-75 border-t-1 border-gray-300">
                  <button onClick={handleClick}>
                    Logout
                    <IoLogOutOutline />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
      <div className="stats">
        <div className="stat text-center">
          <div className="md:stat-value hidden md:block text-orange-500">
            LNMCMS
          </div>
          <div className="hidden md:block text-sm text-slate-500 opacity-80 italic mb-2">
            One Stop Solution For All Your Complaints
          </div>
        </div>
      </div>

      <Link
        to={
          user?.role && isAuthenticated ? `/${user.role}/dashboard` : "/login"
        }
      >
        <img src="/Logo.png" alt="LNMIIT Logo" className="h-14 ml-1" />
      </Link>
    </div>
  );
};

export default Navbar;
