// import React from 'react'

// function Hero() {
//   return (
//     <section className="hero" id="home">
//       <div className="hero-content">
//         <h1 className="hero-title">Find Your Dream Car</h1>
//         <div className="search-container">
//           <div className="search-filters">
//             <div className="filter-group">
//               <select>
//                 <option>Make</option>
//                 <option>BMW</option>
//                 <option>Mercedes-Benz</option>
//                 <option>Audi</option>
//                 <option>Lexus</option>
//                 <option>Porsche</option>
//               </select>
//             </div>
//             <div className="filter-group">
//               <select>
//                 <option>Model</option>
//                 <option>X5</option>
//                 <option>GLC</option>
//                 <option>Q7</option>
//                 <option>RX</option>
//               </select>
//             </div>
//             <div className="filter-group">
//               <select>
//                 <option>Price Range</option>
//                 <option>$50K - $75K</option>
//                 <option>$75K - $100K</option>
//                 <option>$100K - $150K</option>
//                 <option>$150K+</option>
//               </select>
//             </div>
//             <div className="filter-group">
//               <select>
//                 <option>Year</option>
//                 <option>2024</option>
//                 <option>2023</option>
//                 <option>2022</option>
//                 <option>2021</option>
//               </select>
//             </div>
//           </div>
//           <button className="cta-button">
//             Explore Listings
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Hero


// import React from "react";
// import { Search } from "lucide-react";

// function Hero() {
//   return (
//     <>
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 pt-16 md:pt-20 border-t border-gray-800">
//         {/* Hero Section */}
//         <section className="relative h-screen flex items-center justify-center overflow-hidden">
//           {/* Background Image with Overlay */}
//           <div
//             className="absolute inset-0 bg-cover bg-center bg-no-repeat"
//             style={{
//               backgroundImage: `url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
//             }}
//           />
//           {/* Dark overlay for better text readability */}
//           <div className="absolute inset-0 bg-black/40"></div>

//           {/* Animated Background Elements */}
//           <div className="absolute inset-0">
//             <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
//             <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-r from-yellow-400/20 to-red-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
//           </div>

//           {/* Hero Content */}
//           <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center">
//               {/* Main Title */}
//               <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 sm:mb-8 md:mb-8">
//                 <span className="block drop-shadow-2xl bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent animate-pulse">
//                   Find Your Dream Car
//                 </span>
//                 {/* <span className="block drop-shadow-2xl bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent"></span> */}
//               </h1>

//               {/* Subtitle */}
//               <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 sm:mb-12 max-w-3xl mx-auto drop-shadow-lg">
//                 Discover premium vehicles that match your style and budget
//               </p>

//               {/* Search Container */}
//               <div className="max-w-4xl mx-auto">
//                 <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-white/20 dark:border-gray-700/20">
//                   {/* Search Filters Grid */}
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
//                     {/* Make Filter */}
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                         Make
//                       </label>
//                       <select className="w-full p-3 sm:p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500">
//                         <option>Select Make</option>
//                         <option>BMW</option>
//                         <option>Mercedes-Benz</option>
//                         <option>Audi</option>
//                         <option>Lexus</option>
//                         <option>Porsche</option>
//                         <option>Tesla</option>
//                         <option>Jaguar</option>
//                       </select>
//                     </div>

//                     {/* Model Filter */}
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                         Model
//                       </label>
//                       <select className="w-full p-3 sm:p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500">
//                         <option>Select Model</option>
//                         <option>X5</option>
//                         <option>GLC</option>
//                         <option>Q7</option>
//                         <option>RX</option>
//                         <option>Model S</option>
//                         <option>F-Pace</option>
//                       </select>
//                     </div>

//                     {/* Price Range Filter */}
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                         Price Range
//                       </label>
//                       <select className="w-full p-3 sm:p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500">
//                         <option>Select Price</option>
//                         <option>$25K - $50K</option>
//                         <option>$50K - $75K</option>
//                         <option>$75K - $100K</option>
//                         <option>$100K - $150K</option>
//                         <option>$150K+</option>
//                       </select>
//                     </div>

//                     {/* Year Filter */}
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                         Year
//                       </label>
//                       <select className="w-full p-3 sm:p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-0 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500">
//                         <option>Select Year</option>
//                         <option>2024</option>
//                         <option>2023</option>
//                         <option>2022</option>
//                         <option>2021</option>
//                         <option>2020</option>
//                       </select>
//                     </div>
//                   </div>

//                   {/* CTA Button */}
//                   <button className="group w-full p-4 sm:p-5 bg-gradient-to-r from-gray-900 to-black dark:from-yellow-500 dark:to-yellow-600 text-white font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wider relative overflow-hidden">
//                     <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                     <div className="relative flex items-center justify-center space-x-3">
//                       <Search size={20} className="group-hover:animate-pulse" />
//                       <span>Explore Premium Listings</span>
//                     </div>
//                   </button>

//                   {/* Additional Info */}
//                   <div className="mt-6 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-600 dark:text-gray-400">
//                     <div className="flex items-center space-x-2">
//                       <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                       <span>1000+ Premium Cars</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//                       <span>Verified Dealers</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
//                       <span>Best Prices</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     </>
//   );
// }

// export default Hero;

import React from "react";
import { Search } from "lucide-react";

function Hero() {
  return (
    <div id="home" className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 pt-16 md:pt-20 border-t border-gray-800 mt-1">
      <section className="relative min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Background Pulses */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-r from-yellow-400/20 to-red-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 sm:mb-8 md:mb-8">
            <span className="block drop-shadow-2xl bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent animate-pulse">
              Find Your Dream Car
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 sm:mb-12 max-w-3xl mx-auto drop-shadow-lg">
            Discover premium vehicles that match your style and budget
          </p>

          
        </div>
      </section>
    </div>
  );
}
export default Hero