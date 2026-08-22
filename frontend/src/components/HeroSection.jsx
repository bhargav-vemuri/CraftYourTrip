import React from 'react';

export default function HeroSection() {
  return (
    <div className="text-center py-20 px-4 sm:px-6 lg:px-8 relative w-full max-w-4xl mx-auto animate-slide-up">
      
      {/* Decorative badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 mb-8 backdrop-blur-sm transition-transform hover:scale-105 duration-300 cursor-default">
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="text-xs font-bold tracking-wide text-emerald-700 dark:text-emerald-300 uppercase">Powered by Gemini AI</span>
      </div>

      <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-stone-900 dark:text-white mb-6 leading-tight">
        Design your perfect escape in <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-[length:200%_auto] animate-gradient-x">
          seconds, not hours.
        </span>
      </h1>
      
      <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-stone-600 dark:text-stone-400 font-medium leading-relaxed">
        Describe your dream trip and let our intelligent engine craft a personalized, fully-optimized itinerary you can customize on the fly.
      </p>

    </div>
  );
}
