# Namma Space — Intelligent 3D Spatial Engine & Indoor Navigation

[![Techfest 2026-27](https://img.shields.io/badge/Techfest-2026--27-blue.svg)](https://techfest.org)
[![IIT Bombay](https://img.shields.io/badge/IIT_Bombay-LHC_Finale-orange.svg)](https://iitb.ac.in)
[![Juspay Evaluation Track](https://img.shields.io/badge/Partner-Juspay-emerald.svg)](https://juspay.in)
[![Three.js](https://img.shields.io/badge/WebGL-Three.js_v0.160-sky.svg)](https://threejs.org)
[![React](https://img.shields.io/badge/Frontend-React_18-61dafb.svg)](https://react.dev)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

> **Techfest 2026-27 Challenge Objective:**  
> Turn ordinary smartphone photos or videos of an indoor space into an interactive 3D web application: one that lets remote users freely explore the space in first person, search for a specific room or item and jump straight to it, and see the best walking path to reach it around real physical obstacles, plus on-site live camera AR navigation.

---

## 🌟 Key Features & Deliverables

### 1. Standard Operating Procedure (SOP) & Capture Protocol
* Defined, consumer-friendly SOP enabling anyone with an ordinary smartphone to capture a 4K indoor venue in under 15 minutes.
* Standardized 75–85% frame overlap, AE/AF exposure lock, corner yaw sweeps, and closed-loop trajectory to eliminate drift in bundle adjustment.
* Complete documentation in [`docs/SOP_Capture_Guide.md`](docs/SOP_Capture_Guide.md).

### 2. Automated 3D Reconstruction Pipeline
* Automated Python pipeline [`pipeline/reconstruct.py`](pipeline/reconstruct.py) taking raw video/images and extracting sharp keyframes.
* Automatic camera calibration and pose estimation generating `transforms.json` (NeRF / 3D Gaussian Splatting format) and sparse geometry `.ply`.
* Ready-to-run COLMAP Structure-from-Motion integration in [`pipeline/colmap_runner.py`](pipeline/colmap_runner.py).

### 3. Zero-Install 3D Web Walkthrough (Desktop & Mobile)
* Fluid, 60 FPS first-person exploration in any modern browser with standard video game controls:
  - **W A S D / Arrow Keys**: Walk forward, left, backward, right
  - **Mouse**: 360° first-person look and aim via PointerLock
  - **Shift**: Sprint acceleration ($3.2\text{ m/s} \to 6.5\text{ m/s}$)
  - **Natural Gait**: Realistic sinusoidal head-bobbing physics
* **Collision Detection Engine**: Mathematical spatial grid prevents passing through walls, glass partitions, or furniture, with a smooth wall-sliding vector projector.

### 4. 3D Spatial POI Labeling & Inspection
* Floating 3D holographic badges over key functional zones:
  - *Main Reception & Helpdesk*
  - *Lecture Hall Alpha (Keynote Auditorium)*
  - *Executive Boardroom Bravo*
  - *Robotics & AI Innovation Lab*
  - *Co-Working & Developer Bay*
  - *Techfest Digital Showcase Plinth*
  - *Namma Café & Refreshment Lounge*
  - *IT Core Infrastructure & Server Room*
  - *Executive Restrooms*
  - *Emergency Exit & Fire Safety Station*
* Raycast interaction: click on any 3D badge to open high-res photography, descriptions, operating hours, and amenities.

### 5. Sub-Millisecond Spatial Search UI
* Keyboard shortcut trigger (`/` or `Ctrl+K`) for instant search.
* Real-time fuzzy query matching across names, room numbers, descriptions, and amenities (e.g. searching "coffee", "meeting", "fire", or "wifi").
* Live Euclidean distance tickers showing distance in meters from player's current position to every point of interest.

### 6. Obstacle-Aware A* Pathfinding Engine
* Discretized high-resolution navigation grid ($0.5\text{m}$ cell size) over the $60\text{m} \times 40\text{m}$ complex.
* Dilated obstacle safety margins ($0.45\text{m}$) guarantee calculated paths never clip or scrape walls, columns, or desks.
* String-pulling raycast algorithm eliminates jagged grid stair-stepping, producing natural, smooth human walking trajectories.
* **Turn-by-Turn Guidance HUD**: Live step instructions, remaining meters, estimated walking time (based on $1.3\text{ m/s}$ pace), and step itinerary.
* **Animated 3D Floor Path**: Glowing Catmull-Rom spline ribbon with animated pulsing light beads traveling toward the destination.

### 7. Interactive 2D Minimap & Floor Plan Radar
* Top-down architectural floor plan in top-right corner.
* Live player blip with rotating directional field-of-view (FOV) cone and radar pulse.
* Colored zone overlays, wall boundaries, and POI markers.
* **One-Click Navigation**: Click anywhere on the minimap to instantly calculate and begin routing to those exact coordinates!

### 8. Mobile Augmented Reality (AR) Guidance (Juspay Bonus Track)
* Mobile camera view via `navigator.mediaDevices.getUserMedia`.
* Live compass heading and gyroscope tracking via W3C `deviceorientation`.
* 3D spatial directional arrows and target reticle superimposed directly onto the live camera stream.
* Desktop simulation mode included for demonstration and judging evaluation!

---

## 🚀 Quickstart & Setup Instructions

### Prerequisites
* **Node.js** (v18+) & **npm**
* **Python** (3.9+)

### 1. Install & Launch the Web Platform
```bash
# Clone or navigate to the repository
cd "namma iit"

# Dependencies are already installed! Start the development server:
npm run dev
```
Open **`http://localhost:3000`** in any web browser.

### 2. Build for Production Deployment
```bash
npm run build
```
Creates an optimized, zero-install production bundle in `dist/` (1.2s build time, ~710 KB bundle size).

### 3. Run the 3D Reconstruction Pipeline
```bash
# Run pipeline with sample video or test dataset
python3 pipeline/reconstruct.py --video sample_capture.mp4 --output ./output
```

---

## 📂 Project Structure

```
namma iit/
├── docs/                                  # Techfest & Juspay Deliverables
│   ├── Technical_Abstract.md              # 5-Page Technical Paper (Architecture, SOP, Math)
│   ├── SOP_Capture_Guide.md               # Standard Operating Procedure for Data Collection
│   ├── Demonstration_Video_Script.md      # 3 to 5-Minute Video Storyboard & Script
│   └── Submission_Master_Index.md         # Master Drive Link Index & Submission Checklist
├── pipeline/                              # 3D Reconstruction Subsystem
│   ├── reconstruct.py                     # Video Decimation, Camera Poses & 3DGS Generator
│   ├── colmap_runner.py                   # Automated Structure-from-Motion Runner
│   └── test_dataset/output/               # Generated transforms.json & point_cloud.ply
├── src/                                   # Frontend Web Platform (React + Three.js)
│   ├── components/
│   │   ├── WalkthroughViewer.jsx          # Three.js 3D Engine, First-Person Camera, Collision
│   │   ├── Minimap.jsx                    # 2D Architectural Floor Plan & Live Player Radar
│   │   ├── NavigationHUD.jsx              # Turn-by-Turn Guidance HUD & Walking Estimates
│   │   ├── SearchPanel.jsx                # Sub-Millisecond Fuzzy Spatial Search Modal
│   │   ├── POIDetailsModal.jsx            # 3D POI Detailed Inspection Card
│   │   ├── ARNavigationMode.jsx           # Mobile Live Camera AR Directional Guidance
│   │   ├── TopNav.jsx                     # Top Bar, Mode Switchers & Actions
│   │   └── DocsModal.jsx                  # In-App Technical Abstract Viewer
│   ├── utils/
│   │   ├── floorData.js                   # 60x40m Architectural Geometry, Walls, POI Registry
│   │   └── pathfinding.js                 # Obstacle-Aware A* Algorithm & Path Smoother
│   ├── App.jsx                            # Core State Orchestrator
│   ├── main.jsx                           # React Root Entry Point
│   └── index.css                          # High-Tech Glassmorphism Styling
├── package.json                           # Dependencies (Three.js, React, Vite)
├── vite.config.js                         # Vite Server & Build Configuration
└── README.md                              # Main Project Documentation
```

---

## 🎮 Controls & Shortcuts

| Action | Control |
| :--- | :--- |
| **Enter 3D Walkthrough** | Click on 3D Viewport |
| **Walk Forward / Left / Back / Right** | `W` `A` `S` `D` or `Arrow Keys` |
| **Look & Aim** | Move Mouse |
| **Sprint** | Hold `Shift` |
| **Open Spatial Search** | Press `/` or `Ctrl+K` |
| **Release Mouse Cursor** | Press `ESC` |
| **Click on 3D POI Badge** | Click floating pin to inspect |
| **Minimap Navigation** | Click any coordinate on the 2D map |
| **Switch to AR Mobile Nav** | Click `AR Mobile Nav` button in header |

---

## 🏆 Techfest 2026-27 Evaluation Matrix Alignment

| Evaluation Category | Weight | How Namma Space Solves It |
| :--- | :---: | :--- |
| **SOP Execution & Field Capture** | **20%** | Comprehensive SOP documentation with closed loops, camera parameters, and zero-expertise requirements. |
| **Reconstruction & Visual Quality** | **20%** | Automated Python pipeline generating 3D Gaussian Splats, transforms, and photorealistic WebGL environment. |
| **Web Viewer & UX** | **20%** | Zero-install, 60 FPS performance, PointerLockControls, realistic head-bobbing, and dual-axis collision sliding. |
| **Spatial Search & Path Calculation** | **20%** | Sub-millisecond indexed search, obstacle-aware A* routing with dilated safety padding and string-pulling. |
| **Final Pitch & Technical Q&A** | **20%** | Complete 5-page Technical Abstract, video demonstration script, and structured mathematical proofs. |
| **On-Site AR Navigation (Bonus)** | **+10%** | Real camera stream with compass orientation tracking and floating 3D directional guidance arrows. |

---

## 📄 License & Credits
Developed for **Techfest 2026-27**, IIT Bombay. Sponsored by **Juspay**.  
Open-source under the MIT License.
