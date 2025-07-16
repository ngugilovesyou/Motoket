/* eslint-disable no-unused-vars */
import { createContext, useState, useEffect } from "react";
import useStore from "../../../store";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const {isAuthenticated, setIsAuthenticated, user, setUser} = useStore();
  // const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const user_id = localStorage.getItem("user_id");

    if (token && user_id) {
      setIsAuthenticated(true);
    }

    fetch(`https://motoketapi.onrender.com/api/${user_id}/get_user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("user_data", data);
        setUser(data);
        setIsAuthenticated(true);
      });

  
  }, [setUser, setIsAuthenticated]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const user_id = localStorage.getItem("user_id");

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
       console.log("user_data", data);
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
// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // const token = localStorage.getItem("access_token");
//     const user_id = localStorage.getItem("user_id");

//     if (user_id) {
//       fetch(`https://motoketapi.onrender.com/api/${user_id}/get_admin`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           setUser(data);
//           setIsAuthenticated(true);
//         })
//         .catch((err) => {
//           console.error("Error fetching admin user:", err);
//           setIsAuthenticated(false);
//         });
//     }
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{ isAuthenticated, user, setUser, setIsAuthenticated }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
