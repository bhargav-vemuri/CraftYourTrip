import React from 'react';

export default function TravelStyleSelect({ id, label, value, onChange, options, required = false }) {
  return (
    <div className="flex flex-col mb-4">
      <label className="block text-sm font-bold text-stone-800 dark:text-stone-200 mb-3">
        {label} {required && <span className="text-emerald-500">*</span>}
      </label>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => {
          const isSelected = value === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 border flex items-center justify-center ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/30 scale-105'
                  : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:border-emerald-400 dark:hover:border-emerald-600 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {/* Hidden input to maintain HTML required validation */}
      <input type="text" id={id} required={required} value={value} readOnly className="sr-only" tabIndex={-1} />
    </div>
  );
}
