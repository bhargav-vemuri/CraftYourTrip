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
    <div className="mb-12 bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/50 dark:border-stone-800/80 p-6 sm:p-8 relative group/day transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
      
      <div className="mb-10 flex flex-col xl:flex-row xl:items-start gap-6 border-b border-stone-100 dark:border-stone-800 pb-6 relative">
        <div className="flex items-center gap-5 flex-1">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl blur opacity-40"></div>
            <div className="relative bg-gradient-to-br from-emerald-600 to-teal-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg border border-white/20 shrink-0">
              {day.day}
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">{day.title}</h3>
            {day.summary && <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 font-medium">{day.summary}</p>}
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          {/* Action Buttons */}
          <div className="flex gap-2 z-20">
            <button 
              onClick={onOptimize}
              className="px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-600 rounded-lg shadow-sm hover:shadow-md transition-all opacity-0 group-hover/day:opacity-100 flex items-center gap-1 hover:scale-105"
              title="Ask AI to optimize this day"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Optimize Day
            </button>
            <button 
              onClick={() => onDeleteDay(dayIndex)}
              className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover/day:opacity-100 transition-opacity"
              title="Delete entire day"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>

        {/* Intelligence Badges (Weather, Cost, Travel Time) */}
        <div className="flex flex-wrap items-center gap-2 sm:ml-auto mt-2 sm:mt-0 text-xs font-bold text-stone-600 dark:text-stone-400">
          {day.weather && (
            <div className="bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-sky-100 dark:border-sky-800/50">
              <span>{day.weather.condition}</span>
              <span className="opacity-50">|</span>
              <span>{day.weather.minTemp}&deg;C - {day.weather.maxTemp}&deg;C</span>
            </div>
          )}
          {day.totalTravelTime && (
            <div className="bg-stone-100 dark:bg-stone-800/80 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-stone-200 dark:border-stone-700/50">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              {day.totalTravelTime} transit
            </div>
          )}
          {day.estimatedCost > 0 && (
            <div className="bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-amber-100 dark:border-amber-800/50">
              <span>Cost: ₹{day.estimatedCost.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
      
      <div ref={setNodeRef} className="relative min-h-[50px]">
        {day.stops.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-2xl bg-stone-50/50 dark:bg-stone-900/50 text-center transition-colors">
            <p className="text-sm font-semibold text-stone-500 dark:text-stone-400">No activities planned yet.</p>
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

      <div className="mt-8 pl-6 sm:pl-[5.5rem]">
        {isAdding ? (
          <div className="mt-4">
            <h4 className="text-sm font-bold text-stone-700 dark:text-stone-300 mb-3 uppercase tracking-wider">Add New Stop</h4>
            <EditStopForm 
              onSave={(newStop) => { onAddStop(dayIndex, newStop); setIsAdding(false); }}
              onCancel={() => setIsAdding(false)}
            />
          </div>
        ) : (
          <button 
            onClick={() => setIsAdding(true)}
            className="group flex items-center gap-3 text-sm font-bold text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition-colors py-2"
          >
            <div className="w-10 h-10 rounded-full bg-teal-100/50 dark:bg-teal-900/30 group-hover:bg-teal-200 dark:group-hover:bg-teal-800/50 flex items-center justify-center transition-colors border border-teal-200/50 dark:border-teal-800/50">
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
