import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import StopCard from './StopCard';
import EditStopForm from './EditStopForm';

export default function DayCard({ 
  day, 
  dayIndex, 
  onDeleteDay, 
  onAddStop, 
  onUpdateStop, 
  onDeleteStop,
  onToggleFavorite
}) {
  const [isAdding, setIsAdding] = useState(false);

  // Droppable zone for the day container itself (to support dropping into empty days)
  const { setNodeRef } = useDroppable({
    id: `day-${day.day}`,
  });

  return (
    <div className="mb-12 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 relative group/day">
      
      <button 
        onClick={() => onDeleteDay(dayIndex)}
        className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover/day:opacity-100 transition-opacity"
        title="Delete entire day"
        aria-label="Delete day"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
      </button>

      <div className="mb-8 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shadow-md">
          {day.day}
        </div>
        <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">{day.title}</h3>
      </div>
      
      <div ref={setNodeRef} className="relative min-h-[50px]">
        {day.stops.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-center transition-colors">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No activities planned yet.</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Drag stops here or click "Add a stop" below.</p>
          </div>
        ) : (
          <SortableContext items={day.stops.map(s => s.id)} strategy={verticalListSortingStrategy}>
            {day.stops.map((stop) => (
              <StopCard 
                key={stop.id} 
                stop={stop} 
                onUpdate={(updatedStop) => onUpdateStop(dayIndex, stop.id, updatedStop)}
                onDelete={() => onDeleteStop(dayIndex, stop.id)}
                onToggleFavorite={() => onToggleFavorite(dayIndex, stop.id)}
              />
            ))}
          </SortableContext>
        )}
      </div>

      <div className="mt-6 pl-8 sm:pl-32">
        {isAdding ? (
          <div className="mt-4">
            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">Add New Stop</h4>
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
            className="group flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors py-2"
            aria-label="Add a stop"
          >
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/50 flex items-center justify-center transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
            </div>
            Add a stop
          </button>
        )}
      </div>
    </div>
  );
}
