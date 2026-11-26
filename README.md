# PBR VITS DIGITAL TWIN
### Real GIS-Based & Georeferenced 3D Campus Digital Twin Platform
**PBR Visvodaya Institute of Technology & Science (PBR VITS), Kavali, Andhra Pradesh, India**
**Geographic Anchor:** `14.913261° N, 79.983666° E` • EPSG:4326 (WGS84)

---

## 🌟 Overview

The **PBR VITS Digital Twin** is an interactive, browser-based GIS and 3D digital twin of the PBR Visvodaya Institute of Technology & Science campus located along Kondapuram Road in Kavali, SPSR Nellore District, Andhra Pradesh.

Built upon **genuine OpenStreetMap cadastral survey data and satellite imagery**, this platform unifies an interactive **MapLibre GL GIS Map** with a **Three.js 3D Smart Campus Environment**. All 3D building locations, road alignments, sports grounds, and pedestrian navigation networks are mathematically georeferenced from real-world WGS84 geographic footprints.

---

## 🗺️ Real GIS Foundations & Georeferencing

### 1. Geographic Anchor & Coordinate Projection
- **Campus Anchor:** Latitude `14.913261° N`, Longitude `79.983666° E` (EPSG:4326 WGS84).
- **Metric Local Projection:** Local tangent plane centered on the academic core, converting geographic longitude/latitude directly to metric Three.js units (1 unit = 1 meter):
  - $+X$ = Easting ($(\text{lng} - \text{lng}_0) \times R_{\text{lng}}$)
  - $-Z$ = Northing ($(\text{lat} - \text{lat}_0) \times R_{\text{lat}}$)
  - $+Y$ = Elevation above terrain ($0\text{m}$ base plane)

### 2. OpenStreetMap Cadastral Data Sources
- **Academic Campus Perimeter:** OSM Way `1297901220` (`amenity: college`, Visvodaya Institute of Technology & Science).
- **Athletic Grounds & Playground:** OSM Way `1297896001` (`leisure: playground`, PBR VITS playground).
- **Electronics & Electrical Sciences Block:** OSM Way `1297903395` (`building: college`).
- **Mechanical & Civil Engineering Block:** OSM Way `1297903402` (`building: college`).
- **Administrative Bhavan:** OSM Way `1297903400` (`building: yes`).
- **Central Library & North Quad:** OSM Way `1297903411` (`building: yes`).
- **Kondapuram Road / State Highway Frontage:** OSM Way `1297896011` (`highway: secondary`).
- **Central Boulevard Walkway:** OSM Way `1297901222` (`highway: path/pedestrian`).

### 3. Transparent Accuracy Classifications
- `VERIFIED`: Directly surveyed OpenStreetMap footprint or GPS survey ground anchor.
- `APPROXIMATE`: Geographically grounded from aerial imagery and architectural evidence.
- `ESTIMATED`: Zone sector placement based on official campus layout documentation.

---

## 🚀 Key Features

### 1. Unified GIS & 3D Mode Selector
- **`3D Twin`**: Real-time 3D orbital visualization with procedural PBR materials, diurnal lighting, and building selection.
- **`Campus GIS`**: Fullscreen MapLibre GL map with OpenStreetMap streets, vector cadastral boundary overlays, and 3D extruded footprints.
- **`Satellite`**: High-resolution ESRI World Imagery aerial layer showing actual satellite views of Kavali and PBR VITS.
- **`Walk`**: Immersive First-Person walking mode with WASD / mobile controls and wall collision detection.
- **`PiP MiniMap`**: Expandable floating GIS map accessible directly within 3D mode.

### 2. Synchronized 2D/3D Navigation
- Clicking any building on the GIS map focuses the 3D camera onto the structure.
- Selecting a building in 3D highlights its footprint on the GIS map.
- Calculating an A* pedestrian route renders the glowing cyan path across **both** the 3D terrain and the 2D GIS map.

### 3. Cinematic Tour Showcase Mode
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

### 4. Diurnal Lighting & Atmosphere Engine
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
