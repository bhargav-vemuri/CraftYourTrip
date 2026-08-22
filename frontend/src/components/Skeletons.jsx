import React, { useState, useEffect } from 'react';

const LOADING_PHRASES = [
  "✨ Crafting your perfect itinerary...",
  "🗺️ Searching for hidden gems...",
  "🚗 Calculating real-world travel routes...",
  "⛅ Checking the weather forecasts...",
  "🎯 Optimizing for the best experience...",
  "🧳 Almost there, packing the bags..."
];

export function TripSkeleton() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % LOADING_PHRASES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto mb-20 relative flex items-center justify-center min-h-[400px]">
      
      {/* Animated Loading Phrase Only */}
      <div className="text-center flex flex-col items-center justify-center">
        <h3 
          key={phraseIndex} 
          className="text-2xl sm:text-4xl font-black text-stone-800 dark:text-stone-100 tracking-tight animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-amber-600 to-teal-600"
        >
          {LOADING_PHRASES[phraseIndex]}
        </h3>
      </div>
    </div>
  );
}

export function DaySkeleton() {
  return (
    <div className="mb-12 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
      <div className="mb-8 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-48"></div>
      </div>
      
      <div className="space-y-4">
        <StopCardSkeleton />
        <StopCardSkeleton />
        <StopCardSkeleton />
      </div>
    </div>
  );
}

export function StopCardSkeleton() {
  return (
    <div className="relative pl-8 sm:pl-32 py-6">
      {/* Timeline line and dot */}
      <div className="absolute left-0 sm:left-24 top-0 bottom-0 w-px bg-gray-100 dark:bg-gray-800"></div>
      <div className="absolute left-[-4px] sm:left-[92px] top-8 w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700 ring-4 ring-white dark:ring-gray-900"></div>
      
      {/* Time column */}
      <div className="sm:absolute sm:left-0 sm:w-20 sm:top-7 mb-2 sm:mb-0">
        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-12 ml-auto"></div>
      </div>

      {/* Card Content */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
        <div className="flex justify-between items-start mb-3">
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
          <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-full w-16"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
        </div>
        <div className="mt-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
}
