import type { BuildingData } from '../types';

export const campusBuildings: BuildingData[] = [
  {
    "id": "admin-block",
    "name": "Administrative & Executive Chambers Block",
    "shortName": "Admin Block",
    "category": "administrative",
    "position": [
      32.3,
      0,
      11.5
    ],
    "rotation": 0,
    "dimensions": {
      "width": 24,
      "depth": 48,
      "height": 13.5
    },
    "floors": 3,
    "floorHeight": 4.2,
    "color": "#e2d9cc",
    "secondaryColor": "#9c3d28",
    "accentColor": "#f59e0b",
    "windowStyle": "large",
    "roofType": "parapet",
    "description": "Central administrative headquarters housing the Principal's chamber, Registrar, Examination Cell, Accounts, Admissions & Student Affairs office.",
    "departments": [
      "College Administration",
      "Academic Section",
      "Examination Cell",
      "Training & Placements"
    ],
    "facilities": [
      "Principal Office",
      "Governing Body Room",
      "Accounts & Fee Counter",
      "Visitor Lounge",
      "Conference Hall"
    ],
    "verified": "VERIFIED",
    "source": "OpenStreetMap way 1297903400 (building:yes)",
    "accuracyLevel": "Sub-meter Ground Cadastral Footprint",
    "geoCoordinates": {
      "lat": 14.9131576,
      "lng": 79.983966
    },
    "yearBuilt": 1998,
    "architecturalStyle": "Academic Administration Block with Classical Entrance Portico",
    "hasPillars": true,
    "hasCanopy": true,
    "hasSolarPanels": true,
    "hvacUnits": 4,
    "waterTanks": 2,
    "contact": "principal@pbrvits.ac.in | 08626-243930",
    "hours": "09:00 AM - 05:00 PM",
    "navNodeId": "node-admin-entrance",
    "wingType": "stepped"
  },
  {
    "id": "central-library",
    "name": "Central Library & Knowledge Resource Center",
    "shortName": "Central Library",
    "category": "library",
    "position": [
      53.6,
      0,
      -35.5
    ],
    "rotation": 0,
    "dimensions": {
      "width": 46,
      "depth": 38,
      "height": 14.0
    },
    "floors": 3,
    "floorHeight": 4.2,
    "color": "#e8eff5",
    "secondaryColor": "#1e3a8a",
    "accentColor": "#38bdf8",
    "windowStyle": "curtain",
    "roofType": "parapet",
    "description": "Centrally automated three-story academic library holding over 140,000+ volumes, IEEE, DELNET, NPTEL e-resources, multimedia section, and air-conditioned reading halls.",
    "departments": [
      "Library & Information Services",
      "Digital Knowledge Center"
    ],
    "facilities": [
      "Book Stacks (Circulation)",
      "Digital e-Library Workstations",
      "Periodicals & Journals Section",
      "Reference Reading Hall",
      "Reprography"
    ],
    "verified": "VERIFIED",
    "source": "OpenStreetMap way 1297903411 (building:yes)",
    "accuracyLevel": "Sub-meter Ground Cadastral Footprint",
    "geoCoordinates": {
      "lat": 14.9135802,
      "lng": 79.9841641
    },
    "yearBuilt": 2002,
    "architecturalStyle": "Modern Curtain-Glass Facade with Double-Height Atrium",
    "hasPillars": true,
    "hasCanopy": true,
    "hasSolarPanels": true,
    "hvacUnits": 6,
    "waterTanks": 2,
    "contact": "library@pbrvits.ac.in",
    "hours": "08:30 AM - 08:00 PM",
    "navNodeId": "node-library-entrance",
    "wingType": "atrium"
  },
  {
    "id": "cse-it-block",
    "name": "Computer Science & IT Block",
    "shortName": "CSE & AI Block",
    "category": "academic",
    "position": [
      -16.2,
      0,
      -58.3
    ],
    "rotation": 0,
    "dimensions": {
      "width": 50,
      "depth": 32,
      "height": 16.5
    },
    "floors": 4,
    "floorHeight": 4.0,
    "color": "#e5e7eb",
    "secondaryColor": "#0284c7",
    "accentColor": "#38bdf8",
    "windowStyle": "standard",
    "roofType": "parapet",
    "description": "Four-story engineering block housing Computer Science & Engineering, Artificial Intelligence & Machine Learning (AI&ML), IoT laboratories, and smart seminar halls.",
    "departments": [
      "Computer Science & Engineering (CSE)",
      "CSE - Artificial Intelligence & Machine Learning (AI & ML)",
      "CSE - Internet of Things (IoT)",
      "Data Science"
    ],
    "facilities": [
      "Advanced AI & Cloud Computing Lab",
      "Object Oriented Programming Lab",
      "Network Simulation & Security Lab",
      "Department Seminar Hall",
      "Faculty Chambers",
      "ICT-Enabled Smart Classrooms"
    ],
    "verified": "APPROXIMATE",
    "source": "Georeferenced Academic Core North Quad (Derived from campus zoning)",
    "accuracyLevel": "2-3m Estimated Footprint",
    "geoCoordinates": {
      "lat": 14.913785,
      "lng": 79.983515
    },
    "yearBuilt": 2005,
    "architecturalStyle": "Four-Story Academic Block with Exterior Balcony Corridors",
    "hasBalconies": true,
    "hasPillars": true,
    "hasCanopy": true,
    "hasSolarPanels": true,
    "hvacUnits": 8,
    "waterTanks": 3,
    "contact": "hodcse@pbrvits.ac.in",
    "hours": "08:45 AM - 05:00 PM",
    "navNodeId": "node-cse-entrance",
    "wingType": "stepped"
  },
  {
    "id": "ece-eee-block",
    "name": "Electronics & Electrical Sciences Block",
    "shortName": "ECE & EEE Block",
    "category": "academic",
    "position": [
      -6.6,
      0,
      -12.4
    ],
    "rotation": 0,
    "dimensions": {
      "width": 56,
      "depth": 36,
      "height": 16.0
    },
    "floors": 4,
    "floorHeight": 4.0,
    "color": "#f3f4f6",
    "secondaryColor": "#b45309",
    "accentColor": "#f59e0b",
    "windowStyle": "standard",
    "roofType": "parapet",
    "description": "Four-story academic building dedicated to Electronics & Communication Engineering (ECE) and Electrical & Electronics Engineering (EEE).",
    "departments": [
      "Electronics & Communication Engineering (ECE)",
      "Electrical & Electronics Engineering (EEE)"
    ],
    "facilities": [
      "VLSI Design & Embedded Systems Lab",
      "Digital Signal Processing & Microprocessor Lab",
      "Power Electronics & Electrical Machines Lab",
      "Robotics Innovation Hub",
      "Department Seminar Hall"
    ],
    "verified": "VERIFIED",
    "source": "OpenStreetMap way 1297903395 (building:college)",
    "accuracyLevel": "Sub-meter Ground Cadastral Footprint",
    "geoCoordinates": {
      "lat": 14.9133719,
      "lng": 79.9836044
    },
    "yearBuilt": 2004,
    "architecturalStyle": "Four-Story Academic Wing with Concrete Sunscreen Louvers",
    "hasBalconies": true,
    "hasPillars": true,
    "hasCanopy": true,
    "hasSolarPanels": true,
    "hvacUnits": 8,
    "waterTanks": 3,
    "contact": "hodece@pbrvits.ac.in",
    "hours": "08:45 AM - 05:00 PM",
    "navNodeId": "node-ece-entrance",
    "wingType": "stepped"
  },
  {
    "id": "sh-mba-block",
    "name": "Basic Sciences, Humanities & MBA Block",
    "shortName": "S&H / MBA Block",
    "category": "academic",
    "position": [
      -13.6,
      0,
      35.7
    ],
    "rotation": 0,
    "dimensions": {
      "width": 44,
      "depth": 28,
      "height": 13.5
    },
    "floors": 3,
    "floorHeight": 4.2,
    "color": "#f1f5f9",
    "secondaryColor": "#0f766e",
    "accentColor": "#14b8a6",
    "windowStyle": "large",
    "roofType": "parapet",
    "description": "Houses the Department of Basic Sciences & Humanities (for first-year B.Tech students) and the Master of Business Administration (MBA) postgraduate department.",
    "departments": [
      "Basic Sciences & Humanities (S&H)",
      "Master of Business Administration (MBA)"
    ],
    "facilities": [
      "English Communication Skills & Language Lab",
      "Engineering Physics & Chemistry Labs",
      "MBA Case Study Discussion Room",
      "Business Analytics Lab"
    ],
    "verified": "APPROXIMATE",
    "source": "Central Academic Entrance Quad",
    "accuracyLevel": "2-3m Estimated Footprint",
    "geoCoordinates": {
      "lat": 14.91294,
      "lng": 79.98354
    },
    "yearBuilt": 2006,
    "architecturalStyle": "Academic Three-Story Building with Shaded Verandahs",
    "hasBalconies": true,
    "hasPillars": true,
    "hasCanopy": true,
    "hasSolarPanels": false,
    "hvacUnits": 4,
    "waterTanks": 2,
    "contact": "hodsh@pbrvits.ac.in",
    "hours": "08:45 AM - 05:00 PM",
    "navNodeId": "node-sh-mba-entrance",
    "wingType": "standard"
  },
  {
    "id": "mech-civil-block",
    "name": "Mechanical & Civil Engineering Block",
    "shortName": "Mech & Civil Block",
    "category": "academic",
    "position": [
      -67.1,
      0,
      -9.1
    ],
    "rotation": 0,
    "dimensions": {
      "width": 36,
      "depth": 34,
      "height": 13.5
    },
    "floors": 3,
    "floorHeight": 4.2,
    "color": "#e2e8f0",
    "secondaryColor": "#475569",
    "accentColor": "#64748b",
    "windowStyle": "large",
    "roofType": "parapet",
    "description": "Dedicated to Mechanical Engineering and Civil Engineering with specialized design studios, material testing bays, and fluid mechanics labs.",
    "departments": [
      "Mechanical Engineering (ME)",
      "Civil Engineering (CE)"
    ],
    "facilities": [
      "CAD/CAM Modeling Studio",
      "Strength of Materials Lab",
      "Surveying & Geotechnical Testing Lab",
      "Fluid Mechanics & Hydraulic Machinery Lab",
      "Thermal Engineering Lab"
    ],
    "verified": "VERIFIED",
    "source": "OpenStreetMap way 1297903402 (building:college)",
    "accuracyLevel": "Sub-meter Ground Cadastral Footprint",
    "geoCoordinates": {
      "lat": 14.9133427,
      "lng": 79.9830419
    },
    "yearBuilt": 2001,
    "architecturalStyle": "Reinforced Concrete Frame Academic Block",
    "hasBalconies": true,
    "hasCanopy": true,
    "hasSolarPanels": false,
    "hvacUnits": 4,
    "waterTanks": 2,
    "contact": "hodmech@pbrvits.ac.in",
    "hours": "08:45 AM - 05:00 PM",
    "navNodeId": "node-mech-entrance",
    "wingType": "standard"
  },
  {
    "id": "central-workshops",
    "name": "Central Engineering Workshops & Testing Labs",
    "shortName": "Workshops Block",
    "category": "laboratory",
    "position": [
      -73.8,
      0,
      -51.7
    ],
    "rotation": 0,
    "dimensions": {
      "width": 46,
      "depth": 36,
      "height": 10.0
    },
    "floors": 2,
    "floorHeight": 4.8,
    "color": "#cbd5e1",
    "secondaryColor": "#334155",
    "accentColor": "#f97316",
    "windowStyle": "lab",
    "roofType": "sloped",
    "description": "High-bay industrial workshop housing heavy machinery, metal casting, machine tools, welding bays, carpentry, foundry, and automobile engine test rigs.",
    "departments": [
      "Mechanical Engineering",
      "Civil Engineering",
      "Basic Engineering Workshop"
    ],
    "facilities": [
      "Machine Shop (Lathes, Shapers, Milling)",
      "Welding & Sheet Metal Fabrication Bay",
      "Carpentry & Fitting Shop",
      "Foundry & Blacksmithy Bay",
      "Automotive Engine & Emissions Testing Rig"
    ],
    "verified": "APPROXIMATE",
    "source": "Northwest Academic Utility Sector",
    "accuracyLevel": "3-5m Estimated Footprint",
    "geoCoordinates": {
      "lat": 14.913725,
      "lng": 79.98298
    },
    "yearBuilt": 1999,
    "architecturalStyle": "High-Ceiling Industrial Truss Workshop Structure",
    "hasPillars": false,
    "hasCanopy": true,
    "hasSolarPanels": true,
    "hvacUnits": 2,
    "waterTanks": 2,
    "contact": "workshop@pbrvits.ac.in",
    "hours": "09:00 AM - 05:00 PM",
    "navNodeId": "node-workshops-entrance",
    "wingType": "industrial"
  },
  {
    "id": "auditorium",
    "name": "Visvodaya Central Auditorium & Convention Hall",
    "shortName": "Auditorium",
    "category": "facility",
    "position": [
      -8.2,
      0,
      -96.7
    ],
    "rotation": 0,
    "dimensions": {
      "width": 44,
      "depth": 32,
      "height": 12.5
    },
    "floors": 2,
    "floorHeight": 5.8,
    "color": "#f8fafc",
    "secondaryColor": "#7c2d12",
    "accentColor": "#fbbf24",
    "windowStyle": "minimal",
    "roofType": "parapet",
    "description": "Air-conditioned 1,500-seat multi-purpose auditorium for national conferences, graduation days, cultural events, and placement drives.",
    "departments": [
      "Cultural Activities Committee",
      "Student Affairs",
      "Placement Cell"
    ],
    "facilities": [
      "Main Stage & Motorized Curtains",
      "Acoustic Sound & PA System",
      "Air-Conditioned Green Rooms",
      "Foyer Exhibition & Registration Lobby"
    ],
    "verified": "APPROXIMATE",
    "source": "Central Gathering Quad / Northeast Pavilion Zone",
    "accuracyLevel": "3-5m Estimated Footprint",
    "geoCoordinates": {
      "lat": 14.91413,
      "lng": 79.98359
    },
    "yearBuilt": 2008,
    "architecturalStyle": "Large-Span Institutional Auditorium with Stepped Roof",
    "hasPillars": true,
    "hasCanopy": true,
    "hasSolarPanels": true,
    "hvacUnits": 8,
    "waterTanks": 2,
    "contact": "events@pbrvits.ac.in",
    "hours": "Open during scheduled events & college gatherings",
    "navNodeId": "node-auditorium-entrance",
    "wingType": "pavilion"
  },
  {
    "id": "canteen-cafeteria",
    "name": "Campus Canteen & Cafeteria",
    "shortName": "Campus Canteen",
    "category": "canteen",
    "position": [
      77.9,
      0,
      15.1
    ],
    "rotation": 0,
    "dimensions": {
      "width": 32,
      "depth": 26,
      "height": 8.5
    },
    "floors": 2,
    "floorHeight": 4.0,
    "color": "#fef3c7",
    "secondaryColor": "#d97706",
    "accentColor": "#10b981",
    "windowStyle": "large",
    "roofType": "terrace",
    "description": "Hygienic campus food court providing South Indian meals, breakfast, snacks, fresh fruit juices, and an open-air shaded patio for students and faculty.",
    "departments": [
      "Hospitality & Food Services"
    ],
    "facilities": [
      "Student Dining Hall (350+ seats)",
      "Faculty Dining Enclosure",
      "Fresh Juice & Bakery Counter",
      "RO Purified Water Station",
      "Outdoor Garden Pergola Seating"
    ],
    "verified": "ESTIMATED",
    "source": "East Campus Inter-College Service Corridor",
    "accuracyLevel": "5m Estimated Location",
    "geoCoordinates": {
      "lat": 14.913125,
      "lng": 79.98439
    },
    "yearBuilt": 2003,
    "architecturalStyle": "Dining Pavilion with Shaded Outdoor Verandah",
    "hasBalconies": true,
    "hasCanopy": true,
    "hasSolarPanels": false,
    "hvacUnits": 2,
    "waterTanks": 2,
    "contact": "canteen@pbrvits.ac.in",
    "hours": "07:30 AM - 08:30 PM",
    "navNodeId": "node-canteen-entrance",
    "wingType": "standard"
  },
  {
    "id": "boys-hostel",
    "name": "Boys Hostel Complex",
    "shortName": "Boys Hostel",
    "category": "hostel",
    "position": [
      72.0,
      0,
      -99.0
    ],
    "rotation": 0,
    "dimensions": {
      "width": 54,
      "depth": 40,
      "height": 16.0
    },
    "floors": 4,
    "floorHeight": 3.8,
    "color": "#f1f5f9",
    "secondaryColor": "#334155",
    "accentColor": "#0284c7",
    "windowStyle": "standard",
    "roofType": "parapet",
    "description": "On-campus residential facility for male students with high-speed Wi-Fi, dining mess, recreation room, solar water heating, and 24/7 security.",
    "departments": [
      "Hostel Administration",
      "Student Welfare"
    ],
    "facilities": [
      "Furnished Student Rooms (3-sharing)",
      "Hostel Dining Mess & Kitchen",
      "Indoor Sports & Gymnasium",
      "Solar Water Heating System",
      "Warden Residence & First Aid Post"
    ],
    "verified": "ESTIMATED",
    "source": "Northeast Campus Residential Zone",
    "accuracyLevel": "5m Estimated Location",
    "geoCoordinates": {
      "lat": 14.91415,
      "lng": 79.984335
    },
    "yearBuilt": 2006,
    "architecturalStyle": "Four-Story Residential Courtyard Quad",
    "hasBalconies": true,
    "hasPillars": false,
    "hasCanopy": true,
    "hasSolarPanels": true,
    "hvacUnits": 2,
    "waterTanks": 4,
    "contact": "hostel@pbrvits.ac.in",
    "hours": "Resident Access (Gate Curfew: 09:00 PM)",
    "navNodeId": "node-boys-hostel",
    "wingType": "courtyard"
  },
  {
    "id": "girls-hostel",
    "name": "Girls Hostel Complex",
    "shortName": "Girls Hostel",
    "category": "hostel",
    "position": [
      -145.3,
      0,
      -97.3
    ],
    "rotation": 0,
    "dimensions": {
      "width": 48,
      "depth": 38,
      "height": 16.0
    },
    "floors": 4,
    "floorHeight": 3.8,
    "color": "#fdf2f8",
    "secondaryColor": "#be185d",
    "accentColor": "#ec4899",
    "windowStyle": "standard",
    "roofType": "parapet",
    "description": "Secure on-campus residential facility for female students with enclosed internal garden courtyard, round-the-clock female wardens, biometric entry, and study halls.",
    "departments": [
      "Hostel Administration",
      "Student Welfare"
    ],
    "facilities": [
      "Furnished Student Accommodation",
      "Hygienic Dining Hall",
      "Reading & Study Hall",
      "Badminton Court inside perimeter",
      "24x7 Security & CCTV Vigilance"
    ],
    "verified": "ESTIMATED",
    "source": "Northwest Secure Enclosed Residential Zone",
    "accuracyLevel": "5m Estimated Location",
    "geoCoordinates": {
      "lat": 14.914135,
      "lng": 79.982315
    },
    "yearBuilt": 2007,
    "architecturalStyle": "Secure Enclosed Courtyard Residential Facility",
    "hasBalconies": true,
    "hasPillars": false,
    "hasCanopy": true,
    "hasSolarPanels": true,
    "hvacUnits": 2,
    "waterTanks": 4,
    "contact": "girlshostel@pbrvits.ac.in",
    "hours": "Resident Access (Gate Curfew: 07:00 PM)",
    "navNodeId": "node-girls-hostel",
    "wingType": "courtyard"
  },
  {
    "id": "sports-pavilion",
    "name": "Sports Pavilion & Athletics Field",
    "shortName": "Sports Pavilion",
    "category": "sports",
    "position": [
      -109.8,
      0,
      17.9
    ],
    "rotation": 0,
    "dimensions": {
      "width": 24,
      "depth": 32,
      "height": 7.0
    },
    "floors": 1,
    "floorHeight": 5.0,
    "color": "#e2e8f0",
    "secondaryColor": "#15803d",
    "accentColor": "#22c55e",
    "windowStyle": "large",
    "roofType": "flat",
    "description": "Athletics command pavilion with coach offices, sports equipment lockers, spectator seating bleachers, and first-aid center overlooking the main athletic ground.",
    "departments": [
      "Physical Education & Sports Department"
    ],
    "facilities": [
      "Physical Director Office",
      "Equipment Storage Locker",
      "Spectator Seating Bleachers",
      "Changing Rooms & Shower Facility",
      "Cricket & Football Gear Store"
    ],
    "verified": "APPROXIMATE",
    "source": "Athletic Ground East Border (adjacent to OSM way 1297896001)",
    "accuracyLevel": "2-3m Estimated Footprint",
    "geoCoordinates": {
      "lat": 14.9131,
      "lng": 79.982645
    },
    "yearBuilt": 2003,
    "architecturalStyle": "Low-Profile Athletic Pavilion with Shaded Verandah",
    "hasPillars": true,
    "hasCanopy": true,
    "hasSolarPanels": false,
    "hvacUnits": 1,
    "waterTanks": 1,
    "contact": "sports@pbrvits.ac.in",
    "hours": "06:00 AM - 07:00 PM",
    "navNodeId": "node-sports-pavilion",
    "wingType": "pavilion"
  },
  {
    "id": "main-gate",
    "name": "Main Entrance Arch & Security Command Plaza",
    "shortName": "Main Entrance",
    "category": "entrance",
    "position": [
      -1.2,
      0,
      102.5
    ],
    "rotation": 0,
    "dimensions": {
      "width": 32,
      "depth": 8,
      "height": 8.0
    },
    "floors": 1,
    "floorHeight": 5.5,
    "color": "#f8fafc",
    "secondaryColor": "#1e3a8a",
    "accentColor": "#eab308",
    "windowStyle": "large",
    "roofType": "flat",
    "description": "Grand entrance arch on Kondapuram Road / Udayagiri State Highway with dual security cabins, Visvodaya emblem, automated boom barriers, and visitor check-in.",
    "departments": [
      "Campus Security & Vigilance",
      "Transport Operations"
    ],
    "facilities": [
      "Security Command Cabin",
      "Visitor Entry Pass Counter",
      "Automated Boom Barriers",
      "College Bus Pick-up Bay",
      "CCTV Surveillance Control"
    ],
    "verified": "VERIFIED",
    "source": "Kondapuram Road / Campus Frontage Axis (OSM way 1297901222 entry)",
    "accuracyLevel": "Sub-meter Georeferenced Entrance Point",
    "geoCoordinates": {
      "lat": 14.91234,
      "lng": 79.983655
    },
    "yearBuilt": 2000,
    "architecturalStyle": "Monumental Entrance Arch with Steel Truss Columns",
    "hasPillars": true,
    "hasCanopy": true,
    "hasSolarPanels": false,
    "hvacUnits": 1,
    "waterTanks": 1,
    "contact": "security@pbrvits.ac.in",
    "hours": "24x7 Continuous Vigilance",
    "navNodeId": "node-main-gate",
    "wingType": "standard"
  },
  {
    "id": "solar-substation",
    "name": "Campus Electrical Substation & Transformer Yard",
    "shortName": "Power Substation",
    "category": "facility",
    "position": [
      -93.7,
      0,
      87.5
    ],
    "rotation": 0,
    "dimensions": {
      "width": 22,
      "depth": 16,
      "height": 5.5
    },
    "floors": 1,
    "floorHeight": 5.0,
    "color": "#94a3b8",
    "secondaryColor": "#334155",
    "accentColor": "#eab308",
    "windowStyle": "minimal",
    "roofType": "flat",
    "description": "Campus high-voltage electrical substation, silent diesel generators (500 kVA backup), and solar inverter bank providing continuous green energy.",
    "departments": [
      "Electrical Maintenance Division"
    ],
    "facilities": [
      "500 kVA Silent DG Set",
      "Solar Grid Inverters",
      "High Tension Switchyard",
      "Emergency Electrical Support Cell"
    ],
    "verified": "VERIFIED",
    "source": "Southwest Utility Zone (Corresponds to SPDCL Kavali Substation vicinity)",
    "accuracyLevel": "3-5m Georeferenced Location",
    "geoCoordinates": {
      "lat": 14.912475,
      "lng": 79.982795
    },
    "yearBuilt": 2012,
    "architecturalStyle": "Utility Power Distribution Substation",
    "hasPillars": false,
    "hasCanopy": false,
    "hasSolarPanels": true,
    "hvacUnits": 0,
    "waterTanks": 0,
    "contact": "maintenance@pbrvits.ac.in",
    "hours": "Authorized Personnel Only (24 Hours)",
    "navNodeId": "node-solar-substation",
    "wingType": "standard"
  }
];
