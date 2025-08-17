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
import ManageOwnSuperAdmin from "./components/ManageOwnSuperAdmin";
import PendingComplaints from "./components/PendingComplaints";
import AcceptedComplaints from "./components/AcceptedComplaints";
import ResolvedComplaints from "./components/ResolvedComplaints";
import ViewAdminProfile from "./components/ViewAdminProfile";
import ViewAcceptedComplaints from "./components/ViewAcceptedComplaints";
import ViewPendingComplaints from "./components/ViewPendingComplaints";
import ViewResolvedComplaints from "./components/ViewResolvedComplaints";
import ViewStudentProfile from "./components/ViewStudentProfile";
import ChangeAdminPassword from "./components/ChangeAdminPassword";
import ChangeSuperAdminPassword from "./components/ChangeSuperAdminPassword";
import ChangeStudentPassword from "./components/ChangeStudentPassword";
import RegisterComplaint from "./components/RegisterComplaint";
import AddAdmin from "./components/AddAdmin";
import EditAdmin from "./components/EditAdmin";
import AddStudent from "./components/AddStudent"
import DeleteStudent from "./components/DeleteStudent"
import ViewStudent from "./components/ViewStudent"
import ViewAdmin from "./components/ViewAdmin"
import EditStudent from "./components/EditStudent"
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { Analytics } from "@vercel/analytics/react";
import UndeletedStudentsDialog from "./components/UndeletedStudentsDialog";

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
        <UndeletedStudentsDialog />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route
              path="/student/register-complaint"
              element={<RegisterComplaint />}
            />
            <Route
              path="/student/pending-complaints"
              element={<ViewPendingComplaints />}
            />
            <Route
              path="/student/accepted-complaints"
              element={<ViewAcceptedComplaints />}
            />
            <Route
              path="/student/resolved-complaints"
              element={<ViewResolvedComplaints />}
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
            <Route 
              path="/superAdmin/add-admin" 
              element={<AddAdmin />} 
            />
            <Route 
              path="/superAdmin/view-admin" 
              element={<ViewAdmin />} 
            />
            <Route 
              path="/superAdmin/edit-admin/:id" 
              element={<EditAdmin />} 
            />
            <Route path="/superAdmin/add-student" element={<AddStudent />} />
            <Route path="/superAdmin/delete-student" element={<DeleteStudent />} />
            <Route path="/superAdmin/view-student" element={<ViewStudent />} />
            <Route path="/superAdmin/edit-student/:id" element={<EditStudent />} />
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
