import React, { useState, memo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import StopCard from './StopCard';
import EditStopForm from './EditStopForm';

const DayCard = memo(function DayCard({ 
  day, 
  dayIndex, 
  onDeleteDay, 
  onAddStop, 
  onUpdateStop, 
  onDeleteStop,
  onToggleFavorite,
  onOptimize,
  onReplaceStop,
  activeStopId,
  onStopClick
}) {
  const [isAdding, setIsAdding] = useState(false);

  const { setNodeRef } = useDroppable({
    id: `day-${day.day}`,
  });

  return (
    <div className="mb-12 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 relative group/day">
      
      <div className="absolute top-6 right-6 flex gap-2">
        <button 
          onClick={onOptimize}
          className="px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-sm hover:shadow transition-all opacity-0 group-hover/day:opacity-100 flex items-center gap-1"
          title="Ask AI to optimize this day"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          Optimize Day
        </button>
        <button 
          onClick={() => onDeleteDay(dayIndex)}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover/day:opacity-100 transition-opacity"
          title="Delete entire day"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shadow-md shrink-0">
            {day.day}
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">{day.title}</h3>
            {day.summary && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{day.summary}</p>}
          </div>
        </div>

        {/* Intelligence Badges (Weather, Cost, Travel Time) */}
        <div className="flex flex-wrap items-center gap-2 sm:ml-auto mt-2 sm:mt-0 text-xs font-medium text-gray-600 dark:text-gray-400">
          {day.weather && (
            <div className="bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <span>{day.weather.condition}</span>
              <span className="opacity-75">|</span>
              <span>{day.weather.minTemp}°C - {day.weather.maxTemp}°C</span>
            </div>
          )}
          {day.totalTravelTime && (
            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              {day.totalTravelTime} transit
            </div>
          )}
          {day.estimatedCost > 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <span>Cost: ₹{day.estimatedCost.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
      
      <div ref={setNodeRef} className="relative min-h-[50px]">
        {day.stops.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-center transition-colors">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No activities planned yet.</p>
          </div>
        ) : (
          <SortableContext items={day.stops.map(s => s.id)} strategy={verticalListSortingStrategy}>
            {day.stops.map((stop, i) => (
              <StopCard 
                key={stop.id} 
                stop={stop} 
                index={i}
                isActive={activeStopId === stop.id}
                onClick={() => onStopClick(stop.id)}
                onUpdate={(updatedStop) => onUpdateStop(dayIndex, stop.id, updatedStop)}
                onDelete={() => onDeleteStop(dayIndex, stop.id)}
                onToggleFavorite={() => onToggleFavorite(dayIndex, stop.id)}
                onReplace={() => onReplaceStop(stop.id)}
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
              onSave={(newStop) => { onAddStop(dayIndex, newStop); setIsAdding(false); }}
              onCancel={() => setIsAdding(false)}
            />
          </div>
        ) : (
          <button 
            onClick={() => setIsAdding(true)}
            className="group flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors py-2"
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
});

export default DayCard;
