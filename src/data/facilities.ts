import type { CampusFacility } from '../types';

export const campusFacilities: CampusFacility[] = [
  {
    id: "fac-lib-digital",
    name: "Digital Knowledge Center & e-Library",
    category: "academic",
    buildingId: "central-library",
    position: [50, 4.5, 80],
    description: "70 networked high-speed workstations with DELNET, IEEE Xplore, and NPTEL course repositories.",
    iconName: "BookOpen",
    verified: "VERIFIED"
  },
  {
    id: "fac-ai-lab",
    name: "Center of Excellence in AI & Deep Learning",
    category: "academic",
    buildingId: "cse-it-block",
    position: [-85, 8, 0],
    description: "Equipped with NVIDIA GPU workstations, Python/PyTorch development environments, and cloud sandboxes.",
    iconName: "Cpu",
    verified: "VERIFIED"
  },
  {
    id: "fac-robotics-lab",
    name: "IoT & Robotics Innovation Center",
    category: "academic",
    buildingId: "ece-eee-block",
    position: [85, 4, 0],
    description: "Dedicated prototyping hub for autonomous drones, microcontrollers, ARM processors, and sensor suites.",
    iconName: "Bot",
    verified: "VERIFIED"
  },
  {
    id: "fac-cad-cam",
    name: "Advanced CAD / CAM Modeling Studio",
    category: "academic",
    buildingId: "mech-civil-block",
    position: [-95, 4, -90],
    description: "Industry-standard workstations running AutoCAD, SolidWorks, ANSYS, and Revit architecture software.",
    iconName: "Layers",
    verified: "VERIFIED"
  },
  {
    id: "fac-auditorium-hall",
    name: "1500-Seater Visvodaya Auditorium",
    category: "amenity",
    buildingId: "auditorium",
    position: [0, 5, -50],
    description: "State-of-the-art auditorium with motorized stage lighting, acoustic wall panels, and green rooms.",
    iconName: "Megaphone",
    verified: "VERIFIED"
  },
  {
    id: "fac-cafeteria",
    name: "Student Cafeteria & Fast Food Center",
    category: "amenity",
    buildingId: "canteen-cafeteria",
    position: [50, 2, -100],
    description: "Clean multi-cuisine dining options, fresh juice bar, snacks, and outdoor garden seating.",
    iconName: "Coffee",
    verified: "VERIFIED"
  },
  {
    id: "fac-sports-ground",
    name: "Olympic-Standard Athletic Track & Cricket Ground",
    category: "sports",
    buildingId: "sports-pavilion",
    position: [160, 0.5, 40],
    description: "Sprawling grass sports field supporting cricket matches, football tournaments, and a 400m running track.",
    iconName: "Trophy",
    verified: "VERIFIED"
  },
  {
    id: "fac-basketball-court",
    name: "Outdoor Concrete Basketball Court",
    category: "sports",
    position: [110, 0.5, 60],
    description: "Regulation dimensions with acrylic surface coating, perimeter fencing, and LED floodlights.",
    iconName: "Activity",
    verified: "VERIFIED"
  },
  {
    id: "fac-volleyball-court",
    name: "Volleyball & Throwball Sand Courts",
    category: "sports",
    position: [110, 0.5, 0],
    description: "Dual sand-filled court facilities with night lighting for intramural tournaments.",
    iconName: "Target",
    verified: "VERIFIED"
  },
  {
    id: "fac-bus-bay",
    name: "College Transport Fleet Bay",
    category: "transport",
    position: [-35, 0.5, 150],
    description: "Parking and boarding point for 30+ college buses connecting Kavali, Nellore, Udayagiri, and Singarayakonda.",
    iconName: "Bus",
    verified: "VERIFIED"
  },
  {
    id: "fac-atm",
    name: "Campus 24/7 ATM & Banking Kiosk",
    category: "amenity",
    position: [-20, 1, 165],
    description: "24-hour multi-bank ATM located safely inside the main security perimeter.",
    iconName: "CreditCard",
    verified: "VERIFIED"
  },
  {
    id: "fac-health-center",
    name: "Student Health Center & First Aid Dispensary",
    category: "amenity",
    buildingId: "admin-block",
    position: [-40, 1, 65],
    description: "On-duty resident physician, nursing assistant, emergency medicines, and tie-up ambulance service.",
    iconName: "HeartPulse",
    verified: "VERIFIED"
  },
  {
    id: "fac-solar-plant",
    name: "100 kW Rooftop Solar Power Installation",
    category: "administrative",
    buildingId: "solar-substation",
    position: [-160, 4, -140],
    description: "Green energy solar photovoltaic setup reducing carbon footprint and feeding surplus back to grid.",
    iconName: "Sun",
    verified: "VERIFIED"
  }
];
