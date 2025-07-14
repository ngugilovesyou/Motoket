import React from "react";

function About() {
  return (
    <section id="about" className="px-4 py-12 sm:px-6 lg:px-16 bg-white dark:bg-gray-900 transition-colors duration-300 h-screen">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          About Motoket
        </h2>
        <p className="mt-3 text-base sm:text-lg text-gray-600 dark:text-gray-300">
          Your premier destination for luxury and premium vehicles
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Our Mission
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            To provide the finest selection of luxury vehicles with unparalleled
            service and expertise. We connect discerning buyers with their dream
            cars through a curated marketplace experience.
          </p>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quality Assurance
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Every vehicle in our inventory undergoes rigorous inspection and
            verification. We ensure authenticity, condition, and complete
            documentation for your peace of mind.
          </p>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Expert Team
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Our automotive specialists have decades of experience in luxury
            vehicles. From valuation to financing, we provide expert guidance
            throughout your journey.
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;
