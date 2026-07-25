import React, { useState } from 'react';
import StopCard from './StopCard';
import EditStopForm from './EditStopForm';

export default function DayCard({ 
  day, 
  dayIndex, 
  onDeleteDay, 
  onAddStop, 
  onUpdateStop, 
  onDeleteStop, 
  onMoveStop 
}) {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="mb-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative group/day">
      
      {/* Delete Day Button - visible on hover */}
      <button 
        onClick={() => onDeleteDay(dayIndex)}
        className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover/day:opacity-100 transition-opacity"
        title="Delete entire day"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
      </button>

      <div className="mb-8 flex items-center gap-4 border-b border-gray-100 pb-4">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shadow-md">
          {day.day}
        </div>
        <h3 className="text-2xl font-extrabold text-gray-900">{day.title}</h3>
      </div>
      
      <div className="relative">
        {day.stops.map((stop, stopIndex) => (
          <StopCard 
            key={stop.id} 
            stop={stop} 
            isFirst={stopIndex === 0}
            isLast={stopIndex === day.stops.length - 1}
            onUpdate={(updatedStop) => onUpdateStop(dayIndex, stop.id, updatedStop)}
            onDelete={() => onDeleteStop(dayIndex, stop.id)}
            onMoveUp={() => onMoveStop(dayIndex, stopIndex, -1)}
            onMoveDown={() => onMoveStop(dayIndex, stopIndex, 1)}
          />
        ))}
      </div>

      <div className="mt-6 pl-8 sm:pl-32">
        {isAdding ? (
          <div className="mt-4">
            <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Add New Stop</h4>
            <EditStopForm 
              onSave={(newStop) => {
                onAddStop(dayIndex, newStop);
                setIsAdding(false);
              }}
              onCancel={() => setIsAdding(false)}
            />
          </div>
        ) : (
          <button 
            onClick={() => setIsAdding(true)}
            className="group flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors py-2"
          >
            <div className="w-8 h-8 rounded-full bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
            </div>
            Add a stop
          </button>
        )}
      </div>
    </div>
  );
}
