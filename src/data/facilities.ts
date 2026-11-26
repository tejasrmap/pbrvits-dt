import type { CampusFacility } from '../types';

export const campusFacilities: CampusFacility[] = [
  {
    id: "fac-lib-digital",
    name: "Digital Knowledge Center & e-Library",
    category: "academic",
    buildingId: "central-library",
    position: [53.6, 4.5, -35.5],
    description: "70 networked high-speed workstations with DELNET, IEEE Xplore, and NPTEL course repositories.",
    iconName: "BookOpen",
    verified: "VERIFIED"
  },
  {
    id: "fac-ai-lab",
    name: "Center of Excellence in AI & Deep Learning",
    category: "academic",
    buildingId: "cse-it-block",
    position: [-16.2, 8.0, -58.3],
    description: "Equipped with NVIDIA GPU workstations, Python/PyTorch development environments, and cloud sandboxes.",
    iconName: "Cpu",
    verified: "APPROXIMATE"
  },
  {
    id: "fac-robotics-lab",
    name: "IoT & Robotics Innovation Center",
    category: "academic",
    buildingId: "ece-eee-block",
    position: [-6.6, 4.0, -12.4],
    description: "Dedicated prototyping hub for autonomous drones, microcontrollers, ARM processors, and sensor suites.",
    iconName: "Bot",
    verified: "VERIFIED"
  },
  {
    id: "fac-cad-cam",
    name: "Advanced CAD / CAM Modeling Studio",
    category: "academic",
    buildingId: "mech-civil-block",
    position: [-67.1, 4.0, -9.1],
    description: "Industry-standard workstations running AutoCAD, SolidWorks, ANSYS, and Revit architecture software.",
    iconName: "Layers",
    verified: "VERIFIED"
  },
  {
    id: "fac-auditorium-hall",
    name: "1500-Seater Visvodaya Auditorium",
    category: "amenity",
    buildingId: "auditorium",
    position: [-8.2, 5.0, -96.7],
    description: "State-of-the-art auditorium with motorized stage lighting, acoustic wall panels, and green rooms.",
    iconName: "Megaphone",
    verified: "APPROXIMATE"
  },
  {
    id: "fac-cafeteria",
    name: "Student Cafeteria & Fast Food Center",
    category: "amenity",
    buildingId: "canteen-cafeteria",
    position: [77.9, 2.0, 15.1],
    description: "Clean multi-cuisine dining options, fresh juice bar, snacks, and outdoor garden seating.",
    iconName: "Coffee",
    verified: "ESTIMATED"
  },
  {
    id: "fac-sports-ground",
    name: "Cricket Oval & 400m Athletics Field",
    category: "sports",
    buildingId: "sports-pavilion",
    position: [-140.0, 0.5, 20.0],
    description: "Sprawling grass athletic field supporting cricket matches, football tournaments, and athletic tracks (OSM way 1297896001).",
    iconName: "Trophy",
    verified: "VERIFIED"
  },
  {
    id: "fac-basketball-court",
    name: "Outdoor Concrete Basketball Court",
    category: "sports",
    position: [-90.0, 0.5, -45.0],
    description: "Regulation dimensions with acrylic surface coating, perimeter fencing, and LED floodlights.",
    iconName: "Activity",
    verified: "APPROXIMATE"
  },
  {
    id: "fac-volleyball-court",
    name: "Volleyball & Throwball Sand Courts",
    category: "sports",
    position: [-95.0, 0.5, 50.0],
    description: "Dual sand-filled court facilities with night lighting for intramural tournaments.",
    iconName: "Target",
    verified: "APPROXIMATE"
  },
  {
    id: "fac-bus-bay",
    name: "College Transport Fleet Bay",
    category: "transport",
    position: [-28.0, 0.5, 98.0],
    description: "Parking and boarding point for 30+ college buses connecting Kavali, Nellore, Udayagiri, and Singarayakonda.",
    iconName: "Bus",
    verified: "VERIFIED"
  },
  {
    id: "fac-atm",
    name: "Campus 24/7 ATM & Banking Kiosk",
    category: "amenity",
    position: [15.0, 1.0, 95.0],
    description: "24-hour multi-bank ATM located safely inside the main security perimeter.",
    iconName: "CreditCard",
    verified: "VERIFIED"
  },
  {
    id: "fac-health-center",
    name: "Student Health Center & First Aid Dispensary",
    category: "amenity",
    buildingId: "admin-block",
    position: [32.3, 1.0, 11.5],
    description: "On-duty resident physician, nursing assistant, emergency medicines, and tie-up ambulance service.",
    iconName: "HeartPulse",
    verified: "VERIFIED"
  },
  {
    id: "fac-solar-plant",
    name: "100 kW Solar Power Installation & Substation",
    category: "administrative",
    buildingId: "solar-substation",
    position: [-93.7, 4.0, 87.5],
    description: "Green energy solar photovoltaic setup reducing carbon footprint and feeding surplus back to grid.",
    iconName: "Sun",
    verified: "VERIFIED"
  }
];
