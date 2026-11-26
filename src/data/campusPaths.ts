import type { NavNode } from '../types';

export const campusNavNodes: NavNode[] = [
  {
    id: "node-main-gate",
    name: "Main Entrance Gate",
    type: "gate",
    position: [0, 0, 180],
    connections: ["node-security-plaza", "node-bus-bay"]
  },
  {
    id: "node-bus-bay",
    name: "College Bus Bay",
    type: "parking",
    position: [-30, 0, 155],
    connections: ["node-main-gate", "node-security-plaza", "node-visitor-parking"]
  },
  {
    id: "node-visitor-parking",
    name: "Visitor & Two-Wheeler Parking",
    type: "parking",
    position: [-35, 0, 120],
    connections: ["node-bus-bay", "node-admin-entrance"]
  },
  {
    id: "node-security-plaza",
    name: "Central Entrance Avenue",
    type: "junction",
    position: [0, 0, 140],
    connections: ["node-main-gate", "node-bus-bay", "node-admin-junction", "node-sports-junction"]
  },
  {
    id: "node-admin-junction",
    name: "Administration Boulevard Junction",
    type: "junction",
    position: [0, 0, 80],
    connections: ["node-security-plaza", "node-admin-entrance", "node-library-entrance", "node-central-quad"]
  },
  {
    id: "node-admin-entrance",
    name: "Administrative Bhavan Entrance",
    type: "building",
    position: [-45, 0, 80],
    connections: ["node-admin-junction", "node-visitor-parking", "node-girls-hostel"]
  },
  {
    id: "node-library-entrance",
    name: "Central Library Entrance",
    type: "building",
    position: [45, 0, 80],
    connections: ["node-admin-junction", "node-sports-junction", "node-ece-entrance"]
  },
  {
    id: "node-sports-junction",
    name: "Sports Complex Avenue Junction",
    type: "junction",
    position: [80, 0, 100],
    connections: ["node-security-plaza", "node-library-entrance", "node-sports-pavilion", "node-basketball-court"]
  },
  {
    id: "node-sports-pavilion",
    name: "Sports Pavilion & Track",
    type: "sports",
    position: [130, 0, 30],
    connections: ["node-sports-junction", "node-basketball-court", "node-boys-hostel"]
  },
  {
    id: "node-basketball-court",
    name: "Basketball & Volleyball Courts",
    type: "sports",
    position: [110, 0, 60],
    connections: ["node-sports-junction", "node-sports-pavilion"]
  },
  {
    id: "node-central-quad",
    name: "Central Campus Quadrangle",
    type: "junction",
    position: [0, 0, 10],
    connections: ["node-admin-junction", "node-cse-entrance", "node-ece-entrance", "node-auditorium-entrance", "node-sh-mba-entrance"]
  },
  {
    id: "node-sh-mba-entrance",
    name: "S&H / MBA Block Entrance",
    type: "building",
    position: [-35, 0, -25],
    connections: ["node-central-quad", "node-cse-entrance", "node-auditorium-entrance"]
  },
  {
    id: "node-cse-entrance",
    name: "CSE & AI Block Entrance",
    type: "building",
    position: [-60, 0, 0],
    connections: ["node-central-quad", "node-mech-entrance", "node-girls-hostel"]
  },
  {
    id: "node-ece-entrance",
    name: "ECE & EEE Block Entrance",
    type: "building",
    position: [60, 0, 0],
    connections: ["node-central-quad", "node-library-entrance", "node-canteen-entrance"]
  },
  {
    id: "node-auditorium-entrance",
    name: "Central Auditorium Portico",
    type: "building",
    position: [0, 0, -35],
    connections: ["node-central-quad", "node-canteen-junction", "node-west-avenue"]
  },
  {
    id: "node-canteen-junction",
    name: "Canteen & North Campus Junction",
    type: "junction",
    position: [25, 0, -85],
    connections: ["node-auditorium-entrance", "node-canteen-entrance", "node-boys-hostel", "node-mech-entrance"]
  },
  {
    id: "node-canteen-entrance",
    name: "Campus Canteen & Cafeteria",
    type: "amenity",
    position: [45, 0, -95],
    connections: ["node-canteen-junction", "node-ece-entrance", "node-boys-hostel"]
  },
  {
    id: "node-west-avenue",
    name: "West Engineering Avenue",
    type: "junction",
    position: [-60, 0, -60],
    connections: ["node-auditorium-entrance", "node-cse-entrance", "node-mech-entrance"]
  },
  {
    id: "node-mech-entrance",
    name: "Mech & Civil Block Entrance",
    type: "building",
    position: [-75, 0, -90],
    connections: ["node-west-avenue", "node-canteen-junction", "node-workshops-entrance"]
  },
  {
    id: "node-workshops-entrance",
    name: "Central Workshops & Labs",
    type: "building",
    position: [-75, 0, -150],
    connections: ["node-mech-entrance", "node-solar-substation"]
  },
  {
    id: "node-solar-substation",
    name: "Power Grid Substation",
    type: "amenity",
    position: [-145, 0, -140],
    connections: ["node-workshops-entrance"]
  },
  {
    id: "node-boys-hostel",
    name: "Swami Vivekananda Boys Hostel",
    type: "building",
    position: [120, 0, -115],
    connections: ["node-canteen-junction", "node-canteen-entrance", "node-sports-pavilion"]
  },
  {
    id: "node-girls-hostel",
    name: "Sarojini Naidu Girls Hostel",
    type: "building",
    position: [-135, 0, 70],
    connections: ["node-admin-entrance", "node-cse-entrance"]
  }
];
