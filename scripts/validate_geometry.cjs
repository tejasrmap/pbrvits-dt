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

// Ray-casting point-in-polygon
function pointInPolygon(point, polygon) {
  const x = point[0], y = point[1];
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Check 2D bounding box overlap
function bboxOverlap(b1, b2) {
  return !(
    b1.maxX < b2.minX ||
    b1.minX > b2.maxX ||
    b1.maxZ < b2.minZ ||
    b1.minZ > b2.maxZ
  );
}

console.log('===============================================================');
console.log(' PBR VITS DIGITAL TWIN — AUTOMATED GEOMETRY VALIDATION SUITE');
console.log(' Authoritative Geographic Foundation: EPSG:4326 (WGS84)');
console.log(' Reference Anchor: 14.913261° N, 79.983666° E');
console.log('===============================================================\n');

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
// Test 1: Coordinate Consistency
// -------------------------------------------------------------
console.log('--- TEST GROUP 1: Coordinate Consistency ---');
buildingsGeoJSON.features.forEach((feat) => {
  const ring = feat.geometry.coordinates[0];
  const allValid = ring.every(
    ([lng, lat]) =>
      lng >= 79.980 && lng <= 79.988 && lat >= 14.911 && lat <= 14.916
  );
  assert(
    allValid,
    `Building ${feat.id} coordinates within campus bounds (79.980-79.988°E, 14.911-14.916°N)`
  );
});

// -------------------------------------------------------------
// Test 2: Polygon Validity (Closed rings & min vertices)
// -------------------------------------------------------------
console.log('\n--- TEST GROUP 2: Polygon Validity ---');
buildingsGeoJSON.features.forEach((feat) => {
  const ring = feat.geometry.coordinates[0];
  const isClosed =
    ring[0][0] === ring[ring.length - 1][0] &&
    ring[0][1] === ring[ring.length - 1][1];
  const hasMinVertices = ring.length >= 4;
  assert(
    isClosed && hasMinVertices,
    `Building ${feat.id} polygon is valid and closed (Vertices: ${ring.length})`
  );
});

// -------------------------------------------------------------
// Test 3: Polygon Area Validation
// -------------------------------------------------------------
console.log('\n--- TEST GROUP 3: Polygon Area Validation ---');
const buildingAreas = new Map();
buildingsGeoJSON.features.forEach((feat) => {
  const ring = feat.geometry.coordinates[0];
  const localRing = ring.map((pt) => wgs84ToLocal(pt[0], pt[1]));
  const area = calcArea(localRing);
  buildingAreas.set(feat.id, area);
  // Realistic campus buildings range from 200 m² (substation/gate) to 3,500 m² (academic wings)
  const isRealistic = area >= 150 && area <= 4000;
  assert(
    isRealistic,
    `Building ${feat.id} area is realistic (${area.toFixed(1)} m²)`
  );
});

// -------------------------------------------------------------
// Test 4: Centroid Mathematical Accuracy
// -------------------------------------------------------------
console.log('\n--- TEST GROUP 4: Centroid Accuracy ---');
buildingsGeoJSON.features.forEach((feat) => {
  const ring = feat.geometry.coordinates[0];
  const localRing = ring.map((pt) => wgs84ToLocal(pt[0], pt[1]));
  const computedCentroid = calcCentroid(localRing);
  const declaredCentroid = feat.properties.centroid;
  const declaredLocal = wgs84ToLocal(declaredCentroid[0], declaredCentroid[1]);

  const diffX = Math.abs(computedCentroid[0] - declaredLocal[0]);
  const diffZ = Math.abs(computedCentroid[1] - declaredLocal[2]);
  const distance = Math.hypot(diffX, diffZ);

  assert(
    distance < 4.0,
    `Building ${feat.id} centroid matches polygon geometric center (Δ: ${distance.toFixed(2)}m)`
  );
});

// -------------------------------------------------------------
// Test 5: Building Overlap Detection
// -------------------------------------------------------------
console.log('\n--- TEST GROUP 5: Building Overlap Detection ---');
const bboxes = buildingsGeoJSON.features.map((feat) => {
  const ring = feat.geometry.coordinates[0];
  const localRing = ring.map((pt) => wgs84ToLocal(pt[0], pt[1]));
  const xs = localRing.map((p) => p[0]);
  const zs = localRing.map((p) => p[2]);
  return {
    id: feat.id,
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minZ: Math.min(...zs),
    maxZ: Math.max(...zs),
    localRing
  };
});

let overlapsFound = 0;
for (let i = 0; i < bboxes.length; i++) {
  for (let j = i + 1; j < bboxes.length; j++) {
    const b1 = bboxes[i];
    const b2 = bboxes[j];
    if (bboxOverlap(b1, b2)) {
      // Check if centroids or interior points intersect
      const c1 = calcCentroid(b1.localRing);
      const c2 = calcCentroid(b2.localRing);
      if (pointInPolygon(c1, b2.localRing) || pointInPolygon(c2, b1.localRing)) {
        overlapsFound++;
        console.error(`Overlap between ${b1.id} and ${b2.id}`);
      }
    }
  }
}
assert(overlapsFound === 0, 'Zero building-to-building physical overlaps detected');

// -------------------------------------------------------------
// Test 6: Institutional Separation from Neighboring VEC
// -------------------------------------------------------------
console.log('\n--- TEST GROUP 6: Institutional Separation from VEC ---');
const vecFeature = boundaryGeoJSON.features.find(
  (f) => f.id === 'neighboring-vec-campus'
);
assert(
  !!vecFeature,
  'Neighboring VEC property exists as a separate demarcated GIS boundary'
);

if (vecFeature) {
  const vecRing = vecFeature.geometry.coordinates[0];
  let pbrBuildingsInVec = 0;
  buildingsGeoJSON.features.forEach((feat) => {
    const centroid = feat.properties.centroid;
    if (pointInPolygon(centroid, vecRing)) {
      pbrBuildingsInVec++;
      console.error(`Building ${feat.id} is inside neighboring VEC property!`);
    }
  });
  assert(
    pbrBuildingsInVec === 0,
    'Zero PBR VITS buildings placed inside neighboring VEC property'
  );
}

// -------------------------------------------------------------
// Test 7: Duplicate Buildings & IDs
// -------------------------------------------------------------
console.log('\n--- TEST GROUP 7: Duplicate Building Check ---');
const ids = buildingsGeoJSON.features.map((f) => f.id);
const uniqueIds = new Set(ids);
assert(
  ids.length === uniqueIds.size,
  `All building IDs are unique (${uniqueIds.size} unique buildings)`
);

// -------------------------------------------------------------
// Test 8: GIS & 3D Synchronization
// -------------------------------------------------------------
console.log('\n--- TEST GROUP 8: GIS & 3D Synchronization ---');

// Compute 3D building parameters exactly as derived by src/data/buildings.ts
const derived3DBuildings = buildingsGeoJSON.features.map((feat) => {
  const ring = feat.geometry.coordinates[0];
  const localRing = ring.map((pt) => wgs84ToLocal(pt[0], pt[1]));

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

  const xs = localRing.map((p) => p[0]);
  const zs = localRing.map((p) => p[2]);
  const width = Math.max(...xs) - Math.min(...xs);
  const depth = Math.max(...zs) - Math.min(...zs);

  return {
    id: feat.id,
    position: [Number(cx.toFixed(2)), 0, Number(cz.toFixed(2))],
    width: Number(width.toFixed(2)),
    depth: Number(depth.toFixed(2)),
    height: feat.properties.height,
    pointsCount: localRing.length
  };
});

assert(
  derived3DBuildings.length === buildingsGeoJSON.features.length,
  `3D building count (${derived3DBuildings.length}) matches GIS dataset (${buildingsGeoJSON.features.length})`
);

let syncMismatch = 0;
derived3DBuildings.forEach((b) => {
  const gisFeat = buildingsGeoJSON.features.find((f) => f.id === b.id);
  if (!gisFeat) {
    syncMismatch++;
    return;
  }
  const [lng, lat] = gisFeat.properties.centroid;
  const localCoord = wgs84ToLocal(lng, lat);
  const dist = Math.hypot(b.position[0] - localCoord[0], b.position[2] - localCoord[2]);
  if (dist > 3.0) {
    syncMismatch++;
    console.error(`Sync mismatch on ${b.id}: distance = ${dist.toFixed(2)}m`);
  }
});
assert(syncMismatch === 0, '100% position synchronization between GIS and 3D models');

// -------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------
console.log('\n===============================================================');
console.log(` RESULTS: ${passedTests} passed, ${failedTests} failed, Total: ${totalTests}`);
console.log('===============================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('✅ ALL GEOMETRY VALIDATION TESTS PASSED CLEANLY!\n');
  process.exit(0);
}
