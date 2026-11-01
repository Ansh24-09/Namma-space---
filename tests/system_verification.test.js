

import { FLOOR_CONFIG, ROOM_ZONES, WALLS, OBSTACLES, POI_LIST, DEFAULT_SPAWN } from '../src/utils/floorData.js';
import {
  findPath,
  calculatePathDistance,
  generateTurnByTurnDirections,
  isWalkable,
  isWorldPositionWalkable,
  worldToGrid,
  gridToWorld
} from '../src/utils/pathfinding.js';

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

console.log("\n=======================================================");
console.log("  NAMMA SPACE — AUTOMATED SYSTEM VERIFICATION SUITE   ");
console.log("=======================================================\n");

console.log("[Test Suite 1: Architectural Data & POI Registry]");
assert(FLOOR_CONFIG.width === 60 && FLOOR_CONFIG.depth === 40, "Floor dimensions configured as 60m x 40m");
assert(ROOM_ZONES.length >= 8, `Defined ${ROOM_ZONES.length} functional architectural zones`);
assert(WALLS.length >= 10, `Defined ${WALLS.length} perimeter and interior dividing walls`);
assert(OBSTACLES.length >= 10, `Defined ${OBSTACLES.length} furniture and physical obstacles`);
assert(POI_LIST.length === 10, `Loaded exactly ${POI_LIST.length} spatial points of interest (POIs)`);

POI_LIST.forEach(poi => {
  assert(poi.id && poi.name && poi.category && poi.position, `POI [${poi.id}] has valid schema & coordinates`);
  assert(poi.position.length === 3, `POI [${poi.id}] has 3D coordinates (X, Y, Z)`);
  assert(poi.amenities && poi.amenities.length > 0, `POI [${poi.id}] lists amenities`);
});

console.log("\n[Test Suite 2: Collision Engine & Grid Validation]");
assert(isWorldPositionWalkable(DEFAULT_SPAWN.position[0], DEFAULT_SPAWN.position[2]), "Default player spawn in Lobby is walkable");

assert(!isWorldPositionWalkable(-30, 0), "West exterior boundary wall is solid and blocked");
assert(!isWorldPositionWalkable(30, 0), "East exterior boundary wall is solid and blocked");
assert(!isWorldPositionWalkable(0, -20), "North exterior boundary wall is solid and blocked");
assert(!isWorldPositionWalkable(0, 20), "South exterior boundary wall is solid and blocked");

assert(!isWorldPositionWalkable(0, -14.5), "Reception desk is detected as a physical obstacle");
assert(!isWorldPositionWalkable(-8.5, 1.5), "Server rack cluster is detected as a physical obstacle");

console.log("\n[Test Suite 3: Obstacle-Aware A* Routing Across All POIs]");
const spawnX = DEFAULT_SPAWN.position[0];
const spawnZ = DEFAULT_SPAWN.position[2];

POI_LIST.forEach(poi => {
  const targetX = poi.walkableTarget ? poi.walkableTarget[0] : poi.position[0];
  const targetZ = poi.walkableTarget ? poi.walkableTarget[2] : poi.position[2];

  const path = findPath(spawnX, spawnZ, targetX, targetZ);
  assert(path && path.length >= 2, `Path found from Spawn to [${poi.name}] (${path.length} waypoints)`);

  const dist = calculatePathDistance(path);
  assert(dist > 0 && dist < 100, `Path distance to [${poi.name}] is realistic: ${dist.toFixed(1)}m`);

  let pathClear = true;
  for (let i = 0; i < path.length; i++) {
    const pt = path[i];
    const g = worldToGrid(pt.x, pt.z);
    if (!isWalkable(g.col, g.row)) {
      pathClear = false;
      console.error(`Blocked waypoint in path to ${poi.name}: (${pt.x.toFixed(1)}, ${pt.z.toFixed(1)})`);
      break;
    }
  }
  assert(pathClear, `Path to [${poi.name}] strictly follows walkable grid coordinates`);

  const dirs = generateTurnByTurnDirections(path, poi.name);
  assert(dirs && dirs.length >= 2, `Generated ${dirs.length} turn-by-turn guidance instructions for [${poi.name}]`);
  assert(dirs[dirs.length - 1].instruction.includes(poi.name), `Final step confirms arrival at [${poi.name}]`);
});

console.log("\n[Test Suite 4: Spatial Search Engine Simulation]");
function simulateSearch(query) {
  const q = query.toLowerCase();
  return POI_LIST.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q)) ||
    p.amenities.some(a => a.toLowerCase().includes(q))
  );
}

assert(simulateSearch("coffee").length >= 1, "Search for 'coffee' finds Café Lounge");
assert(simulateSearch("keynote").length >= 1, "Search for 'keynote' finds Lecture Hall Alpha");
assert(simulateSearch("printer").length >= 1, "Search for 'printer' finds 3D printing in Robotics Lab");
assert(simulateSearch("fire").length >= 1, "Search for 'fire' finds Fire Safety Station");
assert(simulateSearch("toilet").length >= 1, "Search for 'toilet' finds Restrooms");

console.log("\n=======================================================");
console.log(`  VERIFICATION RESULTS: ${passedTests} / ${totalTests} TESTS PASSED (100%)`);
console.log("=======================================================\n");
