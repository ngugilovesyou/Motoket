import React from 'react';
import { Search, MessageCircle, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: 'Browse & Search',
      description:
        'Search thousands of cars from verified sellers across the country. Filter by make, model, price, and location.',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      iconColor: 'text-yellow-500 dark:hover:text-yellow-400'
    },
    {
      icon: MessageCircle,
      title: 'Connect with Sellers',
      description:
        'Message sellers directly, schedule test drives, and ask questions. All communications are secure and tracked.',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      iconColor: 'text-yellow-500 dark:hover:text-yellow-400'
    },
    {
      icon: CheckCircle,
      title: 'Complete Your Purchase',
      description:
        'Review vehicle history, arrange inspections, and finalize your purchase with confidence. We guide you every step.',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      iconColor: 'text-yellow-500 dark:hover:text-yellow-400'
    }
  ];

  return (
    <section id="how-it-works" className="bg-white dark:bg-gray-900  shadow-sm p-8 border border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          How Motoket Works
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          The easiest way to buy and sell cars online. Join thousands of happy customers and sellers.
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gray-200 dark:bg-gray-700 z-0"></div>
              )}

              <div className="relative z-10 text-center">
                {/* Icon */}
                <div
                  className={`${step.bgColor} w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md`}
                >
                  <Icon className={`w-12 h-12 ${step.iconColor}`} />
                </div>

                {/* Step Number */}
                <div className="inline-block bg-yellow-500 text-white text-sm font-bold px-3 py-1 rounded-full mb-3">
                  Step {index + 1}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats */}
     <div className="mt-12 pt-10 border-t border-gray-200 dark:border-gray-800">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12 text-center">
    {[
      ['24/7', 'Support Available'],
      
      ['Free', 'For Buyers']
    ].map(([value, label]) => (
      <div
        key={label}
        className="flex flex-col items-center space-y-2"
      >
        <div className="text-3xl md:text-4xl font-bold text-yellow-500 dark:hover:text-yellow-400">
          {value}
        </div>
        <div className="text-sm md:text-base text-gray-600 dark:text-gray-400">
          {label}
        </div>
      </div>
    ))}
  </div>
</div>

    </section>
  );
};

export default HowItWorks;
