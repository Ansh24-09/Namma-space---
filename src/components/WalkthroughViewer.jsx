import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { FLOOR_CONFIG, ROOM_ZONES, WALLS, OBSTACLES, POI_LIST, DEFAULT_SPAWN } from '../utils/floorData';
import { isWorldPositionWalkable } from '../utils/pathfinding';

export default function WalkthroughViewer({
  selectedPOI,
  onSelectPOI,
  activePath,
  playerPos,
  setPlayerPos,
  playerHeading,
  setPlayerHeading,
  isNavigating,
  freeLookLocked,
  setFreeLookLocked,
  onOpenSearch
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // Movement state
  const keysPressed = useRef({ w: false, a: false, s: false, d: false, shift: false });
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const headBobTimer = useRef(0);

  // References for dynamic 3D elements
  const pathMeshRef = useRef(null);
  const pathParticlesRef = useRef([]);
  const destinationBeaconRef = useRef(null);
  const poiMeshesRef = useRef([]);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  // Interactive hover state
  const [hoveredPOI, setHoveredPOI] = useState(null);

  // Setup Three.js Scene
  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#090d16');
    scene.fog = new THREE.FogExp2('#090d16', 0.015);
    sceneRef.current = scene;

    // 2. Dimensions & Camera
    const getViewportSize = () => {
      const w = mountRef.current?.clientWidth || window.innerWidth || 1280;
      const h = mountRef.current?.clientHeight || window.innerHeight || 800;
      return { width: Math.max(100, w), height: Math.max(100, h) };
    };

    const { width, height } = getViewportSize();

    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      100
    );
    camera.position.set(DEFAULT_SPAWN.position[0], DEFAULT_SPAWN.position[1], DEFAULT_SPAWN.position[2]);
    camera.rotation.set(DEFAULT_SPAWN.rotation[0], DEFAULT_SPAWN.rotation[1], DEFAULT_SPAWN.rotation[2]);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. PointerLock Controls
    const controls = new PointerLockControls(camera, renderer.domElement);
    controlsRef.current = controls;

    controls.addEventListener('lock', () => setFreeLookLocked(true));
    controls.addEventListener('unlock', () => setFreeLookLocked(false));

    // 5. Lighting Setup (Photorealistic Corporate Architecture)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xddeeff, 0x111122, 0.4);
    scene.add(hemiLight);

    // Main ceiling recessed spotlights for key zones
    ROOM_ZONES.forEach(zone => {
      const centerX = (zone.bounds.minX + zone.bounds.maxX) / 2;
      const centerZ = (zone.bounds.minZ + zone.bounds.maxZ) / 2;

      const zoneLight = new THREE.PointLight(zone.color, 1.2, 18, 1.4);
      zoneLight.position.set(centerX, 3.8, centerZ);
      zoneLight.castShadow = true;
      zoneLight.shadow.mapSize.width = 512;
      zoneLight.shadow.mapSize.height = 512;
      zoneLight.shadow.bias = -0.002;
      scene.add(zoneLight);

      // Emissive ceiling panel geometry
      const panelGeo = new THREE.PlaneGeometry(3, 3);
      const panelMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
      });
      const panelMesh = new THREE.Mesh(panelGeo, panelMat);
      panelMesh.rotation.x = Math.PI / 2;
      panelMesh.position.set(centerX, 4.18, centerZ);
      scene.add(panelMesh);
    });

    // 6. Build Architectural Structure
    buildFloorAndCeiling(scene);
    buildWalls(scene);
    buildFurnitureAndObstacles(scene);
    buildPOIMarkers(scene, poiMeshesRef);

    // 7. Key Event Listeners
    const onKeyDown = (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keysPressed.current.w = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keysPressed.current.s = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keysPressed.current.a = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keysPressed.current.d = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keysPressed.current.shift = true;
          break;
        case 'KeyK':
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            onOpenSearch?.();
          }
          break;
        case 'Slash':
          e.preventDefault();
          onOpenSearch?.();
          break;
        default:
          break;
      }
    };

    const onKeyUp = (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keysPressed.current.w = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keysPressed.current.s = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keysPressed.current.a = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keysPressed.current.d = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keysPressed.current.shift = false;
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // 8. Window Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const { width: w, height: h } = getViewportSize();
      if (w > 0 && h > 0) {
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
      }
    };
    window.addEventListener('resize', handleResize);

    // 9. Pointer Raycast for Clicking POIs in 3D
    const handleCanvasClick = (event) => {
      if (!controls.isLocked) {
        // If not locked, user clicks to lock controls or click on a POI
        const rect = renderer.domElement.getBoundingClientRect();
        mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycasterRef.current.setFromCamera(mouseRef.current, camera);
        const intersects = raycasterRef.current.intersectObjects(poiMeshesRef.current, true);

        if (intersects.length > 0) {
          const clickedPOIObj = intersects[0].object;
          const poiData = clickedPOIObj.userData?.poiData;
          if (poiData) {
            onSelectPOI(poiData);
            return;
          }
        }
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('click', handleCanvasClick);

    // 10. Main Animation Loop
    let lastTime = performance.now();

    const animate = (time) => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Update Player Movement & Collision
      updatePlayer(delta, camera, controls);

      // Animate 3D POI Floating Badges
      animatePOIs(time);

      // Animate Active Navigation Path
      animatePath(time);

      // Render
      renderer.render(scene, camera);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('click', handleCanvasClick);
      controls.dispose();
      renderer.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Player physics, WASD, headbob, and collision sliding
  const updatePlayer = (delta, camera, controls) => {
    // Friction damping
    velocity.current.x -= velocity.current.x * 10.0 * delta;
    velocity.current.z -= velocity.current.z * 10.0 * delta;

    direction.current.z = Number(keysPressed.current.w) - Number(keysPressed.current.s);
    direction.current.x = Number(keysPressed.current.d) - Number(keysPressed.current.a);
    direction.current.normalize();

    const moveSpeed = keysPressed.current.shift ? 6.5 : 3.2; // Sprint vs Walk speed

    if (keysPressed.current.w || keysPressed.current.s) {
      velocity.current.z -= direction.current.z * moveSpeed * 50.0 * delta;
    }
    if (keysPressed.current.a || keysPressed.current.d) {
      velocity.current.x -= direction.current.x * moveSpeed * 50.0 * delta;
    }

    // Calculate intended movement in world space
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    right.y = 0;
    right.normalize();

    const moveDeltaX = (right.x * -velocity.current.x + forward.x * -velocity.current.z) * delta * 0.1;
    const moveDeltaZ = (right.z * -velocity.current.x + forward.z * -velocity.current.z) * delta * 0.1;

    const currentX = camera.position.x;
    const currentZ = camera.position.z;

    // Obstacle & Wall Collision Check with sliding
    const newX = currentX + moveDeltaX;
    const newZ = currentZ + moveDeltaZ;

    // Test full step
    if (isWorldPositionWalkable(newX, newZ, 0.35)) {
      camera.position.x = newX;
      camera.position.z = newZ;
    } else if (isWorldPositionWalkable(newX, currentZ, 0.35)) {
      // Slide along X
      camera.position.x = newX;
    } else if (isWorldPositionWalkable(currentX, newZ, 0.35)) {
      // Slide along Z
      camera.position.z = newZ;
    }

    // Head Bobbing calculation
    const isMoving = (keysPressed.current.w || keysPressed.current.s || keysPressed.current.a || keysPressed.current.d) && controls.isLocked;
    if (isMoving) {
      headBobTimer.current += delta * (keysPressed.current.shift ? 14 : 9);
      camera.position.y = 1.6 + Math.sin(headBobTimer.current) * 0.04;
    } else {
      camera.position.y = 1.6;
    }

    // Sync player position & heading for Minimap and HUD
    setPlayerPos([camera.position.x, camera.position.y, camera.position.z]);

    const camEuler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ');
    setPlayerHeading(camEuler.y);
  };

  // Animate floating POI tags & holographic rings
  const animatePOIs = (time) => {
    const t = time * 0.002;
    poiMeshesRef.current.forEach(poiGroup => {
      // Floating oscillation
      poiGroup.position.y = poiGroup.userData.baseY + Math.sin(t + poiGroup.userData.phase) * 0.12;

      // Rotate decorative beacon ring
      const ring = poiGroup.userData.ring;
      if (ring) {
        ring.rotation.z += 0.02;
      }
    });

    // Animate Techfest Central Hologram
    if (sceneRef.current) {
      const centralHolo = sceneRef.current.getObjectByName('techfest-hologram-mesh');
      if (centralHolo) {
        centralHolo.rotation.y += 0.015;
        centralHolo.rotation.x = Math.sin(t * 0.5) * 0.15;
      }
    }
  };

  // Animate glowing navigation path
  const animatePath = (time) => {
    if (pathMeshRef.current && pathMeshRef.current.material) {
      // Pulse brightness
      const pulse = 0.8 + Math.sin(time * 0.005) * 0.2;
      pathMeshRef.current.material.opacity = pulse;
    }

    // Move glowing light orbs along waypoints
    if (pathParticlesRef.current.length > 0) {
      const t = (time * 0.001) % 1.0;
      pathParticlesRef.current.forEach((particle, idx) => {
        const offset = (t + idx / pathParticlesRef.current.length) % 1.0;
        if (particle.userData.curve) {
          const pt = particle.userData.curve.getPointAt(offset);
          if (pt) particle.position.copy(pt);
        }
      });
    }

    // Destination beacon rotation
    if (destinationBeaconRef.current) {
      destinationBeaconRef.current.rotation.y += 0.03;
    }
  };

  // Update 3D Path whenever activePath changes
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    // Remove old path meshes
    if (pathMeshRef.current) {
      scene.remove(pathMeshRef.current);
      pathMeshRef.current.geometry.dispose();
      pathMeshRef.current.material.dispose();
      pathMeshRef.current = null;
    }

    // Remove old moving particles
    pathParticlesRef.current.forEach(p => {
      scene.remove(p);
      p.geometry.dispose();
      p.material.dispose();
    });
    pathParticlesRef.current = [];

    // Remove old destination beacon
    if (destinationBeaconRef.current) {
      scene.remove(destinationBeaconRef.current);
      destinationBeaconRef.current = null;
    }

    if (!activePath || activePath.length < 2) return;

    // Build smooth 3D CatmullRom spline path
    const points = activePath.map(p => new THREE.Vector3(p.x, 0.08, p.z));
    const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.2);

    // Ribbon geometry along path
    const tubeGeo = new THREE.TubeGeometry(curve, 100, 0.18, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.2,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.9
    });

    const pathMesh = new THREE.Mesh(tubeGeo, tubeMat);
    scene.add(pathMesh);
    pathMeshRef.current = pathMesh;

    // Animated glowing light beads travelling along the path
    const beadCount = 6;
    for (let i = 0; i < beadCount; i++) {
      const beadGeo = new THREE.SphereGeometry(0.24, 16, 16);
      const beadMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.95
      });
      const bead = new THREE.Mesh(beadGeo, beadMat);
      bead.userData.curve = curve;
      scene.add(bead);
      pathParticlesRef.current.push(bead);
    }

    // Destination beacon at target
    const targetPt = points[points.length - 1];
    const beaconGroup = new THREE.Group();
    beaconGroup.position.set(targetPt.x, 0, targetPt.z);

    // Vertical holographic light pillar
    const cylinderGeo = new THREE.CylinderGeometry(0.6, 0.6, 4.0, 32, 1, true);
    const cylinderMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const cylinder = new THREE.Mesh(cylinderGeo, cylinderMat);
    cylinder.position.y = 2.0;
    beaconGroup.add(cylinder);

    // Glowing target concentric rings on floor
    const ringGeo = new THREE.RingGeometry(0.3, 1.2, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.05;
    beaconGroup.add(ring);

    scene.add(beaconGroup);
    destinationBeaconRef.current = beaconGroup;
  }, [activePath]);

  // Teleport player directly to selected POI when requested
  useEffect(() => {
    if (!selectedPOI || !cameraRef.current) return;
    const target = selectedPOI.walkableTarget;
    if (target) {
      cameraRef.current.position.set(target[0], 1.6, target[2]);
      setPlayerPos([target[0], 1.6, target[2]]);
    }
  }, [selectedPOI]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full cursor-crosshair" />

      {/* Crosshair HUD */}
      <div className={`crosshair ${hoveredPOI ? 'interactive' : ''}`} />

      {/* Free Roam / Desktop Walkthrough Click-to-lock instruction banner */}
      {!freeLookLocked && (
        <div
          onClick={() => controlsRef.current?.lock()}
          className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/65 backdrop-blur-sm z-20 cursor-pointer transition-all duration-300"
        >
          <div className="glass-panel p-8 rounded-2xl max-w-lg text-center border border-sky-500/30 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-sky-500/30">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Click to Enter 3D Walkthrough</h2>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              Experience fluid first-person roaming inside the high-fidelity spatial digital twin.
            </p>

            <div className="grid grid-cols-2 gap-3 text-left text-xs bg-slate-900/80 p-4 rounded-xl border border-slate-800 mb-6">
              <div className="flex items-center space-x-2">
                <kbd className="px-2 py-1 bg-slate-800 rounded font-mono text-sky-400 border border-slate-700">W A S D</kbd>
                <span className="text-slate-400">Walk around</span>
              </div>
              <div className="flex items-center space-x-2">
                <kbd className="px-2 py-1 bg-slate-800 rounded font-mono text-sky-400 border border-slate-700">Mouse</kbd>
                <span className="text-slate-400">Look & Aim</span>
              </div>
              <div className="flex items-center space-x-2">
                <kbd className="px-2 py-1 bg-slate-800 rounded font-mono text-sky-400 border border-slate-700">Shift</kbd>
                <span className="text-slate-400">Sprint</span>
              </div>
              <div className="flex items-center space-x-2">
                <kbd className="px-2 py-1 bg-slate-800 rounded font-mono text-sky-400 border border-slate-700">ESC</kbd>
                <span className="text-slate-400">Release Mouse</span>
              </div>
            </div>

            <button className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-sky-500/25 transition-all">
              Start Virtual Walkthrough
            </button>
          </div>
        </div>
      )}

      {/* Control Tips Badge in bottom left */}
      <div className="absolute bottom-6 left-6 pointer-events-none z-10 hidden sm:flex items-center space-x-2 glass-panel-subtle px-3 py-1.5 rounded-lg text-xs text-slate-400 border border-slate-800">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1"></span>
        <span>WASD to Move</span>
        <span className="text-slate-600">•</span>
        <span>Mouse to Look</span>
        <span className="text-slate-600">•</span>
        <span>Shift to Sprint</span>
        <span className="text-slate-600">•</span>
        <span>Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-sky-400 border border-slate-700">ESC</kbd> for Cursor</span>
      </div>
    </div>
  );
}

// ==================== PROCEDURAL 3D ARCHITECTURAL BUILDERS ====================

function buildFloorAndCeiling(scene) {
  const width = FLOOR_CONFIG.width;
  const depth = FLOOR_CONFIG.depth;
  const height = FLOOR_CONFIG.height;

  // Main Polished Architectural Floor
  const floorGeo = new THREE.PlaneGeometry(width, depth, 60, 40);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.25,
    metalness: 0.15,
  });
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);

  // Decorative High-Tech Grid lines on Floor
  const gridHelper = new THREE.GridHelper(width, 60, 0x0284c7, 0x1e293b);
  gridHelper.position.y = 0.01;
  scene.add(gridHelper);

  // Ceiling
  const ceilingGeo = new THREE.PlaneGeometry(width, depth);
  const ceilingMat = new THREE.MeshStandardMaterial({
    color: 0x0b0f19,
    roughness: 0.9,
    metalness: 0.05
  });
  const ceilingMesh = new THREE.Mesh(ceilingGeo, ceilingMat);
  ceilingMesh.rotation.x = Math.PI / 2;
  ceilingMesh.position.y = height;
  scene.add(ceilingMesh);

  // Zone Floor Inlays (Distinguishes rooms with subtle tinted luxury tiles)
  ROOM_ZONES.forEach(zone => {
    const zw = zone.bounds.maxX - zone.bounds.minX;
    const zd = zone.bounds.maxZ - zone.bounds.minZ;
    const cx = (zone.bounds.minX + zone.bounds.maxX) / 2;
    const cz = (zone.bounds.minZ + zone.bounds.maxZ) / 2;

    const zoneFloorGeo = new THREE.PlaneGeometry(zw, zd);
    const zoneFloorMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(zone.floorColor),
      roughness: 0.35,
      metalness: 0.2
    });
    const zoneMesh = new THREE.Mesh(zoneFloorGeo, zoneFloorMat);
    zoneMesh.rotation.x = -Math.PI / 2;
    zoneMesh.position.set(cx, 0.02, cz);
    zoneMesh.receiveShadow = true;
    scene.add(zoneMesh);
  });
}

function buildWalls(scene) {
  WALLS.forEach(w => {
    const width = Math.max(0.2, w.maxX - w.minX);
    const depth = Math.max(0.2, w.maxZ - w.minZ);
    const height = w.h;

    const posX = (w.minX + w.maxX) / 2;
    const posZ = (w.minZ + w.maxZ) / 2;
    const posY = height / 2;

    const wallGeo = new THREE.BoxGeometry(width, height, depth);

    let wallMat;
    if (w.type === 'exterior') {
      wallMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.7,
        metalness: 0.2
      });
    } else if (w.type === 'glass') {
      wallMat = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        transmission: 0.85,
        opacity: 0.4,
        transparent: true,
        roughness: 0.1,
        metalness: 0.1,
        ior: 1.5
      });
    } else if (w.type === 'pillar') {
      wallMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.3,
        metalness: 0.5
      });
    } else {
      // Interior drywall with modern dark architectural tone
      wallMat = new THREE.MeshStandardMaterial({
        color: 0x1e2230,
        roughness: 0.8,
        metalness: 0.1
      });
    }

    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    wallMesh.position.set(posX, posY, posZ);
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;
    scene.add(wallMesh);

    // Decorative wall baseboard strip
    if (w.type !== 'glass' && w.type !== 'pillar') {
      const baseGeo = new THREE.BoxGeometry(width + 0.05, 0.12, depth + 0.05);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8, roughness: 0.2 });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.set(posX, 0.06, posZ);
      scene.add(baseMesh);
    }
  });
}

function buildFurnitureAndObstacles(scene) {
  OBSTACLES.forEach(o => {
    const width = Math.max(0.4, o.maxX - o.minX);
    const depth = Math.max(0.4, o.maxZ - o.minZ);
    const height = o.h;

    const posX = (o.minX + o.maxX) / 2;
    const posZ = (o.minZ + o.maxZ) / 2;
    const posY = height / 2;

    const geo = new THREE.BoxGeometry(width, height, depth);
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(o.color),
      roughness: 0.4,
      metalness: 0.3
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(posX, posY, posZ);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
  });

  // Special Centerpiece: Techfest Floating Hologram Cube
  const holoGeo = new THREE.OctahedronGeometry(1.2, 0);
  const holoMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.9,
    wireframe: true,
    roughness: 0.1
  });
  const holoMesh = new THREE.Mesh(holoGeo, holoMat);
  holoMesh.name = 'techfest-hologram-mesh';
  holoMesh.position.set(6.5, 2.6, 1.5);
  scene.add(holoMesh);

  // Large Video Wall Screen in Keynote Lecture Hall
  const screenGeo = new THREE.PlaneGeometry(8, 3.2);
  const screenMat = new THREE.MeshBasicMaterial({
    color: 0x1e1b4b,
    side: THREE.DoubleSide
  });
  const screenMesh = new THREE.Mesh(screenGeo, screenMat);
  screenMesh.position.set(-28.5, 2.2, -6);
  screenMesh.rotation.y = Math.PI / 2;
  scene.add(screenMesh);
}

function buildPOIMarkers(scene, poiMeshesRef) {
  POI_LIST.forEach((poi, index) => {
    const poiGroup = new THREE.Group();
    poiGroup.position.set(poi.position[0], poi.position[1], poi.position[2]);
    poiGroup.userData = {
      poiData: poi,
      baseY: poi.position[1],
      phase: index * 0.8
    };

    // 1. Holographic Floating Diamond Pin
    const pinGeo = new THREE.ConeGeometry(0.35, 0.7, 5);
    const pinMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(poi.categoryColor),
      emissive: new THREE.Color(poi.categoryColor),
      emissiveIntensity: 0.7,
      roughness: 0.2,
      metalness: 0.8
    });
    const pinMesh = new THREE.Mesh(pinGeo, pinMat);
    pinMesh.rotation.x = Math.PI; // Point down towards target
    pinMesh.userData = { poiData: poi };
    poiGroup.add(pinMesh);

    // 2. Rotating Decorative Celestial Ring
    const ringGeo = new THREE.TorusGeometry(0.55, 0.025, 8, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(poi.categoryColor),
      wireframe: true
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.userData = { poiData: poi };
    poiGroup.add(ringMesh);
    poiGroup.userData.ring = ringMesh;

    // 3. Glowing Point light for local illumination
    const poiLight = new THREE.PointLight(poi.categoryColor, 0.8, 6);
    poiLight.position.set(0, 0, 0);
    poiGroup.add(poiLight);

    // 4. Floating 2D Canvas Sprite Text Label
    const sprite = createTextSprite(poi.name, poi.categoryColor);
    sprite.position.set(0, 0.75, 0);
    sprite.userData = { poiData: poi };
    poiGroup.add(sprite);

    scene.add(poiGroup);
    poiMeshesRef.current.push(pinMesh, ringMesh, sprite);
  });
}

function createTextSprite(text, colorHex) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Background rounded pill
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = colorHex;
  ctx.lineWidth = 4;
  roundRect(ctx, 16, 16, 480, 96, 24);
  ctx.fill();
  ctx.stroke();

  // Text
  ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 256, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMat = new THREE.SpriteMaterial({ map: texture, depthTest: false });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(3.5, 0.88, 1);
  return sprite;
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

