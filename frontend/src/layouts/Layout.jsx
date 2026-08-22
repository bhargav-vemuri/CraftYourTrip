import React from 'react';
import { useTheme } from '../hooks/useTheme';

export default function Layout({ children }) {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className="min-h-screen relative flex flex-col font-sans text-gray-900 dark:text-gray-100 selection:bg-fuchsia-300/30">
      
      {/* Background with glowing orbs */}
      <div className="fixed inset-0 -z-10 bg-slate-50 dark:bg-zinc-950 transition-colors duration-500 overflow-hidden">
        {/* Abstract blur background elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-400/20 dark:bg-violet-900/20 blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 dark:bg-fuchsia-900/20 blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen"></div>
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full bg-blue-300/20 dark:bg-blue-900/20 blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen"></div>
        {/* Noise overlay for texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay"></div>
      </div>
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/50 dark:bg-zinc-950/50 border-b border-white/20 dark:border-zinc-800/50 supports-[backdrop-filter]:bg-white/40 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-violet-500/30 group-hover:scale-105 transition-transform">
              C
            </div>
            <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 tracking-tighter">
              CraftYourTrip
            </span>
          </div>

          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl bg-white/80 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm transition-all hover:scale-105 active:scale-95"
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
      <footer className="w-full py-8 text-center text-zinc-500 dark:text-zinc-500 text-sm mt-auto z-10 font-medium">
        &copy; {new Date().getFullYear()} CraftYourTrip. Crafted with AI.
      </footer>
    </div>
  );
}
