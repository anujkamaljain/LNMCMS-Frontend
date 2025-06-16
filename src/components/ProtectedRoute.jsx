import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ProtectedRoute = ({ allowedRoles, redirectPath = "/login" }) => {
  const { isAuthenticated, user } = useSelector((store) => store.auth);
  const location = useLocation();


  const isAllowed =
    isAuthenticated && user?.role && allowedRoles.includes(user.role);

  if (!isAllowed) {
    return <Navigate to={redirectPath} replace state={{ from: location }} />;
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
