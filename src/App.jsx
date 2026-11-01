import React, { useState, useEffect, useCallback, useMemo } from 'react';
import WalkthroughViewer from './components/WalkthroughViewer';
import Minimap from './components/Minimap';
import SearchPanel from './components/SearchPanel';
import NavigationHUD from './components/NavigationHUD';
import POIDetailsModal from './components/POIDetailsModal';
import ARNavigationMode from './components/ARNavigationMode';
import TopNav from './components/TopNav';
import DocsModal from './components/DocsModal';

import { POI_LIST, DEFAULT_SPAWN } from './utils/floorData';
import {
  findPath,
  calculatePathDistance,
  generateTurnByTurnDirections
} from './utils/pathfinding';

export default function App() {
  
  const [playerPos, setPlayerPos] = useState(DEFAULT_SPAWN.position);
  const [playerHeading, setPlayerHeading] = useState(DEFAULT_SPAWN.rotation[1]);
  const [selectedPOI, setSelectedPOI] = useState(null);
  const [activeDestination, setActiveDestination] = useState(null);
  const [activePath, setActivePath] = useState(null);
  const [directions, setDirections] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  const [activeMode, setActiveMode] = useState('walkthrough'); 
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [inspectingPOI, setInspectingPOI] = useState(null);
  const [freeLookLocked, setFreeLookLocked] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const startNavigation = useCallback((targetX, targetZ, destObj = null) => {
    const path = findPath(playerPos[0], playerPos[2], targetX, targetZ);
    if (!path || path.length < 2) {
      showToast('⚠️ Unable to compute clear path to destination');
      return;
    }

    const dist = calculatePathDistance(path);
    const destName = destObj ? destObj.name : `Location (${targetX.toFixed(1)}, ${targetZ.toFixed(1)})`;
    const dirs = generateTurnByTurnDirections(path, destName);

    setActiveDestination(destObj || {
      name: destName,
      categoryColor: '#0ea5e9',
      position: [targetX, 1.6, targetZ]
    });
    setActivePath(path);
    setDirections(dirs);
    setTotalDistance(dist);
    setIsNavigating(true);
    showToast(`📍 Routing to ${destName} (${dist.toFixed(1)}m)`);
  }, [playerPos, showToast]);

  const handleNavigateToPOI = useCallback((poi) => {
    const target = poi.walkableTarget || [poi.position[0], 0, poi.position[2]];
    startNavigation(target[0], target[2], poi);
  }, [startNavigation]);

  const handleTeleportToPOI = useCallback((poi) => {
    setSelectedPOI(poi);
    showToast(`⚡ Teleported to ${poi.name}`);
  }, [showToast]);

  const handleCancelNavigation = useCallback(() => {
    setActiveDestination(null);
    setActivePath(null);
    setDirections([]);
    setTotalDistance(0);
    setIsNavigating(false);
    showToast('Navigation ended');
  }, [showToast]);

  const handleResetPosition = useCallback(() => {
    setSelectedPOI({
      name: 'Grand Reception Lobby',
      walkableTarget: DEFAULT_SPAWN.position
    });
    handleCancelNavigation();
    showToast('Returned to Reception Lobby');
  }, [handleCancelNavigation, showToast]);

  useEffect(() => {
    if (!isNavigating || !activeDestination) return;

    const targetPos = activeDestination.walkableTarget || [
      activeDestination.position[0],
      0,
      activeDestination.position[2]
    ];
    const distToTarget = Math.hypot(
      targetPos[0] - playerPos[0],
      targetPos[2] - playerPos[2]
    );

    if (distToTarget < 1.8) {
      showToast(`🎉 You have arrived at ${activeDestination.name}!`);
      handleCancelNavigation();
      return;
    }

    if (activePath && activePath.length > 1) {
      
      const remainingDist = distToTarget;
      setTotalDistance(remainingDist);
    }
  }, [playerPos, isNavigating, activeDestination, activePath, handleCancelNavigation, showToast]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950 select-none">
      
      <TopNav
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        onOpenSearch={() => setIsSearchOpen(true)}
        onResetPosition={handleResetPosition}
        onOpenDocs={() => setIsDocsOpen(true)}
        isNavigating={isNavigating}
        destination={activeDestination}
      />

      <WalkthroughViewer
        selectedPOI={selectedPOI}
        onSelectPOI={(poi) => setInspectingPOI(poi)}
        activePath={activePath}
        playerPos={playerPos}
        setPlayerPos={setPlayerPos}
        playerHeading={playerHeading}
        setPlayerHeading={setPlayerHeading}
        isNavigating={isNavigating}
        freeLookLocked={freeLookLocked}
        setFreeLookLocked={setFreeLookLocked}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <Minimap
        playerPos={playerPos}
        playerHeading={playerHeading}
        activePath={activePath}
        selectedPOI={activeDestination || selectedPOI}
        onSelectPOI={(poi) => setInspectingPOI(poi)}
        onNavigateToCoords={(x, z) => startNavigation(x, z)}
      />

      {isNavigating && activeDestination && (
        <NavigationHUD
          destination={activeDestination}
          directions={directions}
          totalDistance={totalDistance}
          onCancelNavigation={handleCancelNavigation}
          playerPos={playerPos}
        />
      )}

      <SearchPanel
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        playerPos={playerPos}
        onSelectPOI={(poi) => setInspectingPOI(poi)}
        onNavigateToPOI={handleNavigateToPOI}
        onTeleportToPOI={handleTeleportToPOI}
      />

      <POIDetailsModal
        poi={inspectingPOI}
        onClose={() => setInspectingPOI(null)}
        onStartNavigation={handleNavigateToPOI}
        onTeleport={handleTeleportToPOI}
      />

      {activeMode === 'ar' && (
        <ARNavigationMode
          destination={activeDestination || POI_LIST[0]}
          directions={directions.length > 0 ? directions : [
            {
              instruction: `Follow arrow towards ${POI_LIST[0].name}`,
              distance: 12.0,
              icon: 'straight',
              waypoint: { x: POI_LIST[0].position[0], z: POI_LIST[0].position[2] }
            }
          ]}
          totalDistance={totalDistance > 0 ? totalDistance : 12.0}
          playerPos={playerPos}
          onClose={() => setActiveMode('walkthrough')}
          onCancelNavigation={handleCancelNavigation}
        />
      )}

      <DocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

      {toastMessage && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="glass-panel px-4 py-2.5 rounded-2xl text-xs font-semibold text-white shadow-2xl border border-sky-400/40 flex items-center space-x-2">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}

