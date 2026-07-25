import React, { useState } from 'react';

export default function ExpandableSection({ defaultExpanded = false, preview, children }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="w-full">
      <div 
        className="cursor-pointer group flex items-start justify-between" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          {preview}
        </div>
        <button 
          className="ml-4 p-2 text-gray-400 group-hover:text-blue-500 rounded-full hover:bg-blue-50 transition-colors"
          title={isExpanded ? "Collapse" : "Expand"}
        >
          <svg 
            className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100 mt-3' : 'max-h-0 opacity-0'}`}
      >
        {children}
      </div>
    </div>
  );
}
