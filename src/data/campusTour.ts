import type { TourStep } from '../types';

export const campusTourSteps: TourStep[] = [
  {
    id: "tour-aerial-start",
    title: "PBR VITS Campus Overview",
    subtitle: "Welcome to PBR Visvodaya Institute of Technology & Science, Kavali (Established 1998, 35+ Acres)",
    position: [0, 220, 200],
    lookAt: [0, 0, 20],
    durationSeconds: 7,
    timeOfDay: "day"
  },
  {
    id: "tour-main-gate-approach",
    title: "Campus Main Gateway Approach",
    subtitle: "Frontage road on Visvodaya Road / NH-16 connecting Nellore and Kavali",
    position: [0, 26, 235],
    lookAt: [0, 7, 185],
    durationSeconds: 6,
    timeOfDay: "day",
    buildingId: "main-gate"
  },
  {
    id: "tour-main-gate-arch",
    title: "Grand Entrance Arch & Security Plaza",
    subtitle: "Visvodaya Society crest, dual security monitoring posts, automated boom barriers, and college bus fleet bay",
    position: [0, 14, 195],
    lookAt: [0, 8, 185],
    durationSeconds: 6,
    timeOfDay: "day",
    buildingId: "main-gate"
  },
  {
    id: "tour-admin-bhavan",
    title: "Administrative Block",
    subtitle: "Executive headquarters housing Principal's chamber, Registrar, Examination Cell, and Admissions",
    position: [-22, 18, 115],
    lookAt: [-50, 7, 80],
    durationSeconds: 7,
    timeOfDay: "goldenHour",
    buildingId: "admin-block"
  },
  {
    id: "tour-cse-ai-block",
    title: "Computer Science & IT Academic Complex",
    subtitle: "Four-story academic hub housing CSE, AI & ML, IoT labs, Cloud Computing center, and smart seminar halls",
    position: [-55, 25, 45],
    lookAt: [-85, 9, 0],
    durationSeconds: 7,
    timeOfDay: "day",
    buildingId: "cse-it-block"
  },
  {
    id: "tour-ece-eee-block",
    title: "Electronics & Electrical Sciences Block",
    subtitle: "Advanced VLSI design, Embedded Systems, Robotics prototyping, and high-voltage power electronics labs",
    position: [55, 25, 45],
    lookAt: [85, 9, 0],
    durationSeconds: 7,
    timeOfDay: "day",
    buildingId: "ece-eee-block"
  },
  {
    id: "tour-central-library",
    title: "Central Library",
    subtitle: "Automated 3-story knowledge center with over 140,000+ volumes, IEEE digital journal access, and e-learning suites",
    position: [25, 22, 115],
    lookAt: [50, 7, 80],
    durationSeconds: 7,
    timeOfDay: "goldenHour",
    buildingId: "central-library"
  },
  {
    id: "tour-auditorium",
    title: "Visvodaya Central Auditorium",
    subtitle: "1,500-seat acoustic amphitheater and convention hall for national symposia and graduation ceremonies",
    position: [0, 24, -15],
    lookAt: [0, 7, -50],
    durationSeconds: 7,
    timeOfDay: "sunset",
    buildingId: "auditorium"
  },
  {
    id: "tour-sports-ground",
    title: "Sports Pavilion & Athletic Ground",
    subtitle: "400m running track, central cricket pitch, regulation basketball courts, and volleyball sands",
    position: [95, 26, 85],
    lookAt: [145, 3, 35],
    durationSeconds: 7,
    timeOfDay: "day",
    buildingId: "sports-pavilion"
  },
  {
    id: "tour-hostels",
    title: "Student Residential Living Quarters",
    subtitle: "Boys and Girls hostel complexes with internal garden courtyards, dining halls, and 24x7 security",
    position: [105, 26, -75],
    lookAt: [145, 8, -115],
    durationSeconds: 7,
    timeOfDay: "sunset",
    buildingId: "boys-hostel"
  },
  {
    id: "tour-night-showcase",
    title: "Campus Nocturnal Illumination",
    subtitle: "Nocturnal campus view featuring LED street illumination, glowing building facades, and starlit sky",
    position: [0, 110, 160],
    lookAt: [0, 10, 10],
    durationSeconds: 8,
    timeOfDay: "night"
  },
  {
    id: "tour-aerial-finale",
    title: "PBR VITS Smart Campus Digital Twin",
    subtitle: "Full digital representation for smart campus infrastructure, facility planning, and virtual exploration",
    position: [0, 260, 50],
    lookAt: [0, 0, 0],
    durationSeconds: 8,
    timeOfDay: "day"
  }
];
