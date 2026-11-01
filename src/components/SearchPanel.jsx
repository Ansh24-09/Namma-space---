import React, { useState, useMemo } from 'react';
import { POI_LIST } from '../utils/floorData';

export default function SearchPanel({
  isOpen,
  onClose,
  playerPos,
  onSelectPOI,
  onNavigateToPOI,
  onTeleportToPOI
}) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Information & Check-in', 'Keynotes & Talks', 'Meeting & Conferences', 'R&D / Hardware', 'Workspace', 'Dining & Refreshments', 'Amenities', 'Emergency & Safety'];

  // Calculate distance from player to each POI
  const poisWithDistance = useMemo(() => {
    return POI_LIST.map((poi) => {
      const dx = poi.position[0] - playerPos[0];
      const dz = poi.position[2] - playerPos[2];
      const dist = Math.hypot(dx, dz);
      return {
        ...poi,
        distanceMeters: Math.round(dist * 10) / 10
      };
    });
  }, [playerPos]);

  // Filtered results
  const filteredPOIs = useMemo(() => {
    return poisWithDistance.filter((poi) => {
      const matchesCategory = selectedCategory === 'All' || poi.category === selectedCategory;
      const q = query.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesQuery =
        poi.name.toLowerCase().includes(q) ||
        poi.category.toLowerCase().includes(q) ||
        poi.description.toLowerCase().includes(q) ||
        poi.tags.some((t) => t.toLowerCase().includes(q)) ||
        poi.amenities.some((a) => a.toLowerCase().includes(q));

      return matchesCategory && matchesQuery;
    }).sort((a, b) => a.distanceMeters - b.distanceMeters);
  }, [poisWithDistance, query, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl glass-panel rounded-2xl shadow-2xl border border-sky-500/30 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-900/90 space-x-3">
          <svg className="w-5 h-5 text-sky-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search rooms, desks, booths, amenities (e.g. 'Coffee', 'Lecture Hall', 'Restroom')..."
            autoFocus
            className="w-full bg-transparent text-white placeholder-slate-400 text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white rounded"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-mono border border-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 px-4 py-2.5 overflow-x-auto border-b border-slate-800/60 bg-slate-950/40 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-4 space-y-3 flex-1">
          {filteredPOIs.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <svg className="w-12 h-12 mx-auto mb-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium">No Points of Interest match "{query}"</p>
              <p className="text-xs text-slate-500 mt-1">Try searching for "Hall", "Coffee", "Lab", or "Safety"</p>
            </div>
          ) : (
            filteredPOIs.map((poi) => (
              <div
                key={poi.id}
                className="group p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-sky-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div
                  className="flex items-start space-x-3 cursor-pointer flex-1"
                  onClick={() => {
                    onSelectPOI(poi);
                    onClose();
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md font-bold text-white text-sm"
                    style={{ backgroundColor: poi.categoryColor }}
                  >
                    {poi.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors">
                        {poi.name}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {poi.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{poi.description}</p>
                    <div className="flex items-center space-x-3 mt-1.5 text-[11px] text-slate-500 font-mono">
                      <span className="flex items-center text-sky-400 font-semibold">
                        <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        {poi.distanceMeters}m away
                      </span>
                      <span>•</span>
                      <span>{poi.floor}</span>
                      <span>•</span>
                      <span>{poi.operatingHours}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => {
                      onTeleportToPOI(poi);
                      onClose();
                    }}
                    title="Instantly jump camera to this location"
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 flex items-center space-x-1 transition"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Jump</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigateToPOI(poi);
                      onClose();
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-sky-500/20 flex items-center space-x-1.5 transition"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <span>Navigate</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>{filteredPOIs.length} spatial points indexed</span>
          <div className="flex items-center space-x-1 text-slate-500">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-[10px] text-slate-300">↑</kbd>
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-[10px] text-slate-300">↓</kbd>
            <span>to navigate</span>
          </div>
        </div>
      </div>
    </div>
  );
}
