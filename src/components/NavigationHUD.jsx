import React, { useState } from 'react';

export default function NavigationHUD({
  destination,
  directions,
  totalDistance,
  onCancelNavigation,
  playerPos
}) {
  const [showFullItinerary, setShowFullItinerary] = useState(false);

  if (!destination || !directions || directions.length === 0) return null;

  // Estimate walking time (1.3 m/s human walk speed)
  const estimatedSeconds = Math.round(totalDistance / 1.3);
  const timeFormatted =
    estimatedSeconds > 60
      ? `${Math.floor(estimatedSeconds / 60)} min ${estimatedSeconds % 60} s`
      : `${estimatedSeconds} sec`;

  const currentStep = directions[0];

  const renderIcon = (iconType) => {
    switch (iconType) {
      case 'turn-left':
        return (
          <svg width="24" height="24" style={{ width: 24, height: 24 }} className="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        );
      case 'turn-right':
        return (
          <svg width="24" height="24" style={{ width: 24, height: 24 }} className="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        );
      case 'sharp-left':
        return (
          <svg width="24" height="24" style={{ width: 24, height: 24 }} className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 15l-3-3m0 0l3-3m-3 3h8a3 3 0 003-3V6" />
          </svg>
        );
      case 'sharp-right':
        return (
          <svg width="24" height="24" style={{ width: 24, height: 24 }} className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 15l3-3m0 0l-3-3m3 3H8a3 3 0 01-3-3V6" />
          </svg>
        );
      case 'destination':
        return (
          <svg width="24" height="24" style={{ width: 24, height: 24 }} className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
        );
      default:
        return (
          <svg width="24" height="24" style={{ width: 24, height: 24 }} className="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        );
    }
  };

  return (
    <div className="absolute top-20 left-6 z-30 max-w-sm w-full animate-in slide-in-from-top-4 duration-300">
      <div className="glass-panel rounded-2xl overflow-hidden border border-sky-500/30 shadow-2xl">
        {/* Top Banner: Destination info */}
        <div className="p-4 bg-gradient-to-r from-slate-900/90 to-slate-800/90 border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-base shadow-lg shrink-0"
              style={{ backgroundColor: destination.categoryColor || '#0ea5e9' }}
            >
              {destination.name.charAt(0)}
            </div>
            <div>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-sky-400">
                Active Turn-by-Turn Guidance
              </span>
              <h3 className="text-sm font-bold text-white leading-tight line-clamp-1">
                {destination.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onCancelNavigation}
            title="End Navigation"
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Current Turn Direction Callout */}
        <div className="p-4 bg-slate-950/60 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center shrink-0 shadow-inner">
            {renderIcon(currentStep?.icon)}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white leading-snug">
              {currentStep?.instruction || 'Follow highlighted floor trail'}
            </p>
            <p className="text-xs text-sky-400 font-mono mt-0.5">
              Step 1 of {directions.length}
            </p>
          </div>
        </div>

        {/* Route Stats Bar */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-slate-900/60 border-t border-slate-800 text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <div>
              <span className="text-[10px] text-slate-400 block">Remaining</span>
              <span className="font-bold font-mono text-white">{totalDistance.toFixed(1)} meters</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <svg className="w-4 h-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <span className="text-[10px] text-slate-400 block">Est. Time</span>
              <span className="font-bold font-mono text-white">{timeFormatted}</span>
            </div>
          </div>
        </div>

        {/* Full Itinerary Accordion Toggle */}
        <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <button
            onClick={() => setShowFullItinerary(!showFullItinerary)}
            className="text-slate-400 hover:text-sky-400 font-medium flex items-center space-x-1 transition"
          >
            <span>{showFullItinerary ? 'Hide step list' : 'View full itinerary'}</span>
            <svg
              className={`w-3.5 h-3.5 transition-transform ${showFullItinerary ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <span className="text-[10px] text-slate-500 font-mono">A* Obstacle-Free</span>
        </div>

        {/* Expanded Itinerary Steps */}
        {showFullItinerary && (
          <div className="max-h-56 overflow-y-auto p-3 space-y-2 bg-slate-950/90 border-t border-slate-800 text-xs animate-in fade-in">
            {directions.map((d, index) => (
              <div
                key={index}
                className="flex items-start space-x-2.5 p-2 rounded-lg bg-slate-900/70 border border-slate-800/80"
              >
                <div className="p-1 rounded bg-slate-800 text-sky-400 shrink-0">
                  {renderIcon(d.icon)}
                </div>
                <div className="flex-1">
                  <p className="text-slate-200 font-medium">{d.instruction}</p>
                  {d.distance > 0 && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      Segment: {d.distance}m
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

