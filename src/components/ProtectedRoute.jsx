import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ProtectedRoute = ({ allowedRoles, redirectPath = "/login" }) => {
  const { isAuthenticated, user } = useSelector((store) => store.auth);

  const isAllowed =
    isAuthenticated && user?.role && allowedRoles.includes(user.role);

  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default ProtectedRoute;
