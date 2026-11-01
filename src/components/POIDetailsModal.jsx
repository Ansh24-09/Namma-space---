import React from 'react';

export default function POIDetailsModal({
  poi,
  onClose,
  onStartNavigation,
  onTeleport
}) {
  if (!poi) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg glass-panel rounded-3xl overflow-hidden shadow-2xl border border-sky-500/30 flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
          <img
            src={poi.photoUrl}
            alt={poi.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white backdrop-blur-md border border-white/10 transition"
          >
            <svg width="20" height="20" style={{ width: 20, height: 20 }} className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="absolute bottom-4 left-5 flex items-center space-x-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-md uppercase tracking-wider"
              style={{ backgroundColor: poi.categoryColor || '#0ea5e9' }}
            >
              {poi.category}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900/80 text-slate-300 border border-slate-700 backdrop-blur-md">
              {poi.floor}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-4 bg-slate-950/70">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">{poi.name}</h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">{poi.description}</p>
          </div>

          {poi.amenities && poi.amenities.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Room Amenities & Facilities
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {poi.amenities.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs bg-slate-900 border border-slate-800 text-slate-300 flex items-center space-x-1"
                  >
                    <svg className="w-3.5 h-3.5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-400 border-t border-slate-800/80">
            <div>
              <span className="block text-slate-500 font-mono text-[10px] uppercase">Access Hours</span>
              <span className="text-slate-200 font-medium">{poi.operatingHours}</span>
            </div>
            <div>
              <span className="block text-slate-500 font-mono text-[10px] uppercase">3D Coordinates</span>
              <span className="text-slate-200 font-mono">
                X: {poi.position[0]}, Z: {poi.position[2]}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                onTeleport(poi);
                onClose();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition flex items-center justify-center space-x-2 shadow-lg"
            >
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Instant Teleport</span>
            </button>

            <button
              onClick={() => {
                onStartNavigation(poi);
                onClose();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 transition flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span>Walk to Destination</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

