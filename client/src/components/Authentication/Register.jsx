/* eslint-disable no-unused-vars */
import { React, useState } from "react";
import Paper from "@mui/material/Paper";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import RegionPicker from "./Regionpicker";
import { ToastContainer, toast } from "react-toastify";
import GoogleSignIn from "./GoogleSignin";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleNext = () => {
    if (step === 2) return;

    // Validate before going to next step
    if (step === 2) {
      const passwordError = validatePassword(formData.password);
      const confirmError =
        formData.password !== formData.confirm_password
          ? "Passwords do not match."
          : "";

      setErrors((prev) => ({
        ...prev,
        password: passwordError,
        confirm_password: confirmError,
      }));

      if (passwordError || confirmError) return;
    }

    setStep((prev) => Math.min(prev + 1, 2));
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const validatePassword = (password) => {
    if (password.includes(" ")) {
      return "Password should not contain spaces.";
    }
    if (!/[A-Z]/.test(password)) {
      return "Must include at least one uppercase letter.";
    }
    if (!/[a-z]/.test(password)) {
      return "Must include at least one lowercase letter.";
    }
    if (!/[0-9]/.test(password)) {
      return "Must include at least one number.";
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return "Must include at least one special character.";
    }
    return "";
  };
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    const error = validatePassword(value);

    setFormData((prev) => ({
      ...prev,
      password: value,
    }));

    setErrors((prev) => ({
      ...prev,
      password: error,
      confirm_password:
        formData.confirm_password && formData.confirm_password !== value
          ? "Passwords do not match."
          : "",
    }));
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      confirm_password: value,
    }));

    setErrors((prev) => ({
      ...prev,
      confirm_password:
        formData.password !== value ? "Passwords do not match." : "",
    }));
  };

  const handleGoogleSuccess = (userData) => {
    setFormData((prev) => ({
      ...prev,
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
    }));

    setStep(2);
  };
  const handleGoogleFailure = (error) => {
    console.log(error);
  };
  const handleSubmit = async () => {
    const passwordError = validatePassword(formData.password);
    const confirmError =
      formData.password !== formData.confirm_password
        ? "Passwords do not match."
        : "";

    setErrors((prev) => ({
      ...prev,
      password: passwordError,
      confirm_password: confirmError,
    }));

    if (passwordError || confirmError) return;

    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "password",
      "role",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in the ${field.replace("_", " ")} field`);
        return;
      }
    }

    try {
      const response = await fetch("https://motoketapi.onrender.com/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.error ||
          data.message ||
          (data.errors
            ? Object.values(data.errors).flat().join(", ")
            : "Registration failed");
        throw new Error(errorMessage);
      }

      toast.success(data.message || "User registered successfully");
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        role: "",
        password: "",
        confirm_password: "",
      });
      //  const redirectTo = location.state?.from || "/";
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="h-screen w-full bg-gradient-to-br from-blue-100 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex justify-center items-center px-4">
        <div className="p-6 sm:p-10 w-[95%] sm:w-[80%] md:w-[70%] lg:w-[45%]  mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="text-center py-6">
            <h1 className="text-2xl sm:text-4xl md:text-4xl font-bold font-sans text-center mb-2 tracking-tight bg-gradient-to-r from-blue-600 to-indigo-800 dark:from-yellow-300 dark:to-yellow-500 bg-clip-text text-transparent">
              Welcome to Motoket
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-gray-700 dark:text-gray-200 mt-2">
              Let's Drive Your Dream!
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
            <div className="w-full">
              {/* Step 1 */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      // className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white py-3 px-4 text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      // className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white py-3 px-4 text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      // className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white py-3 px-4 text-base"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Role
                    </label>
                    <select
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white py-3  text-base"
                      name="role"
                      id=""
                      onChange={handleChange}
                    >
                      <option value="">Select Role</option>
                      <option value="Buyer">Buyer</option>
                      <option value="Seller">Seller</option>
                    </select>
                    {/* <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      // className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white py-3 px-4 text-base"
                      required
                    /> */}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handlePasswordChange}
                        className={`mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white py-3 px-4 text-base ${
                          errors.password ? "border-red-500" : ""
                        }`}
                      />
                      <button
                        type="button"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleConfirmPasswordChange}
                        className={`mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white py-3 px-4 text-base ${
                          errors.confirm_password ? "border-red-500" : ""
                        }`}
                      />
                      <button
                        type="button"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </button>
                    </div>
                    {errors.confirm_password && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.confirm_password}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={step === 1}
                  sx={{ color: "gray", backgroundColor: "white" }}
                >
                  Back
                </Button>
                {step < 2 ? (
                  <Button variant="contained" onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                )}
              </div>

              {/* Login Link */}
              <div className="mt-3 text-gray-700 dark:text-gray-300">
                <p>
                  Already have an account?{" "}
                  <NavLink
                    className="text-blue-600 dark:text-yellow-400 hover:underline"
                    to="/login"
                  >
                    Login
                  </NavLink>
                </p>
              </div>

              {/* Google Sign In */}
              <GoogleSignIn onGoogleSuccess={handleGoogleSuccess} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
