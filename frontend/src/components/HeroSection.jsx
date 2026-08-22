import React from 'react';

export default function HeroSection() {
  return (
    <div className="text-center py-20 px-4 sm:px-6 lg:px-8 relative w-full max-w-4xl mx-auto">
      
      {/* Decorative badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100/50 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800 mb-8 backdrop-blur-sm">
        <span className="flex h-2 w-2 rounded-full bg-violet-500 animate-pulse"></span>
        <span className="text-xs font-bold tracking-wide text-violet-700 dark:text-violet-300 uppercase">Powered by Gemini AI</span>
      </div>

      <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-900 dark:text-white mb-6 leading-tight">
        Design your perfect escape in <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 animate-gradient-x">
          seconds, not hours.
        </span>
      </h1>
      
      <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
        Describe your dream trip and let our intelligent engine craft a personalized, fully-optimized itinerary you can customize on the fly.
      </p>

    </div>
  );
}
