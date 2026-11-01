import React, { useEffect, useRef, useState } from 'react';

export default function ARNavigationMode({
  destination,
  directions,
  totalDistance,
  playerPos,
  onClose,
  onCancelNavigation
}) {
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [compassHeading, setCompassHeading] = useState(0); // Degrees 0-360
  const [pitch, setPitch] = useState(0);                   // Device tilt
  const [simulationHeading, setSimulationHeading] = useState(0);
  const [isSimulated, setIsSimulated] = useState(false);

  // Initialize phone camera
  useEffect(() => {
    let stream = null;

    async function startCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera API not supported on this browser/environment');
        }

        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Rear phone camera
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setCameraActive(true);
        }
      } catch (err) {
        console.warn('Camera access unavailable, defaulting to high-fidelity AR simulation mode:', err);
        setCameraError(err.message);
        setIsSimulated(true);
      }
    }

    startCamera();

    // Listen to real device orientation / gyroscope if on mobile
    const handleOrientation = (e) => {
      if (e.webkitCompassHeading !== undefined) {
        // iOS Safari WebKit compass heading
        setCompassHeading(e.webkitCompassHeading);
        setIsSimulated(false);
      } else if (e.alpha !== null) {
        // Android / standard standard alpha
        setCompassHeading(360 - e.alpha);
        setIsSimulated(false);
      }
      if (e.beta !== null) {
        setPitch(e.beta);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, true);

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  // Compute bearing angle from player position to next waypoint
  const currentStep = directions?.[0];
  const targetWaypoint = currentStep?.waypoint || (destination ? { x: destination.position[0], z: destination.position[2] } : null);

  let bearingDegrees = 0;
  if (targetWaypoint) {
    const dx = targetWaypoint.x - playerPos[0];
    const dz = targetWaypoint.z - playerPos[2];
    // In our coordinate system: -Z is North (0 deg), +X is East (90 deg)
    const rad = Math.atan2(dx, -dz);
    bearingDegrees = ((rad * 180) / Math.PI + 360) % 360;
  }

  // Active heading: real compass if available, else simulation heading
  const currentDeviceHeading = isSimulated ? simulationHeading : compassHeading;

  // Relative angle between current phone heading and target bearing
  let relativeAngle = bearingDegrees - currentDeviceHeading;
  while (relativeAngle > 180) relativeAngle -= 360;
  while (relativeAngle < -180) relativeAngle += 360;

  // Screen horizontal offset for floating AR marker (-45 deg to +45 deg FOV)
  const screenOffsetPct = Math.max(-45, Math.min(45, relativeAngle)) / 45; // -1 to 1

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col select-none overflow-hidden animate-in fade-in duration-300">
      {/* Live Rear Camera Feed or AR Simulated Digital Twin Canvas */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {cameraActive && !cameraError ? (
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 flex flex-col items-center justify-center relative">
            {/* Visual simulation backdrop */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="ar-scanner-line" />
            <div className="text-center p-6 z-10 max-w-md">
              <div className="w-16 h-16 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center mx-auto mb-4 text-sky-400">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">AR Live Camera Simulation Mode</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Mobile WebXR camera feed simulator for desktop judging and live demonstration. Real mobile devices automatically stream the rear camera.
              </p>

              {/* Desktop Simulation Heading Slider */}
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-left">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Simulated Phone Heading</span>
                  <span className="font-mono text-sky-400 font-bold">{Math.round(simulationHeading)}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={simulationHeading}
                  onChange={(e) => setSimulationHeading(parseFloat(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Live AR Overlay HUD */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
          {/* Top Bar: Compass & Target Info */}
          <div className="flex items-center justify-between pointer-events-auto">
            <div className="glass-panel px-4 py-2 rounded-2xl flex items-center space-x-3 border border-sky-500/30">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
              <div>
                <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider block">
                  Juspay AR Indoor Positioning System
                </span>
                <span className="text-xs font-semibold text-white">
                  Heading: {Math.round(currentDeviceHeading)}° | Target: {Math.round(bearingDegrees)}°
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white backdrop-blur-md border border-white/20 transition shadow-lg pointer-events-auto"
            >
              <svg width="20" height="20" style={{ width: 20, height: 20 }} className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Central 3D AR Spatial Waypoint Arrow Indicator */}
          <div className="relative flex-1 flex items-center justify-center">
            {/* Dynamic floating waypoint badge positioned according to phone azimuth */}
            <div
              className="absolute transition-all duration-150 ease-out flex flex-col items-center"
              style={{
                transform: `translateX(${screenOffsetPct * 180}px) translateY(0px)`,
                opacity: Math.abs(relativeAngle) < 60 ? 1 : 0.4
              }}
            >
              {/* 3D Glowing AR Holographic Chevron */}
              <div
                className="w-20 h-20 rounded-full bg-gradient-to-tr from-sky-500/30 to-indigo-500/30 backdrop-blur-md border-2 border-sky-400 flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.7)] animate-pulse"
                style={{
                  transform: `rotate(${relativeAngle}deg)`
                }}
              >
                <svg width="40" height="40" style={{ width: 40, height: 40 }} className="w-10 h-10 text-white drop-shadow-[0_0_10px_#38bdf8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>

              {/* Waypoint distance callout */}
              <div className="mt-3 glass-panel px-3 py-1.5 rounded-xl border border-sky-400/50 shadow-xl text-center">
                <p className="text-xs font-bold text-white">
                  {destination ? destination.name : 'Target Destination'}
                </p>
                <p className="text-[11px] font-mono font-bold text-sky-400">
                  {totalDistance.toFixed(1)}m away
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Guidance Banner */}
          <div className="pointer-events-auto">
            <div className="glass-panel p-4 rounded-2xl border border-sky-500/30 shadow-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-lg"
                  style={{ backgroundColor: destination?.categoryColor || '#0ea5e9' }}
                >
                  {destination?.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider block">
                    Live Camera Walking Directions
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    {currentStep?.instruction || 'Walk in the direction of the holographic arrow'}
                  </h4>
                  <span className="text-xs text-slate-400 font-mono">
                    {totalDistance.toFixed(1)} meters remaining
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onCancelNavigation();
                  onClose();
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition"
              >
                Exit AR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

