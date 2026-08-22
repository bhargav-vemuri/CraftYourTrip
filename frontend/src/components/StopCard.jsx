import React, { useState, memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CategoryBadge from './CategoryBadge';
import ExpandableSection from './ExpandableSection';
import EditStopForm from './EditStopForm';

const StopCard = memo(function StopCard({ 
  stop,
  index,
  onUpdate, 
  onDelete,
  onToggleFavorite,
  onReplace,
  isActive,
  onClick,
  isOverlay = false
}) {
  const [isEditing, setIsEditing] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: stop.id, disabled: isEditing || isOverlay 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.3 : 1,
  };

  if (isEditing) {
    return (
      <div className="relative pl-8 sm:pl-32 py-6">
        <div className="absolute left-0 sm:left-24 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-800"></div>
        <div className="absolute left-[-4px] sm:left-[92px] top-8 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white dark:ring-gray-900"></div>
        <EditStopForm 
          initialStop={stop} 
          onSave={(updated) => { onUpdate(updated); setIsEditing(false); }} 
          onCancel={() => setIsEditing(false)} 
        />
      </div>
    );
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`relative pl-8 sm:pl-32 py-6 group ${isOverlay ? 'scale-105 shadow-2xl opacity-100 z-50' : ''}`}
    >
      {/* Route Intelligence from previous stop (only show if it's not the first stop and has route info) */}
      {!isOverlay && stop.travelInfo && index > 0 && (
        <div className="absolute left-4 sm:left-28 -top-3 bg-teal-50 dark:bg-teal-900/30 z-10 px-2 flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-800/50 rounded-full shadow-sm backdrop-blur-md">
          {stop.travelInfo.mode === 'Driving' ? (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          )}
          {stop.travelInfo.duration} · {stop.travelInfo.distance}
        </div>
      )}

      {!isOverlay && (
        <>
          <div className="absolute left-0 sm:left-24 top-0 bottom-0 w-px bg-stone-200 dark:bg-stone-800/80"></div>
          <div className={`absolute left-[-4px] sm:left-[92px] top-8 w-3 h-3 rounded-full ${isActive ? 'bg-emerald-600 ring-4 ring-emerald-100 dark:ring-emerald-900/50 scale-125 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-stone-300 dark:bg-stone-600 ring-4 ring-white dark:ring-stone-900/50'} transition-all duration-300`}></div>
        </>
      )}
      
      <div className="sm:absolute sm:left-0 sm:w-20 sm:text-right sm:top-7 mb-2 sm:mb-0 flex items-center justify-between sm:justify-end">
        <span className="text-sm font-black text-stone-500 dark:text-stone-400 block tracking-tight">{stop.time}</span>
      </div>

      <div 
        onClick={onClick}
        className={`bg-white/80 dark:bg-stone-900/80 backdrop-blur-lg rounded-2xl border p-5 transition-all duration-300 relative cursor-pointer group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] ${
          isDragging ? 'border-emerald-300 dark:border-emerald-700 shadow-xl ring-2 ring-emerald-100 dark:ring-emerald-900/50' : 
          isOverlay ? 'border-emerald-400 dark:border-emerald-600 shadow-2xl ring-4 ring-emerald-200 dark:ring-emerald-900/50 cursor-grabbing' : 
          isActive ? 'border-emerald-400 dark:border-emerald-600 shadow-md ring-1 ring-emerald-400' :
          'border-stone-200/60 dark:border-stone-800/60 shadow-sm hover:border-emerald-200 dark:hover:border-emerald-800/80 hover:-translate-y-0.5'
        }`}
      >
        
        {/* Action controls */}
        <div className={`absolute -top-3 right-4 bg-white dark:bg-stone-900 shadow-sm border rounded-lg flex items-center overflow-hidden transition-opacity duration-200 ${
            isOverlay || isDragging || isActive ? 'opacity-100 border-emerald-200 dark:border-emerald-800' : 'opacity-0 group-hover:opacity-100 border-stone-200 dark:border-stone-800'
          }`}
        >
          <button {...attributes} {...listeners} className={`p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-50 dark:hover:bg-stone-800 ${isOverlay ? 'cursor-grabbing' : 'cursor-grab'}`} title="Drag">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"/></svg>
          </button>
          
          <button onClick={(e) => { e.stopPropagation(); onReplace(); }} className="p-1.5 hover:bg-teal-50 dark:hover:bg-teal-900/20 text-teal-600 dark:text-teal-400 border-l border-stone-100 dark:border-stone-800 transition-colors" title="Ask AI for Alternative">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
          </button>

          <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }} className="p-1.5 hover:bg-amber-50 dark:hover:bg-amber-900/20 border-l border-stone-100 dark:border-stone-800 transition-colors">
            <svg className={`w-4 h-4 ${stop.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-stone-300 dark:text-stone-500 hover:text-amber-400'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-l border-stone-100 dark:border-stone-800 transition-colors" title="Edit">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 border-l border-stone-100 dark:border-stone-800 transition-colors" title="Delete">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>

        <ExpandableSection 
          preview={
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-bold text-stone-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{stop.name}</h4>
                </div>
                {/* Place Validation Intelligence */}
                {stop.rating ? (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs font-bold text-stone-700 dark:text-stone-300">{stop.rating}</span>
                    <svg className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    <span className="text-xs text-stone-400 ml-1 truncate max-w-[200px]">{stop.address}</span>
                  </div>
                ) : stop.address ? (
                  <div className="mt-1 text-xs text-stone-400 truncate max-w-[250px]">{stop.address}</div>
                ) : null}
              </div>
              <CategoryBadge category={stop.category} />
            </div>
          }
        >
          <div className="mt-2 text-stone-600 dark:text-stone-400 text-sm leading-relaxed border-t border-stone-100 dark:border-stone-800 pt-4">
            <p className="mb-4">{stop.description}</p>
            {stop.why && (
              <p className="mb-4 text-xs italic font-medium bg-emerald-50/50 dark:bg-emerald-900/20 p-3 rounded-xl text-emerald-800 dark:text-emerald-300 border border-emerald-100/50 dark:border-emerald-800/30">
                ✨ {stop.why}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 text-stone-500 font-bold text-xs bg-stone-50 dark:bg-stone-800/80 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700/50">
                <svg className="w-3.5 h-3.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                {stop.duration}
              </div>
              {stop.estimatedCost > 0 && (
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
                  Est. ₹{stop.estimatedCost.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </ExpandableSection>
      </div>
    </div>
  );
});

export default StopCard;
