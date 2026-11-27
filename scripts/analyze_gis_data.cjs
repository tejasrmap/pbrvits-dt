const fs = require('fs');
const path = require('path');

const buildingsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/gis/buildings.json'), 'utf8'));
const boundaryData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/gis/campus-boundary.json'), 'utf8'));

const PBR_VITS_ORIGIN = {
  lat: 14.913261,
  lng: 79.983666
};

const METERS_PER_DEG_LAT = 111319.9;
const METERS_PER_DEG_LNG = 111319.9 * Math.cos((PBR_VITS_ORIGIN.lat * Math.PI) / 180);

function wgs84ToLocal(lng, lat, elevation = 0) {
  const x = (lng - PBR_VITS_ORIGIN.lng) * METERS_PER_DEG_LNG;
  const z = -(lat - PBR_VITS_ORIGIN.lat) * METERS_PER_DEG_LAT;
  return [Number(x.toFixed(2)), elevation, Number(z.toFixed(2))];
}

// Calculate polygon area in square meters (spherical / projected)
function polygonArea(coords) {
  let area = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    const p1 = wgs84ToLocal(coords[i][0], coords[i][1]);
    const p2 = wgs84ToLocal(coords[i+1][0], coords[i+1][1]);
    area += (p1[0] * p2[2] - p2[0] * p1[2]);
  }
  return Math.abs(area) / 2;
}

// Calculate centroid of polygon
function polygonCentroid(coords) {
  let cx = 0, cz = 0, signedArea = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    const p1 = wgs84ToLocal(coords[i][0], coords[i][1]);
    const p2 = wgs84ToLocal(coords[i+1][0], coords[i+1][1]);
    const a = p1[0] * p2[2] - p2[0] * p1[2];
    signedArea += a;
    cx += (p1[0] + p2[0]) * a;
    cz += (p1[2] + p2[2]) * a;
  }
  signedArea *= 0.5;
  if (Math.abs(signedArea) < 1e-6) return [0, 0];
  cx /= (6 * signedArea);
  cz /= (6 * signedArea);
  return [Number(cx.toFixed(2)), Number(cz.toFixed(2))];
}

console.log('=== PBR VITS AUTHORITATIVE GIS BUILDINGS AUDIT ===');
console.log('Origin:', PBR_VITS_ORIGIN);
console.log('Total buildings:', buildingsData.features.length);

const summary = [];

buildingsData.features.forEach((feat, idx) => {
  const props = feat.properties;
  const ring = feat.geometry.coordinates[0];
  const area = polygonArea(ring);
  const centroidLocal = polygonCentroid(ring);
  const localRing = ring.map(pt => wgs84ToLocal(pt[0], pt[1]));

  // Derived bounding dimensions
  const xs = localRing.map(p => p[0]);
  const zs = localRing.map(p => p[2]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minZ = Math.min(...zs), maxZ = Math.max(...zs);
  const width = Number((maxX - minX).toFixed(2));
  const depth = Number((maxZ - minZ).toFixed(2));

  summary.push({
    id: feat.id,
    name: props.name,
    category: props.category,
    source: props.source,
    status: props.verificationStatus,
    cornerCount: ring.length,
    areaSqm: Number(area.toFixed(1)),
    derivedWidth: width,
    derivedDepth: depth,
    height: props.height,
    centroidLngLat: props.centroid,
    centroidLocal: centroidLocal,
    cornersWGS84: ring,
    cornersLocal: localRing
  });
});

console.log(JSON.stringify(summary, null, 2));
