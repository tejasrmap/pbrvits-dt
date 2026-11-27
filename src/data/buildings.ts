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
  roofType: 'flat' | 'parapet' | 'terrace' | 'sloped';
  description: string;
  yearBuilt: number;
  architecturalStyle: string;
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
    architecturalStyle: 'Institutional Administration Block',
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
    description: 'Academic library holding 140,000+ volumes, digital e-library center, periodicals section, and reading halls.',
    yearBuilt: 2002,
    architecturalStyle: 'Academic Knowledge Center',
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
    description: 'Computing sciences building housing programming laboratories, AI/ML research facilities, and departmental lecture halls.',
    yearBuilt: 2005,
    architecturalStyle: 'Institutional Engineering Wing',
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
    description: 'Electrical and electronics engineering wing with circuits labs, microprocessors facility, and communications center.',
    yearBuilt: 1999,
    architecturalStyle: 'Multi-Story Institutional Quad with Concrete Chajjas',
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
    description: 'Basic sciences and management studies block with chemistry and physics laboratories, mathematics department, and MBA syndicate rooms.',
    yearBuilt: 2004,
    architecturalStyle: 'Institutional Academic Block',
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
    description: 'Mechanical and civil engineering laboratories, fluid mechanics labs, CAD/CAM suites, and materials testing facilities.',
    yearBuilt: 2000,
    architecturalStyle: 'Industrial Engineering Wing',
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
    description: 'Engineering machine shops for practical training: machining, welding fabrication, carpentry, and fitting shops.',
    yearBuilt: 1998,
    architecturalStyle: 'Industrial High-Bay Workshop Shed',
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
    description: 'Campus auditorium for institutional convocations, cultural gatherings, and technical conferences.',
    yearBuilt: 2008,
    architecturalStyle: 'Institutional Assembly Hall',
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
    description: 'Campus dining pavilion and student cafeteria located in the student amenity area.',
    yearBuilt: 2010,
    architecturalStyle: 'Student Dining Facility',
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
    description: 'Residential hostel accommodation for male scholars with study areas and dining.',
    yearBuilt: 2001,
    architecturalStyle: 'Institutional Residential Block',
    contact: 'warden.boys@pbrvits.ac.in | 08626-243932',
    hours: '24/7',
    navNodeId: 'node-boys-hostel-entrance',
    wingType: 'courtyard'
  },
  'girls-hostel': {
    color: '#e5e0d8',
    secondaryColor: '#831843',
    accentColor: '#ec4899',
    windowStyle: 'balcony',
    roofType: 'parapet',
    description: 'Secure residential complex for female scholars with attached dining and recreation.',
    yearBuilt: 2003,
    architecturalStyle: 'Secured Residential Complex',
    contact: 'warden.girls@pbrvits.ac.in | 08626-243934',
    hours: '24/7',
    navNodeId: 'node-girls-hostel-entrance',
    wingType: 'courtyard'
  },
  'sports-pavilion': {
    color: '#ede9e3',
    secondaryColor: '#15803d',
    accentColor: '#22c55e',
    windowStyle: 'standard',
    roofType: 'parapet',
    description: 'Physical Education pavilion facing the 400m running track oval and sports grounds.',
    yearBuilt: 2006,
    architecturalStyle: 'Athletics Ground Pavilion',
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
    description: 'Campus entrance gateway with security post on Kondapuram Road.',
    yearBuilt: 1998,
    architecturalStyle: 'Entrance Gateway Pylons',
    contact: 'security@pbrvits.ac.in | 08626-243939',
    hours: '24/7',
    navNodeId: 'node-main-gate',
    wingType: 'standard'
  },
  'solar-substation': {
    color: '#cbd5e1',
    secondaryColor: '#334155',
    accentColor: '#f59e0b',
    windowStyle: 'minimal',
    roofType: 'flat',
    description: 'Electrical power step-down transformers and distribution yard.',
    yearBuilt: 2005,
    architecturalStyle: 'Utility Distribution Enclosure',
    contact: 'maintenance@pbrvits.ac.in',
    hours: 'Restricted Access',
    navNodeId: 'node-substation',
    wingType: 'standard'
  }
};

/**
 * Authoritative campusBuildings array generated mathematically from
 * the official GeoJSON building polygon dataset.
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
    verified: (props.verificationStatus as VerificationStatus) || 'IMAGE-ESTIMATED',
    yearBuilt: style.yearBuilt,
    architecturalStyle: style.architecturalStyle,
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
