import React from 'react';

export default function LoadingState() {
  return (
    <div className="w-full max-w-2xl mx-auto py-16 px-4 text-center">
      <div className="inline-block relative w-20 h-20 mb-8">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-100 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3 animate-pulse">
        Crafting your personalized itinerary...
      </h3>
      <p className="text-gray-500 text-lg">
        This may take a few seconds.
      </p>
    </div>
  );
}
