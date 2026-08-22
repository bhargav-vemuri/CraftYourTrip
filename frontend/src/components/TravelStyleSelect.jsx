import React from 'react';

export default function TravelStyleSelect({ id, label, value, onChange, options, required = false }) {
  return (
    <div className="flex flex-col mb-4">
      <label htmlFor={id} className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">
        {label} {required && <span className="text-violet-500">*</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all shadow-sm outline-none text-zinc-900 dark:text-zinc-100 appearance-none cursor-pointer"
        >
          <option value="" disabled>Select {label.toLowerCase()}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
