import React from 'react';

export default function TextAreaField({ label, id, placeholder, value, onChange, required = false }) {
  return (
    <div className="flex flex-col mb-4">
      <label htmlFor={id} className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">
        {label} {required && <span className="text-violet-500">*</span>}
      </label>
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={5}
        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all shadow-sm outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 resize-y min-h-[120px]"
      />
    </div>
  );
}
