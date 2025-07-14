import React from "react";

const reviews = [
  {
    name: "John K.",
    comment: "Motoket helped me find my dream car quickly!",
    rating: 5,
  },
  { name: "Mary A.", comment: "Smooth and trustworthy experience.", rating: 4 },
  { name: "David O.", comment: "Best car platform in Kenya!", rating: 5 },
];

function Testimonials() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-12">What Our Users Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 shadow-md transition-colors duration-300"
            >
              <p className="italic text-lg mb-4">"{r.comment}"</p>
              <div className="font-semibold mb-2">- {r.name}</div>
              <div className="text-yellow-400 text-xl">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
