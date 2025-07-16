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
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Homepage/Navbar";

function AllListings() {
  const [listings, setListings] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  // const[cars, setCars] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const LISTINGS_PER_PAGE = 15;
  const totalPages = Math.ceil(totalCount / LISTINGS_PER_PAGE);


  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(
          `https://motoketapi.onrender.com/api/all_vehicles/?page=${currentPage}&limit=${LISTINGS_PER_PAGE}`
        );
        const data = await res.json();
        console.log("data from all listings", data);
        setListings(data.vehicles || []);
        setTotalCount(data.count);
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    };

    fetchListings();
  }, [currentPage]);

  useEffect(() => {
    console.log("Updated listings state:", listings);
  }, [listings]);

  //   const viewCarDetails = (carId) => {
  //     console.log(`Viewing details for: ${carId}`);
  //     // You can implement navigation or state logic here
  //   };
  return (
    <>
      <Navbar />
      <div className="py-16  px-4 sm:px-6 lg:px-8 w-full mx-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300 border-t border-gray-900 mt-6">
        <div className="text-center mb-12 md:mb-6 lg:mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 dark:text-white mb-4 tracking-wide">
            All{" "}
            <span className="font-semibold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Listings
            </span>
          </h2>
          <p className="text-gray-500 text-lg text-center mt-2">
            Find your next ride below
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-6">
          <form className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-white/20 dark:border-gray-700/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Make */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Make
                </label>
                <input
                  type="text"
                  placeholder="e.g. BMW"
                  className="w-full p-3 sm:p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300"
                />
              </div>

              {/* Model */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Model
                </label>
                <input
                  type="text"
                  placeholder="e.g. X5"
                  className="w-full p-3 sm:p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300"
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Max Price ($)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  className="w-full p-3 sm:p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300"
                />
              </div>

              {/* Year */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Min Year
                </label>
                <input
                  type="number"
                  placeholder="e.g. 2020"
                  className="w-full p-3 sm:p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300"
                />
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="submit"
              className="group w-full p-4 sm:p-5 bg-gradient-to-r from-gray-900 to-black dark:from-yellow-500 dark:to-yellow-600 text-white font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wider relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center space-x-3">
                <Search size={20} className="group-hover:animate-pulse" />
                <span>Explore Listings</span>
              </div>
            </button>

            {/* Info Row */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>1000+ Premium Cars</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Verified Dealers</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Best Prices</span>
              </div>
            </div>
          </form>
        </div>

        {listings.length === 0 ? (
          <p className="text-center col-span-full text-gray-500">
            No listings found.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
              {listings.map((car, index) => (
                <div
                  key={car.id}
                  className="group cursor-pointer"
                  //   onClick={() => viewCarDetails(car.id)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-gray-100 dark:border-gray-700">
                    {/* Car Image */}
                    <div className="relative h-64 md:h-72 lg:h-80 overflow-hidden">
                      <img
                        src={
                          car.images[0]?.image_url || "default-car-image.jpg"
                        }
                        // src={car.images.image}
                        alt={car.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                      {/* Badge */}
                      {/* <div
                    className={`absolute top-4 left-4 ${getBadgeColor(
                      car.badge
                    )} text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-lg`}
                  >
                    {car.badge}
                  </div> */}

                      {/* Rating */}
                      {/* <div className="absolute top-4 right-4 flex items-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-2 py-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white ml-1">
                      {car.rating}
                    </span>
                  </div> */}
                    </div>

                    {/* Car Details */}
                    <div className="p-6 md:p-8">
                      <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-4 group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors duration-300">
                        {car.make} {car.model}
                      </h3>

                      {/* Specs */}
                      <div className="flex justify-between items-center mb-6 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{car.year}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Gauge className="w-4 h-4" />
                          <span>{car.mileage}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {car.fuel_type === "Electric" && (
                            <Battery className="w-4 h-4" />
                          )}
                          {car.fuel_type === "Gasoline" && (
                            <Fuel className="w-4 h-4" />
                          )}
                          {car.fuel_type === "Diesel" && (
                            <Fuel className="w-4 h-4 text-gray-600" />
                          )}
                          {car.fuel_type === "Hybrid" && (
                            <HybridIcon className="w-4 h-4 text-green-500" />
                          )}
                          {car.fuel_type === "Plug-in Hybrid" && (
                            <Plug className="w-4 h-4 text-blue-500" />
                          )}
                          <span>{car.fuel_type}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {car.transmission === "Automatic" && (
                            <Cog className="w-4 h-4" />
                          )}
                          {car.transmission === "Manual" && (
                            <Settings className="w-4 h-4" />
                          )}
                          {car.transmission === "CVT" && (
                            <RefreshCw className="w-4 h-4" />
                          )}
                          <span>{car.transmission}</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-6">
                        Ksh {car.price}
                      </div>

                      {/* View Details Button */}
                      <Link
                        to={`/details/${car.slug}`}
                        className="group/btn w-full py-3 md:py-4 bg-transparent border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 hover:border-gray-900 dark:hover:border-white transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <Eye className="w-5 h-5" />
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination */}
            <div className="mt-6 flex justify-center space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50 text-white"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === index + 1 ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50 dark:bg-white text-gray-700"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default AllListings;
