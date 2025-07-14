/* eslint-disable no-unused-vars */

import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Menu,
  X,
  User,
  LogIn,
  UserPlus,
  Car,
  Moon,
  Sun,
  Settings,
  Camera,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";
import { AuthContext, AuthProvider } from "../Authentication/Auth";
import useStore from "../../../store";

function DropdownMenu({ onSelect }) {
  return (
    <div className="absolute top-12 right-0 w-52 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
      <div className="py-2">
        <button
          onClick={() => onSelect("Login")}
          className="w-full flex items-center px-4 py-3 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <LogIn size={18} className="mr-3 text-gray-500 dark:text-gray-400" />
          <span className="font-medium">Login</span>
        </button>
        <button
          onClick={() => onSelect("Sign Up")}
          className="w-full flex items-center px-4 py-3 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <UserPlus
            size={18}
            className="mr-3 text-gray-500 dark:text-gray-400"
          />
          <span className="font-medium">Sign Up</span>
        </button>
      </div>
    </div>
  );
}
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [buyer, setBuyer] = useState("");
  const { setIsAuthenticated, setUser } = useStore();

  function UserProfileDropdown({ onSelect, userInfo }) {
    if (user.role == "Buyer") {
      setBuyer("Buyer");
    }
    return (
      <div className="absolute top-12 right-0 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
        {/* User Info Section */}
        <div className="p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar
                src={userInfo?.avatar || "/broken-image.jpg"}
                sx={{ width: 56, height: 56 }}
                className="ring-2 ring-white dark:ring-gray-600 shadow-lg"
              />
              <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-400 hover:bg-yellow-500 rounded-full flex items-center justify-center shadow-md transition-colors duration-200">
                <Camera size={12} className="text-white" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {user.first_name} {user.last_name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="py-2">
          <button
            onClick={() => onSelect("My Account")}
            className="w-full flex items-center px-6 py-3 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4">
              <User size={18} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <span className="font-medium block">My Account</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Manage your account settings
              </span>
            </div>
          </button>

          {buyer ? (
            <button
              onClick={() => onSelect("My Favourites")}
              className="w-full flex items-center px-6 py-3 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-4">
                <Car size={18} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <span className="font-medium block">My Listings</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  View and manage your cars
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={() => onSelect("My Listings")}
              className="w-full flex items-center px-6 py-3 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-4">
                <Car size={18} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <span className="font-medium block">My Listings</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  View and manage your cars
                </span>
              </div>
            </button>
          )}

          <button
            onClick={() => onSelect("Settings")}
            className="w-full flex items-center px-6 py-3 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-4">
              <Settings
                size={18}
                className="text-purple-600 dark:text-purple-400"
              />
            </div>
            <div>
              <span className="font-medium block">Settings</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Preferences and privacy
              </span>
            </div>
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-600 my-2"></div>

        {/* Logout */}
        <div className="py-2">
          <button
            onClick={() => {}}
            className="w-full flex items-center px-6 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
          >
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mr-4">
              <LogOut size={18} className="text-red-600 dark:text-red-400" />
            </div>
            <div>
              <span className="font-medium block">Sign out</span>
              <span className="text-xs text-red-500 dark:text-red-400">
                Sign out of your account
              </span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  const handleToggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionSelect = (value) => {
    console.log("Selected option:", value);

    // Handle different actions
    switch (value) {
      case "Login":
        navigate("/login");
        break;
      case "Sign Up":
        navigate("/register");
        break;
      case "My Account":
        navigate("/profile");
        break;
      case "My Listings":
        navigate("/my-listings");
        break;
      case "Settings":
        navigate("/settings");
        break;
      case "Logout":
        sessionStorage.removeItem("user_id");
        sessionStorage.removeItem("access_token");

        // Reset Zustand store
        setUser(false);
        setIsAuthenticated(false);

        // Navigate
        navigate("/home");
        break;
      default:
        break;
    }

    setIsOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { id: "home", label: "Home", type: "route", path: "/home" },
    { id: "about", label: "About", type: "scroll" },
    { id: "browse", label: "Browse", type: "route", path: "/listings" },
    { id: "sell", label: "Sell", type: "route", path: "/sell" },
    { id: "contact", label: "Contact", type: "route", path: "/contact-us" },
  ];

  const handleNavigation = (link) => {
    if (link.type === "scroll") {
      const el = document.getElementById(link.id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else if (link.type === "route") {
      navigate(link.path);
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <nav className="fixed top-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 z-50 transition-all duration-300 ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 md:h-20">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <img
                    onClick={() => navigate("/home")}
                    src="assets/ChatGPT Image May 22, 2025, 05_25_35 PM.png"
                    alt=""
                    className="cursor-pointer"
                  />
                </div>
                <span className="text-xl md:text-2xl font-light tracking-wider text-gray-900 dark:text-white">
                  Motoket
                </span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-8 xl:space-x-12">
                <NavLink
                  to={"/home"}
                  className="text-sm font-light tracking-wider uppercase text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-300 relative group"
                >
                  Home
                </NavLink>
                <NavLink
                  to={"/sell"}
                  className="text-sm font-light tracking-wider uppercase text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-300 relative group"
                >
                  Sell
                </NavLink>
                <NavLink
                  to={"/listings"}
                  className="text-sm font-light tracking-wider uppercase text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-300 relative group"
                >
                  Browse
                </NavLink>
                <NavLink
                  to={"/pricing"}
                  className="text-sm font-light tracking-wider uppercase text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-300 relative group"
                >
                  Pricing
                </NavLink>
              </div>

              {/* Right Side - Desktop - Only show on desktop */}
              <div className="hidden lg:flex items-center space-x-4">
                {/* User Profile Dropdown */}
                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={handleToggleDropdown}
                    className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-300 dark:ring-gray-600 hover:ring-yellow-400 dark:hover:ring-yellow-400 transition-all duration-300 transform hover:scale-105"
                  >
                    <Avatar
                      src={user.image_url || "/broken-image.jpg"}
                      sx={{ width: 40, height: 40 }}
                    />
                  </button>
                  {isOpen && (
                    <UserProfileDropdown
                      onSelect={handleOptionSelect}
                      userInfo={user}
                    />
                  )}
                </div>
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden flex items-center space-x-3">
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  {mobileMenuOpen ? (
                    <X size={24} className="text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Menu
                      size={24}
                      className="text-gray-600 dark:text-gray-400"
                    />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`lg:hidden transition-all duration-300 ease-in-out ${
              mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            <div className="px-4 pt-2 pb-6 space-y-1 bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700">
              {/* Mobile Navigation Links */}
              <NavLink
                to={"/home"}
                className="block px-3 py-3 text-base font-light tracking-wider uppercase text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to={"/sell"}
                className="block px-3 py-3 text-base font-light tracking-wider uppercase text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sell your Car
              </NavLink>
              <NavLink
                to={"/pricing"}
                className="block px-3 py-3 text-base font-light tracking-wider uppercase text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </NavLink>

              {/* Mobile User Actions */}
              <div className="pt-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    handleOptionSelect("My Account");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-3 text-left text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                >
                  <User size={18} className="mr-3" />
                  <span className="font-medium">My Account</span>
                </button>
                <button
                  onClick={() => {
                    handleOptionSelect("My Listings");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-3 text-left text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                >
                  <Car size={18} className="mr-3" />
                  <span className="font-medium">My Listings</span>
                </button>
                <button
                  onClick={() => {
                    handleOptionSelect("Logout");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                >
                  <LogOut size={18} className="mr-3" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      ) : (
        <nav className="fixed top-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 z-50 transition-all duration-300 ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 md:h-20">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <img
                    onClick={() => navigate("/home")}
                    src="assets/ChatGPT Image May 22, 2025, 05_25_35 PM.png"
                    alt=""
                    className="cursor-pointer"
                  />
                </div>
                <span className="text-xl md:text-2xl font-light tracking-wider text-gray-900 dark:text-white">
                  Motoket
                </span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-8 xl:space-x-12">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleNavigation(link)}
                    className="text-sm font-light tracking-wider uppercase text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-300 relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 dark:bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
                  </button>
                ))}
              </div>

              {/* Right Side - Desktop */}
              <div className="hidden lg:flex items-center space-x-4">
                {/* User Profile Dropdown */}
                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={handleToggleDropdown}
                    className="w-9 h-9 border-2 border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center hover:bg-gray-900 dark:hover:bg-gray-100 hover:text-white dark:hover:text-gray-900 transition-all duration-300 group"
                  >
                    <User
                      size={18}
                      className="text-gray-600 dark:text-gray-400 group-hover:text-white dark:group-hover:text-gray-900"
                    />
                  </button>
                  {isOpen && <DropdownMenu onSelect={handleOptionSelect} />}
                </div>
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden flex items-center space-x-3">
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  {mobileMenuOpen ? (
                    <X size={24} className="text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Menu
                      size={24}
                      className="text-gray-600 dark:text-gray-400"
                    />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`lg:hidden transition-all duration-300 ease-in-out ${
              mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            <div className="px-4 pt-2 pb-6 space-y-1 bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700">
              {/* Mobile Navigation Links */}
              {navLinks.map((link) => (
                <a
                  className="block px-3 py-3 text-base font-light tracking-wider uppercase text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 cursor-pointer"
                  key={link.id}
                  onClick={() => {
                    handleNavigation(link);
                    setMobileMenuOpen(false);
                  }}
                >
                  {link.label}
                </a>
              ))}

              {/* Mobile User Actions */}
              <div className="pt-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    handleOptionSelect("Login");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-3 text-left text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                >
                  <LogIn size={18} className="mr-3" />
                  <span className="font-medium">Login</span>
                </button>
                <button
                  onClick={() => {
                    handleOptionSelect("Sign Up");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-3 text-left text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                >
                  <UserPlus size={18} className="mr-3" />
                  <span className="font-medium">Sign Up</span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}
    </>
  );
}

export default Navbar;
