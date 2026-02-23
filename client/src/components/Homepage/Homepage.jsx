import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import ScrollSection from "../../../ScrollSection";
import FeaturedCars from "./Featured";
import Footer from "./Footer";
import Testimonials from "./Testimonial";
import About from "./About";
import SearchFilter from "./SearchFilter";
import HowItWorks from "./HowItWorks";
import MarketplaceStats from "./MarketplaceStats";
import QuickCategories from "./QuickCategories";
import RecentListings from "./RecentListings";
import PopularNearby from "./PopularNearby";
import BestDeals from "./BestDeals";
import TrustedSellers from "./TrustedSellers";
import ParticipationCTA from "./ParticipationCTA";

function Homepage() {
  return (
    <>
      <Navbar />
      <div className=" ">
        
      </div>
      <SearchFilter />
      <MarketplaceStats />
      <QuickCategories />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 bg-white dark:bg-gray-900">
        {/* Recent Listings */}
        <RecentListings />

        {/* Popular Nearby */}
        <PopularNearby />

        {/* Best Deals */}
        <BestDeals />

        {/* Trusted Sellers */}
        <TrustedSellers />
      </div>

      <HowItWorks />

      <ParticipationCTA />
      <Footer />
    </>
  );
}

export default Homepage;