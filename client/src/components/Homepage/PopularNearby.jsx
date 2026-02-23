import React from 'react';
import CarCard from './CarCard';
import { MapPin, TrendingUp } from 'lucide-react';

const PopularNearby = () => {
  // Mock data - replace with API call
  const popularCars = [
    {
      id: 5,
      year: 2021,
      make: 'BMW',
      model: '3 Series',
      price: 38900,
      mileage: 18000,
      location: 'Oakland, CA',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop',
      featured: true,
      seller: {
        name: 'Premium Auto Group',
        type: 'Dealership',
        verified: true,
        rating: 4.9
      }
    },
    {
      id: 6,
      year: 2022,
      make: 'Mazda',
      model: 'CX-5 Grand Touring',
      price: 32500,
      mileage: 12000,
      location: 'San Jose, CA',
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop',
      seller: {
        name: 'Valley Motors',
        type: 'Dealership',
        verified: true,
        rating: 4.6
      }
    },
    {
      id: 7,
      year: 2020,
      make: 'Jeep',
      model: 'Wrangler Unlimited',
      price: 36000,
      mileage: 28000,
      location: 'Fresno, CA',
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&auto=format&fit=crop',
      seller: {
        name: 'Sarah Johnson',
        type: 'Private Seller',
        verified: false,
        rating: 4.3
      }
    },
    {
      id: 8,
      year: 2023,
      make: 'Hyundai',
      model: 'Tucson SEL',
      price: 29800,
      mileage: 5000,
      location: 'Berkeley, CA',
      image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&auto=format&fit=crop',
      seller: {
        name: 'Bay Area Auto',
        type: 'Dealership',
        verified: true,
        rating: 4.7
      }
    }
  ];

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-yellow-500 dark:hover:text-yellow-400">Popular Near You</h2>
            <p className="text-sm text-yellow-500 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Within 50 miles of your location
            </p>
          </div>
        </div>
        <button className="text-yellow-600 dark:hover:text-yellow-400 font-semibold text-sm sm:text-base flex items-center gap-1">
          View All
          <span>→</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {popularCars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </section>
  );
};

export default PopularNearby;
