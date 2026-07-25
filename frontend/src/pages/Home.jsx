import React from 'react';

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-blue-600 mb-4">
        CraftYourTrip
      </h1>
      <p className="text-xl md:text-2xl text-gray-600 mb-8 font-light">
        AI-powered personalized travel planner
      </p>
      <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
        Project initialized successfully.
      </div>
    </div>
  );
}
