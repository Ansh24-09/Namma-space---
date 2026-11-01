# Namma Space — Demonstration Video Storyboard & Presentation Script

**Deliverable:** 3 to 5-minute Demonstration Video for Techfest 2026-27 (Round 1 & Round 2)  
**Total Target Duration:** 4 minutes 15 seconds  
**Visual Style:** Screen recording + voiceover narration + live mobile camera footage

---

## Storyboard Timeline

```
+------------+-------------------------------------------------------------+
| TIME       | SCENE / VISUAL CONTENT                                      |
+------------+-------------------------------------------------------------+
| 0:00-0:35  | Introduction, Motivation & The Challenge of Indoor Spaces   |
| 0:35-1:15  | Capture SOP in Action (Smartphone walking footage)          |
| 1:15-1:50  | Automated 3D Reconstruction Pipeline (Video -> 3DGS/GLTF)    |
| 1:50-2:45  | First-Person 3D Web Walkthrough (WASD, Physics, Lighting)   |
| 2:45-3:25  | Spatial Indexing, POI Tagging & Sub-Millisecond Search UI   |
| 3:25-3:55  | Obstacle-Aware Pathfinding & Animated Floor Guidance HUD    |
| 3:55-4:15  | Mobile AR Live Camera Guidance (Juspay Bonus) & Conclusion  |
+------------+-------------------------------------------------------------+
```

---

## Detailed Script & Actions

### Scene 1: Introduction & Problem Statement (0:00 – 0:35)
* **Visual:** Split screen showing someone struggling to decipher a complicated 2D fire escape blueprint in an airport/mall, transitioning to the title card: *Namma Space — Intelligent 3D Indoor Digital Twin*.
* **Voiceover:**  
  *"Every year, millions of people get lost inside sprawling corporate offices, massive exhibition halls, and complex airport terminals. While outdoor navigation was revolutionized by Google Maps, indoor navigation has remained trapped in outdated, static 2D floor plans.*  
  *Welcome to **Namma Space**—our end-to-end intelligent spatial engine for Techfest 2026-27. We convert ordinary smartphone video into photorealistic 3D digital twins, complete with first-person virtual exploration, instant spatial search, obstacle-aware pathfinding, and live mobile AR navigation."*

---

### Scene 2: Standard Operating Procedure (SOP) Capture (0:35 – 1:15)
* **Visual:** Real footage of a student walking with an ordinary smartphone through a room at chest level, executing the perimeter loop and corner sweep with graphic overlay annotations showing "75% Overlap", "AE/AF Lock", and "Loop Closure".
* **Voiceover:**  
  *"Democratization starts with capture. Our defined Standard Operating Procedure allows anyone with no technical expertise to map an entire venue using just a smartphone.*  
  *By locking exposure and walking a continuous perimeter loop at half-meter-per-second pace, we maintain 80% visual overlap across frames. Corner sweeps capture angular perspectives, while closing the loop back at the starting doorway mathematically eliminates trajectory drift in bundle adjustment. An entire complex can be mapped in under fifteen minutes."*

---

### Scene 3: Automated Reconstruction Pipeline (1:15 – 1:50)
* **Visual:** Terminal running `python3 reconstruct.py --video venue.mp4`. Screen displays keyframe extraction, COLMAP point cloud generation, and export to web-ready 3D Gaussian Splats and GLTF models.
* **Voiceover:**  
  *"Our automated Python pipeline ingests the raw 4K video, decodes keyframes, filters motion blur, and executes Structure-from-Motion using SIFT feature matching. The resulting sparse geometry is converted into 3D Gaussian Splats and optimized WebGL polygon meshes. At the same time, an architectural 2D slice is extracted into an obstacle-aware navigation grid—ready for instant web deployment with zero manual 3D modeling."*

---

### Scene 4: First-Person 3D Web Walkthrough (1:50 – 2:45)
* **Visual:** Browser opens `http://localhost:3000`. User clicks "Start Virtual Walkthrough", enters PointerLock, and walks through the Techfest venue with WASD and mouse. Shows smooth movement, collision with walls, sprint mode, realistic lighting, and head-bobbing.
* **Voiceover:**  
  *"Here is our zero-install web application running directly in the browser at a silky smooth 60 frames per second. Users experience true first-person presence using intuitive video-game controls: WASD to walk, mouse to look around, and Shift to sprint.*  
  *Notice our physical collision engine: the player cannot walk through walls, glass partitions, or desks. Instead, our dual-axis sliding solver glides smoothly along obstacles, delivering a natural, fluid exploration experience without motion sickness."*

---

### Scene 5: Spatial POI Labeling & Search UI (2:45 – 3:25)
* **Visual:** Mouse clicks on the floating 3D diamond pin over "Lecture Hall Alpha". The POI Inspection modal pops up showing photos, description, and amenities. Then user presses `/` to open Search, types "Coffee", and results instantly filter to "Namma Café & Lounge".
* **Voiceover:**  
  *"Every critical room and asset is indexed with floating 3D holographic badges that rotate and pulse in space. Clicking any badge reveals its designated name, operating hours, and facilities.*  
  *Need to find something specific? Pressing forward-slash opens our sub-millisecond spatial search. Whether searching for 'Keynote Auditorium', 'Restroom', or simply 'Coffee', results update instantaneously with exact walking distances calculated from your current real-time coordinates."*

---

### Scene 6: Obstacle-Aware Pathfinding & Guidance HUD (3:25 – 3:55)
* **Visual:** User clicks "Navigate" to Robotics Lab. Instantly, an animated glowing blue path ribbon appears on the floor with moving light beads navigating cleanly around pillars and desks. The 2D minimap updates with the route, and the Turn-by-Turn HUD displays step instructions. User walks along the path until reaching the destination.
* **Voiceover:**  
  *"Once a destination is selected, our obstacle-aware A\* algorithm computes the mathematically optimal walking path. Notice how the path hugs corners safely, steering completely clear of walls, columns, and furniture thanks to our dilated safety margin and string-pulling raycast smoothing.*  
  *The animated glowing floor ribbon and Turn-by-Turn HUD guide the user step by step, updating remaining distance and arrival time in real time—delivering the same intuitive clarity indoors that Google Maps provides outdoors."*

---

### Scene 7: Mobile AR Live Camera Guidance & Finale (3:55 – 4:15)
* **Visual:** User switches to AR Navigation Mode. Shows live mobile camera view with real-time compass heading and floating 3D directional arrow pointing toward the destination as the user turns the phone.
* **Voiceover:**  
  *"For on-site campus visitors at IIT Bombay, Namma Space provides live Augmented Reality guidance through the smartphone camera. By reading the device compass and spatial vector bearings, floating 3D arrows point visitors directly to their destination in real time.*  
  *From phone video to interactive 3D digital twin, Namma Space is ready to replace static blueprints forever. Thank you!"*

