/* eslint-disable no-unused-vars */
import {
  ArrowRight,
  Battery,
  Calendar,
  Cog,
  Eye,
  Fuel,
  Gauge,
  Plug,
  RefreshCw,
  Search,
  Settings,
  Star,
  BatteryCharging,
  Filter,
  X,
  ChevronDown,
  MapPin,
  SlidersHorizontal,
  Heart,
  Share2,
  TrendingUp,
  Clock,
  Sparkles,
  Grid3x3,
  List,
  AlertCircle,
  Loader2
} from "lucide-react";
import React, { useEffect, useState, useMemo, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Homepage/Navbar";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../Authentication/Auth";
import { Helmet } from "react-helmet-async";
import './listings.css'
import HowItWorks from "../Homepage/HowItWorks";
import { ToastContainer, toast } from "react-toastify";
// Utility function for number formatting
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(price);
};

// Utility function for debouncing
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Loading skeleton component
const ListingSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-700 animate-pulse">
    <div className="h-64 md:h-72 lg:h-80 bg-gray-300 dark:bg-gray-700"></div>
    <div className="p-6 md:p-8">
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
      <div className="flex justify-between mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
        ))}
      </div>
      <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded mb-6 w-1/2"></div>
      <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
    </div>
  </div>
);

// Empty state component
const EmptyState = ({ onReset }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-20">
    <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-6">
      <AlertCircle className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
    </div>
    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
      No vehicles found
    </h3>
    <p className="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
      We couldn't find any vehicles matching your criteria. Try adjusting your filters or search terms.
    </p>
    <button
      onClick={onReset}
      className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
    >
      Reset All Filters
    </button>
  </div>
);

// Sorting dropdown options
const SORT_OPTIONS = [
  { value: "", label: "Featured First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "year_desc", label: "Newest First" },
  { value: "year_asc", label: "Oldest First" },
  { value: "mileage_asc", label: "Lowest Mileage" },
];

// Popular makes for quick filters
const POPULAR_MAKES = ["Toyota", "BMW", "Mercedes-Benz", "Audi", "Honda", "Nissan", "Volkswagen", "Ford"];

function AllListings() {
  const { make } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);

  const userId = user?.id || null;

  // State management
  const [listings, setListings] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showFilters, setShowFilters] = useState(false);
  const [savedListings, setSavedListings] = useState(new Set());
  const API_BASE_URL = "https://motoketapi.onrender.com/api";
  const LOCAL_API_URL = "http://127.0.0.1:8000/api";

  // Filter states
  const [localFilters, setLocalFilters] = useState({
    make: make || searchParams.get("make") || "",
    model: searchParams.get("model") || "",
    priceMin: searchParams.get("priceMin") || "",
    priceMax: searchParams.get("priceMax") || "",
    yearMin: searchParams.get("yearMin") || "",
    yearMax: searchParams.get("yearMax") || "",
    mileageMax: searchParams.get("mileageMax") || "",
    fuelType: searchParams.get("fuelType") || "",
    transmission: searchParams.get("transmission") || "",
    location: searchParams.get("location") || "",
    condition: searchParams.get("condition") || "",
  });

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "");

  // Debounced search
  const debouncedSearch = useDebounce(searchQuery, 500);

  const LISTINGS_PER_PAGE = 15;
  const totalPages = Math.ceil(totalCount / LISTINGS_PER_PAGE);

  // Fetch listings
  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const params = new URLSearchParams();
    
    // Add all filters to params
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    if (debouncedSearch) params.append("search", debouncedSearch);
    if (sortBy) params.append("sort", sortBy);
    params.append("page", currentPage);
    params.append("limit", LISTINGS_PER_PAGE);

    try {
      const res = await fetch(
        `${API_BASE_URL}/all_vehicles/?${params.toString()}`
      );
      
      if (!res.ok) throw new Error("Failed to fetch listings");
      
      const data = await res.json();
      setListings(data.vehicles || []);
      setTotalCount(data.count || 0);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [localFilters, debouncedSearch, sortBy, currentPage]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [localFilters, debouncedSearch, sortBy]);

  // Sync URL with filters
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value && key !== 'make') params.append(key, value);
    });
    if (debouncedSearch) params.append("search", debouncedSearch);
    if (sortBy) params.append("sort", sortBy);

    const basePath = localFilters.make ? `/shop/${localFilters.make}` : "/shop";
    const newUrl = params.toString() ? `${basePath}?${params.toString()}` : basePath;
    
    window.history.replaceState({}, '', newUrl);
  }, [localFilters, debouncedSearch, sortBy]);

  // Handle filter submission
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchListings();
    setShowFilters(false);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setLocalFilters({
      make: "",
      model: "",
      priceMin: "",
      priceMax: "",
      yearMin: "",
      yearMax: "",
      mileageMax: "",
      fuelType: "",
      transmission: "",
      location: "",
      condition: "",
    });
    setSearchQuery("");
    setSortBy("");
    setCurrentPage(1);
    navigate("/shop");
  };
  
  // get favourited 
 useEffect(() => {
  if (!user?.id) return;

  const fetchSaved = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/${user.id}/user-favourite/`
      );

      const data = await res.json();

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
        ? data.results
        : [];

      const ids = list.map(item => Number(item.vehicle.id));

      setSavedListings(new Set(ids));

    } catch (err) {
      console.error("Saved fetch error:", err);
    }
  };

  fetchSaved();
}, [user?.id]);





  // Handle save/unsave listing
  const toggleSaveListing = async (listingId) => {

  if (!userId) {
    toast.error('Please log in to favourite a vehicle.');
    return;
  }

  const isCurrentlySaved = savedListings.has(listingId);

  try {
    if (isCurrentlySaved) {
      // Call DELETE endpoint to unfavourite
      const res = await fetch(
        `${API_BASE_URL}/${userId}/${listingId}/unfavourite/`,
        { method: 'DELETE' }
      );

      if (!res.ok) throw new Error('Failed to unfavourite');

      
    } else {
      // Call POST endpoint to favourite
      const res = await fetch(
        `${API_BASE_URL}/${userId}/${listingId}/favourite/`,
        { method: 'POST' }
      );

      if (!res.ok) throw new Error('Failed to favourite');

     
    }

    // Update frontend state & localStorage
    setSavedListings((prev) => {
      const newSet = new Set(prev);
      if (isCurrentlySaved) {
        newSet.delete(listingId);
      } else {
        newSet.add(listingId);
      }
      // localStorage.setItem('savedListings', JSON.stringify([...newSet]));
      return newSet;
    });

  } catch (err) {
    console.error(err);
    toast.error('Something went wrong. Please try again.');
  }
};


  // Active filters count
  const activeFiltersCount = useMemo(() => {
    return Object.values(localFilters).filter(v => v).length + 
           (debouncedSearch ? 1 : 0) + 
           (sortBy ? 1 : 0);
  }, [localFilters, debouncedSearch, sortBy]);

  // Pagination component
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, "...");
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push("...", totalPages);
      } else if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    return (
      <div className="flex items-center justify-center gap-2 mt-12">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
        >
          Previous
        </button>

        <div className="flex gap-2">
          {getPageNumbers().map((pageNum, idx) => (
            pageNum === "..." ? (
              <span key={`dots-${idx}`} className="px-4 py-2 text-gray-500">
                ...
              </span>
            ) : (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                  currentPage === pageNum
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg"
                    : "border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {pageNum}
              </button>
            )
          ))}
        </div>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <Helmet>
        <title>
          {localFilters.make ? `${localFilters.make} Cars` : "All Cars"} for Sale | Motoket
        </title>
        <meta
          name="description"
          content={
            localFilters.make && localFilters.model
              ? `Find ${localFilters.make} ${localFilters.model} cars for sale in ${localFilters.location || "Kenya"} at the best prices.`
              : "Browse all car listings on Motoket. Find premium cars, verified dealers, and best prices."
          }
        />
        <link
          rel="canonical"
          href={`https://motoket.com/shop/${localFilters.make || ""}${localFilters.model ? `?model=${localFilters.model}` : ""}`}
        />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 w-full mx-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300 mt-15">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 dark:text-white mb-4 tracking-wide">
              {localFilters.make ? (
                <>
                  <span className="font-semibold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    {localFilters.make}
                  </span>
                  {localFilters.model && ` ${localFilters.model}`} Cars
                </>
              ) : (
                <>
                  All{" "}
                  <span className="font-semibold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    Listings
                  </span>
                </>
              )}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Find your next ride
            </p>
          </div>

          {/* Search Bar & Quick Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by make, model, or keyword..."
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300 text-lg"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Popular Makes - Quick Filters */}
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap gap-2 justify-center">
                {POPULAR_MAKES.map((makeName) => (
                  <button
                    key={makeName}
                    onClick={() => setLocalFilters({ ...localFilters, make: makeName })}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      localFilters.make === makeName
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-yellow-400 dark:hover:border-yellow-400"
                    }`}
                  >
                    {makeName}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Toolbar - Sort, Filter, View Mode */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 relative"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Sort Dropdown */}
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none w-full sm:w-64 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 cursor-pointer pr-10"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-gray-600 shadow-md"
                    : "hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
                title="Grid View"
              >
                <Grid3x3 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === "list"
                    ? "bg-white dark:bg-gray-600 shadow-md"
                    : "hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
                title="List View"
              >
                <List className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-gray-700 animate-slideDown">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Advanced Filters
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-300"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleFilterSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                  {/* Make */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Make
                    </label>
                    <input
                      type="text"
                      value={localFilters.make}
                      onChange={(e) => setLocalFilters({ ...localFilters, make: e.target.value })}
                      placeholder="e.g. BMW"
                      className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300"
                    />
                  </div>

                  {/* Model */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Model
                    </label>
                    <input
                      type="text"
                      value={localFilters.model}
                      onChange={(e) => setLocalFilters({ ...localFilters, model: e.target.value })}
                      placeholder="e.g. X5"
                      className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300"
                    />
                  </div>

                  {/* Price Min */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Min Price (KES)
                    </label>
                    <input
                      type="number"
                      value={localFilters.priceMin}
                      onChange={(e) => setLocalFilters({ ...localFilters, priceMin: e.target.value })}
                      placeholder="e.g. 500000"
                      className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300"
                    />
                  </div>

                  {/* Price Max */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Max Price (KES)
                    </label>
                    <input
                      type="number"
                      value={localFilters.priceMax}
                      onChange={(e) => setLocalFilters({ ...localFilters, priceMax: e.target.value })}
                      placeholder="e.g. 5000000"
                      className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300"
                    />
                  </div>

                  {/* Year Min */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Min Year
                    </label>
                    <input
                      type="number"
                      value={localFilters.yearMin}
                      onChange={(e) => setLocalFilters({ ...localFilters, yearMin: e.target.value })}
                      placeholder="e.g. 2020"
                      className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300"
                    />
                  </div>

                  {/* Year Max */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Max Year
                    </label>
                    <input
                      type="number"
                      value={localFilters.yearMax}
                      onChange={(e) => setLocalFilters({ ...localFilters, yearMax: e.target.value })}
                      placeholder="e.g. 2024"
                      className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300"
                    />
                  </div>

                  {/* Mileage Max */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Max Mileage (km)
                    </label>
                    <input
                      type="number"
                      value={localFilters.mileageMax}
                      onChange={(e) => setLocalFilters({ ...localFilters, mileageMax: e.target.value })}
                      placeholder="e.g. 50000"
                      className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300"
                    />
                  </div>

                  {/* Fuel Type */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Fuel Type
                    </label>
                    <select
                      value={localFilters.fuelType}
                      onChange={(e) => setLocalFilters({ ...localFilters, fuelType: e.target.value })}
                      className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300"
                    >
                      <option value="">All</option>
                      <option value="Gasoline">Gasoline</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Plug-in Hybrid">Plug-in Hybrid</option>
                    </select>
                  </div>

                  {/* Transmission */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Transmission
                    </label>
                    <select
                      value={localFilters.transmission}
                      onChange={(e) => setLocalFilters({ ...localFilters, transmission: e.target.value })}
                      className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300"
                    >
                      <option value="">All</option>
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                      <option value="CVT">CVT</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Location
                    </label>
                    <input
                      type="text"
                      value={localFilters.location}
                      onChange={(e) => setLocalFilters({ ...localFilters, location: e.target.value })}
                      placeholder="e.g. Nairobi"
                      className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300"
                    />
                  </div>

                  {/* Condition */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Condition
                    </label>
                    <select
                      value={localFilters.condition}
                      onChange={(e) => setLocalFilters({ ...localFilters, condition: e.target.value })}
                      className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300"
                    >
                      <option value="">All</option>
                      <option value="New">New</option>
                      <option value="Used">Used</option>
                      <option value="Certified Pre-Owned">Certified Pre-Owned</option>
                    </select>
                  </div>
                </div>

                {/* Filter Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    Apply Filters
                  </button>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="py-3 px-6 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Reset All
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="mb-6 flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Active filters:
              </span>
              {Object.entries(localFilters).map(([key, value]) => 
                value ? (
                  <span
                    key={key}
                    className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full text-sm font-medium flex items-center gap-2"
                  >
                    {key}: {value}
                    <button
                      onClick={() => setLocalFilters({ ...localFilters, [key]: "" })}
                      className="hover:bg-yellow-200 dark:hover:bg-yellow-800 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ) : null
              )}
              {debouncedSearch && (
                <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full text-sm font-medium flex items-center gap-2">
                  Search: {debouncedSearch}
                  <button
                    onClick={() => setSearchQuery("")}
                    className="hover:bg-yellow-200 dark:hover:bg-yellow-800 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Listings Grid/List */}
          {error ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Oops! Something went wrong
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {error}
              </p>
              <button
                onClick={fetchListings}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          ) : isLoading ? (
            <div className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                : "grid-cols-1"
            }`}>
              {[...Array(6)].map((_, i) => (
                <ListingSkeleton key={i} />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <EmptyState onReset={handleResetFilters} />
          ) : (
            <>
              <div className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1"
              }`}>
                {listings.map((car, index) => (
                  <div
                    key={car.id}
                    className="group"
                    style={{ 
                      animation: 'fadeInUp 0.6s ease-out',
                      animationDelay: `${index * 0.1}s`,
                      animationFillMode: 'both'
                    }}
                  >
                    <div className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 ${
                      viewMode === "list" ? "flex flex-col md:flex-row" : ""
                    }`}>
                      {/* Car Image */}
                      <div className={`relative overflow-hidden ${
                        viewMode === "list" ? "md:w-1/3 h-64 md:h-auto" : "h-64 md:h-72 lg:h-80"
                      }`}>
                        <img
                          src={car.images[0]?.image_url || "/api/placeholder/400/300"}
                          alt={`${car.make} ${car.model}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        
                        {/* Featured Badge */}
                        {car.is_featured && (
                          <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-lg flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Featured
                          </div>
                        )}

                        {/* Save Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleSaveListing(car.id);
                          }}
                          className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full hover:scale-110 transition-all duration-300 group/heart"
                        >
                          <Heart
                            className={`w-5 h-5 transition-all duration-300 ${
 savedListings.has(Number(car.id))
    ? "fill-red-500 text-red-500"
    : "text-gray-600 dark:text-gray-300 group-hover/heart:text-red-500"
}`}

                          />
                        </button>

                        {/* Quick Stats Overlay */}
                        {viewMode === "grid" && (
                          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
                              <Calendar className="w-3 h-3" />
                              {car.year}
                            </div>
                            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
                              <Gauge className="w-3 h-3" />
                              {car.mileage} km
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Car Details */}
                      <div className={`p-6 ${viewMode === "list" ? "md:w-2/3" : ""}`}>
                        <Link to={`/details/${car.slug}`} className="block">
                          <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors duration-300 line-clamp-1">
                            {car.year} {car.make} {car.model}
                          </h3>
                        </Link>

                        {/* Location */}
                        {car.location && (
                          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mb-4">
                            <MapPin className="w-4 h-4" />
                            {car.location}
                          </div>
                        )}

                        {/* Specs Grid */}
                        <div className={`grid gap-3 mb-4 ${
                          viewMode === "list" ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2"
                        }`}>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4 text-yellow-500" />
                            <span>{car.year}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Gauge className="w-4 h-4 text-yellow-500" />
                            <span>{car.mileage} km</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            {car.fuel_type === "Electric" && <Battery className="w-4 h-4 text-green-500" />}
                            {car.fuel_type === "Gasoline" && <Fuel className="w-4 h-4 text-orange-500" />}
                            {car.fuel_type === "Diesel" && <Fuel className="w-4 h-4 text-gray-500" />}
                            {car.fuel_type === "Hybrid" && <BatteryCharging className="w-4 h-4 text-green-500" />}
                            {car.fuel_type === "Plug-in Hybrid" && <Plug className="w-4 h-4 text-blue-500" />}
                            <span className="line-clamp-1">{car.fuel_type}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            {car.transmission === "Automatic" && <Cog className="w-4 h-4 text-purple-500" />}
                            {car.transmission === "Manual" && <Settings className="w-4 h-4 text-blue-500" />}
                            {car.transmission === "CVT" && <RefreshCw className="w-4 h-4 text-indigo-500" />}
                            <span>{car.transmission}</span>
                          </div>
                        </div>

                        {/* Price & CTA */}
                        <div className={`flex items-center justify-between ${
                          viewMode === "list" ? "flex-col md:flex-row gap-4" : "flex-col gap-4"
                        }`}>
                          <div>
                            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                              {formatPrice(car.price)}
                            </div>
                            {car.original_price && car.original_price > car.price && (
                              <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                {formatPrice(car.original_price)}
                              </div>
                            )}
                          </div>

                          <Link
                            to={`/details/${car.slug}`}
                            className="w-full md:w-auto group/btn py-3 px-6 bg-transparent border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 hover:border-gray-900 dark:hover:border-white transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <Eye className="w-5 h-5" />
                            <span>View Details</span>
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {renderPagination()}
            </>
          )}
          <HowItWorks />
          {/* Trust Indicators */}
          {/* <div className="mt-12 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 dark:from-yellow-500/5 dark:to-yellow-600/5 rounded-2xl p-8 border border-yellow-200 dark:border-yellow-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  1000+ Premium Cars
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Curated selection of quality vehicles
                </p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  24/7 Support
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We're here to help anytime
                </p>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      
    </>
  );
}

export default AllListings;
