import React, { useState } from 'react';

export default function DocsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('abstract');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl h-[85vh] glass-panel rounded-3xl overflow-hidden shadow-2xl border border-sky-500/30 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-sky-500/30">
              IIT
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Namma Space — Technical Abstract & Pipeline Architecture
              </h2>
              <p className="text-xs text-slate-400">Techfest 2026-27 Submission • Juspay Evaluation Track</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
          >
            <svg width="20" height="20" style={{ width: 20, height: 20 }} className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center space-x-2 px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 text-xs font-semibold">
          {[
            { id: 'abstract', label: '1. Executive Abstract & Scope' },
            { id: 'sop', label: '2. Capture SOP & Video Protocol' },
            { id: 'pipeline', label: '3. 3D Reconstruction Pipeline' },
            { id: 'pathfinding', label: '4. Obstacle-Aware Pathfinding' },
            { id: 'ar', label: '5. Mobile AR Guidance (Bonus)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl transition ${
                activeTab === tab.id
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-300 text-sm leading-relaxed">
          {activeTab === 'abstract' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30">
                <h3 className="text-base font-bold text-sky-400 mb-1">Challenge Objective</h3>
                <p className="text-xs text-slate-300">
                  Replace outdated static 2D blueprints with an intelligent end-to-end 3D digital twin spatial engine. Enables remote visitors to freely explore indoor spaces in first person, search for rooms or items, and follow collision-free walking paths around physical obstacles.
                </p>
              </div>

              <div>
                <h4 className="text-white font-bold text-base mb-2">System Highlights & Deliverables</h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
                  <li><strong>Zero-Install Web Viewer:</strong> High-performance WebGL / Three.js first-person camera with WASD and mouse look.</li>
                  <li><strong>Spatial POI Indexing:</strong> 3D holographic markers with raycast hit detection, rich metadata, and instant fuzzy search.</li>
                  <li><strong>A* Obstacle Avoidance:</strong> Mathematical 2D grid pathfinder with obstacle dilation that never collides with walls, desks, or pillars.</li>
                  <li><strong>Turn-by-Turn HUD:</strong> Real-time distance, estimated walking time, next turn indicator, and interactive 2D minimap with live player radar.</li>
                  <li><strong>On-Site AR Navigation (Bonus):</strong> Mobile rear-camera overlay with real-time compass heading and floating 3D directional arrows.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'sop' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Standard Operating Procedure (SOP) for Capture</h3>
              <p className="text-xs text-slate-300">
                Our defined SOP enables any non-technical user to capture an entire floor in under 15 minutes using a standard consumer smartphone.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2">Video Capture Requirements</h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    <li>• Resolution: 4K (3840x2160) @ 60 FPS for maximum sharpness.</li>
                    <li>• Walking Pace: Smooth 0.5 m/s slow glide with elbows tucked in.</li>
                    <li>• Overlap: 75–85% visual overlap between successive frames.</li>
                    <li>• Lens: Ultra-wide (0.5x) or Main wide (1.0x) with fixed focal lock.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Room Trajectory Pattern</h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    <li>• <strong>Perimeter Sweep:</strong> Walk room boundaries facing slightly inward (30° angle).</li>
                    <li>• <strong>Corner Panorama:</strong> Stand in each corner, execute a slow 90° pan.</li>
                    <li>• <strong>Loop Closures:</strong> Return to the starting lobby doorway to eliminate visual drift in Bundle Adjustment.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pipeline' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Automated 3D Reconstruction Pipeline</h3>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
                <p className="text-sky-400 font-bold">[Step 1: Video Input & Keyframe Decimation]</p>
                <p>ffmpeg -i indoor_capture.mp4 -r 4 -q:v 2 frames/%05d.jpg</p>
                <p className="text-sky-400 font-bold mt-2">[Step 2: Structure-from-Motion (COLMAP)]</p>
                <p>colmap feature_extractor & colmap exhaustive_matcher & colmap mapper</p>
                <p className="text-sky-400 font-bold mt-2">[Step 3: 3D Gaussian Splatting / Poisson Mesh]</p>
                <p>python3 reconstruct.py --input frames/ --output scene.splat --export-glb</p>
              </div>
            </div>
          )}

          {activeTab === 'pathfinding' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Obstacle-Aware Pathfinding Engine</h3>
              <p className="text-xs text-slate-300">
                The pathfinder uses a 0.5m discrete grid discretized across the 60m x 40m floor plan. All walls, furniture, pillars, and desks are rasterized with safety padding:
              </p>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs text-emerald-400">
                f(n) = g(n) + h(n)<br />
                h(n) = &radic;((x_target - x_n)&sup2; + (z_target - z_n)&sup2;) + 0.001 &times; |&Delta;x &times; &Delta;z_target - &Delta;x_target &times; &Delta;z|
              </div>
              <p className="text-xs text-slate-400">
                String-pulling raycast smoothing eliminates stair-stepping, producing natural, continuous spline paths.
              </p>
            </div>
          )}

          {activeTab === 'ar' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Augmented Reality (AR) On-Site Guidance</h3>
              <p className="text-xs text-slate-300">
                Eligible for the <strong>Juspay Bonus Award</strong>: On-site visitors access the web app via mobile browser without app store installation.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs text-slate-300">
                <li><strong>HTML5 Camera Stream:</strong> Queries device camera with ideal 1080p resolution.</li>
                <li><strong>Spatial Compass Tracking:</strong> Uses DeviceOrientation API to determine phone azimuth relative to magnetic north.</li>
                <li><strong>Dynamic 3D Vector Bearing:</strong> Calculates angle &Delta;&theta; = atan2(&Delta;x, -&Delta;z) - Heading and positions the animated 3D directional arrow directly in the user's line of sight.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Engine: Three.js • A* Pathfinding • WebXR AR</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold shadow-md"
          >
            Back to Walkthrough
          </button>
        </div>
      </div>
    </div>
  );
}

