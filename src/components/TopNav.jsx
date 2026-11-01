import React from 'react';

export default function TopNav({
  activeMode,
  setActiveMode,
  onOpenSearch,
  onResetPosition,
  onOpenDocs,
  isNavigating,
  destination
}) {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-6 py-4 flex items-center justify-between pointer-events-none">
      {/* Brand & Venue Badge */}
      <div className="flex items-center space-x-3 pointer-events-auto">
        <div className="flex items-center space-x-2 glass-panel px-3.5 py-2 rounded-2xl border border-sky-500/30 shadow-xl">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-500/30 shrink-0">
            <svg width="20" height="20" style={{ width: 20, height: 20 }} className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-sm tracking-tight text-white">Namma Space</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-indigo-500/30 text-indigo-300 font-bold rounded-md border border-indigo-500/40">
                IIT Bombay
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Techfest 2026-27 • 3D Spatial Digital Twin</p>
          </div>
        </div>
      </div>

      {/* Central Search Bar Quick Trigger */}
      <div className="hidden md:flex items-center pointer-events-auto">
        <button
          onClick={onOpenSearch}
          className="flex items-center space-x-3 px-4 py-2 rounded-2xl glass-panel-subtle hover:bg-slate-900/90 border border-slate-700/80 hover:border-sky-500/50 transition-all text-slate-400 hover:text-slate-200 shadow-lg group"
        >
          <svg width="16" height="16" style={{ width: 16, height: 16 }} className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-xs font-medium">Search rooms, desks, amenities...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-sky-400 border border-slate-700">
            /
          </kbd>
        </button>
      </div>

      {/* Right Controls: Mode Toggle, AR Button, Docs */}
      <div className="flex items-center space-x-2 pointer-events-auto">
        {/* AR Navigation Mode Button (Juspay Bonus) */}
        <button
          onClick={() => setActiveMode(activeMode === 'ar' ? 'walkthrough' : 'ar')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-lg ${
            activeMode === 'ar'
              ? 'bg-rose-500 text-white shadow-rose-500/30 animate-pulse'
              : 'glass-panel text-white hover:bg-slate-800 border border-sky-400/40'
          }`}
          title="Launch Live Camera AR Navigation on Mobile or Desktop Simulator"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <svg width="16" height="16" style={{ width: 16, height: 16 }} className="w-4 h-4 text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span className="hidden sm:inline">AR Mobile Nav</span>
          <span className="text-[10px] px-1 py-0.5 rounded bg-sky-500/30 text-sky-300 font-mono">Bonus</span>
        </button>

        {/* Search button for mobile */}
        <button
          onClick={onOpenSearch}
          className="md:hidden p-2 rounded-xl glass-panel text-slate-300 hover:text-white border border-slate-700"
          title="Open Search"
        >
          <svg width="16" height="16" style={{ width: 16, height: 16 }} className="w-4 h-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {/* Reset spawn position */}
        <button
          onClick={onResetPosition}
          className="p-2 rounded-xl glass-panel text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 transition shadow"
          title="Return to Main Reception Lobby"
        >
          <svg width="16" height="16" style={{ width: 16, height: 16 }} className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>

        {/* Techfest Abstract & Pipeline Docs */}
        <button
          onClick={onOpenDocs}
          className="px-3 py-2 rounded-xl glass-panel hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 hover:border-sky-500/50 transition flex items-center space-x-1.5 shadow"
        >
          <svg width="16" height="16" style={{ width: 16, height: 16 }} className="w-4 h-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="hidden sm:inline">Technical Abstract</span>
        </button>
      </div>
    </header>
  );
}
