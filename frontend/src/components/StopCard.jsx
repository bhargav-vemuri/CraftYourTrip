import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CategoryBadge from './CategoryBadge';
import ExpandableSection from './ExpandableSection';
import EditStopForm from './EditStopForm';

export default function StopCard({ 
  stop, 
  onUpdate, 
  onDelete,
  onToggleFavorite,
  isOverlay = false
}) {
  const [isEditing, setIsEditing] = useState(false);

  // Setup dnd-kit sortable hook
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: stop.id,
    disabled: isEditing || isOverlay // Don't drag while editing or if it's the overlay
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.3 : 1, // Dim the original while dragging
  };

  if (isEditing) {
    return (
      <div className="relative pl-8 sm:pl-32 py-6">
        <div className="absolute left-0 sm:left-24 top-0 bottom-0 w-px bg-gray-200"></div>
        <div className="absolute left-[-4px] sm:left-[92px] top-8 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white"></div>
        <EditStopForm 
          initialStop={stop} 
          onSave={(updated) => {
            onUpdate(updated);
            setIsEditing(false);
          }} 
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
      {/* Timeline line and dot (hidden on overlay to look cleaner) */}
      {!isOverlay && (
        <>
          <div className="absolute left-0 sm:left-24 top-0 bottom-0 w-px bg-gray-200"></div>
          <div className="absolute left-[-4px] sm:left-[92px] top-8 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white transition-transform group-hover:scale-125 duration-200"></div>
        </>
      )}
      
      {/* Time column (desktop) / header (mobile) */}
      <div className="sm:absolute sm:left-0 sm:w-20 sm:text-right sm:top-7 mb-2 sm:mb-0 flex items-center justify-between sm:justify-end">
        <span className="text-sm font-bold text-gray-500 block">{stop.time}</span>
      </div>

      {/* Card Content */}
      <div className={`bg-white rounded-xl border p-5 transition-all duration-200 relative ${
          isDragging ? 'border-blue-300 shadow-md ring-2 ring-blue-100' : 
          isOverlay ? 'border-blue-400 shadow-2xl ring-4 ring-blue-200 cursor-grabbing' : 
          'border-gray-100 shadow-sm hover:shadow-md group-hover:border-blue-100'
        }`}
      >
        
        {/* Action controls (Drag Handle, Favorite, Edit, Delete) */}
        <div className={`absolute -top-3 right-4 bg-white shadow-sm border rounded-lg flex items-center overflow-hidden transition-opacity duration-200 ${
            isOverlay || isDragging ? 'opacity-100 border-blue-200' : 'opacity-0 group-hover:opacity-100 border-gray-100'
          }`}
        >
          {/* Drag Handle */}
          <button 
            {...attributes} 
            {...listeners}
            className={`p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 ${isOverlay ? 'cursor-grabbing' : 'cursor-grab'}`}
            title="Drag to move"
            aria-label="Drag handle"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"/></svg>
          </button>

          {/* Favorite Toggle */}
          <button 
            onClick={onToggleFavorite}
            className="p-1.5 hover:bg-yellow-50 border-l border-gray-100 transition-colors"
            title={stop.isFavorite ? "Remove favorite" : "Mark as favorite"}
            aria-label="Toggle favorite"
          >
            <svg className={`w-4 h-4 transition-colors ${stop.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-400'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>

          <button onClick={() => setIsEditing(true)} className="p-1.5 hover:bg-blue-50 text-blue-600 border-l border-gray-100" title="Edit" aria-label="Edit stop">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
          </button>
          
          <button onClick={onDelete} className="p-1.5 hover:bg-red-50 text-red-600 border-l border-gray-100" title="Delete" aria-label="Delete stop">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>

        <ExpandableSection 
          preview={
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{stop.name}</h4>
                {stop.isFavorite && (
                  <svg className="w-4 h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                )}
              </div>
              <CategoryBadge category={stop.category} />
            </div>
          }
        >
          <div className="mt-2 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-3">
            <p className="mb-3">{stop.description}</p>
            <div className="flex items-center gap-2 text-gray-500 font-medium text-xs bg-gray-50 inline-block px-3 py-1.5 rounded-lg">
              <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Duration: {stop.duration}
            </div>
          </div>
        </ExpandableSection>
      </div>
    </div>
  );
}
