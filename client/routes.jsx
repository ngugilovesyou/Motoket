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

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" />,
  },
  {
    path: "/home",
    element: <App />,
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
  },
  {
    path: "/listings",
    element: <AllListings />,
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
    path:"/admin",
    element:<AdminChatDashboard />
  },
  {
    path:"/admin/login",
    element:<AdminLogin />
  }
]);
export default routes;