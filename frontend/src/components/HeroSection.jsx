import React from 'react';

export default function HeroSection() {
  return (
    <div className="text-center py-20 px-4 sm:px-6 lg:px-8 relative w-full max-w-4xl mx-auto animate-slide-up">
      <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-stone-900 dark:text-white mb-6 leading-tight animate-stagger-2">
        Design your perfect escape in <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-amber-600 to-teal-600 bg-[length:200%_auto] animate-gradient-x">
          seconds, not hours.
        </span>
      </h1>
      
      <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-stone-600 dark:text-stone-400 font-medium leading-relaxed animate-stagger-3">
        Describe your dream trip and let our intelligent engine craft a personalized, fully-optimized itinerary you can customize on the fly.
      </p>

    </div>
  );
}
