import React from 'react';
import { useTheme } from '../hooks/useTheme';

export default function Layout({ children }) {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className="min-h-screen relative flex flex-col font-sans text-stone-900 dark:text-stone-100 selection:bg-emerald-300/30">
      
      {/* Background with glowing orbs */}
      <div className="fixed inset-0 -z-10 bg-stone-50 dark:bg-stone-950 transition-colors duration-500 overflow-hidden">
        {/* Abstract blur background elements with earthy tones */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-400/20 dark:bg-emerald-900/20 blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen animate-float"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-400/20 dark:bg-teal-900/20 blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen animate-float-delayed"></div>
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full bg-amber-300/20 dark:bg-amber-900/20 blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen animate-pulse-slow"></div>
        {/* Noise overlay for texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay"></div>
      </div>
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-stone-50/50 dark:bg-stone-950/50 border-b border-stone-200/20 dark:border-stone-800/50 supports-[backdrop-filter]:bg-stone-50/40 shadow-sm transition-all duration-300">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform duration-300">
              C
            </div>
            <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 tracking-tighter">
              CraftYourTrip
            </span>
          </div>

          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl bg-white/80 dark:bg-stone-900/80 text-stone-600 dark:text-stone-300 hover:bg-white dark:hover:bg-stone-800 border border-stone-200/50 dark:border-stone-800/50 shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 flex flex-col items-center flex-grow z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-stone-500 dark:text-stone-500 text-sm mt-auto z-10 font-medium">
        &copy; {new Date().getFullYear()} CraftYourTrip. Crafted with AI.
      </footer>
    </div>
  );
}
