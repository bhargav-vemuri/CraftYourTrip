import React, { useState } from 'react';
import CategoryBadge from './CategoryBadge';
import ExpandableSection from './ExpandableSection';
import EditStopForm from './EditStopForm';

export default function StopCard({ 
  stop, 
  isFirst, 
  isLast, 
  onUpdate, 
  onDelete, 
  onMoveUp, 
  onMoveDown 
}) {
  const [isEditing, setIsEditing] = useState(false);

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
    <div className="relative pl-8 sm:pl-32 py-6 group">
      {/* Timeline line and dot */}
      <div className="absolute left-0 sm:left-24 top-0 bottom-0 w-px bg-gray-200"></div>
      <div className="absolute left-[-4px] sm:left-[92px] top-8 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white transition-transform group-hover:scale-125 duration-200"></div>
      
      {/* Time column (desktop) / header (mobile) */}
      <div className="sm:absolute sm:left-0 sm:w-20 sm:text-right sm:top-7 mb-2 sm:mb-0">
        <span className="text-sm font-bold text-gray-500 block">{stop.time}</span>
      </div>

      {/* Card Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200 group-hover:border-blue-100 relative">
        
        {/* Action controls (Move, Edit, Delete) - Visible on hover or focus-within */}
        <div className="absolute -top-3 right-4 bg-white shadow-sm border border-gray-100 rounded-lg flex items-center overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button onClick={onMoveUp} disabled={isFirst} className={`p-1.5 hover:bg-gray-100 ${isFirst ? 'text-gray-300' : 'text-gray-600'}`} title="Move Up">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"/></svg>
          </button>
          <button onClick={onMoveDown} disabled={isLast} className={`p-1.5 hover:bg-gray-100 border-l border-gray-100 ${isLast ? 'text-gray-300' : 'text-gray-600'}`} title="Move Down">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" transform="rotate(180 12 12)"/></svg>
          </button>
          <button onClick={() => setIsEditing(true)} className="p-1.5 hover:bg-blue-50 text-blue-600 border-l border-gray-100" title="Edit">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
          </button>
          <button onClick={onDelete} className="p-1.5 hover:bg-red-50 text-red-600 border-l border-gray-100" title="Delete">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>

        <ExpandableSection 
          preview={
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{stop.name}</h4>
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
