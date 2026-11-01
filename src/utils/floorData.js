

export const FLOOR_CONFIG = {
  width: 60,   
  depth: 40,   
  height: 4.2, 
  gridCellSize: 0.5, 
};

export const ROOM_ZONES = [
  {
    id: 'lobby',
    name: 'Grand Reception & Atrium',
    bounds: { minX: -12, maxX: 12, minZ: -19, maxZ: -10 },
    color: '#0284c7',
    floorColor: '#0f172a',
    ceilingColor: '#1e293b'
  },
  {
    id: 'hall-alpha',
    name: 'Lecture Hall Alpha (Keynotes)',
    bounds: { minX: -28, maxX: -13, minZ: -14, maxZ: 1 },
    color: '#8b5cf6',
    floorColor: '#1e1b4b',
    ceilingColor: '#0f172a'
  },
  {
    id: 'conf-bravo',
    name: 'Executive Boardroom Bravo',
    bounds: { minX: -28, maxX: -13, minZ: 3, maxZ: 18 },
    color: '#06b6d4',
    floorColor: '#164e63',
    ceilingColor: '#0f172a'
  },
  {
    id: 'innovation-lab',
    name: 'Robotics & AI Innovation Lab',
    bounds: { minX: 13, maxX: 28, minZ: -14, maxZ: 1 },
    color: '#10b981',
    floorColor: '#064e3b',
    ceilingColor: '#0f172a'
  },
  {
    id: 'startup-incubator',
    name: 'Workstation Bay & Co-Working',
    bounds: { minX: 13, maxX: 28, minZ: 3, maxZ: 18 },
    color: '#f59e0b',
    floorColor: '#451a03',
    ceilingColor: '#0f172a'
  },
  {
    id: 'cafeteria',
    name: 'Namma Café & Lounge',
    bounds: { minX: -11, maxX: 11, minZ: 9, maxZ: 19 },
    color: '#ec4899',
    floorColor: '#4c0519',
    ceilingColor: '#0f172a'
  },
  {
    id: 'server-datacenter',
    name: 'IT Core & Server Cluster',
    bounds: { minX: -11, maxX: -2, minZ: -3, maxZ: 6 },
    color: '#6366f1',
    floorColor: '#1e1e38',
    ceilingColor: '#0b0f19'
  },
  {
    id: 'techfest-exhibit',
    name: 'Techfest Main Exhibition Plinth',
    bounds: { minX: 2, maxX: 11, minZ: -3, maxZ: 6 },
    color: '#eab308',
    floorColor: '#262626',
    ceilingColor: '#0f172a'
  }
];

export const WALLS = [
  
  { minX: -30, maxX: 30, minZ: -20, maxZ: -19.6, h: 4.2, type: 'exterior' }, 
  { minX: -30, maxX: 30, minZ: 19.6, maxZ: 20, h: 4.2, type: 'exterior' },   
  { minX: -30, maxX: -29.6, minZ: -20, maxZ: 20, h: 4.2, type: 'exterior' }, 
  { minX: 29.6, maxX: 30, minZ: -20, maxZ: 20, h: 4.2, type: 'exterior' },   

  { minX: -13, maxX: -12.6, minZ: -19.6, maxZ: -4, h: 4.2, type: 'interior' },
  { minX: -13, maxX: -12.6, minZ: -2, maxZ: 8, h: 4.2, type: 'interior' },
  
  { minX: -13, maxX: -12.6, minZ: 10, maxZ: 19.6, h: 4.2, type: 'interior' },

  { minX: -29.6, maxX: -13, minZ: 1.8, maxZ: 2.2, h: 4.2, type: 'interior' },

  { minX: 12.6, maxX: 13, minZ: -19.6, maxZ: -4, h: 4.2, type: 'interior' },
  { minX: 12.6, maxX: 13, minZ: -2, maxZ: 8, h: 4.2, type: 'interior' },
  
  { minX: 12.6, maxX: 13, minZ: 10, maxZ: 19.6, h: 4.2, type: 'interior' },

  { minX: 13, maxX: 29.6, minZ: 1.8, maxZ: 2.2, h: 4.2, type: 'interior' },

  { minX: -11, maxX: -10.6, minZ: -3, maxZ: 6, h: 4.2, type: 'glass' },
  { minX: -11, maxX: -2, minZ: -3.2, maxZ: -2.8, h: 4.2, type: 'glass' },
  { minX: -11, maxX: -5, minZ: 5.8, maxZ: 6.2, h: 4.2, type: 'glass' }, 
  { minX: -2.4, maxX: -2, minZ: -3, maxZ: 6, h: 4.2, type: 'glass' },

  { minX: -6.5, maxX: -5.5, minZ: -12.5, maxZ: -11.5, h: 4.2, type: 'pillar' },
  { minX: 5.5, maxX: 6.5, minZ: -12.5, maxZ: -11.5, h: 4.2, type: 'pillar' },
  { minX: -6.5, maxX: -5.5, minZ: -6.5, maxZ: -5.5, h: 4.2, type: 'pillar' },
  { minX: 5.5, maxX: 6.5, minZ: -6.5, maxZ: -5.5, h: 4.2, type: 'pillar' },
  { minX: -6.5, maxX: -5.5, minZ: 7.5, maxZ: 8.5, h: 4.2, type: 'pillar' },
  { minX: 5.5, maxX: 6.5, minZ: 7.5, maxZ: 8.5, h: 4.2, type: 'pillar' },
];

export const OBSTACLES = [
  
  { name: 'Reception Desk', minX: -4, maxX: 4, minZ: -15.5, maxZ: -13.5, h: 1.2, color: '#334155' },

  { name: 'Alpha Stage', minX: -28, maxX: -24, minZ: -10, maxZ: -2, h: 0.6, color: '#312e81' },
  { name: 'Auditorium Seating Row 1', minX: -22, maxX: -15, minZ: -9, maxZ: -7.5, h: 0.9, color: '#4338ca' },
  { name: 'Auditorium Seating Row 2', minX: -22, maxX: -15, minZ: -6, maxZ: -4.5, h: 0.9, color: '#4338ca' },
  { name: 'Auditorium Seating Row 3', minX: -22, maxX: -15, minZ: -3, maxZ: -1.5, h: 0.9, color: '#4338ca' },

  { name: 'Boardroom Table', minX: -23, maxX: -17, minZ: 8, maxZ: 13, h: 0.85, color: '#78350f' },

  { name: 'Robotics Bench A', minX: 16, maxX: 25, minZ: -11, maxZ: -8.5, h: 1.0, color: '#047857' },
  { name: 'Robotics Bench B', minX: 16, maxX: 25, minZ: -6.5, maxZ: -4, h: 1.0, color: '#047857' },
  { name: '3D Printer Farm', minX: 25, maxX: 28, minZ: -12, maxZ: -2, h: 1.4, color: '#0f766e' },

  { name: 'Dev Pod Alpha', minX: 16, maxX: 20, minZ: 6, maxZ: 10, h: 0.9, color: '#b45309' },
  { name: 'Dev Pod Beta', minX: 22, maxX: 26, minZ: 6, maxZ: 10, h: 0.9, color: '#b45309' },
  { name: 'Dev Pod Gamma', minX: 16, maxX: 20, minZ: 12, maxZ: 16, h: 0.9, color: '#b45309' },
  { name: 'Dev Pod Delta', minX: 22, maxX: 26, minZ: 12, maxZ: 16, h: 0.9, color: '#b45309' },

  { name: 'Server Rack A', minX: -9.5, maxX: -8, minZ: -1, maxZ: 4, h: 2.2, color: '#1e1b4b' },
  { name: 'Server Rack B', minX: -5.5, maxX: -4, minZ: -1, maxZ: 4, h: 2.2, color: '#1e1b4b' },

  { name: 'Techfest Hologram Plinth', minX: 4.5, maxX: 8.5, minZ: -0.5, maxZ: 3.5, h: 1.1, color: '#ca8a04' },

  { name: 'Café Bar Counter', minX: -9, maxX: 9, minZ: 16, maxZ: 17.5, h: 1.15, color: '#831843' },
  { name: 'Café Table 1', minX: -8, maxX: -5.5, minZ: 11, maxZ: 13.5, h: 0.8, color: '#9d174d' },
  { name: 'Café Table 2', minX: -2, maxX: 1.5, minZ: 11, maxZ: 13.5, h: 0.8, color: '#9d174d' },
  { name: 'Café Table 3', minX: 4.5, maxX: 7.5, minZ: 11, maxZ: 13.5, h: 0.8, color: '#9d174d' }
];

export const POI_LIST = [
  {
    id: 'poi-reception',
    name: 'Main Reception & Helpdesk',
    category: 'Information & Check-in',
    categoryColor: '#0ea5e9',
    position: [0, 1.8, -13],
    walkableTarget: [0, 0, -11.5], 
    tags: ['reception', 'helpdesk', 'registration', 'lobby', 'checkin', 'information', 'entry'],
    description: 'Central check-in hub for Techfest attendees and delegates. Collect NFC smart badges, event itineraries, and delegate kits.',
    amenities: ['Visitor Registration', 'Info Kiosk', 'Lost & Found', 'Live LED Schedule'],
    operatingHours: '08:00 AM – 09:00 PM',
    photoUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    floor: 'Level 1'
  },
  {
    id: 'poi-hall-alpha',
    name: 'Lecture Hall Alpha (Keynote Auditorium)',
    category: 'Keynotes & Talks',
    categoryColor: '#8b5cf6',
    position: [-20, 2.2, -6],
    walkableTarget: [-20, 0, -10],
    tags: ['hall alpha', 'lecture hall', 'keynote', 'auditorium', 'stage', 'talks', 'symposium'],
    description: 'Tiered 250-seat high-tech auditorium hosting flagship Techfest keynote addresses, research paper presentations, and international robotics summits.',
    amenities: ['Dual 4K Laser Projection', 'Dolby Atmos Spatial Audio', 'Live Broadcast Uplink', 'Simultaneous Translation'],
    operatingHours: '09:00 AM – 08:00 PM',
    photoUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80',
    floor: 'Level 1'
  },
  {
    id: 'poi-boardroom-bravo',
    name: 'Executive Boardroom Bravo',
    category: 'Meeting & Conferences',
    categoryColor: '#06b6d4',
    position: [-20, 1.8, 10.5],
    walkableTarget: [-15.5, 0, 10.5],
    tags: ['boardroom', 'meeting room', 'bravo', 'conference', 'vip', 'investor', 'pitch room'],
    description: 'State-of-the-art boardroom for judge deliberations, startup pitch sessions, and VIP panel discussions featuring smart glass and 4K telepresence.',
    amenities: ['Smart Interactive Whiteboard', 'Polycom 360 Video Conference', 'Private Acoustic Baffles', 'Nespresso Station'],
    operatingHours: '08:30 AM – 07:00 PM',
    photoUrl: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=600&q=80',
    floor: 'Level 1'
  },
  {
    id: 'poi-innovation-lab',
    name: 'Robotics & AI Innovation Lab',
    category: 'R&D / Hardware',
    categoryColor: '#10b981',
    position: [20, 2.0, -6],
    walkableTarget: [14.5, 0, -6],
    tags: ['robotics', 'ai lab', 'hardware', '3d printing', 'drone', 'prototyping', 'iot', 'makerspace'],
    description: 'Advanced makerspace equipped with industrial SLA/FDM 3D printers, ROS robotics test arena, oscilloscope stations, and embedded compute rigs.',
    amenities: ['Stereolithography 3D Printers', 'Soldering & SMD Station', 'NVIDIA Jetson Clusters', 'Autonomous Rover Arena'],
    operatingHours: '24 Hours (Authorized Badge Access)',
    photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    floor: 'Level 1'
  },
  {
    id: 'poi-startup-incubator',
    name: 'Co-Working & Developer Bay',
    category: 'Workspace',
    categoryColor: '#f59e0b',
    position: [20, 1.8, 11],
    walkableTarget: [18, 0, 11],
    tags: ['coworking', 'workspace', 'developer', 'incubator', 'startup', 'desks', 'monitors', 'hackathon'],
    description: 'Open collaborative workspace for hackathon finalists and student developers with ultra-low latency fiber, ergonomic Herman Miller seating, and standing desks.',
    amenities: ['Gigabit Wi-Fi 7', 'Dual 32-inch 4K Displays', 'Ergonomic Task Chairs', 'Private Focus Booths'],
    operatingHours: '24 Hours Open Access',
    photoUrl: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=600&q=80',
    floor: 'Level 1'
  },
  {
    id: 'poi-techfest-exhibit',
    name: 'Techfest Flagship Digital Showcase',
    category: 'Exhibition & Demos',
    categoryColor: '#eab308',
    position: [6.5, 2.2, 1.5],
    walkableTarget: [6.5, 0, -1.5],
    tags: ['exhibit', 'showcase', 'techfest', 'hologram', 'spatial', 'juspay', 'plinth', 'digital twin'],
    description: 'Central demonstration plinth hosting interactive spatial twin demos, Juspay payment ecosystem innovations, and live audience robotics showcases.',
    amenities: ['Holographic Spatial Display', 'Live Touch Screen Wall', 'Juspay Tech Showcase', 'Swag Dispensary'],
    operatingHours: '09:00 AM – 09:00 PM',
    photoUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
    floor: 'Level 1'
  },
  {
    id: 'poi-cafeteria',
    name: 'Namma Café & Refreshment Lounge',
    category: 'Dining & Refreshments',
    categoryColor: '#ec4899',
    position: [0, 1.8, 14],
    walkableTarget: [0, 0, 14.8],
    tags: ['cafe', 'coffee', 'food', 'cafeteria', 'drinks', 'chai', 'snacks', 'lunch', 'lounge', 'dining'],
    description: 'Relaxation lounge serving fresh filter coffee, gourmet sandwiches, traditional South Indian snacks, and energizing beverages for participants.',
    amenities: ['Espresso Coffee Machine', 'Chai Point Bar', 'Snack Vending', 'Lounge Seating'],
    operatingHours: '07:30 AM – 11:00 PM',
    photoUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
    floor: 'Level 1'
  },
  {
    id: 'poi-server-datacenter',
    name: 'IT Core Infrastructure & Server Room',
    category: 'Infrastructure',
    categoryColor: '#6366f1',
    position: [-6.5, 2.0, 1.5],
    walkableTarget: [-3.0, 0, 5.0],
    tags: ['server', 'datacenter', 'it', 'network', 'router', 'cloud', 'security'],
    description: 'Mission-critical server room housing local edge compute nodes, 10Gbps backbone fiber switches, and campus network relays powering the event.',
    amenities: ['Biometric Smart Lock', 'Precision CRAC Cooling', 'N+1 Redundant UPS', 'Direct Fiber Backbone'],
    operatingHours: 'Restricted Access (IT Staff Only)',
    photoUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    floor: 'Level 1'
  },
  {
    id: 'poi-fire-safety',
    name: 'Emergency Exit & Fire Safety Station',
    category: 'Emergency & Safety',
    categoryColor: '#ef4444',
    position: [28.5, 1.8, 0],
    walkableTarget: [26, 0, 0],
    tags: ['fire', 'emergency', 'safety', 'exit', 'extinguisher', 'first aid', 'aed'],
    description: 'Emergency response point equipped with CO2 and dry powder fire extinguishers, Automated External Defibrillator (AED), and emergency push-bar exit.',
    amenities: ['Class ABC Extinguisher', 'First Aid Trauma Kit', 'AED Defibrillator', 'Emergency Evacuation Map'],
    operatingHours: '24/7 Always Accessible',
    photoUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=600&q=80',
    floor: 'Level 1'
  },
  {
    id: 'poi-restrooms',
    name: 'Executive Restrooms & Washrooms',
    category: 'Amenities',
    categoryColor: '#14b8a6',
    position: [-28.5, 1.8, 0],
    walkableTarget: [-26, 0, 0],
    tags: ['restroom', 'washroom', 'toilet', 'bathroom', 'amenity', 'accessible'],
    description: 'High-standard sanitised restrooms with touchless sensor faucets, barrier-free wheelchair accessible stalls, and infant changing station.',
    amenities: ['Wheelchair Accessible', 'Touchless Sanitizers', 'Filtered Water Dispenser'],
    operatingHours: '24/7 Always Open',
    photoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    floor: 'Level 1'
  }
];

export const DEFAULT_SPAWN = {
  position: [0, 1.6, -11], 
  rotation: [0, Math.PI, 0] 
};

