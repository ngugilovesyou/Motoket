/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Navbar from '../Homepage/Navbar';
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Gauge,
  Settings,
  BatteryCharging,
  Battery,
  Cog,
  Eye,
  Fuel,
  Gauge,
  Plug,
  RefreshCw,
} from "lucide-react";
function Favourites() {
    const [favourites, setFavourite]=useState([])
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const LISTINGS_PER_PAGE = 15;
    const totalPages = Math.ceil(totalCount / LISTINGS_PER_PAGE);
    useEffect(() => {
  const userId = sessionStorage.getItem("user_id");
  
  if (!userId) {
    console.error("User ID not found in session storage");
    
    window.location.href = '/login';
    return;
  }

  fetch(
    `https://motoketapi.onrender.com/api/user-favourite/${userId}/?page=${currentPage}&limit=${LISTINGS_PER_PAGE}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch favourites');
      }
      return response.json();
    })
    .then((data) => {
      console.log(data.results);
      setFavourite(data.results || []);
      setTotalCount(data.count || 0);
    })
    .catch((error) => {
      console.error("Error fetching favourites:", error);
      setFavourite([]);
    });
}, [currentPage]);
  return (
    <>
    <Navbar />
       <div className="min-h-screen px-4 sm:px-6 lg:px-8 w-full mx-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
  {favourites.length === 0 ? (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
     
      <div className="mb-6">
        <svg 
          className="w-24 h-24 text-gray-300 dark:text-gray-600" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </div>
      <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-4">
        No listings found
      </p>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
        You haven't favorited any vehicles yet. Browse our collection and save your favorites!
      </p>
      <Link
        to="/listings"
        className="mt-8 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        Browse Vehicles
      </Link>
    </div>
  ) : (
    <>
      <div className="py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          My Favorites
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {favourites.map((fav, index) => {
            const car = fav.vehicle;
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
                    src={car?.images?.[0]?.image_url || "/default-car-image.jpg"}
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
  <BatteryCharging className="w-4 h-4 text-green-500" />
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
})}
        </div>
        {/* Pagination */}
        <div className="mt-16 flex justify-center space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 border rounded-lg transition-colors ${
                currentPage === index + 1 
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-yellow-500" 
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </>
  )}
</div>
    </>
  );
}

export default Favourites