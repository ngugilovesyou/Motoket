import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import ScrollSection from "../../../ScrollSection";
import FeaturedCars from "./Featured";
import Footer from "./Footer";
import Testimonials from "./Testimonial";
import About from "./About";

function Homepage() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeaturedCars />
      <About />
      <Testimonials />
      <Footer />
    </>
  );
}

export default Homepage;

