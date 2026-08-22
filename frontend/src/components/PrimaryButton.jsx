import React from 'react';

export default function PrimaryButton({ type = 'submit', onClick, children, disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`relative w-full sm:w-auto px-8 py-4 font-bold rounded-2xl transition-all duration-300 text-lg flex justify-center items-center gap-2 overflow-hidden group ${
        disabled 
          ? 'bg-zinc-300 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed shadow-none'
          : 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 text-white shadow-[0_0_40px_-10px_rgba(124,58,237,0.5)] hover:shadow-[0_0_60px_-15px_rgba(124,58,237,0.7)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95'
      }`}
    >
      {!disabled && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
