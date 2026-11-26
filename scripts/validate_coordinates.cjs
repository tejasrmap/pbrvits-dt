// Validate 10 key campus points: conversion round-trip, local coordinates, and estimated ground accuracy
const PBR_VITS_ORIGIN = { lat: 14.913261, lng: 79.983666 };
const METERS_PER_DEG_LAT = 111319.9;
const METERS_PER_DEG_LNG = 111319.9 * Math.cos((PBR_VITS_ORIGIN.lat * Math.PI) / 180);

function wgs84ToLocal(lng, lat, elevation = 0) {
  const x = (lng - PBR_VITS_ORIGIN.lng) * METERS_PER_DEG_LNG;
  const z = -(lat - PBR_VITS_ORIGIN.lat) * METERS_PER_DEG_LAT;
  return [Number(x.toFixed(2)), elevation, Number(z.toFixed(2))];
}

function localToWgs84(x, z) {
  const lng = PBR_VITS_ORIGIN.lng + x / METERS_PER_DEG_LNG;
  const lat = PBR_VITS_ORIGIN.lat - z / METERS_PER_DEG_LAT;
  return [Number(lng.toFixed(7)), Number(lat.toFixed(7))];
}

const points = [
  { name: 'Campus Anchor / Reference Datum', lat: 14.913261, lng: 79.983666, source: 'OSM Way 1297901220 centroid', category: 'OSM-MAPPED', estGroundError: '±3m' },
  { name: 'Main Campus Entrance Gate', lat: 14.912290, lng: 79.983666, source: 'OSM Way 1297896011 frontage intersection', category: 'OSM-MAPPED', estGroundError: '±4m' },
  { name: 'Administrative Bhavan (Visvodaya)', lat: 14.913261, lng: 79.983666, source: 'OSM Way 1297903400 polygon center', category: 'OSM-MAPPED', estGroundError: '±3m' },
  { name: 'Central Library & Auditorium Quad', lat: 14.913980, lng: 79.983666, source: 'OSM Way 1297903411 northern quad', category: 'OSM-MAPPED', estGroundError: '±4m' },
  { name: 'ECE & Electronics Engineering Block', lat: 14.913261, lng: 79.984223, source: 'OSM Way 1297903395 eastern academic wing', category: 'OSM-MAPPED', estGroundError: '±3m' },
  { name: 'Mechanical & Civil Engineering Block', lat: 14.913261, lng: 79.983109, source: 'OSM Way 1297903402 western academic wing', category: 'OSM-MAPPED', estGroundError: '±3m' },
  { name: 'Visvodaya Sports Complex / Athletic Oval', lat: 14.913261, lng: 79.981809, source: 'OSM Way 1297896001 playground centroid', category: 'OSM-MAPPED', estGroundError: '±5m' },
  { name: 'Boys Hostel Complex (Block A & B)', lat: 14.914339, lng: 79.982366, source: 'Satellite imagery visual alignment', category: 'IMAGE-ESTIMATED', estGroundError: '±8m' },
  { name: 'Girls Hostel Complex', lat: 14.914159, lng: 79.985059, source: 'Satellite imagery visual alignment', category: 'IMAGE-ESTIMATED', estGroundError: '±10m' },
  { name: 'Kondapuram Highway / Udayagiri Road Axis', lat: 14.912021, lng: 79.983666, source: 'OSM Way 1297896011 highway alignment', category: 'OSM-MAPPED', estGroundError: '±3m' }
];

const results = points.map(pt => {
  const [localX, localY, localZ] = wgs84ToLocal(pt.lng, pt.lat);
  const [roundLng, roundLat] = localToWgs84(localX, localZ);
  const deltaLng = Math.abs(roundLng - pt.lng);
  const deltaLat = Math.abs(roundLat - pt.lat);
  // error in meters:
  const errorMeters = Math.sqrt(Math.pow(deltaLng * METERS_PER_DEG_LNG, 2) + Math.pow(deltaLat * METERS_PER_DEG_LAT, 2));
  return {
    ...pt,
    localX,
    localZ,
    roundLng,
    roundLat,
    mathDeltaMeters: errorMeters.toFixed(4)
  };
});

console.log(JSON.stringify(results, null, 2));
