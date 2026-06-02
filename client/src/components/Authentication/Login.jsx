import { useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { ToastContainer, toast } from "react-toastify";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";
import useStore from "../../../store";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const setUser = useStore((s) => s.setUser);
  const setIsAuthenticated = useStore((s) => s.setIsAuthenticated);
  const API_BASE_URL = "https://motoketapi.onrender.com/api";
  const LOCAL_API_URL = "http://127.0.0.1:8000/api";

  const togglePassword = () => setShowPassword((p) => !p);

  // ---------- CHANGE HANDLER ----------
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // ---------- MANUAL LOGIN ----------
  const handleManualSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password)
      return toast.error("Email and password are required");

    try {
      const res = await fetch(`${API_BASE_URL}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      sessionStorage.setItem("access_token", data.token);
      sessionStorage.setItem("user_id", data.user.id);

      setUser(data.user);
      setIsAuthenticated(true);

      toast.success(`Welcome back, ${data.user.first_name}`);

      const redirectTo = location.state?.from || "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ---------- GOOGLE LOGIN ----------
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const { email, displayName, uid } = result.user;

      const res = await fetch(
        `${API_BASE_URL}/users/check/?email=${email}`
      );
      const data = await res.json();

      if (!data.exists)
        throw new Error("Register first before using Google login");

      if (!data.firebase_uid) {
        await fetch(`${API_BASE_URL}/users/update-firebase/`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, firebase_uid: uid }),
        });
      }

      sessionStorage.setItem("access_token", data.token);
      sessionStorage.setItem("user_id", data.user.id);

      setUser(data.user);
      setIsAuthenticated(true);

      toast.success(`Welcome back, ${data.user.first_name}`);

      const redirectTo = location.state?.from || "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>Login | Motoket</title>
        <meta name="description" content="Login to your Motoket account to manage vehicles, listings and messages." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <ToastContainer position="top-right" autoClose={3000} />

      <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">

        <section
          aria-label="Login Form"
          className="w-full max-w-md rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 transition-all"
        >

          {/* HEADER */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Login to continue
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleManualSubmit} className="space-y-4">

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Email
              </label>
              <input
                aria-label="Email Address"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-yellow-500 dark:bg-gray-900 dark:text-white outline-none"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Password
              </label>

              <div className="relative mt-1">
                <input
                  aria-label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-yellow-500 dark:bg-gray-900 dark:text-white outline-none"
                />

                <button
                  type="button"
                  onClick={togglePassword}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </button>
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-white font-semibold bg-gradient-to-r from-yellow-500 to-yellow-600 hover:opacity-90 transition"
            >
              Login
            </button>
          </form>

          {/* REGISTER */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            Don’t have an account?{" "}
            <NavLink
              to="/register"
              className="font-semibold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent hover:underline"
            >
              Register
            </NavLink>
          </p>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
            <span className="text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
          </div>

          {/* GOOGLE LOGIN */}
          <Button
            onClick={handleGoogleLogin}
            variant="contained"
            fullWidth
            sx={{
              background: "linear-gradient(to right,#f59e0b,#d97706)",
              fontWeight: "bold",
              borderRadius: "12px",
              ":hover": { opacity: 0.9 },
            }}
          >
            Continue with Google
          </Button>

        </section>
      </main>
    </>
  );
}

export default Login;
