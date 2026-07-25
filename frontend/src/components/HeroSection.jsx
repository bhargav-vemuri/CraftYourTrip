import React from 'react';

export default function HeroSection() {
  return (
    <div className="text-center py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
          CraftYourTrip
        </span>
      </h1>
      <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-2xl">
        AI-powered personalized travel planner
      </p>
      <div className="mt-5 max-w-2xl mx-auto sm:flex sm:justify-center md:mt-8">
        <p className="text-lg text-gray-600 font-medium bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          "Describe your dream trip and let AI craft a personalized itinerary you can customize and organize."
        </p>
      </div>
    </div>
  );
}
