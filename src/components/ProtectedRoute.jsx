import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { logout } from "../utils/authSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ allowedRoles, redirectPath = "/login" }) => {
  const { isAuthenticated, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const isAllowed =
    isAuthenticated && user?.role && allowedRoles.includes(user.role);

  useEffect(() => {
    if (!isAllowed) {
      const handleLogout = async () => {
        try {
          await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
        } catch (err) {
          console.log("Logout failed:", err);
        } finally {
          dispatch(logout());
          setShouldRedirect(true); 
        }
      };

      handleLogout();
    }
  }, [isAllowed, dispatch]);

  if (shouldRedirect) {
    return <Navigate to={redirectPath} replace state={{ from: location }} />;
  }

  if (!isAllowed) {
    return <span className="loading loading-bars loading-lg"></span>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default ProtectedRoute;
