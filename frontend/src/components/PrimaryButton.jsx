import React from 'react';

export default function PrimaryButton({ type = 'submit', onClick, children, disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full sm:w-auto px-8 py-4 font-bold rounded-xl shadow-md transition-all duration-200 text-lg flex justify-center items-center gap-2 ${
        disabled 
          ? 'bg-gray-400 text-gray-100 cursor-not-allowed shadow-none'
          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
      }`}
    >
      {children}
    </button>
  );
}
