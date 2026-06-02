// /* eslint-disable no-unused-vars */


import { useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { ToastContainer, toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import GoogleSignIn from "./GoogleSignin";

function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const API_BASE_URL = "https://motoketapi.onrender.com/api";
  const LOCAL_API_URL = "http://127.0.0.1:8000/api";

  // ---------- INPUT CHANGE ----------
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  }, []);

  // ---------- PASSWORD VALIDATION ----------
  const validatePassword = (password) => {
    if (password.includes(" ")) return "No spaces allowed";
    if (!/[A-Z]/.test(password)) return "Add uppercase letter";
    if (!/[a-z]/.test(password)) return "Add lowercase letter";
    if (!/[0-9]/.test(password)) return "Add number";
    if (!/[^A-Za-z0-9]/.test(password)) return "Add special character";
    return "";
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setFormData((p) => ({ ...p, password: value }));

    setErrors((prev) => ({
      ...prev,
      password: validatePassword(value),
      confirm_password:
        formData.confirm_password && formData.confirm_password !== value
          ? "Passwords do not match"
          : "",
    }));
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setFormData((p) => ({ ...p, confirm_password: value }));

    setErrors((prev) => ({
      ...prev,
      confirm_password:
        formData.password !== value ? "Passwords do not match" : "",
    }));
  };

  // ---------- STEP NAVIGATION ----------
  const handleNext = () => {
    if (!formData.first_name || !formData.last_name || !formData.email)
      return toast.error("Fill all fields");

    setStep(2);
  };

  const handleBack = () => setStep(1);

  // ---------- SUBMIT ----------
  const handleSubmit = async () => {
    const passwordError = validatePassword(formData.password);
    const confirmError =
      formData.password !== formData.confirm_password
        ? "Passwords do not match"
        : "";

    if (passwordError || confirmError)
      return setErrors({ password: passwordError, confirm_password: confirmError });

    if (!formData.role) return toast.error("Select role");

    try {
      const res = await fetch(`${API_BASE_URL}/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      toast.success("Account created successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ---------- GOOGLE SUCCESS ----------
  const handleGoogleSuccess = (user) => {
    setFormData((p) => ({
      ...p,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    }));
    setStep(2);
  };

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>Register | Motoket</title>
        <meta name="description" content="Create a Motoket account to buy or sell vehicles easily." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <ToastContainer position="top-right" autoClose={3000} />

      <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">

        <section className="w-full max-w-xl rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8">

          {/* HEADER */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              Join Motoket
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Create your account in seconds
            </p>
          </div>

          {/* STEP INDICATOR */}
          <div className="flex items-center justify-center mb-6 gap-2">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`h-2 w-16 rounded-full transition ${
                  step >= s
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">

              {["first_name", "last_name", "email"].map((field) => (
                <div key={field}>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300 capitalize">
                    {field.replace("_", " ")}
                  </label>
                  <input
                    name={field}
                    type={field === "email" ? "email" : "text"}
                    value={formData[field]}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-yellow-500 dark:bg-gray-900 dark:text-white outline-none"
                  />
                </div>
              ))}

              <Button
                fullWidth
                onClick={handleNext}
                sx={{
                  background: "linear-gradient(to right,#f59e0b,#d97706)",
                  fontWeight: "bold",
                  borderRadius: "12px",
                  marginTop: "8px",
                  ":hover": { opacity: 0.9 },
                }}
                variant="contained"
              >
                Continue
              </Button>

              {/* <GoogleSignIn onGoogleSuccess={handleGoogleSuccess} /> */}
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">

              {/* ROLE */}
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-yellow-500 dark:bg-gray-900 dark:text-white"
                >
                  <option value="">Select Role</option>
                  <option value="Buyer">Buyer</option>
                  <option value="Seller">Seller</option>
                </select>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-yellow-500 dark:bg-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* CONFIRM */}
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.confirm_password}
                  onChange={handleConfirmPasswordChange}
                  className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-yellow-500 dark:bg-gray-900 dark:text-white"
                />
                {errors.confirm_password && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirm_password}</p>
                )}
              </div>

              {/* BUTTONS */}
              <div className="flex gap-3">
                <Button fullWidth variant="outlined" onClick={handleBack}>
                  Back
                </Button>

                <Button
                  fullWidth
                  onClick={handleSubmit}
                  variant="contained"
                  sx={{
                    background: "linear-gradient(to right,#f59e0b,#d97706)",
                    fontWeight: "bold",
                    borderRadius: "12px",
                    ":hover": { opacity: 0.9 },
                  }}
                >
                  Create Account
                </Button>
              </div>
            </div>
          )}

          {/* LOGIN LINK */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{" "}
            <NavLink
              to="/login"
              className="font-semibold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent hover:underline"
            >
              Login
            </NavLink>
          </p>

        </section>
      </main>
    </>
  );
}

export default Register;
