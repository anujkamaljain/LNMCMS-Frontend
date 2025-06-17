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
import PendingComplaints from "./components/PendingComplaints";
import AcceptedComplaints from "./components/AcceptedComplaints";
import ResolvedComplaints from "./components/ResolvedComplaints";
import ViewAdminProfile from "./components/ViewAdminProfile";
import ViewYourComplaints from "./components/ViewYourComplaints";
import ViewStudentProfile from "./components/ViewStudentProfile";
import ChangeAdminPassword from "./components/ChangeAdminPassword";
import ChangeSuperAdminPassword from "./components/ChangeSuperAdminPassword";
import ChangeStudentPassword from "./components/ChangeStudentPassword";
import RegisterComplaint from "./components/RegisterComplaint";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { Analytics } from "@vercel/analytics/react";

axios.defaults.withCredentials = true;

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
      <Toaster position="top-right" />
      <BrowserRouter basename="/">
        <Analytics />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route
              path="/student/register-complaint"
              element={<RegisterComplaint />}
            />
            <Route
              path="/student/view-complaints"
              element={<ViewYourComplaints />}
            />
            <Route
              path="/student/change-password"
              element={<ChangeStudentPassword />}
            />
            <Route
              path="/student/view-profile"
              element={<ViewStudentProfile />}
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
            <Route path="/admin/view-profile" element={<ViewAdminProfile />} />
            <Route
              path="/admin/change-password"
              element={<ChangeAdminPassword />}
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
              element={<ChangeSuperAdminPassword />}
            />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
