import React from 'react';

export default function EmptyState() {
  return (
    <div className="w-full max-w-2xl mx-auto py-16 px-4 text-center">
      <div className="text-6xl mb-6 transform hover:scale-110 transition-transform duration-300">
        🧳
      </div>
      <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
        Plan your next adventure.
      </h3>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto font-light leading-relaxed">
        Describe your destination and let AI craft a personalized itinerary just for you.
      </p>
    </div>
  );
}
