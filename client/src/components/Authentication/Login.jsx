/* eslint-disable no-unused-vars */
import { React, useEffect, useState } from "react";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import useStore from "../../../store";
function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setIsAuthenticated } = useStore.getState();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit() {
    if (formData.email === "" || formData.password === "") {
      setErrors(true);
      return;
    }

    try {
      const response = await fetch("https://motoketapi.onrender.com/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          admin_only: true,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.error ||
          data.message ||
          (data.errors
            ? Object.values(data.errors).flat().join(", ")
            : "Login failed");
        throw new Error(errorMessage);
      }

      // Success - store user data
      toast.success("Logging you in");

      // Store the token and user information
      sessionStorage.setItem("access_token", data.token);
      sessionStorage.setItem("user_id", data.user.id);
      setUser(data.user);
      setIsAuthenticated(true);
      // For debugging - view what's being stored
      console.log("Stored user data:", {
        token: data.token,
        userId: data.user.id,
        email: data.user.email,
      });

      // Redirect after short delay
      setTimeout(() => {
        const redirectTo = location.state?.from || "/";
        navigate(redirectTo, { replace: true });
      }, 1500);
    } catch (error) {
      toast.error(error.message);
      console.error("Login error:", error);
    }
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="h-screen w-full bg-gradient-to-br from-blue-100 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black flex justify-center items-center">
        <div className="p-6 sm:p-10 w-[95%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[40%] bg-white dark:bg-gray-900 rounded-lg shadow-md">
          <div className="text-center py-6">
            <h1 className="text-2xl sm:text-4xl font-bold font-sans bg-gradient-to-r from-blue-600 to-indigo-800 bg-clip-text text-transparent dark:from-blue-300 dark:to-indigo-400">
              Welcome Back!!
            </h1>
          </div>

          <div className="flex flex-col gap-4">
            {/* Email Input */}
            <div>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
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
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Forgotten Password */}
            <span className="text-sm text-blue-600 cursor-pointer hover:underline dark:text-blue-400">
              Forgotten password?
            </span>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              className="w-full bg-blue-300 p-4 dark:text-white"
            >
              Submit
            </Button>

            {/* Link to Register */}
            <div className="mt-3 text-center text-sm">
              <p className="dark:text-gray-300">
                Already have an account?{" "}
                <NavLink
                  to="/register"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  Register
                </NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
