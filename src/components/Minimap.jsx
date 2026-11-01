import React, { useState } from 'react';
import { FLOOR_CONFIG, ROOM_ZONES, WALLS, OBSTACLES, POI_LIST } from '../utils/floorData';

export default function Minimap({
  playerPos,
  playerHeading,
  activePath,
  selectedPOI,
  onSelectPOI,
  onNavigateToCoords
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const width = FLOOR_CONFIG.width;   // 60m (-30 to +30)
  const depth = FLOOR_CONFIG.depth;   // 40m (-20 to +20)

  // Map coordinate conversion to SVG viewport (viewBox: 0 0 600 400)
  const SVG_W = 600;
  const SVG_H = 400;

  const toSvgX = (x) => ((x + 30) / width) * SVG_W;
  const toSvgY = (z) => ((z + 20) / depth) * SVG_H;
  const toWorldX = (svgX) => (svgX / SVG_W) * width - 30;
  const toWorldZ = (svgY) => (svgY / SVG_H) * depth - 20;

  const playerSvgX = toSvgX(playerPos[0]);
  const playerSvgY = toSvgY(playerPos[2]);

  // Player FOV Cone angle in 2D SVG
  // Camera Euler Y rotation in radians: 0 is looking -Z in Three.js (up in SVG)
  const headingDeg = (-playerHeading * 180) / Math.PI + 180;

  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const svgX = (clickX / rect.width) * SVG_W;
    const svgY = (clickY / rect.height) * SVG_H;

    const worldX = toWorldX(svgX);
    const worldZ = toWorldZ(svgY);

    if (onNavigateToCoords) {
      onNavigateToCoords(worldX, worldZ);
    }
  };

  return (
    <div
      className={`glass-panel transition-all duration-300 rounded-2xl overflow-hidden shadow-2xl border border-sky-500/20 ${
        isExpanded
          ? 'w-[480px] h-[340px] fixed top-20 right-6 z-40'
          : 'w-72 h-52 absolute top-20 right-6 z-20'
      }`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-slate-800 bg-slate-900/80">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Level 1 Digital Twin Floorplan
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Minimize map' : 'Expand map'}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition"
          >
            {isExpanded ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div className="relative w-full h-[calc(100%-36px)] bg-[#070b12] cursor-crosshair">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full h-full"
          onClick={handleMapClick}
        >
          {/* Subtle Grid background */}
          <defs>
            <pattern id="miniGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            </pattern>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <radialGradient id="playerRadar" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(56, 189, 248, 0.45)" />
              <stop offset="100%" stopColor="rgba(56, 189, 248, 0)" />
            </radialGradient>
          </defs>

          <rect width={SVG_W} height={SVG_H} fill="url(#miniGrid)" />

          {/* Room Zones */}
          {ROOM_ZONES.map((zone) => {
            const rx = toSvgX(zone.bounds.minX);
            const ry = toSvgY(zone.bounds.minZ);
            const rw = toSvgX(zone.bounds.maxX) - rx;
            const rh = toSvgY(zone.bounds.maxZ) - ry;
            return (
              <g key={zone.id}>
                <rect
                  x={rx}
                  y={ry}
                  width={rw}
                  height={rh}
                  fill={zone.color}
                  fillOpacity="0.08"
                  stroke={zone.color}
                  strokeOpacity="0.25"
                  strokeWidth="1"
                  rx="4"
                />
                {isExpanded && (
                  <text
                    x={rx + rw / 2}
                    y={ry + rh / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={zone.color}
                    fillOpacity="0.7"
                    fontSize="10"
                    fontWeight="600"
                    className="pointer-events-none select-none"
                  >
                    {zone.name}
                  </text>
                )}
              </g>
            );
          })}

          {/* Obstacles & Furniture */}
          {OBSTACLES.map((obs, i) => {
            const ox = toSvgX(obs.minX);
            const oy = toSvgY(obs.minZ);
            const ow = toSvgX(obs.maxX) - ox;
            const oh = toSvgY(obs.maxZ) - oy;
            return (
              <rect
                key={i}
                x={ox}
                y={oy}
                width={ow}
                height={oh}
                fill={obs.color}
                fillOpacity="0.6"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="0.5"
                rx="2"
              />
            );
          })}

          {/* Architectural Walls */}
          {WALLS.map((wall, idx) => {
            const wx = toSvgX(wall.minX);
            const wy = toSvgY(wall.minZ);
            const ww = Math.max(2, toSvgX(wall.maxX) - wx);
            const wh = Math.max(2, toSvgY(wall.maxZ) - wy);
            return (
              <rect
                key={idx}
                x={wx}
                y={wy}
                width={ww}
                height={wh}
                fill={wall.type === 'glass' ? '#0ea5e9' : '#334155'}
                fillOpacity={wall.type === 'glass' ? 0.4 : 0.9}
                stroke="#475569"
                strokeWidth="0.5"
              />
            );
          })}

          {/* Active Navigation Route */}
          {activePath && activePath.length > 1 && (
            <g>
              {/* Glowing background path */}
              <polyline
                points={activePath.map((p) => `${toSvgX(p.x)},${toSvgY(p.z)}`).join(' ')}
                fill="none"
                stroke="#0284c7"
                strokeWidth="5"
                strokeOpacity="0.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Foreground animated dashed line */}
              <polyline
                points={activePath.map((p) => `${toSvgX(p.x)},${toSvgY(p.z)}`).join(' ')}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animated-path-line"
              />
              {/* Waypoint dots */}
              {activePath.map((p, idx) => (
                <circle
                  key={idx}
                  cx={toSvgX(p.x)}
                  cy={toSvgY(p.z)}
                  r="2"
                  fill="#ffffff"
                  stroke="#38bdf8"
                  strokeWidth="1"
                />
              ))}
            </g>
          )}

          {/* POI Markers */}
          {POI_LIST.map((poi) => {
            const px = toSvgX(poi.position[0]);
            const py = toSvgY(poi.position[2]);
            const isSelected = selectedPOI?.id === poi.id;

            return (
              <g
                key={poi.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPOI(poi);
                }}
                className="cursor-pointer group"
              >
                {isSelected && (
                  <circle
                    cx={px}
                    cy={py}
                    r="9"
                    fill="none"
                    stroke={poi.categoryColor}
                    strokeWidth="1.5"
                    className="animate-ping"
                  />
                )}
                <circle
                  cx={px}
                  cy={py}
                  r={isSelected ? '6' : '4.5'}
                  fill={poi.categoryColor}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              </g>
            );
          })}

          {/* Player Blip & Directional FOV Cone */}
          <g transform={`translate(${playerSvgX}, ${playerSvgY})`}>
            {/* FOV Cone */}
            <path
              d="M 0 0 L -25 -45 A 50 50 0 0 1 25 -45 Z"
              fill="url(#playerRadar)"
              transform={`rotate(${headingDeg})`}
              className="pointer-events-none"
            />
            {/* Radar ring */}
            <circle cx="0" cy="0" r="10" fill="#38bdf8" fillOpacity="0.2" className="radar-ping" />
            {/* Inner player dot */}
            <circle cx="0" cy="0" r="4.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
            {/* Heading pointer tip */}
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="-9"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              transform={`rotate(${headingDeg})`}
            />
          </g>
        </svg>
      </div>

      {/* Footer hint */}
      <div className="px-3 py-1 bg-slate-950 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-800">
        <span>Click anywhere to navigate</span>
        <span className="text-sky-400 font-mono">
          X: {playerPos[0].toFixed(1)}m | Z: {playerPos[2].toFixed(1)}m
        </span>
      </div>
    </div>
  );
}

