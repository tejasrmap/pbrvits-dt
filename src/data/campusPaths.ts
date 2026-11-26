import type { NavNode } from '../types';

export const campusNavNodes: NavNode[] = [
  {
    id: "node-main-gate",
    name: "Main Entrance Gate (Kondapuram Road)",
    type: "gate",
    position: [-1.2, 0, 102.5],
    connections: ["node-security-plaza", "node-bus-bay", "node-visitor-parking"]
  },
  {
    id: "node-bus-bay",
    name: "College Bus Transit Bay",
    type: "parking",
    position: [-28.0, 0, 98.0],
    connections: ["node-main-gate", "node-security-plaza", "node-solar-substation"]
  },
  {
    id: "node-visitor-parking",
    name: "Visitor & Two-Wheeler Parking",
    type: "parking",
    position: [25.0, 0, 95.0],
    connections: ["node-main-gate", "node-security-plaza", "node-admin-junction"]
  },
  {
    id: "node-security-plaza",
    name: "Central Boulevard Entry Plaza",
    type: "junction",
    position: [-0.5, 0, 80.0],
    connections: ["node-main-gate", "node-bus-bay", "node-visitor-parking", "node-admin-junction", "node-solar-substation"]
  },
  {
    id: "node-admin-junction",
    name: "Administration Boulevard Junction",
    type: "junction",
    position: [0.0, 0, 45.0],
    connections: ["node-security-plaza", "node-visitor-parking", "node-admin-entrance", "node-sh-mba-entrance", "node-central-quad", "node-canteen-entrance"]
  },
  {
    id: "node-admin-entrance",
    name: "Administrative Block Portico",
    type: "building",
    position: [20.0, 0, 12.0],
    connections: ["node-admin-junction", "node-central-quad", "node-canteen-entrance", "node-library-entrance"]
  },
  {
    id: "node-sh-mba-entrance",
    name: "S&H / MBA Block Entrance",
    type: "building",
    position: [-14.0, 0, 20.0],
    connections: ["node-admin-junction", "node-central-quad", "node-sports-junction"]
  },
  {
    id: "node-central-quad",
    name: "Central Academic Quadrangle",
    type: "junction",
    position: [0.0, 0, 0.0],
    connections: ["node-admin-junction", "node-admin-entrance", "node-sh-mba-entrance", "node-ece-entrance", "node-mech-entrance", "node-library-entrance", "node-cse-entrance"]
  },
  {
    id: "node-ece-entrance",
    name: "ECE & EEE Block Entrance",
    type: "building",
    position: [-6.0, 0, 6.0],
    connections: ["node-central-quad", "node-mech-entrance", "node-cse-entrance"]
  },
  {
    id: "node-mech-entrance",
    name: "Mechanical Block Entrance",
    type: "building",
    position: [-50.0, 0, -9.0],
    connections: ["node-central-quad", "node-ece-entrance", "node-sports-junction", "node-workshops-entrance", "node-cse-entrance"]
  },
  {
    id: "node-sports-junction",
    name: "Athletic Ground Connector Path",
    type: "junction",
    position: [-85.0, 0, 18.0],
    connections: ["node-sh-mba-entrance", "node-mech-entrance", "node-sports-pavilion", "node-solar-substation"]
  },
  {
    id: "node-sports-pavilion",
    name: "Sports Pavilion & Track Command",
    type: "sports",
    position: [-98.0, 0, 18.0],
    connections: ["node-sports-junction", "node-basketball-court"]
  },
  {
    id: "node-basketball-court",
    name: "Basketball & Volleyball Hardcourt",
    type: "sports",
    position: [-90.0, 0, -45.0],
    connections: ["node-sports-pavilion", "node-workshops-entrance", "node-girls-hostel"]
  },
  {
    id: "node-library-entrance",
    name: "Central Library Glass Atrium Foyer",
    type: "building",
    position: [30.0, 0, -35.0],
    connections: ["node-central-quad", "node-admin-entrance", "node-cse-entrance", "node-canteen-entrance", "node-auditorium-entrance"]
  },
  {
    id: "node-cse-entrance",
    name: "CSE & AI Block Entrance",
    type: "building",
    position: [-16.0, 0, -40.0],
    connections: ["node-central-quad", "node-ece-entrance", "node-mech-entrance", "node-library-entrance", "node-auditorium-entrance", "node-workshops-entrance"]
  },
  {
    id: "node-workshops-entrance",
    name: "Central Workshops & Testing Bays",
    type: "building",
    position: [-74.0, 0, -32.0],
    connections: ["node-mech-entrance", "node-cse-entrance", "node-basketball-court", "node-girls-hostel"]
  },
  {
    id: "node-auditorium-entrance",
    name: "Visvodaya Central Auditorium Portico",
    type: "building",
    position: [-8.0, 0, -78.0],
    connections: ["node-cse-entrance", "node-library-entrance", "node-boys-hostel", "node-girls-hostel"]
  },
  {
    id: "node-canteen-entrance",
    name: "Campus Canteen & Cafeteria Patio",
    type: "amenity",
    position: [62.0, 0, 15.0],
    connections: ["node-admin-junction", "node-admin-entrance", "node-library-entrance", "node-boys-hostel"]
  },
  {
    id: "node-solar-substation",
    name: "Campus Electrical Substation",
    type: "amenity",
    position: [-82.0, 0, 80.0],
    connections: ["node-bus-bay", "node-security-plaza", "node-sports-junction"]
  },
  {
    id: "node-boys-hostel",
    name: "Swami Vivekananda Boys Hostel",
    type: "building",
    position: [55.0, 0, -80.0],
    connections: ["node-library-entrance", "node-auditorium-entrance", "node-canteen-entrance"]
  },
  {
    id: "node-girls-hostel",
    name: "Sarojini Naidu Girls Hostel",
    type: "building",
    position: [-120.0, 0, -80.0],
    connections: ["node-workshops-entrance", "node-basketball-court", "node-auditorium-entrance"]
  }
];
