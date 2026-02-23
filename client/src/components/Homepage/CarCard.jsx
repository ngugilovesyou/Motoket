import React from 'react';
import { MapPin, Calendar, Gauge, Heart, Verified } from 'lucide-react';

const CarCard = ({ car, featured = false }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group ${featured ? 'ring-2 ring-blue-500' : ''}`}>
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={car.image}
          alt={`${car.year} ${car.make} ${car.model}`}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {car.featured && (
            <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
              FEATURED
            </span>
          )}
          {car.newListing && (
            <span className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded">
              NEW
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
          <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
        </button>

        {/* Price Tag */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg">
          <div className="text-xl font-bold text-gray-900">${car.price.toLocaleString()}</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
          {car.year} {car.make} {car.model}
        </h3>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-2 mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Gauge className="w-4 h-4" />
            <span>{car.mileage.toLocaleString()} mi</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{car.year}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{car.location}</span>
          </div>
        </div>

        {/* Seller Info */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {car.seller.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-gray-900">{car.seller.name}</span>
                {car.seller.verified && (
                  <Verified className="w-4 h-4 text-blue-500 fill-blue-500" />
                )}
              </div>
              <span className="text-xs text-gray-500">{car.seller.type}</span>
            </div>
          </div>
          
          {car.seller.rating && (
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              <span className="text-sm font-semibold text-gray-900">{car.seller.rating}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarCard;
