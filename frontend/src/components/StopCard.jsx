import React from 'react';
import CategoryBadge from './CategoryBadge';

export default function StopCard({ stop }) {
  return (
    <div className="relative pl-8 sm:pl-32 py-6 group">
      {/* Timeline line and dot */}
      <div className="absolute left-0 sm:left-24 top-0 bottom-0 w-px bg-gray-200"></div>
      <div className="absolute left-[-4px] sm:left-[92px] top-8 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white"></div>
      
      {/* Time column (desktop) / header (mobile) */}
      <div className="sm:absolute sm:left-0 sm:w-20 sm:text-right sm:top-7 mb-2 sm:mb-0">
        <span className="text-sm font-bold text-gray-500 block">{stop.time}</span>
        <span className="text-xs text-gray-400 block mt-1">{stop.duration}</span>
      </div>

      {/* Card Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
          <h4 className="text-lg font-bold text-gray-900">{stop.name}</h4>
          <CategoryBadge category={stop.category} />
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">
          {stop.description}
        </p>
      </div>
    </div>
  );
}
