import React from 'react';

export default function TextAreaField({ label, id, placeholder, value, onChange, required = false }) {
  return (
    <div className="flex flex-col mb-4">
      <label htmlFor={id} className="block text-sm font-bold text-stone-800 dark:text-stone-200 mb-2">
        {label} {required && <span className="text-emerald-500">*</span>}
      </label>
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={5}
        className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm outline-none text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600 resize-y min-h-[120px]"
      />
    </div>
  );
}
