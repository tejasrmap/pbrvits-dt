import type { TourStep } from '../types';

export const campusTourSteps: TourStep[] = [
  {
    id: "tour-aerial-start",
    title: "PBR VITS Real GIS Campus Overview",
    subtitle: "PBR Visvodaya Institute of Technology & Science, Kavali, AP (14.9132° N, 79.9836° E)",
    position: [0, 220, 180],
    lookAt: [0, 0, 0],
    durationSeconds: 7,
    timeOfDay: "day"
  },
  {
    id: "tour-main-gate-approach",
    title: "Kondapuram Road Campus Approach",
    subtitle: "State highway frontage road connecting Udayagiri, Kavali town center, and NH-16",
    position: [-1.2, 22, 150],
    lookAt: [-1.2, 6, 102.5],
    durationSeconds: 6,
    timeOfDay: "day",
    buildingId: "main-gate"
  },
  {
    id: "tour-main-gate-arch",
    title: "Grand Entrance Arch & Security Command",
    subtitle: "Visvodaya emblem, dual security cabins, automated boom barriers, and college bus transit bay",
    position: [-1.2, 12, 128],
    lookAt: [-1.2, 6, 102.5],
    durationSeconds: 6,
    timeOfDay: "day",
    buildingId: "main-gate"
  },
  {
    id: "tour-admin-bhavan",
    title: "Administrative Block (OSM Verified)",
    subtitle: "Executive headquarters housing Principal's chamber, Registrar, Examination Cell, and Admissions (OSM way 1297903400)",
    position: [62, 20, 42],
    lookAt: [32.3, 7, 11.5],
    durationSeconds: 7,
    timeOfDay: "goldenHour",
    buildingId: "admin-block"
  },
  {
    id: "tour-cse-ai-block",
    title: "Computer Science & IT Academic Complex",
    subtitle: "Four-story academic hub housing CSE, AI & ML, IoT labs, Cloud Computing center, and smart seminar halls",
    position: [15, 24, -28],
    lookAt: [-16.2, 8, -58.3],
    durationSeconds: 7,
    timeOfDay: "day",
    buildingId: "cse-it-block"
  },
  {
    id: "tour-ece-eee-block",
    title: "Electronics & Electrical Sciences Block (OSM Verified)",
    subtitle: "Four-story academic wing housing VLSI, Embedded Systems, Robotics, and Power Systems (OSM way 1297903395)",
    position: [24, 24, 18],
    lookAt: [-6.6, 8, -12.4],
    durationSeconds: 7,
    timeOfDay: "day",
    buildingId: "ece-eee-block"
  },
  {
    id: "tour-central-library",
    title: "Central Library & Knowledge Center (OSM Verified)",
    subtitle: "Automated knowledge center holding over 140,000+ volumes, IEEE digital access, and reading halls (OSM way 1297903411)",
    position: [85, 22, -10],
    lookAt: [53.6, 8, -35.5],
    durationSeconds: 7,
    timeOfDay: "goldenHour",
    buildingId: "central-library"
  },
  {
    id: "tour-auditorium",
    title: "Visvodaya Central Auditorium",
    subtitle: "1,500-seat multi-purpose acoustic auditorium for national conferences, graduation ceremonies, and cultural events",
    position: [22, 24, -68],
    lookAt: [-8.2, 7, -96.7],
    durationSeconds: 7,
    timeOfDay: "sunset",
    buildingId: "auditorium"
  },
  {
    id: "tour-sports-ground",
    title: "PBR VITS Athletic Ground (OSM Verified)",
    subtitle: "OpenStreetMap verified playground (way 1297896001), cricket oval, 400m track, and sports pavilion",
    position: [-75, 25, 45],
    lookAt: [-125, 2, 18],
    durationSeconds: 7,
    timeOfDay: "day",
    buildingId: "sports-pavilion"
  },
  {
    id: "tour-hostels",
    title: "Student Residential Quarters",
    subtitle: "Boys and Girls hostel complexes with internal garden courtyards, dining halls, and round-the-clock security",
    position: [102, 24, -68],
    lookAt: [72.0, 8, -99.0],
    durationSeconds: 7,
    timeOfDay: "sunset",
    buildingId: "boys-hostel"
  },
  {
    id: "tour-night-showcase",
    title: "Campus Nocturnal Illumination",
    subtitle: "Georeferenced night environment with illuminated LED streetlights, glowing windows, and dark sky",
    position: [0, 95, 140],
    lookAt: [0, 10, 0],
    durationSeconds: 8,
    timeOfDay: "night"
  },
  {
    id: "tour-aerial-finale",
    title: "PBR VITS Georeferenced Digital Twin",
    subtitle: "Unified GIS and 3D smart-campus digital twin built on genuine OpenStreetMap geographic foundations",
    position: [0, 240, 40],
    lookAt: [0, 0, 0],
    durationSeconds: 8,
    timeOfDay: "day"
  }
];
