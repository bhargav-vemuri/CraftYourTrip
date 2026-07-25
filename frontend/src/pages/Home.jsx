import React from 'react';
import HeroSection from '../components/HeroSection';
import TripForm from '../components/TripForm';

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center">
      <HeroSection />
      <div className="w-full px-4 sm:px-6 lg:px-8 mt-2">
        <TripForm />
      </div>
    </div>
  );
}
