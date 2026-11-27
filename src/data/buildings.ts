import type { BuildingData, VerificationStatus } from '../types';
import buildingsGeoJSON from './gis/buildings.json';
import { wgs84ToLocal } from './gis';

/**
 * Architectural styling dictionary providing authentic physical details
 * keyed by authoritative building ID.
 */
interface BuildingStyleMetadata {
  color: string;
  secondaryColor: string;
  accentColor: string;
  windowStyle: 'standard' | 'large' | 'lab' | 'curtain' | 'balcony' | 'minimal';
  roofType: 'flat' | 'parapet' | 'terrace' | 'sloped' | 'solar';
  description: string;
  yearBuilt: number;
  architecturalStyle: string;
  hasPillars?: boolean;
  hasCanopy?: boolean;
  hasSolarPanels?: boolean;
  hasBalconies?: boolean;
  hvacUnits?: number;
  waterTanks?: number;
  contact?: string;
  hours?: string;
  navNodeId: string;
  wingType?: 'standard' | 'stepped' | 'atrium' | 'courtyard' | 'industrial' | 'pavilion';
}

const buildingStyles: Record<string, BuildingStyleMetadata> = {
  'admin-block': {
    color: '#e2d9cc',
    secondaryColor: '#9c3d28',
    accentColor: '#f59e0b',
    windowStyle: 'large',
    roofType: 'parapet',
    description: "Central administrative headquarters housing the Principal's chamber, Registrar, Examination Cell, Accounts, Admissions & Student Affairs office.",
    yearBuilt: 1998,
    architecturalStyle: 'Academic Administration Block with Classical Entrance Portico',
    hasPillars: true,
    hasCanopy: true,
    hasSolarPanels: true,
    hvacUnits: 4,
    waterTanks: 2,
    contact: 'principal@pbrvits.ac.in | 08626-243930',
    hours: '09:00 AM - 05:00 PM',
    navNodeId: 'node-admin-entrance',
    wingType: 'stepped'
  },
  'central-library': {
    color: '#e8eff5',
    secondaryColor: '#1e3a8a',
    accentColor: '#38bdf8',
    windowStyle: 'curtain',
    roofType: 'parapet',
    description: 'Centrally automated academic library holding over 140,000+ volumes, IEEE, DELNET, NPTEL e-resources, multimedia section, and air-conditioned reading halls.',
    yearBuilt: 2002,
    architecturalStyle: 'Modern Curtain-Glass Facade with Double-Height Atrium',
    hasPillars: true,
    hasCanopy: true,
    hasSolarPanels: true,
    hvacUnits: 6,
    waterTanks: 2,
    contact: 'library@pbrvits.ac.in',
    hours: '08:30 AM - 08:00 PM',
    navNodeId: 'node-library-entrance',
    wingType: 'atrium'
  },
  'cse-it-block': {
    color: '#dce4ec',
    secondaryColor: '#0f766e',
    accentColor: '#14b8a6',
    windowStyle: 'lab',
    roofType: 'parapet',
    description: 'Advanced computing sciences pavilion with high-performance computing clusters, AI/ML center of excellence, IoT laboratories, and faculty suites.',
    yearBuilt: 2005,
    architecturalStyle: 'High-Tech Engineering Wing with Internal Courtyard',
    hasPillars: false,
    hasCanopy: true,
    hasSolarPanels: true,
    hvacUnits: 8,
    waterTanks: 2,
    contact: 'hodcse@pbrvits.ac.in',
    hours: '08:30 AM - 06:00 PM',
    navNodeId: 'node-cse-entrance',
    wingType: 'courtyard'
  },
  'ece-eee-block': {
    color: '#ede8df',
    secondaryColor: '#b45309',
    accentColor: '#f59e0b',
    windowStyle: 'standard',
    roofType: 'parapet',
    description: 'Core electrical sciences wing with VLSI design suites, Embedded Systems lab, Power Systems test bays, Microprocessor research center, and robotics cells.',
    yearBuilt: 1999,
    architecturalStyle: 'Multi-Story Institutional Quad with Continuous Concrete Chajjas',
    hasPillars: false,
    hasCanopy: true,
    hasSolarPanels: false,
    hvacUnits: 4,
    waterTanks: 2,
    contact: 'hodece@pbrvits.ac.in',
    hours: '08:30 AM - 05:00 PM',
    navNodeId: 'node-ece-entrance',
    wingType: 'standard'
  },
  'sh-mba-block': {
    color: '#eae5dc',
    secondaryColor: '#334155',
    accentColor: '#64748b',
    windowStyle: 'standard',
    roofType: 'parapet',
    description: 'Foundational sciences block with physics and chemistry wet-laboratories, English language communication center, MBA syndicate rooms, and seminar galleries.',
    yearBuilt: 2004,
    architecturalStyle: 'Contemporary Academic Block with Concrete Brise-Soleil',
    hasPillars: false,
    hasCanopy: true,
    hasSolarPanels: false,
    hvacUnits: 3,
    waterTanks: 2,
    contact: 'hodsh@pbrvits.ac.in',
    hours: '09:00 AM - 05:00 PM',
    navNodeId: 'node-sh-entrance',
    wingType: 'standard'
  },
  'mech-civil-block': {
    color: '#dfdad1',
    secondaryColor: '#475569',
    accentColor: '#0ea5e9',
    windowStyle: 'large',
    roofType: 'parapet',
    description: 'Heavy engineering laboratories including IC Engines test cell, CAD/CAM design center, Strength of Materials testing station, and Fluid Mechanics flume facilities.',
    yearBuilt: 2000,
    architecturalStyle: 'Industrial Engineering Wing with Heavy Concrete Framing',
    hasPillars: false,
    hasCanopy: true,
    hasSolarPanels: false,
    hvacUnits: 2,
    waterTanks: 2,
    contact: 'hodmech@pbrvits.ac.in',
    hours: '08:30 AM - 05:00 PM',
    navNodeId: 'node-mech-entrance',
    wingType: 'standard'
  },
  'central-workshops': {
    color: '#cbd5e1',
    secondaryColor: '#334155',
    accentColor: '#ef4444',
    windowStyle: 'minimal',
    roofType: 'sloped',
    description: 'Industrial high-bay machine shops for practical training: CNC machining center, Foundry, Welding fabrication bays, Carpentry, Fitting, and Sheet Metal shop.',
    yearBuilt: 1998,
    architecturalStyle: 'Industrial Pitched-Roof High-Bay Workshop Sheds',
    hasPillars: false,
    hasCanopy: true,
    hasSolarPanels: false,
    hvacUnits: 0,
    waterTanks: 1,
    contact: 'workshop@pbrvits.ac.in',
    hours: '08:30 AM - 05:00 PM',
    navNodeId: 'node-workshop-entrance',
    wingType: 'industrial'
  },
  'auditorium': {
    color: '#f1ede6',
    secondaryColor: '#1e3a8a',
    accentColor: '#3b82f6',
    windowStyle: 'large',
    roofType: 'parapet',
    description: 'Premier air-conditioned convention auditorium with 1,200 seats, acoustically calibrated stage, professional green rooms, and motorized projection systems.',
    yearBuilt: 2008,
    architecturalStyle: 'Monumental Public Assembly Hall with Colonnade Entrance Foyer',
    hasPillars: true,
    hasCanopy: true,
    hasSolarPanels: true,
    hvacUnits: 10,
    waterTanks: 2,
    contact: 'events@pbrvits.ac.in',
    hours: 'Event Dependent',
    navNodeId: 'node-auditorium-entrance',
    wingType: 'pavilion'
  },
  'canteen-cafeteria': {
    color: '#f8fafc',
    secondaryColor: '#059669',
    accentColor: '#10b981',
    windowStyle: 'large',
    roofType: 'parapet',
    description: 'Modern campus food court serving breakfast, lunch, and refreshments with hygienic commercial kitchens, outdoor shaded patio, and student lounge.',
    yearBuilt: 2010,
    architecturalStyle: 'Modern Pavilion with Wide Glass Dining Bays and Outdoor Pergolars',
    hasPillars: false,
    hasCanopy: true,
    hasSolarPanels: false,
    hvacUnits: 2,
    waterTanks: 2,
    contact: 'canteen@pbrvits.ac.in',
    hours: '07:30 AM - 08:30 PM',
    navNodeId: 'node-canteen-entrance',
    wingType: 'pavilion'
  },
  'boys-hostel': {
    color: '#e5e0d8',
    secondaryColor: '#78350f',
    accentColor: '#d97706',
    windowStyle: 'balcony',
    roofType: 'parapet',
    description: 'Four-story residential hall accommodating 450+ students with mess dining, recreation room, high-speed Wi-Fi, and 24/7 security guard post.',
    yearBuilt: 2001,
    architecturalStyle: 'Residential Quadrangular Block with Shaded Balconies',
    hasPillars: false,
    hasCanopy: true,
    hasSolarPanels: true,
    hasBalconies: true,
    hvacUnits: 0,
    waterTanks: 4,
    contact: 'warden.boys@pbrvits.ac.in | 08626-243932',
    hours: '24/7 (Gate Closes: 09:00 PM)',
    navNodeId: 'node-boys-hostel-entrance',
    wingType: 'courtyard'
  },
  'girls-hostel': {
    color: '#e5e0d8',
    secondaryColor: '#831843',
    accentColor: '#ec4899',
    windowStyle: 'balcony',
    roofType: 'parapet',
    description: 'Dedicated residential complex providing secure accommodation for female scholars with attached dining hall, indoor gym, study lounge, and biometric access.',
    yearBuilt: 2003,
    architecturalStyle: 'Secured Residential Complex with Courtyard and Balcony Fenestrations',
    hasPillars: false,
    hasCanopy: true,
    hasSolarPanels: true,
    hasBalconies: true,
    hvacUnits: 0,
    waterTanks: 4,
    contact: 'warden.girls@pbrvits.ac.in | 08626-243934',
    hours: '24/7 (Gate Closes: 07:00 PM)',
    navNodeId: 'node-girls-hostel-entrance',
    wingType: 'courtyard'
  },
  'sports-pavilion': {
    color: '#ede9e3',
    secondaryColor: '#15803d',
    accentColor: '#22c55e',
    windowStyle: 'standard',
    roofType: 'parapet',
    description: 'Department of Physical Education pavilion featuring sports equipment room, indoor table tennis, badminton facilities, and athletics command desk.',
    yearBuilt: 2006,
    architecturalStyle: 'Athletics Command Pavilion Facing the Track and Cricket Oval',
    hasPillars: true,
    hasCanopy: true,
    hasSolarPanels: false,
    hvacUnits: 1,
    waterTanks: 1,
    contact: 'sports@pbrvits.ac.in',
    hours: '06:00 AM - 07:30 PM',
    navNodeId: 'node-sports-pavilion',
    wingType: 'pavilion'
  },
  'main-gate': {
    color: '#e2e8f0',
    secondaryColor: '#1e3a8a',
    accentColor: '#f59e0b',
    windowStyle: 'large',
    roofType: 'flat',
    description: 'Campus entrance gateway with security command cabin, automated visitor check-in, CCTV surveillance hub, and emergency response staging point.',
    yearBuilt: 1998,
    architecturalStyle: 'Monumental Entrance Gateway Arch with Security Kiosks',
    hasPillars: true,
    hasCanopy: true,
    hasSolarPanels: false,
    hvacUnits: 1,
    waterTanks: 1,
    contact: 'security@pbrvits.ac.in | 08626-243939',
    hours: '24/7 Operating Hours',
    navNodeId: 'node-main-gate',
    wingType: 'standard'
  },
  'solar-substation': {
    color: '#cbd5e1',
    secondaryColor: '#334155',
    accentColor: '#f59e0b',
    windowStyle: 'minimal',
    roofType: 'flat',
    description: 'Primary campus electrical power distribution yard with step-down transformers, automatic power factor controllers, HT switchgear, and backup diesel generators.',
    yearBuilt: 2005,
    architecturalStyle: 'Heavy Utility Enclosure with Safety Perimeter Fence',
    hasPillars: false,
    hasCanopy: false,
    hasSolarPanels: false,
    hvacUnits: 0,
    waterTanks: 0,
    contact: 'maintenance@pbrvits.ac.in',
    hours: '24/7 Restricted Access',
    navNodeId: 'node-substation',
    wingType: 'standard'
  }
};

/**
 * Authoritative campusBuildings array generated mathematically from
 * the official GeoJSON building polygon dataset.
 *
 * Guarantees that:
 * 1. 3D models and GIS maps share identical coordinate origins and footprints.
 * 2. Position is the exact centroid of the WGS84 polygon converted to local metric units.
 * 3. Dimensions are derived from the actual polygon boundary.
 * 4. No duplicate, hardcoded, or manually invented coordinate datasets exist.
 */
export const campusBuildings: BuildingData[] = buildingsGeoJSON.features.map((feat) => {
  const props = feat.properties as any;
  const ring = feat.geometry.coordinates[0] as [number, number][];
  const localRing = ring.map((pt) => wgs84ToLocal(pt[0], pt[1])) as [number, number, number][];

  // Mathematical polygon centroid calculation
  let cx = 0;
  let cz = 0;
  let signedArea = 0;
  for (let i = 0; i < localRing.length - 1; i++) {
    const p1 = localRing[i];
    const p2 = localRing[i + 1];
    const a = p1[0] * p2[2] - p2[0] * p1[2];
    signedArea += a;
    cx += (p1[0] + p2[0]) * a;
    cz += (p1[2] + p2[2]) * a;
  }
  signedArea *= 0.5;

  if (Math.abs(signedArea) > 1e-5) {
    cx /= 6 * signedArea;
    cz /= 6 * signedArea;
  } else {
    cx = localRing.reduce((sum, p) => sum + p[0], 0) / (localRing.length - 1);
    cz = localRing.reduce((sum, p) => sum + p[2], 0) / (localRing.length - 1);
  }

  // Derive bounding width & depth
  const xs = localRing.map((p) => p[0]);
  const zs = localRing.map((p) => p[2]);
  const width = Math.max(...xs) - Math.min(...xs);
  const depth = Math.max(...zs) - Math.min(...zs);

  const style = buildingStyles[feat.id] || {
    color: '#e2d9cc',
    secondaryColor: '#9c3d28',
    accentColor: '#f59e0b',
    windowStyle: 'standard',
    roofType: 'parapet',
    description: props.name,
    yearBuilt: 2000,
    architecturalStyle: 'Institutional Academic Wing',
    navNodeId: `node-${feat.id}`,
    wingType: 'standard'
  };

  const floors = props.floors || 3;
  const height = props.height || 14;

  return {
    id: feat.id,
    name: props.name,
    shortName: props.shortName || props.name,
    category: props.category,
    position: [Number(cx.toFixed(2)), 0, Number(cz.toFixed(2))],
    rotation: 0,
    dimensions: {
      width: Number(width.toFixed(2)),
      depth: Number(depth.toFixed(2)),
      height: height
    },
    polygonCoordinates: ring,
    localPolygonVertices: localRing,
    floors: floors,
    floorHeight: Number((height / floors).toFixed(2)),
    color: style.color,
    secondaryColor: style.secondaryColor,
    accentColor: style.accentColor,
    windowStyle: style.windowStyle,
    roofType: style.roofType,
    description: style.description,
    departments: props.departments || [],
    facilities: props.facilities || [],
    verified: (props.verificationStatus as VerificationStatus) || 'OSM-MAPPED',
    yearBuilt: style.yearBuilt,
    architecturalStyle: style.architecturalStyle,
    hasSolarPanels: style.hasSolarPanels,
    hasPillars: style.hasPillars,
    hasCanopy: style.hasCanopy,
    hasBalconies: style.hasBalconies,
    hvacUnits: style.hvacUnits,
    waterTanks: style.waterTanks,
    contact: style.contact,
    hours: style.hours,
    navNodeId: style.navNodeId,
    wingType: style.wingType,
    geoCoordinates: {
      lat: props.centroid[1],
      lng: props.centroid[0]
    },
    source: props.source,
    accuracyLevel: props.accuracyLevel
  };
});
