/* eslint-disable no-unused-vars */
import { createContext, useState, useEffect } from "react";
import useStore from "../../../store";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { isAuthenticated, setIsAuthenticated, user, setUser, isAdmin, setIsAdmin } = useStore();
  const API_BASE_URL = "https://motoketapi.onrender.com/api";
  const LOCAL_API_URL = "http://127.0.0.1:8000/api";

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    const user_id = sessionStorage.getItem("user_id");
    
    // Only fetch if we have credentials and no user data yet
    if (token && user_id && !user) {
      // Fetch user data
      fetch(`${API_BASE_URL}/${user_id}/get_user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        credentials: "include",
      })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failed to fetch user");
      })
      .then((data) => {
        setUser(data);
        setIsAuthenticated(true);
        // Check if user is admin based on role or is_admin field
        setIsAdmin(data.role === "Admin" || data.is_admin === true);
      })
      .catch((error) => {
        console.error("Auth check failed:", error);
        // Clear invalid credentials
        sessionStorage.removeItem("auth-storage");
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("user_id");
        sessionStorage.removeItem("first_name");
        sessionStorage.removeItem("last_name");
        setIsAuthenticated(false);
        setUser(false);
        setIsAdmin(false);
      });
    } else if (!token || !user_id) {
      // No credentials found, ensure clean state
      setIsAuthenticated(false);
      setUser(false);
      setIsAdmin(false);
    }
  }, []); 

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, setUser, setIsAuthenticated, isAdmin, setIsAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};