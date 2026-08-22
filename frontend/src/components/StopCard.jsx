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
        <div className="absolute left-4 sm:left-28 -top-3 bg-white dark:bg-gray-900 z-10 px-2 flex items-center gap-1.5 text-xs font-medium text-indigo-500 dark:text-indigo-400 border border-gray-100 dark:border-gray-800 rounded-full shadow-sm">
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
          <div className="absolute left-0 sm:left-24 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-800"></div>
          <div className={`absolute left-[-4px] sm:left-[92px] top-8 w-3 h-3 rounded-full ${isActive ? 'bg-blue-600 ring-4 ring-blue-100 dark:ring-blue-900/50 scale-125' : 'bg-blue-400 ring-4 ring-white dark:ring-gray-900'} transition-all duration-200`}></div>
        </>
      )}
      
      <div className="sm:absolute sm:left-0 sm:w-20 sm:text-right sm:top-7 mb-2 sm:mb-0 flex items-center justify-between sm:justify-end">
        <span className="text-sm font-bold text-gray-500 dark:text-gray-400 block">{stop.time}</span>
      </div>

      <div 
        onClick={onClick}
        className={`bg-white dark:bg-gray-900 rounded-xl border p-5 transition-all duration-200 relative cursor-pointer ${
          isDragging ? 'border-blue-300 dark:border-blue-700 shadow-md ring-2 ring-blue-100 dark:ring-blue-900/50' : 
          isOverlay ? 'border-blue-400 dark:border-blue-600 shadow-2xl ring-4 ring-blue-200 dark:ring-blue-900/50 cursor-grabbing' : 
          isActive ? 'border-blue-400 dark:border-blue-600 shadow-md ring-1 ring-blue-400' :
          'border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800'
        }`}
      >
        
        {/* Action controls */}
        <div className={`absolute -top-3 right-4 bg-white dark:bg-gray-900 shadow-sm border rounded-lg flex items-center overflow-hidden transition-opacity duration-200 ${
            isOverlay || isDragging || isActive ? 'opacity-100 border-blue-200 dark:border-blue-800' : 'opacity-0 group-hover:opacity-100 border-gray-100 dark:border-gray-800'
          }`}
        >
          <button {...attributes} {...listeners} className={`p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 ${isOverlay ? 'cursor-grabbing' : 'cursor-grab'}`} title="Drag">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"/></svg>
          </button>
          
          <button onClick={(e) => { e.stopPropagation(); onReplace(); }} className="p-1.5 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-l border-gray-100 dark:border-gray-800" title="Ask AI for Alternative">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
          </button>

          <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }} className="p-1.5 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 border-l border-gray-100 dark:border-gray-800">
            <svg className={`w-4 h-4 ${stop.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-500 hover:text-yellow-400'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-l border-gray-100 dark:border-gray-800" title="Edit">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 border-l border-gray-100 dark:border-gray-800" title="Delete">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>

        <ExpandableSection 
          preview={
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{stop.name}</h4>
                </div>
                {/* Place Validation Intelligence */}
                {stop.rating ? (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{stop.rating}</span>
                    <svg className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    <span className="text-xs text-gray-400 ml-1 truncate max-w-[200px]">{stop.address}</span>
                  </div>
                ) : stop.address ? (
                  <div className="mt-1 text-xs text-gray-400 truncate max-w-[250px]">{stop.address}</div>
                ) : null}
              </div>
              <CategoryBadge category={stop.category} />
            </div>
          }
        >
          <div className="mt-2 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-50 dark:border-gray-800 pt-3">
            <p className="mb-3">{stop.description}</p>
            {stop.why && (
              <p className="mb-3 text-xs italic bg-blue-50/50 dark:bg-blue-900/10 p-2 rounded text-blue-800 dark:text-blue-300">
                ✨ {stop.why}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 text-gray-500 font-medium text-xs bg-gray-50 dark:bg-gray-800 inline-block px-3 py-1.5 rounded-lg">
                <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Duration: {stop.duration}
              </div>
              {stop.estimatedCost > 0 && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium text-xs bg-green-50 dark:bg-green-900/20 inline-block px-3 py-1.5 rounded-lg">
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
