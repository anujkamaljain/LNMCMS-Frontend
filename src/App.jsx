import { useEffect } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import StudentDashboard from "./components/StudentDashboard";
import AdminDashboard from "./components/AdminDashboard";
import SuperAdminDashboard from "./components/SuperAdminDashboard";

function App() {
  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/student/dashboard" element={<StudentDashboard />} />

          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route
            path="/superadmin/dashboard"
            element={<SuperAdminDashboard />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
