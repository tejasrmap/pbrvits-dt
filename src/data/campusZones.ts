import type { CampusZone } from '../types';

export const campusZones: CampusZone[] = [
  {
    id: "zone-academic",
    name: "Academic & Tech Core",
    code: "Z-ACAD",
    color: "#0284c7",
    description: "Heart of teaching, lecture theaters, computer labs, and departmental faculty chambers.",
    center: [0, 0, 0],
    radius: 110
  },
  {
    id: "zone-administrative",
    name: "Administrative & Public Gateway",
    code: "Z-ADMIN",
    color: "#f59e0b",
    description: "Main gate, security checkpoint, Dr. Visvesvaraya Bhavan, visitor lounge, and Central Library.",
    center: [0, 0, 110],
    radius: 90
  },
  {
    id: "zone-residential",
    name: "Residential & Student Living",
    code: "Z-HOSTEL",
    color: "#8b5cf6",
    description: "Boys and Girls hostel residences, quiet recreation areas, mess facilities, and residential dining.",
    center: [0, 0, -110],
    radius: 100
  },
  {
    id: "zone-sports",
    name: "Sports, Athletics & Outdoors",
    code: "Z-SPORTS",
    color: "#10b981",
    description: "Full-scale athletic grounds, cricket pitch, basketball arena, volleyball courts, and sports pavilion.",
    center: [140, 0, 40],
    radius: 80
  },
  {
    id: "zone-workshops",
    name: "Workshops & Heavy Engineering",
    code: "Z-WORKSHOP",
    color: "#ea580c",
    description: "Industrial bays, machine tooling, manufacturing labs, civil testing yards, and high-power substation.",
    center: [-120, 0, -120],
    radius: 80
  }
];
