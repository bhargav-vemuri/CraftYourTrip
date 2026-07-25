import React from 'react';
import HeroSection from '../components/HeroSection';
import TripForm from '../components/TripForm';
import TripResults from '../components/TripResults';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Home() {
  const [itinerary, setItinerary] = useLocalStorage('craftyourtrip-itinerary', null);

  return (
    <div className="w-full flex flex-col items-center">
      {!itinerary && <HeroSection />}
      
      {!itinerary ? (
        <div className="w-full sm:px-6 lg:px-8 mt-2 animate-fade-in">
          <TripForm onSuccess={setItinerary} />
        </div>
      ) : (
        <div className="w-full sm:px-6 lg:px-8 mt-4 animate-fade-in">
          <TripResults itinerary={itinerary} onUpdateItinerary={setItinerary} />
          
          <div className="text-center mb-20 mt-8">
            <button 
              onClick={() => {
                if (window.confirm("Are you sure you want to start a new trip? Your current itinerary will be lost.")) {
                  setItinerary(null);
                }
              }}
              className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Start over and plan another trip
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
