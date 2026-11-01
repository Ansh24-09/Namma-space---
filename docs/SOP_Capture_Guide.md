# Namma Space — Standard Operating Procedure (SOP) for Indoor Data Collection

**Document ID:** SOP-NAMMA-01  
**Target Environment:** Indoor Venues (Lecture Halls, Office Floors, Retail Stores, Convention Centers)  
**Hardware Requirement:** Standard Consumer Smartphone (iPhone 12+, Samsung Galaxy S21+, Google Pixel 6+, or equivalent)  
**Target Accuracy:** Metric scale ($\pm 5\text{cm}$), obstacle-safe navigation geometry

---

## 1. Overview & Purpose

This Standard Operating Procedure (SOP) defines the standardized methodology for capturing real-world indoor spaces using a smartphone to enable automated 3D digital twin reconstruction, spatial point of interest (POI) labeling, and obstacle-aware navigation.

Following this protocol ensures high visual fidelity, dense point cloud reconstruction, elimination of motion blur, and seamless loop closures during Structure-from-Motion (SfM) and 3D Gaussian Splatting (3DGS).

---

## 2. Equipment & Camera Setup

| Setting | Recommended Specification | Rationale |
| :--- | :--- | :--- |
| **Video Resolution** | 4K UHD ($3840 \times 2160$) | Captures sub-centimeter architectural details and legible signage. |
| **Framerate** | 60 FPS (or 30 FPS minimum) | High framerate minimizes camera shutter exposure time and motion blur. |
| **Camera Lens** | Ultra-Wide ($0.5\times$) or Main Wide ($1.0\times$) | Wide field of view maximizes multi-view stereo feature matching. |
| **Exposure / Focus** | **AE / AF Lock: ON** | Prevents brightness flickering and focal breathing during reconstruction. |
| **Stabilization** | Optical / Electronic (Standard OIS) | Prevents rolling shutter artifacts and jagged trajectory jumps. |
| **Cleanliness** | Microfiber wipe lens clean | Fingerprint grease on phone lenses causes severe radial glare artifacts. |

---

## 3. Pre-Capture Venue Preparation

1. **Illumination:** Turn on all ceiling panel lights, overhead downlights, and corridor fixtures. Ensure uniform ambient lighting. Avoid turning off lights during capture.
2. **Dynamic Obstacles:** Request occupants to remain stationary or capture during low-traffic hours (early morning/evening) to avoid ghosting artifacts in 3D splats.
3. **Doors & Entrances:** Fix all internal doors (conference rooms, labs, restrooms) open to allow unobstructed capture of transitions and doorways.
4. **Hazard Clearance:** Verify that walkways are free of temporary tripping hazards (cables, loose boxes).

---

## 4. Capture Trajectory & Walking Protocol

```
                        ROOM CAPTURE PATTERN
+------------------------------------------------------------------+
| [C1] Corner Sweep                               [C2] Corner Sweep|
|   \                                               /              |
|    \                                             /               |
|     +======>> Counter-Clockwise Perimeter >>====+               |
|     ||                                         ||                |
|     ||                                         ||                |
|     ||               [CENTER ISLAND /          ||                |
|     ||                 FURNITURE]              ||                |
|     ||                                         ||                |
|     ||                                         ||                |
|     +======<< Counter-Clockwise Perimeter <<====+                |
|    /                                             \               |
|   /                                               \              |
| [START / FINISH DOORWAY]                       [C3] Corner Sweep |
+------------------------------------------------------------------+
```

### Step 1: Initialization at Entry Threshold
* Position yourself at the main entryway (e.g., Reception Lobby).
* Hold the smartphone with both hands at upper chest level ($1.4\text{m} - 1.6\text{m}$ above floor).
* Pitch camera downwards slightly ($10^\circ$) so that the floor plane occupies the bottom 30% of the frame, with walls and furniture occupying the upper 70%.
* Lock AE/AF on a neutral mid-tone surface (e.g., hallway wall).
* Press Record. Hold steady for 3 seconds before taking your first step.

### Step 2: Perimeter Boundary Walk
* Walk along the perimeter of the room at a steady, measured pace of approximately **$0.5\text{ m/s}$** (half normal walking speed).
* Keep your elbows tucked against your torso to act as a natural two-axis gimbal.
* Point the camera inward at a $30^\circ$ angle toward the center of the space while moving forward.

### Step 3: Corner Anchors
* As you approach each architectural corner:
  - Pause foot movement.
  - Slowly rotate your torso in a smooth $90^\circ$ pan (taking 4–5 seconds) to sweep the adjacent wall.
  - Resume perimeter walking.

### Step 4: Central Island / Obstacle Inspection
* If the room contains large central obstacles (e.g., conference tables, reception counter, lecture hall stage, server racks):
  - Walk a secondary concentric loop around the furniture item at a distance of $1.5\text{m} - 2.0\text{m}$.
  - Ensure all four sides and top surface are clearly captured.

### Step 5: Doorway Transition to Adjacent Rooms
* When moving from a corridor into an adjoining room (e.g., Lecture Hall Alpha):
  - Approach the doorway facing forward.
  - Pass through the doorway threshold slowly.
  - Immediately perform a $45^\circ$ left and $45^\circ$ right look to tie the visual features of both rooms together.

### Step 6: Loop Closure (Critical!)
* **Do not stop recording until you return to your exact starting position at the Lobby threshold.**
* Hold the phone in the initial starting orientation for 3 seconds before tapping stop.
* *Why this is essential:* Closing the loop provides mathematical ground truth constraints that eliminate accumulated trajectory drift in Bundle Adjustment.

---

## 5. POI Annotation Checklist

During or immediately following data capture, record the following Point of Interest (POI) spatial landmarks in the venue log:

1. **Designated Name & Room Number** (e.g., "Lecture Hall Alpha - Room 101")
2. **Category** (Workspace, Meeting, Keynote, Amenity, Dining, Emergency)
3. **Key Amenities** (Projector, Whiteboard, Wi-Fi 7, Restrooms, AED, Fire Extinguisher)
4. **Operating Hours & Access Restrictions** (e.g., 24/7 or Badge Access Only)
5. **Reference Photo** for the web inspection modal.

---

## 6. Quality Assurance (QA) Checklist

Before uploading the capture video to the automated reconstruction pipeline:

- [x] **Sharpness Check:** Play back video at $2\times$ zoom; text on posters/wall signs must remain legible without motion blur.
- [x] **Lighting Consistency:** No sudden blown-out exposures or black underexposed regions.
- [x] **Complete Coverage:** All doorways, corridors, and furniture clusters captured with at least 75% overlap.
- [x] **Loop Closed:** Video begins and ends at the identical physical location.
- [x] **Format:** Saved as `.mp4` or `.mov` in 4K or 1080p resolution.

