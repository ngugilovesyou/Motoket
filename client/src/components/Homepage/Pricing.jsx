import React from "react";
import { Check, Zap, Shield, Globe, Star } from "lucide-react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "Basic",
      price: "1,500",
      duration: "month",
      description: "Essential features to get started",
      features: [
        "5 vehicle listings",
        "Basic customer support",
        "Email notifications",
        "30-day listing duration",
      ],
      popular: false,
      icon: <Check className="w-5 h-5 text-green-500" />,
    },
    {
      name: "Professional",
      price: "3,500",
      duration: "month",
      description: "For serious sellers",
      features: [
        "20 vehicle listings",
        "Priority customer support",
        "SMS & email alerts",
        "Featured listings",
        "90-day listing duration",
        "Basic analytics",
      ],
      popular: true,
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
    },
    {
      name: "Enterprise",
      price: "8,000",
      duration: "month",
      description: "Maximum exposure",
      features: [
        "Unlimited listings",
        "24/7 VIP support",
        "Top search placement",
        "Advanced analytics",
        "Social media promotion",
        "Professional photoshoot (1/month)",
      ],
      popular: false,
      icon: <Globe className="w-5 h-5 text-blue-500" />,
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Flexible Pricing for Every Seller
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Choose the plan that fits your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-800/50 ${
                  plan.popular
                    ? "ring-2 ring-yellow-500 dark:ring-yellow-400 transform scale-[1.02]"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-4 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    POPULAR
                  </div>
                )}

                <div className="flex items-center mb-4">
                  <div className="mr-3 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    {plan.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {plan.name}
                  </h3>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    {plan.description}
                  </p>
                  <div className="flex items-end">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      KES {plan.price}
                    </span>
                    <span className="ml-1 text-gray-500 dark:text-gray-400">
                      /{plan.duration}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 mr-2" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link to={"/payment"}

                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                    plan.popular
                      ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                      : "bg-gray-900 dark:bg-white dark:text-gray-900 text-white hover:bg-gray-800 dark:hover:bg-gray-200"
                  }`}
                >
                  Get Started
                </Link>

                {plan.popular && (
                  <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Shield className="w-4 h-4 mr-1 text-green-500" />
                    Most trusted choice
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gray-100 dark:bg-gray-800 rounded-xl p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Not sure which plan to choose?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our team can help you select the perfect package for your needs.
            </p>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900">
              Contact Sales
              <svg
                className="ml-2 -mr-1 w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pricing;
