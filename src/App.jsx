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
import ViewRejectedComplaints from "./components/ViewRejectedComplaints";
import ViewStudentProfile from "./components/ViewStudentProfile";
import ChangeAdminPassword from "./components/ChangeAdminPassword";
import ChangeSuperAdminPassword from "./components/ChangeSuperAdminPassword";
import ChangeStudentPassword from "./components/ChangeStudentPassword";
import RegisterComplaint from "./components/RegisterComplaint";
import AddAdmin from "./components/AddAdmin";
import EditAdmin from "./components/EditAdmin";
import AddStudent from "./components/AddStudent";
import DeleteStudent from "./components/DeleteStudent";
import ViewStudent from "./components/ViewStudent";
import ViewAdmin from "./components/ViewAdmin";
import EditStudent from "./components/EditStudent";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { Analytics } from "@vercel/analytics/react";
import UndeletedStudentsDialog from "./components/UndeletedStudentsDialog";
import Discover from "./components/Discover";
import Chat from "./components/Chat";

axios.defaults.withCredentials = true;

// Safari compatibility: Add token to Authorization header if cookies fail
axios.interceptors.request.use((config) => {
  // Only use localStorage token for Safari/iOS browsers or if explicitly needed
  const userAgent = navigator.userAgent;
  const isSafariOrIOS =
    (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) ||
    /iPad|iPhone|iPod/.test(userAgent);

  const token = localStorage.getItem("authToken");
  if (token && (isSafariOrIOS || !document.cookie.includes("token="))) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token storage for Safari compatibility
axios.interceptors.response.use(
  (response) => {
    // If response contains a token, store it for Safari fallback
    if (response.data?.token) {
      localStorage.setItem("authToken", response.data.token);
    }
    return response;
  },
  (error) => {
    // Clear token on auth errors
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
    }
    return Promise.reject(error);
  }
);

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
            <Route path="/student/complaints/discover" element={<Discover />} />
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
              path="/student/rejected-complaints"
              element={<ViewRejectedComplaints />}
            />
            <Route
              path="/student/change-password"
              element={<ChangeStudentPassword />}
            />
            <Route
              path="/student/view-profile"
              element={<ViewStudentProfile />}
            />
            <Route path="/student/chat/:targetUserId" 
            element={<Chat />} 
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
            <Route path="/admin/chat/:targetUserId" 
            element={<Chat />} 
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
            <Route path="/superAdmin/add-admin" element={<AddAdmin />} />
            <Route path="/superAdmin/view-admin" element={<ViewAdmin />} />
            <Route path="/superAdmin/edit-admin/:id" element={<EditAdmin />} />
            <Route path="/superAdmin/add-student" element={<AddStudent />} />
            <Route
              path="/superAdmin/delete-student"
              element={<DeleteStudent />}
            />
            <Route path="/superAdmin/view-student" element={<ViewStudent />} />
            <Route
              path="/superAdmin/edit-student/:id"
              element={<EditStudent />}
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
