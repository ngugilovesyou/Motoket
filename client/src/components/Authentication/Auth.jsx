/* eslint-disable no-unused-vars */
import { createContext, useState, useEffect } from "react";
import useStore from "../../../store";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { isAuthenticated, setIsAuthenticated, user, setUser } = useStore();
  // const [user, setUser] = useState(null);


useEffect(() => {
  const token = sessionStorage.getItem("access_token");
  const user_id = sessionStorage.getItem("user_id");

  if (token && user_id) {
    fetch(`https://motoketapi.onrender.com/api/${user_id}/get_user`, {
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
    })
    .catch((error) => {
      console.error("Auth check failed:", error);
      // Clear invalid credentials
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("user_id");
      setIsAuthenticated(false);
    });
  } else {
    setIsAuthenticated(false);
  }
}, [setUser, setIsAuthenticated]);


  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    const user_id = sessionStorage.getItem("user_id");

    if (token && user_id) {
      setIsAuthenticated(true);
    }

    fetch(`https://motoketapi.onrender.com/api/${user_id}/get_admin`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        setIsAuthenticated(true);
      });
  }, [setUser, setIsAuthenticated]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, setUser, setIsAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
