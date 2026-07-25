import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans text-gray-900">
      <main className="w-full max-w-4xl px-4 flex flex-col items-center">
        {children}
      </main>
    </div>
  );
}
