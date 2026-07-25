import React from 'react';
import StopCard from './StopCard';

export default function DaySection({ day }) {
  return (
    <div className="mb-12">
      <div className="mb-6 flex items-center gap-4">
        <div className="bg-blue-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg shadow-sm">
          {day.day}
        </div>
        <h3 className="text-2xl font-bold text-gray-900">{day.title}</h3>
      </div>
      
      <div className="relative">
        {day.stops.map((stop) => (
          <StopCard key={stop.id} stop={stop} />
        ))}
      </div>
    </div>
  );
}
