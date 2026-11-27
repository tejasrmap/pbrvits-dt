import campusBoundaryData from './campus-boundary.json';
import buildingsData from './buildings.json';
import roadsData from './roads.json';
import pathwaysData from './pathways.json';
import facilitiesData from './facilities.json';
import sportsFacilitiesData from './sports-facilities.json';
import vegetationZonesData from './vegetation-zones.json';
import type { GeoCoordinates } from '../../types';

/**
 * PBR Visvodaya Institute of Technology & Science, Kavali, AP
 * Official WGS84 Geographic Reference Anchor (Academic Core)
 */
export const PBR_VITS_ORIGIN: GeoCoordinates = {
  lat: 14.913261,
  lng: 79.983666
};

// Earth ellipsoid constants at Latitude 14.913° N
const METERS_PER_DEG_LAT = 111319.9;
const METERS_PER_DEG_LNG = 111319.9 * Math.cos((PBR_VITS_ORIGIN.lat * Math.PI) / 180);

/**
 * Converts WGS84 Longitude / Latitude to Local Three.js Metric Coordinates (X, Y=0, Z)
 * Convention:
 * - +X is East, -X is West
 * - -Z is North, +Z is South
 * - +Y is Up (Elevation)
 */
export function wgs84ToLocal(lng: number, lat: number, elevation = 0): [number, number, number] {
  const x = (lng - PBR_VITS_ORIGIN.lng) * METERS_PER_DEG_LNG;
  const z = -(lat - PBR_VITS_ORIGIN.lat) * METERS_PER_DEG_LAT;
  return [Number(x.toFixed(2)), elevation, Number(z.toFixed(2))];
}

/**
 * Converts Local Three.js Metric Coordinates (X, Z) to WGS84 [Longitude, Latitude]
 */
export function localToWgs84(x: number, z: number): [number, number] {
  const lng = PBR_VITS_ORIGIN.lng + x / METERS_PER_DEG_LNG;
  const lat = PBR_VITS_ORIGIN.lat - z / METERS_PER_DEG_LAT;
  return [Number(lng.toFixed(7)), Number(lat.toFixed(7))];
}

/**
 * Converts Local Coordinates array to WGS84 Coordinates Object
 */
export function localToGeoCoordinates(x: number, z: number): GeoCoordinates {
  const [lng, lat] = localToWgs84(x, z);
  return { lng, lat };
}

// Export GeoJSON Datasets
export const campusBoundaryGeoJSON = campusBoundaryData;
export const buildingsGeoJSON = buildingsData;
export const roadsGeoJSON = roadsData;
export const pathwaysGeoJSON = pathwaysData;
export const facilitiesGeoJSON = facilitiesData;
export const sportsFacilitiesGeoJSON = sportsFacilitiesData;
export const vegetationZonesGeoJSON = vegetationZonesData;

/**
 * Basemap layer definitions with free reliable tile providers
 */
export const BASEMAP_PROVIDERS = {
  osm: {
    id: 'osm',
    name: 'OpenStreetMap Streets',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  },
  satellite: {
    id: 'satellite',
    name: 'Satellite (ESRI World Imagery)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 18
  },
  topo: {
    id: 'topo',
    name: 'Topographic Terrain',
    url: 'https://tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)',
    maxZoom: 17
  },
  cartoDark: {
    id: 'cartoDark',
    name: 'CartoDB Positron / Clean',
    url: 'https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    maxZoom: 20
  }
} as const;

export type BasemapId = keyof typeof BASEMAP_PROVIDERS;
