# PBR VITS DIGITAL TWIN
### 3D Browser-Based Interactive Digital Twin & Campus GIS Platform
**PBR Visvodaya Institute of Technology & Science (PBR VITS), Kavali, Andhra Pradesh, India**

---

## 🌟 Overview

The **PBR VITS Digital Twin** is an interactive, browser-based 3D digital replica of the PBR Visvodaya Institute of Technology & Science campus located in Kavali, SPSR Nellore District, Andhra Pradesh.

Built using **React 19, Vite, TypeScript, Three.js, React Three Fiber, Drei, and Tailwind CSS**, this platform delivers a smart-campus visualization with 1:1 metric scale, procedural PBR textures, architectural facade generation, graph-based A* navigation, dynamic 4-state diurnal lighting (Day, Golden Hour, Sunset, Night), first-person walking simulation with building collision detection, and an automated **Cinematic Guided Tour** showcase mode.

---

## 🚀 Key Features

### 1. Cinematic Tour Showcase Mode
- **Automated Guided Choreography:** 12-stop curated camera tour across the campus:
  1. Full campus aerial overview
  2. Main Entrance Boulevard approach
  3. Grand Entrance Arch & Security Plaza
  4. Administrative Block (Executive Chambers)
  5. Computer Science & IT Academic Complex
  6. Electronics & Electrical Sciences Block
  7. Central Library (Glass Atrium)
  8. Visvodaya Central Auditorium
  9. Sports Pavilion & Athletic Track
  10. Student Residential Hostels
  11. Campus Nocturnal Illumination
  12. Final Aerial Campus Finale
- **Interactive Tour HUD:** Live step counter, destination title & dossier, Play / Pause toggle, Skip Forward, Skip Back, and Exit controls.

### 2. Procedural 3D Architecture & Facades
- **Architecturally Articulated Structures:**
  - **`stepped` Multi-Wing Complexes:** CSE Block, ECE Block, and Admin Block feature projecting lateral wings, floor-divider accents, and recessed entrance porticos.
  - **`atrium` Glazing:** Central Library features an expansive double-height curtain glass foyer flanked by vertical sun-control fins.
  - **`industrial` High-Bay Workshops:** Central Workshops feature heavy-equipment steel roller shutters and sloped truss roof.
  - **`courtyard` Living Quarters:** Boys and Girls hostels feature enclosed residential quadrangles and room balconies.
  - **`pavilion` Architecture:** Visvodaya Auditorium and Sports Pavilion feature wide entrance plazas and expansive roof profiles.
- **Rooftop Infrastructure:** Parapets, Sintex-style water storage tanks, HVAC chiller condenser units, and photovoltaic solar cell arrays.

### 3. Diurnal Lighting & Atmosphere Engine
- **Day Mode:** Natural crisp daylight with soft directional sun shadows and clear sky.
- **Golden Hour Mode:** Warm sunlight, long dramatic shadows, and golden atmospheric horizon.
- **Sunset Mode:** Rich orange-pink evening sky, warm building illumination, and atmospheric depth.
- **Night Mode:** Dark blue nocturnal environment, starry sky, glowing building windows, and illuminated LED street poles with dynamic point-light illumination.

### 4. A* Graph Pedestrian Navigation
- **Routing Engine:** Computes shortest pedestrian paths across the campus network without traversing solid buildings.
- **Routing Preferences:**
  - **Shortest Route:** Direct Euclidean shortest-path traversal.
  - **Main Path Route:** Prioritizes wide boulevards and illuminated avenues.
  - **Accessible Route:** Prioritizes flat paved pathways and building ramps.
- **Visuals:** 3D glowing cyan CatmullRom tube path with animated destination pulse pins.
- **Metrics:** Exact walking distance in meters and walking time in minutes.

### 5. Multi-Mode Camera Exploration
- **Orbit Camera:** 360° pan, tilt, zoom with ground-clamping angle limits preventing subterranean clipping.
- **Aerial GIS Camera:** Top-down orthographic perspective aligned with True North.
- **First-Person Walk Mode:**
  - WASD + Arrow keys movement
  - Mouse-look pointer lock
  - Shift sprint (16 m/s)
  - Camera height locked to 1.7m eye level
  - Real-time bounding-box collision detection against all 14 building footprints
  - **On-Screen Virtual D-Pad:** Accessible directional buttons for laptops/touchpads and mobile devices.
- **Building Inspection:** Smooth automated flight to frame any selected building.

### 6. Graphics & Performance Engine
- **Quality Presets:** Low, Medium, High, Ultra.
- **Dynamic DPR:** Automatically scales device pixel ratio between 1.0x and 2.0x.
- **GPU Instancing:** Palm trees, Neem/Gulmohar shade trees, and Ashoka avenue trees rendered via `InstancedMesh` (6 draw calls for 300+ trees).
- **Procedural Canvas Textures:** Cached procedural textures for asphalt, pavers, concrete plaster, solar cells, and grass turf.

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Production build
npm run build

# 4. Preview production build locally
npm run preview
```

---

## 🌐 Deployment to Vercel

The application is pre-configured for one-click deployment on **Vercel**:
1. Push repository to GitHub.
2. Import project into Vercel.
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Deploy!
