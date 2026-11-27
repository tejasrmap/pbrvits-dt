const https = require('https');

const query = `[out:json][timeout:30];
(
  way["building"](14.911,79.980,14.916,79.988);
  way["leisure"](14.911,79.980,14.916,79.988);
  way["highway"](14.911,79.980,14.916,79.988);
  way["amenity"](14.911,79.980,14.916,79.988);
);
out body;
>;
out skel qt;`;

const url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query);

console.log('Querying Overpass API for PBR VITS bounding box...');

const req = https.get(url, { headers: { 'User-Agent': 'PBRVITS-DigitalTwin-Research/1.0' } }, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      console.log('Total OSM elements:', data.elements ? data.elements.length : 0);
      const nodes = new Map();
      data.elements.filter(e => e.type === 'node').forEach(n => nodes.set(n.id, { lat: n.lat, lon: n.lon }));

      const ways = data.elements.filter(e => e.type === 'way');
      console.log('Ways found:', ways.length);

      ways.forEach(w => {
        const coords = (w.nodes || []).map(nid => nodes.get(nid)).filter(Boolean);
        console.log(`Way ${w.id}: tags=${JSON.stringify(w.tags || {})}, nodeCount=${coords.length}`);
        if (coords.length > 0) {
          console.log(`   First coord: [${coords[0].lon}, ${coords[0].lat}]`);
        }
      });
    } catch (e) {
      console.error('Failed to parse Overpass response:', e.message);
      console.log('Response head:', body.slice(0, 500));
    }
  });
});

req.on('error', (err) => console.error('Request failed:', err.message));
