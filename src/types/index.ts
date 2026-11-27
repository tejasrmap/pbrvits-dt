export type BuildingCategory =
  | 'academic'
  | 'administrative'
  | 'library'
  | 'laboratory'
  | 'hostel'
  | 'canteen'
  | 'sports'
  | 'facility'
  | 'entrance';

export type VerificationStatus =
  | 'VERIFIED'
  | 'IMAGE-VERIFIED'
  | 'OSM-MAPPED'
  | 'APPROXIMATE'
  | 'ESTIMATED'
  | 'UNKNOWN'
  | 'IMAGE-ESTIMATED'
  | 'UNVERIFIED'
  | 'UNVERIFIED ESTIMATE';

export type AlignmentStatus = 'ALIGNED' | 'PARTIALLY ALIGNED' | 'MISALIGNED' | 'UNVERIFIED';

export type AppViewMode = '3d' | 'gis' | 'satellite' | 'firstPerson';

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export type WindowStyle = 'standard' | 'large' | 'lab' | 'curtain' | 'balcony' | 'minimal';
export type RoofType = 'flat' | 'parapet' | 'terrace' | 'sloped' | 'solar';

export interface BuildingDimensions {
  width: number;
  depth: number;
  height: number;
}

export interface BuildingData {
  id: string;
  name: string;
  shortName: string;
  category: BuildingCategory;
  position: [number, number, number];
  rotation: number; // in radians
  dimensions: BuildingDimensions;
  floors: number;
  floorHeight: number;
  color: string;
  secondaryColor?: string;
  accentColor?: string;
  windowStyle: WindowStyle;
  roofType: RoofType;
  description: string;
  departments: string[];
  facilities: string[];
  verified: VerificationStatus;
  alignmentStatus?: AlignmentStatus;
  yearBuilt?: number;
  architecturalStyle?: string;
  hasSolarPanels?: boolean;
  hasPillars?: boolean;
  hasCanopy?: boolean;
  hasBalconies?: boolean;
  hvacUnits?: number;
  waterTanks?: number;
  contact?: string;
  hours?: string;
  navNodeId: string;
  wingType?: 'standard' | 'stepped' | 'atrium' | 'courtyard' | 'industrial' | 'pavilion';
  geoCoordinates?: GeoCoordinates;
  polygonCoordinates?: [number, number][];
  localPolygonVertices?: [number, number, number][];
  source?: string;
  accuracyLevel?: string;
}

export interface CampusFacility {
  id: string;
  name: string;
  category: 'academic' | 'administrative' | 'amenity' | 'sports' | 'residential' | 'transport';
  buildingId?: string;
  position: [number, number, number];
  description: string;
  iconName: string;
  verified: VerificationStatus;
  alignmentStatus?: AlignmentStatus;
}

export interface CampusZone {
  id: string;
  name: string;
  code: string;
  color: string;
  description: string;
  center: [number, number, number];
  radius: number;
}

export interface NavNode {
  id: string;
  name: string;
  position: [number, number, number];
  type: 'gate' | 'building' | 'junction' | 'parking' | 'sports' | 'amenity';
  connections: string[];
}

export interface NavRoute {
  nodes: NavNode[];
  points: [number, number, number][];
  geoPoints?: [number, number][];
  distanceMeters: number;
  walkingMinutes: number;
  instructions: string[];
}

export type TimeOfDay = 'day' | 'goldenHour' | 'sunset' | 'night';

export type CameraMode = 'orbit' | 'aerial' | 'firstPerson' | 'inspect' | 'tour';

export type GraphicsQuality = 'low' | 'medium' | 'high' | 'ultra';

export interface LayerVisibility {
  buildings: boolean;
  roads: boolean;
  trees: boolean;
  grass: boolean;
  parking: boolean;
  campusLabels: boolean;
  facilities: boolean;
  navigation: boolean;
  boundary: boolean;
  sports: boolean;
  shadows: boolean;
}

export interface TourStep {
  id: string;
  title: string;
  subtitle: string;
  position: [number, number, number];
  lookAt: [number, number, number];
  durationSeconds: number;
  buildingId?: string;
  timeOfDay?: TimeOfDay;
}

export interface CampusStats {
  totalBuildings: number;
  departmentsCount: number;
  facilitiesCount: number;
  campusAreaAcres: number;
  studentCapacity: number;
}
