import React, { useState, useRef, useEffect } from 'react';

export default function TravelStyleSelect({ id, label, value, onChange, options, required = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col mb-4 relative" ref={dropdownRef}>
      <label className="block text-sm font-bold text-stone-800 dark:text-stone-200 mb-2">
        {label} {required && <span className="text-emerald-500">*</span>}
      </label>
      
      <div 
        className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-stone-900 transition-all shadow-sm cursor-pointer flex justify-between items-center ${
          isOpen ? 'border-amber-500 ring-2 ring-amber-500/50' : 'border-stone-200 dark:border-stone-800 hover:border-amber-400 dark:hover:border-amber-600'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? 'text-stone-900 dark:text-stone-100 font-medium' : 'text-stone-400 dark:text-stone-600'}>
          {value || 'Select travel style...'}
        </span>
        <svg 
          className={`w-5 h-5 text-stone-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-amber-500' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Custom Dropdown Menu */}
      <div 
        className={`absolute z-50 w-full top-full mt-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl shadow-xl overflow-hidden transition-all duration-300 origin-top ${
          isOpen ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-95 invisible'
        }`}
      >
        <div className="py-2 max-h-60 overflow-y-auto custom-scrollbar">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`px-4 py-3 cursor-pointer transition-colors flex items-center justify-between ${
                value === option 
                  ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold' 
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700'
              }`}
            >
              {option}
              {value === option && (
                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Hidden input to maintain HTML required validation */}
      <input type="text" id={id} required={required} value={value} readOnly className="sr-only" tabIndex={-1} />
    </div>
  );
}
