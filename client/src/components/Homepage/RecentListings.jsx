import React from 'react';
import CarCard from './CarCard';
import { Clock } from 'lucide-react';

const RecentListings = () => {
  // Mock data - replace with API call
  const recentCars = [
    {
      id: 1,
      year: 2022,
      make: 'Toyota',
      model: 'Camry XSE',
      price: 28500,
      mileage: 15000,
      location: 'Los Angeles, CA',
      image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format&fit=crop',
      newListing: true,
      seller: {
        name: 'AutoMax Dealers',
        type: 'Dealership',
        verified: true,
        rating: 4.8
      }
    },
    {
      id: 2,
      year: 2021,
      make: 'Honda',
      model: 'Accord Sport',
      price: 26900,
      mileage: 22000,
      location: 'San Diego, CA',
      image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&auto=format&fit=crop',
      newListing: true,
      seller: {
        name: 'John Smith',
        type: 'Private Seller',
        verified: false,
        rating: 4.5
      }
    },
    {
      id: 3,
      year: 2023,
      make: 'Tesla',
      model: 'Model 3',
      price: 42000,
      mileage: 8000,
      location: 'San Francisco, CA',
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop',
      featured: true,
      newListing: true,
      seller: {
        name: 'Elite Motors',
        type: 'Dealership',
        verified: true,
        rating: 4.9
      }
    },
    {
      id: 4,
      year: 2020,
      make: 'Ford',
      model: 'F-150 XLT',
      price: 35500,
      mileage: 45000,
      location: 'Sacramento, CA',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop',
      newListing: true,
      seller: {
        name: 'Truck World',
        type: 'Dealership',
        verified: true,
        rating: 4.7
      }
    }
  ];

  return (
    <section className='bg-white dark:bg-gray-900 '>
      <div className="flex items-center justify-between mb-6 ">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-yellow-500 dark:hover:text-yellow-400">Recently Listed</h2>
            <p className="text-sm text-yellow-500">Fresh arrivals from our sellers</p>
          </div>
        </div>
        <button className="text-yellow-600 dark:hover:text-yellow-400 font-semibold text-sm sm:text-base flex items-center gap-1">
          View All
          <span>→</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recentCars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>

      {/* Live Activity Indicator */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <p className="text-sm text-blue-900">
          <span className="font-semibold">23 new cars</span> listed in the last hour
        </p>
      </div>
    </section>
  );
};

export default RecentListings;
