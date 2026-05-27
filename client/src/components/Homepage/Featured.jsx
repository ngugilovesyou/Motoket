/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Eye,
  Calendar,
  Gauge,
  Settings,
  ArrowRight,
  Star,
  Award,
  Battery,
  Fuel,
  Plug,
  Cog,
  RefreshCw,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function FeaturedCars() {
  const [featuredCars, setFeaturedCars] = useState([]);
  const navigate=useNavigate()
  const API_BASE_URL = "https://motoketapi.onrender.com/api";
  const LOCAL_API_URL = "http://127.0.0.1:8000/api";

  const viewCarDetails = (carId) => {
    console.log(`Viewing details for: ${carId}`);
    // You can implement navigation or state logic here
  };
useEffect(()=>{
  fetch(`${LOCAL_API_URL}/all_vehicles/?is_featured=true`, {
    method:'GET',
    headers:{
      'Content-Type': 'application/json',
    },
    credentials:'include'
  })
  .then(response =>response.json())
  .then(data =>{
    console.log(data.vehicles)
    setFeaturedCars(data.vehicles || [])
  })
},[])
  
  const getBadge = (car) => {
    if (car.is_featured) return "FEATURED";
    const currentYear = new Date().getFullYear();
    if (parseInt(car.year) >= currentYear) return "NEW";
    return null;
  };

  const getBadgeClass = (badge) => {
    switch (badge) {
      case "FEATURED":
        return "bg-purple-600";
      case "NEW":
        return "bg-green-600";
      default:
        return "bg-gray-500";
    }
  };

   
  return (
    <section className="py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 w-full mx-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300 border-t border-gray-900">
      {/* Section Header */}
      <div className="text-center mb-12 md:mb-16 lg:mb-20">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mb-6">
          <Award className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 dark:text-white mb-4 tracking-wide">
          Featured{" "}
          <span className="font-semibold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Listings
          </span>
        </h2>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover our handpicked selection of premium vehicles, carefully
          curated for discerning buyers
        </p>
      </div>

      {/* Cars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
        {featuredCars.map((car, index) => (
          <div
            key={car.id}
            className="group cursor-pointer"
            onClick={() => viewCarDetails(car.id)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-gray-100 dark:border-gray-700">
              {/* Car Image */}
              <div className="relative h-64 md:h-72 lg:h-80 overflow-hidden">
                <img
                  src={car.images[0]?.image_url || "default-car-image.jpg"}
                  // src={car.images.image}
                  alt={car.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                {/* Badge */}
                {getBadge(car) && (
                  <div
                    className={`absolute top-4 left-4 ${getBadgeClass(
                      getBadge(car)
                    )} text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-lg`}
                  >
                    {getBadge(car)}
                  </div>
                )}

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
                  {car.price}
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

      {/* Bottom CTA */}
      <div className="text-center mt-16 md:mt-20">
        <button
          onClick={() => navigate("/listings")}
          className="group inline-flex items-center space-x-3 bg-gradient-to-r from-gray-900 to-black dark:from-yellow-500 dark:to-yellow-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          <span>View All Listings</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </section>
  );
}

export default FeaturedCars;
