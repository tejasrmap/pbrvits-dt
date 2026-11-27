const fs = require('fs');
const xml = fs.readFileSync('osm_bbox.xml', 'utf8');

// Parse nodes
const nodes = {};
const nodeRegex = /<node id="(\d+)"[^>]*lat="([^"]+)"[^>]*lon="([^"]+)"/g;
let m;
while ((m = nodeRegex.exec(xml)) !== null) {
  nodes[m[1]] = { lat: parseFloat(m[2]), lon: parseFloat(m[3]) };
}

// Also handle lon before lat
const nodeRegex2 = /<node id="(\d+)"[^>]*lon="([^"]+)"[^>]*lat="([^"]+)"/g;
while ((m = nodeRegex2.exec(xml)) !== null) {
  nodes[m[1]] = { lat: parseFloat(m[3]), lon: parseFloat(m[2]) };
}

console.log('Total nodes indexed:', Object.keys(nodes).length);

const wayBlocks = xml.split('</way>');
console.log('Total way blocks:', wayBlocks.length - 1);

const parsedWays = [];
for (let wb of wayBlocks) {
  const wayMatch = wb.match(/<way id="(\d+)"/);
  if (!wayMatch) continue;
  const id = wayMatch[1];
  
  const ndMatches = [...wb.matchAll(/<nd ref="(\d+)"/g)].map(x => x[1]);
  const tagMatches = [...wb.matchAll(/<tag k="([^"]+)" v="([^"]+)"/g)];
  const tags = {};
  for (let t of tagMatches) tags[t[1]] = t[2];
  
  const coords = ndMatches.map(ref => nodes[ref]).filter(Boolean);
  parsedWays.push({ id, tags, coordsCount: coords.length, coords });
}

console.log('\n--- BUILDINGS, AMENITIES & CAMPUS BOUNDARIES ---');
for (let w of parsedWays) {
  if (w.tags.building || w.tags.amenity || w.tags.leisure || (w.tags.name && !w.tags.highway)) {
    console.log(`\nWay ID: ${w.id}`);
    console.log(`Tags:`, JSON.stringify(w.tags));
    console.log(`Points count: ${w.coords.length}`);
    if (w.coords.length > 0) {
      console.log(`First point: [${w.coords[0].lon}, ${w.coords[0].lat}]`);
      // Compute centroid
      const cLon = w.coords.reduce((a, b) => a + b.lon, 0) / w.coords.length;
      const cLat = w.coords.reduce((a, b) => a + b.lat, 0) / w.coords.length;
      console.log(`Centroid: [${cLon.toFixed(7)}, ${cLat.toFixed(7)}]`);
      console.log(`Coordinates:`, JSON.stringify(w.coords.map(c => [c.lon, c.lat])));
    }
  }
}

// Also check tagged nodes (e.g. amenity=college, school, etc.)
console.log('\n--- TAGGED NODES ---');
const nodeBlocks = xml.split('</node>');
for (let nb of nodeBlocks) {
  const nodeMatch = nb.match(/<node id="(\d+)"[^>]*lat="([^"]+)"[^>]*lon="([^"]+)"/);
  if (!nodeMatch) continue;
  const tagMatches = [...nb.matchAll(/<tag k="([^"]+)" v="([^"]+)"/g)];
  if (tagMatches.length > 0) {
    const tags = {};
    for (let t of tagMatches) tags[t[1]] = t[2];
    console.log(`Node ${nodeMatch[1]} at [${nodeMatch[3]}, ${nodeMatch[2]}]:`, JSON.stringify(tags));
  }
}
