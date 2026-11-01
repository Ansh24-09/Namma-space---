

import { FLOOR_CONFIG, WALLS, OBSTACLES } from './floorData.js';

const CELL_SIZE = FLOOR_CONFIG.gridCellSize; 
const MIN_X = -FLOOR_CONFIG.width / 2;       
const MAX_X = FLOOR_CONFIG.width / 2;        
const MIN_Z = -FLOOR_CONFIG.depth / 2;       
const MAX_Z = FLOOR_CONFIG.depth / 2;        

const COLS = Math.round((MAX_X - MIN_X) / CELL_SIZE); 
const ROWS = Math.round((MAX_Z - MIN_Z) / CELL_SIZE); 

export function worldToGrid(x, z) {
  const col = Math.round((x - MIN_X) / CELL_SIZE);
  const row = Math.round((z - MIN_Z) / CELL_SIZE);
  return {
    col: Math.max(0, Math.min(COLS - 1, col)),
    row: Math.max(0, Math.min(ROWS - 1, row))
  };
}

export function gridToWorld(col, row) {
  return {
    x: MIN_X + col * CELL_SIZE,
    z: MIN_Z + row * CELL_SIZE
  };
}

function createNavigationGrid() {
  const grid = new Uint8Array(COLS * ROWS);

  function blockBox(minX, maxX, minZ, maxZ, padding = 0.45) {
    const pMinX = Math.max(MIN_X, minX - padding);
    const pMaxX = Math.min(MAX_X, maxX + padding);
    const pMinZ = Math.max(MIN_Z, minZ - padding);
    const pMaxZ = Math.min(MAX_Z, maxZ + padding);

    const start = worldToGrid(pMinX, pMinZ);
    const end = worldToGrid(pMaxX, pMaxZ);

    for (let c = start.col; c <= end.col; c++) {
      for (let r = start.row; r <= end.row; r++) {
        grid[r * COLS + c] = 1; 
      }
    }
  }

  WALLS.forEach(w => {
    
    const pad = w.type === 'interior' ? 0.35 : 0.45;
    blockBox(w.minX, w.maxX, w.minZ, w.maxZ, pad);
  });

  OBSTACLES.forEach(o => {
    blockBox(o.minX, o.maxX, o.minZ, o.maxZ, 0.4);
  });

  const DOORWAYS = [
    { x: -12.8, z: -3.0, radius: 1.2 }, 
    { x: -12.8, z: 9.0, radius: 1.2 },  
    { x: 12.8, z: -3.0, radius: 1.2 },  
    { x: 12.8, z: 9.0, radius: 1.2 },   
    { x: -3.5, z: 6.0, radius: 1.0 },   
    { x: 0.0, z: -10.0, radius: 2.0 },  
    { x: 0.0, z: 9.0, radius: 2.0 },    
  ];

  DOORWAYS.forEach(d => {
    const start = worldToGrid(d.x - d.radius, d.z - d.radius);
    const end = worldToGrid(d.x + d.radius, d.z + d.radius);
    for (let c = start.col; c <= end.col; c++) {
      for (let r = start.row; r <= end.row; r++) {
        
        const world = gridToWorld(c, r);
        if (Math.abs(world.x) < 29.2 && Math.abs(world.z) < 19.2) {
          grid[r * COLS + c] = 0; 
        }
      }
    }
  });

  return grid;
}

export const NAV_GRID = createNavigationGrid();

export function isWalkable(col, row) {
  if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return false;
  return NAV_GRID[row * COLS + col] === 0;
}

export function isWorldPositionWalkable(x, z, radius = 0.3) {
  const checkOffsets = [
    [0, 0], [radius, 0], [-radius, 0], [0, radius], [0, -radius]
  ];
  for (const [dx, dz] of checkOffsets) {
    const g = worldToGrid(x + dx, z + dz);
    if (!isWalkable(g.col, g.row)) return false;
  }
  return true;
}

function findNearestWalkable(col, row) {
  if (isWalkable(col, row)) return { col, row };

  const maxRadius = 15;
  for (let r = 1; r <= maxRadius; r++) {
    for (let dc = -r; dc <= r; dc++) {
      for (let dr = -r; dr <= r; dr++) {
        if (Math.abs(dc) === r || Math.abs(dr) === r) {
          const testC = col + dc;
          const testR = row + dr;
          if (isWalkable(testC, testR)) {
            return { col: testC, row: testR };
          }
        }
      }
    }
  }
  return { col, row };
}

class PriorityQueue {
  constructor() {
    this.items = [];
  }
  enqueue(element, priority) {
    const queueElement = { element, priority };
    let added = false;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].priority > queueElement.priority) {
        this.items.splice(i, 0, queueElement);
        added = true;
        break;
      }
    }
    if (!added) this.items.push(queueElement);
  }
  dequeue() {
    return this.items.shift();
  }
  isEmpty() {
    return this.items.length === 0;
  }
}

export function findPath(startX, startZ, targetX, targetZ) {
  const startRaw = worldToGrid(startX, startZ);
  const targetRaw = worldToGrid(targetX, targetZ);

  const start = findNearestWalkable(startRaw.col, startRaw.row);
  const target = findNearestWalkable(targetRaw.col, targetRaw.row);

  const startKey = `${start.col},${start.row}`;
  const targetKey = `${target.col},${target.row}`;

  if (startKey === targetKey) {
    return [{ x: startX, y: 0.05, z: startZ }, { x: targetX, y: 0.05, z: targetZ }];
  }

  const openSet = new PriorityQueue();
  const cameFrom = new Map();
  const gScore = new Map();
  const fScore = new Map();

  gScore.set(startKey, 0);
  const initialH = Math.hypot(target.col - start.col, target.row - start.row);
  fScore.set(startKey, initialH);
  openSet.enqueue(start, initialH);

  const NEIGHBORS = [
    [1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1],
    [1, 1, Math.SQRT2], [1, -1, Math.SQRT2],
    [-1, 1, Math.SQRT2], [-1, -1, Math.SQRT2]
  ];

  let found = false;
  let iterations = 0;
  const MAX_ITER = 6000;

  while (!openSet.isEmpty() && iterations++ < MAX_ITER) {
    const current = openSet.dequeue().element;
    const currentKey = `${current.col},${current.row}`;

    if (current.col === target.col && current.row === target.row) {
      found = true;
      break;
    }

    for (const [dc, dr, cost] of NEIGHBORS) {
      const neighborCol = current.col + dc;
      const neighborRow = current.row + dr;

      if (!isWalkable(neighborCol, neighborRow)) continue;

      if (dc !== 0 && dr !== 0) {
        if (!isWalkable(current.col + dc, current.row) || !isWalkable(current.col, current.row + dr)) {
          continue;
        }
      }

      const neighborKey = `${neighborCol},${neighborRow}`;
      const tentativeG = gScore.get(currentKey) + cost;

      if (!gScore.has(neighborKey) || tentativeG < gScore.get(neighborKey)) {
        cameFrom.set(neighborKey, current);
        gScore.set(neighborKey, tentativeG);
        const h = Math.hypot(target.col - neighborCol, target.row - neighborRow);
        const f = tentativeG + h;
        fScore.set(neighborKey, f);
        openSet.enqueue({ col: neighborCol, row: neighborRow }, f);
      }
    }
  }

  if (!found) {
    
    return [
      { x: startX, y: 0.05, z: startZ },
      { x: targetX, y: 0.05, z: targetZ }
    ];
  }

  const rawPath = [];
  let curr = target;
  while (curr) {
    const worldPos = gridToWorld(curr.col, curr.row);
    rawPath.push({ x: worldPos.x, y: 0.05, z: worldPos.z });
    const key = `${curr.col},${curr.row}`;
    curr = cameFrom.get(key);
  }
  rawPath.reverse();

  const smoothedPath = smoothPath(rawPath);

  smoothedPath[0] = { x: startX, y: 0.05, z: startZ };
  smoothedPath[smoothedPath.length - 1] = { x: targetX, y: 0.05, z: targetZ };

  return smoothedPath;
}

function hasLineOfSight(p1, p2) {
  const g1 = worldToGrid(p1.x, p1.z);
  const g2 = worldToGrid(p2.x, p2.z);

  let c0 = g1.col, r0 = g1.row;
  const c1 = g2.col, r1 = g2.row;

  const dc = Math.abs(c1 - c0);
  const dr = Math.abs(r1 - r0);
  const sc = c0 < c1 ? 1 : -1;
  const sr = r0 < r1 ? 1 : -1;
  let err = dc - dr;

  while (true) {
    if (!isWalkable(c0, r0)) return false;
    if (c0 === c1 && r0 === r1) break;
    const e2 = 2 * err;
    if (e2 > -dr) {
      err -= dr;
      c0 += sc;
    }
    if (e2 < dc) {
      err += dc;
      r0 += sr;
    }
  }
  return true;
}

function smoothPath(path) {
  if (path.length <= 2) return path;

  const smoothed = [path[0]];
  let currentIdx = 0;

  while (currentIdx < path.length - 1) {
    let furthestIdx = currentIdx + 1;
    
    for (let testIdx = path.length - 1; testIdx > currentIdx; testIdx--) {
      if (hasLineOfSight(path[currentIdx], path[testIdx])) {
        furthestIdx = testIdx;
        break;
      }
    }
    smoothed.push(path[furthestIdx]);
    currentIdx = furthestIdx;
  }

  return smoothed;
}

export function calculatePathDistance(path) {
  if (!path || path.length < 2) return 0;
  let dist = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const p1 = path[i];
    const p2 = path[i + 1];
    dist += Math.hypot(p2.x - p1.x, p2.z - p1.z);
  }
  return dist;
}

export function generateTurnByTurnDirections(path, destinationName) {
  if (!path || path.length < 2) return [];

  const directions = [];
  const walkingSpeed = 1.3; 

  for (let i = 0; i < path.length - 1; i++) {
    const p1 = path[i];
    const p2 = path[i + 1];
    const segmentDist = Math.hypot(p2.x - p1.x, p2.z - p1.z);

    if (segmentDist < 0.2 && i < path.length - 2) continue;

    const angle = Math.atan2(p2.x - p1.x, p2.z - p1.z); 

    let instruction = '';
    let icon = 'straight';

    if (i === 0) {
      instruction = `Head straight for ${Math.round(segmentDist)}m`;
      icon = 'straight';
    } else {
      const prevP = path[i - 1];
      const prevAngle = Math.atan2(p1.x - prevP.x, p1.z - prevP.z);
      let angleDiff = angle - prevAngle;

      while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
      while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

      const deg = (angleDiff * 180) / Math.PI;

      if (deg > 40 && deg <= 120) {
        instruction = `Turn right, continue for ${Math.round(segmentDist)}m`;
        icon = 'turn-right';
      } else if (deg > 120) {
        instruction = `Make a sharp right turn, continue for ${Math.round(segmentDist)}m`;
        icon = 'sharp-right';
      } else if (deg < -40 && deg >= -120) {
        instruction = `Turn left, continue for ${Math.round(segmentDist)}m`;
        icon = 'turn-left';
      } else if (deg < -120) {
        instruction = `Make a sharp left turn, continue for ${Math.round(segmentDist)}m`;
        icon = 'sharp-left';
      } else {
        instruction = `Continue straight for ${Math.round(segmentDist)}m`;
        icon = 'straight';
      }
    }

    directions.push({
      step: i + 1,
      instruction,
      distance: Math.round(segmentDist * 10) / 10,
      icon,
      waypoint: p2
    });
  }

  directions.push({
    step: directions.length + 1,
    instruction: `Arrived at ${destinationName}`,
    distance: 0,
    icon: 'destination',
    waypoint: path[path.length - 1]
  });

  return directions;
}
