const fs = require('fs');
const path = require('path');

const buildingsGeoJSON = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/data/gis/buildings.json'), 'utf8')
);
const boundaryGeoJSON = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/data/gis/campus-boundary.json'), 'utf8')
);

const PBR_VITS_ORIGIN = { lat: 14.913261, lng: 79.983666 };
const METERS_PER_DEG_LAT = 111319.9;
const METERS_PER_DEG_LNG = 111319.9 * Math.cos((PBR_VITS_ORIGIN.lat * Math.PI) / 180);

function wgs84ToLocal(lng, lat, elevation = 0) {
  const x = (lng - PBR_VITS_ORIGIN.lng) * METERS_PER_DEG_LNG;
  const z = -(lat - PBR_VITS_ORIGIN.lat) * METERS_PER_DEG_LAT;
  return [Number(x.toFixed(2)), elevation, Number(z.toFixed(2))];
}

// 2D Polygon area via shoelace formula
function calcArea(coordsLocal) {
  let area = 0;
  for (let i = 0; i < coordsLocal.length - 1; i++) {
    const p1 = coordsLocal[i];
    const p2 = coordsLocal[i + 1];
    area += p1[0] * p2[2] - p2[0] * p1[2];
  }
  return Math.abs(area) * 0.5;
}

// 2D Polygon centroid
function calcCentroid(coordsLocal) {
  let cx = 0;
  let cz = 0;
  let signedArea = 0;
  for (let i = 0; i < coordsLocal.length - 1; i++) {
    const p1 = coordsLocal[i];
    const p2 = coordsLocal[i + 1];
    const a = p1[0] * p2[2] - p2[0] * p1[2];
    signedArea += a;
    cx += (p1[0] + p2[0]) * a;
    cz += (p1[2] + p2[2]) * a;
  }
  signedArea *= 0.5;
  if (Math.abs(signedArea) < 1e-6) return [0, 0];
  cx /= 6 * signedArea;
  cz /= 6 * signedArea;
  return [Number(cx.toFixed(2)), Number(cz.toFixed(2))];
}

// Check counter-clockwise orientation
function isCounterClockwise(ring) {
  let sum = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const p1 = ring[i];
    const p2 = ring[i + 1];
    sum += (p2[0] - p1[0]) * (p2[1] + p1[1]);
  }
  return sum < 0;
}

// 2D segment intersection
function ccw(A, B, C) {
  return (C[1] - A[1]) * (B[0] - A[0]) > (B[1] - A[1]) * (C[0] - A[0]);
}

function segmentsIntersect(A, B, C, D) {
  return ccw(A, C, D) !== ccw(B, C, D) && ccw(A, B, C) !== ccw(A, B, D);
}

// Ray-casting point-in-polygon
function pointInPolygon(point, polygon) {
  const x = point[0], y = point[1];
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const intersect = ((yi > y) !== (yj > y)) &&
      (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Strict Polygon-Polygon Intersection (Edges Crossing + Vertex Containment)
function polygonsIntersect(polyA, polyB) {
  for (let i = 0; i < polyA.length - 1; i++) {
    for (let j = 0; j < polyB.length - 1; j++) {
      if (segmentsIntersect(polyA[i], polyA[i + 1], polyB[j], polyB[j + 1])) {
        return true;
      }
    }
  }
  for (let i = 0; i < polyA.length - 1; i++) {
    if (pointInPolygon(polyA[i], polyB)) return true;
  }
  for (let j = 0; j < polyB.length - 1; j++) {
    if (pointInPolygon(polyB[j], polyA)) return true;
  }
  return false;
}

console.log('======================================================================');
console.log(' PBR VITS DIGITAL TWIN — RIGOROUS GEOMETRY VALIDATION SUITE');
console.log(' Authoritative Geographic Foundation: EPSG:4326 (WGS84)');
console.log(' Anchor: 14.913261° N, 79.983666° E (Kavali, AP, India)');
console.log('======================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${testName} — ${details}`);
  }
}

// -------------------------------------------------------------
// SUITE A: GeoJSON Validity & Topology
// -------------------------------------------------------------
console.log('--- SUITE A: GeoJSON Topology & Validity ---');
buildingsGeoJSON.features.forEach((feat) => {
  const geom = feat.geometry;
  assert(geom.type === 'Polygon', `${feat.id}: Geometry type is Polygon`);

  const ring = geom.coordinates[0];
  const isClosed =
    ring.length >= 4 &&
    Math.hypot(ring[0][0] - ring[ring.length - 1][0], ring[0][1] - ring[ring.length - 1][1]) < 1e-7;
  assert(isClosed, `${feat.id}: Closed linear ring with $\\ge 4$ points (Vertices: ${ring.length})`);

  // Bounding range
  const validRange = ring.every(
    ([lng, lat]) => lng >= 79.980 && lng <= 79.988 && lat >= 14.911 && lat <= 14.916
  );
  assert(validRange, `${feat.id}: Coordinates within campus geographic bounds`);

  // No zero-length edges
  let hasZeroEdges = false;
  for (let i = 0; i < ring.length - 1; i++) {
    const d = Math.hypot(ring[i][0] - ring[i + 1][0], ring[i][1] - ring[i + 1][1]);
    if (d < 1e-7) hasZeroEdges = true;
  }
  assert(!hasZeroEdges, `${feat.id}: Zero-length edge check`);

  // Self-intersection check
  let selfIntersects = false;
  for (let i = 0; i < ring.length - 1; i++) {
    for (let j = i + 2; j < ring.length - 1; j++) {
      if (i === 0 && j === ring.length - 2) continue; // adjacent closing edge
      if (segmentsIntersect(ring[i], ring[i + 1], ring[j], ring[j + 1])) {
        selfIntersects = true;
      }
    }
  }
  assert(!selfIntersects, `${feat.id}: Simple polygon (zero self-intersections)`);
});

// -------------------------------------------------------------
// SUITE B: Rigorous Pairwise Building Overlap Tests
// -------------------------------------------------------------
console.log('\n--- SUITE B: Physical Building Overlap Tests ---');
let overlapCount = 0;
for (let i = 0; i < buildingsGeoJSON.features.length; i++) {
  for (let j = i + 1; j < buildingsGeoJSON.features.length; j++) {
    const b1 = buildingsGeoJSON.features[i];
    const b2 = buildingsGeoJSON.features[j];
    const r1 = b1.geometry.coordinates[0];
    const r2 = b2.geometry.coordinates[0];
    if (polygonsIntersect(r1, r2)) {
      overlapCount++;
      console.error(`Overlap between ${b1.id} and ${b2.id}!`);
    }
  }
}
assert(
  overlapCount === 0,
  `Zero physical building overlaps across all ${buildingsGeoJSON.features.length * (buildingsGeoJSON.features.length - 1) / 2} pairs`
);

// -------------------------------------------------------------
// SUITE C: Campus Containment & Institutional Separation
// -------------------------------------------------------------
console.log('\n--- SUITE C: Campus Containment & Separation from VEC ---');
const academicFeat = boundaryGeoJSON.features.find((f) => f.id === 'pbr-vits-academic-boundary');
const sportsFeat = boundaryGeoJSON.features.find((f) => f.id === 'pbr-vits-playground-boundary');
const overallFeat = boundaryGeoJSON.features.find((f) => f.id === 'pbr-vits-overall-boundary');
const vecFeat = boundaryGeoJSON.features.find((f) => f.id === 'neighboring-vec-campus');

assert(!!academicFeat, 'PBR VITS Academic Boundary exists (OSM Way 1297901220)');
assert(!!sportsFeat, 'PBR VITS Athletic Boundary exists (OSM Way 1297896001)');
assert(!!overallFeat, 'PBR VITS Campus Perimeter exists (Synthesized boundary)');
assert(!!vecFeat, 'Neighboring VEC Property exists as a separate demarcated parcel (OSM Way 1297901221)');

const academicRing = academicFeat ? academicFeat.geometry.coordinates[0] : [];
const overallRing = overallFeat ? overallFeat.geometry.coordinates[0] : [];
const vecRing = vecFeat ? vecFeat.geometry.coordinates[0] : [];

let pbrInVecCount = 0;
let outsideOverallCount = 0;

buildingsGeoJSON.features.forEach((feat) => {
  const centroid = feat.properties.centroid;
  const inVec = pointInPolygon(centroid, vecRing);
  const inOverall = pointInPolygon(centroid, overallRing);

  if (inVec) {
    pbrInVecCount++;
    console.error(`Building ${feat.id} centroid lies inside neighboring VEC!`);
  }

  if (!inOverall) {
    outsideOverallCount++;
    console.error(`Building ${feat.id} lies outside PBR VITS campus perimeter!`);
  }
});

assert(pbrInVecCount === 0, 'Zero PBR VITS buildings placed inside neighboring VEC property');
assert(outsideOverallCount === 0, 'All 14 PBR VITS buildings contained within campus perimeter');

// Test that core academic quadrangle buildings sit within the official academic parcel
const coreAcademicIds = ['admin-block', 'central-library', 'ece-eee-block', 'mech-civil-block', 'sh-mba-block', 'canteen-cafeteria'];
let coreAcademicInParcel = true;
coreAcademicIds.forEach((id) => {
  const feat = buildingsGeoJSON.features.find((f) => f.id === id);
  if (feat && !pointInPolygon(feat.properties.centroid, academicRing)) {
    coreAcademicInParcel = false;
    console.error(`Core academic building ${id} is outside academic boundary polygon!`);
  }
});
assert(coreAcademicInParcel, 'Core academic blocks reside within official academic boundary (Way 1297901220)');

// Test boundary non-overlap: Overall boundary must not intersect VEC parcel
assert(
  !polygonsIntersect(overallRing, vecRing),
  'PBR VITS Campus Perimeter strictly separated from VEC (Zero polygon intersection)'
);

// -------------------------------------------------------------
// SUITE D: GIS-to-3D Geometry & Vertex Consistency
// -------------------------------------------------------------
console.log('\n--- SUITE D: GIS-to-3D Geometry & Vertex Consistency ---');

buildingsGeoJSON.features.forEach((feat) => {
  const ringWGS84 = feat.geometry.coordinates[0];
  const localRing = ringWGS84.map((pt) => wgs84ToLocal(pt[0], pt[1]));

  // 1. Centroid calculation
  const computedCentroid = calcCentroid(localRing);
  const declaredCentroid = feat.properties.centroid;
  const declaredLocal = wgs84ToLocal(declaredCentroid[0], declaredCentroid[1]);
  const centroidDelta = Math.hypot(
    computedCentroid[0] - declaredLocal[0],
    computedCentroid[1] - declaredLocal[2]
  );
  assert(
    centroidDelta < 2.0,
    `${feat.id}: Centroid delta < 2m (Δ: ${centroidDelta.toFixed(2)}m)`
  );

  // 2. Footprint area consistency
  const areaLocal = calcArea(localRing);
  assert(
    areaLocal >= 150 && areaLocal <= 4000,
    `${feat.id}: Realistic footprint area (${areaLocal.toFixed(1)} m²)`
  );

  // 3. Vertex count consistency
  assert(
    localRing.length === ringWGS84.length,
    `${feat.id}: 1:1 vertex count correspondence (Vertices: ${localRing.length})`
  );

  // 4. Bounding box dimensions
  const xs = localRing.map((p) => p[0]);
  const zs = localRing.map((p) => p[2]);
  const width = Math.max(...xs) - Math.min(...xs);
  const depth = Math.max(...zs) - Math.min(...zs);
  assert(
    width > 5 && depth > 5 && feat.properties.height > 3,
    `${feat.id}: Valid 3D physical dimensions (${width.toFixed(1)}m x ${depth.toFixed(1)}m x ${feat.properties.height}m)`
  );
});

// -------------------------------------------------------------
// SUITE E: Evidence & Classification Validation
// -------------------------------------------------------------
console.log('\n--- SUITE E: Evidence & Verification Status Consistency ---');
let falseVerifiedCount = 0;
let missingSourceCount = 0;

buildingsGeoJSON.features.forEach((feat) => {
  const props = feat.properties;
  const source = props.source || '';
  const status = props.verificationStatus;

  if (!source || source.trim().length === 0) {
    missingSourceCount++;
    console.error(`Building ${feat.id} is missing a documented source!`);
  }

  // Prevent estimated data from being labeled VERIFIED
  const isEstimatedSource =
    source.toLowerCase().includes('satellite') ||
    source.toLowerCase().includes('estimated') ||
    source.toLowerCase().includes('sector') ||
    source.toLowerCase().includes('vicinity');

  if (isEstimatedSource && (status === 'VERIFIED' || status === 'OSM-MAPPED')) {
    // Only if it doesn't cite an OSM way
    if (!source.toLowerCase().includes('way')) {
      falseVerifiedCount++;
      console.error(`Building ${feat.id} has estimated source '${source}' but is labeled '${status}'!`);
    }
  }
});

assert(missingSourceCount === 0, 'Every mapped building has a documented geographic source');
assert(falseVerifiedCount === 0, 'Zero estimated buildings are mislabeled as VERIFIED or OSM-MAPPED');

// -------------------------------------------------------------
// SUITE F: Final Acceptance Classification & Accuracy Guardrails
// -------------------------------------------------------------
console.log('\n--- SUITE F: Final Acceptance Classification & Accuracy Guardrails ---');

const alignedAcademic = buildingsGeoJSON.features.filter(
  (f) => f.properties.alignmentStatus === 'ALIGNED' && f.properties.id !== 'main-gate'
);
const alignedInfra = buildingsGeoJSON.features.filter(
  (f) => f.properties.alignmentStatus === 'ALIGNED' && f.properties.id === 'main-gate'
);
const partialFacilities = buildingsGeoJSON.features.filter(
  (f) => f.properties.alignmentStatus === 'PARTIALLY ALIGNED'
);
const unverifiedHostels = buildingsGeoJSON.features.filter(
  (f) => f.properties.alignmentStatus === 'UNVERIFIED'
);

assert(alignedAcademic.length === 4, `Exactly 4 ALIGNED academic building footprints (Found: ${alignedAcademic.length})`);
assert(alignedInfra.length === 1, `Exactly 1 ALIGNED gateway infrastructure portal (Found: ${alignedInfra.length})`);
assert(partialFacilities.length === 7, `Exactly 7 PARTIALLY ALIGNED zonal facilities (Found: ${partialFacilities.length})`);
assert(unverifiedHostels.length === 2, `Exactly 2 UNVERIFIED excluded residential hostels (Found: ${unverifiedHostels.length})`);

// Explicit check for sports-pavilion
const sportsPavilion = buildingsGeoJSON.features.find((f) => f.id === 'sports-pavilion');
assert(
  sportsPavilion && sportsPavilion.properties.alignmentStatus === 'PARTIALLY ALIGNED',
  'sports-pavilion remains PARTIALLY ALIGNED until physical footprint is independently identified'
);

// Hostels must be unverified and excluded
const boysHostel = buildingsGeoJSON.features.find((f) => f.id === 'boys-hostel');
const girlsHostel = buildingsGeoJSON.features.find((f) => f.id === 'girls-hostel');
assert(boysHostel && boysHostel.properties.alignmentStatus === 'UNVERIFIED', 'boys-hostel status is UNVERIFIED');
assert(girlsHostel && girlsHostel.properties.alignmentStatus === 'UNVERIFIED', 'girls-hostel status is UNVERIFIED');

// -------------------------------------------------------------
// SUMMARY & VERDICT
// -------------------------------------------------------------
console.log('\n======================================================================');
console.log(` VALIDATION SUMMARY: ${passedTests} passed, ${failedTests} failed, Total: ${totalTests}`);
console.log('======================================================================');

if (failedTests > 0) {
  console.error('\n❌ VALIDATION FAILED: Correct the geometry errors above before proceeding.');
  process.exit(1);
} else {
  console.log('\n✅ ALL GEOMETRIC, TOPOLOGICAL, CONTAINMENT & EVIDENCE TESTS PASSED!\n');
  process.exit(0);
}
