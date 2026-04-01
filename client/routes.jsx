import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./src/App";
import Register from "./src/components/Authentication/Register";
import Login from "./src/components/Authentication/Login";
import SellPage from "./src/components/SellPage/SellPage";
import VehicleDetails from "./src/components/Vehicle/VehicleDetail";
import AllListings from "./src/components/Vehicle/AllListings";
import ContactUs from "./src/components/Homepage/Contact";
import About from "./src/components/Homepage/About";
import Pricing from "./src/components/Homepage/Pricing";
import Payment from "./src/components/Payment/Payment";
import AdminChatDashboard from "./src/components/Admin/AdminChat";
import AdminLogin from "./src/components/Admin/AdminLogin";
import Profile from "./src/components/PersonalInfo/Profile";
import Favourites from "./src/components/PersonalInfo/Favourites";
import Dashboard from "./src/components/Admin/Dashboard";
import ErrorPage from "./src/components/Pages/ErrorPage";
import SellerChats from "./src/components/Chats/SellerChats";
import BuyerChats from "./src/components/Chats/BuyerChats";
import Featured from "./src/components/Vehicle/Featured";
import Garage from "./src/components/Vehicle/Garage";
import Dealers from "./src/components/Dealers/Dealers";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" />,
  },

  {
    path: "/home",
    element: <AllListings />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/sell",
    element: <SellPage />,
    errorElement:<ErrorPage />
  },
  {
    path: "/shop/:make?",
    element: <AllListings />,
    errorElement:<ErrorPage />
  },
  {
    path: "/details/:slug",
    element: <VehicleDetails />,
  },
  {
    path: "/contact-us",
    element: <ContactUs />,
  },
  {
    path: "about-us",
    element: <About />,
  },
  {
    path: "/pricing",
    element:<Pricing />
  }, 
  {
    path:"/payment",
    element:<Payment />
  },
  {
    path:"/admin/Dashboard",
    element:<Dashboard />
  },
  {
    path:"/admin/login",
    element:<AdminLogin />
  },
  {
    path:"/seller/chats",
    element:<SellerChats />,
    errorElement:<ErrorPage />
  },
  {
    path:"/buyer/chats",
    element:<BuyerChats />,
    errorElement:<ErrorPage />
  },
  {
    path:"/profile",
    element:<Profile />,
    errorElement:<ErrorPage />
  },
  {
    path:"/myfavourites",
    element:<Favourites />,
    errorElement:<ErrorPage />
  }
  ,
  {
    path:"/my-garage",
    element:<Garage />,
    errorElement:<ErrorPage />
  }
  ,
  {
    path:"/vehicles/featured",
    element:<Featured />,
    errorElement:<ErrorPage />
  },
  {
    path:"/dealers",
    element:<Dealers />,
    errorElement:<ErrorPage />
  },
  {
    path:"*",
    errorElement:<ErrorPage />
  }
]);
export default routes;