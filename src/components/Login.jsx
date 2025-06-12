import { useDispatch } from "react-redux";
import { login } from "../utils/authSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion } from "motion/react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("anujkjain@lnmiit.ac.in");
  const [password, setPassword] = useState("Anuj@1234");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          email,
          password,
          role,
        },
        { withCredentials: true }
      );
      await dispatch(login(res?.data?.data));
      switch (role) {
        case "student":
          navigate("/student/dashboard");
          break;
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "superAdmin":
          navigate("/superAdmin/dashboard");
          break;
        default:
          navigate("/login");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong!!");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="absolute inset-0 bg-[url('/ERryvXnU4AATNh-.jpg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-black opacity-50" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <motion.main
          className="flex-grow p-4 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.2,
          }}
        >
          <div className="card w-96 bg-base-100/70 shadow-sm">
            <div className="card-body">
              <span className="badge badge-xs badge-warning">LNMCMS</span>
              <div className="flex justify-between">
                <h2 className="text-3xl font-bold">Login</h2>
              </div>
              {error && (
                <div className="alert alert-error">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <br />
                <div>
                  <label className="input validator join-item">
                    <svg
                      className="h-[1em] opacity-50"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                      </g>
                    </svg>
                    <input
                      type="email"
                      placeholder="abc@lnmiit.ac.in"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                  <div className="validator-hint hidden">
                    Enter valid email address
                  </div>
                </div>
                <fieldset className="fieldset -mt-2">
                  <br />
                  <select
                    className="select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit(e);
                      }
                    }}
                    required
                  >
                    <option value="" disabled>
                      Pick your Role
                    </option>
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                    <option value="superAdmin">SuperAdmin</option>
                  </select>
                </fieldset>
                <br />
                <label className="input validator">
                  <svg
                    className="h-[1em] opacity-50"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <g
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      strokeWidth="2.5"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                      <circle
                        cx="16.5"
                        cy="7.5"
                        r=".5"
                        fill="currentColor"
                      ></circle>
                    </g>
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength="8"
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                    title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                  />
                </label>
                <p className="validator-hint hidden">
                  Must be more than 8 characters, including
                  <br />
                  At least one number <br />
                  At least one lowercase letter <br />
                  At least one uppercase letter
                </p>
                <label className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary h-4 w-4 mr-2"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                  />
                  Show Password
                </label>
                <div className="mt-6">
                  <button type="submit" className="btn btn-primary btn-block">
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.main>
        <Footer />
      </div>
    </div>
  );
};

export default Login;
