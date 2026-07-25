import React, { useState } from 'react';
import HeroSection from '../components/HeroSection';
import TripForm from '../components/TripForm';
import TripResults from '../components/TripResults';

export default function Home() {
  const [itinerary, setItinerary] = useState(null);

  return (
    <div className="w-full flex flex-col items-center">
      <HeroSection />
      
      {!itinerary ? (
        <div className="w-full px-4 sm:px-6 lg:px-8 mt-2">
          <TripForm onSuccess={setItinerary} />
        </div>
      ) : (
        <div className="w-full px-4 sm:px-6 lg:px-8 mt-4">
          <TripResults itinerary={itinerary} />
          
          <div className="text-center mb-20">
            <button 
              onClick={() => setItinerary(null)}
              className="text-blue-600 font-medium hover:text-blue-800 transition-colors underline"
            >
              Start over and plan another trip
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
