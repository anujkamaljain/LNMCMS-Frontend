import { useEffect } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import StudentDashboard from "./components/StudentDashboard";
import AdminDashboard from "./components/AdminDashboard";
import SuperAdminDashboard from "./components/SuperAdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navigate } from "react-router-dom";
import ManageSuperAdmin from "./components/ManageSuperAdmin";
import "@fontsource/bowlby-one-sc";
import ManageAdmin from "./components/ManageAdmin";
import ManageStudent from "./components/ManageStudent";
import ManageOwnSuperAdmin from "./components/ManageOwnSuperAdmin";
import ChangeSuperAdmiPassword from "./components/ChangeSuperAdmiPassword";
import PendingComplaints from "./components/PendingComplaints";
import AcceptedComplaints from "./components/AcceptedComplaints";
import ResolvedComplaints from "./components/ResolvedComplaints";

const App = () => {
  const theme = useSelector((state) => state.theme.theme);
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route
              path="/student/register-complaint"
              element={<StudentDashboard />}
            />
            <Route
              path="/student/view-complaints"
              element={<StudentDashboard />}
            />
            <Route
              path="/student/change-password"
              element={<StudentDashboard />}
            />
            <Route
              path="/student/view-profile"
              element={<StudentDashboard />}
            />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route
              path="/admin/pending-complaints"
              element={<PendingComplaints />}
            />
            <Route
              path="/admin/accepted-complaints"
              element={<AcceptedComplaints />}
            />
            <Route
              path="/admin/resolved-complaints"
              element={<ResolvedComplaints />}
            />
            <Route path="/admin/view-profile" element={<AdminDashboard />} />
            <Route
              path="/admin/change-password"
              element={<AdminDashboard />}
            />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["superAdmin"]} />}>
            <Route
              path="/superAdmin/dashboard"
              element={<SuperAdminDashboard />}
            />
            <Route
              path="/superAdmin/manage-superAdmins"
              element={<ManageSuperAdmin />}
            />
            <Route path="/superAdmin/manage-Admins" element={<ManageAdmin />} />
            <Route
              path="/superAdmin/manage-Students"
              element={<ManageStudent />}
            />
            <Route
              path="/superAdmin/manage-profile"
              element={<ManageOwnSuperAdmin />}
            />
            <Route
              path="/superAdmin/change-password"
              element={<ChangeSuperAdmiPassword />}
            />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
