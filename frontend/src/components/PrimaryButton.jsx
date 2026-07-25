import React from 'react';

export default function PrimaryButton({ type = 'submit', onClick, children }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-lg flex justify-center items-center gap-2"
    >
      {children}
    </button>
  );
}
