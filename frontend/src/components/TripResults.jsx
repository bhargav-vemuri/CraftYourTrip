import React from 'react';
import DaySection from './DaySection';

export default function TripResults({ itinerary }) {
  if (!itinerary) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mb-20 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          {itinerary.tripTitle}
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
          {itinerary.summary}
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 p-6 sm:p-10">
        {itinerary.days.map((day) => (
          <DaySection key={day.day} day={day} />
        ))}
      </div>
    </div>
  );
}
