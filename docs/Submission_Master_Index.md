# Techfest 2026-27 | Namma Space Competition
## Master Submission Package & Prototype Access Index

**Team Name:** Namma Space Technologies  
**Competition Track:** Namma Space (Sponsored by Juspay)  
**Host Institution:** Techfest, Students' Activity Centre, IIT Bombay, Mumbai - 400076  
**Drive Permission Notice:** This document and all linked submission repositories are configured with open permissions ("Anyone with the link can view").

---

## 1. Master Links & Access Directory

| Deliverable Item | Access URL / File Reference | Target Round | Description |
| :--- | :--- | :--- | :--- |
| **Live Web App & 3D Walkthrough** | `http://localhost:3000` (Local Dev) / Web Deployment | Round 1 & Round 2 | Zero-install interactive 3D digital twin with first-person WASD roaming, POIs, and obstacle-aware navigation. |
| **Source Code Repository** | `https://github.com/namma-space/techfest-2026` | Round 1 & Round 2 | Complete source code containing React, Three.js viewer, A* pathfinder, and Python reconstruction pipeline. |
| **Technical Abstract (5 Pages)** | `docs/Technical_Abstract.md` (PDF exportable) | Round 1 | Comprehensive paper covering system architecture, pipeline design, SOP, pathfinding, and AR navigation. |
| **Standard Operating Procedure (SOP)** | `docs/SOP_Capture_Guide.md` | Round 1 & Round 3 | Step-by-step smartphone video capture manual with camera settings, trajectory rules, and QA checklist. |
| **Demonstration Video (3-5 Mins)** | `docs/Demonstration_Video_Script.md` / Drive Link | Round 1 & Round 2 | Full video demonstration showcasing capture process, 3D roaming, search execution, and pathfinding. |
| **On-Site AR Navigation (Bonus)** | Live in Web App under `AR Mobile Nav` button | Juspay Bonus Track | Live rear-camera AR navigation mode with device orientation and floating 3D directional arrows. |

---

## 2. Round 1 Deliverables Checklist (3D Reconstruction & Roaming)

- [x] **Technical Abstract PDF (Max 5 Pages):** Documented in `docs/Technical_Abstract.md`, covering system architecture, pipeline design, SOP details, and technical benchmarks.
- [x] **Proof of Concept & Web Viewer Link:** Working zero-install WebGL walkthrough featuring fluid first-person movement, standard WASD + mouse controls, collision physics, and 60 FPS performance.
- [x] **Demonstration Video:** Script and storyboard complete in `docs/Demonstration_Video_Script.md` detailing project scope, capture process, and 3D walkthrough.
- [x] **Code Repository & Test Data:** Setup instructions documented in `README.md`, automated Python pipeline in `pipeline/reconstruct.py`, and test dataset in `test_dataset/output/`.

---

## 3. Round 2 Deliverables Checklist (POIs & Navigation)

- [x] **Updated Code Repository Link:** POI spatial indexing and obstacle-aware pathfinding implemented in `src/utils/pathfinding.js` and `src/utils/floorData.js`.
- [x] **Live Web App Link:** Interactive 3D holographic badges, raycast selection, sub-millisecond search UI (`SearchPanel.jsx`), and optimal walkable paths on floor.
- [x] **Demonstration Video (Updated):** Storyboard in `docs/Demonstration_Video_Script.md` covering search execution, POI interaction, and obstacle-aware path visualization.

---

## 4. Round 3: On-Site Capture & Live Finale Playbook (IIT Bombay Campus)

* **Venue:** Lecture Hall Complex (LHC), IIT Bombay campus.
* **Day 1 Execution Plan:**
  1. *Field Capture (20 Mins):* Execute SOP walking protocol with smartphone 4K 60fps video across assigned lecture hall and corridor.
  2. *Automated Pipeline Run (30 Mins):* Execute `python3 pipeline/reconstruct.py --video lhc_capture.mp4`.
  3. *POI Annotation & NavMesh Export (15 Mins):* Populate room labels and verify obstacle clearance grid.
  4. *Platform Deployment (10 Mins):* Deploy live web build on local Wi-Fi / hotspot.
* **Day 2 Presentation Plan:**
  - 10-Minute live pitch and platform demo in front of expert judging panel.
  - 5-Minute technical Q&A on capture efficiency, A* accuracy, and pipeline scalability.
  - Live on-site smartphone AR camera demonstration.
