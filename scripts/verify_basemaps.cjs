const https = require('https');

// Sample tile coordinates at zoom 17 around PBR VITS (lat: 14.913261, lng: 79.983666)
// z = 17, x = 94657, y = 59287
const tileTests = [
  {
    name: 'OpenStreetMap Streets',
    url: 'https://tile.openstreetmap.org/17/94657/59287.png',
    headers: { 'User-Agent': 'PBRVITS-DigitalTwin-Audit/1.0' }
  },
  {
    name: 'ESRI World Imagery',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/17/59287/94657',
    headers: { 'User-Agent': 'PBRVITS-DigitalTwin-Audit/1.0' }
  },
  {
    name: 'OpenTopoMap',
    url: 'https://tile.opentopomap.org/17/94657/59287.png',
    headers: { 'User-Agent': 'PBRVITS-DigitalTwin-Audit/1.0' }
  },
  {
    name: 'CartoDB Positron',
    url: 'https://basemaps.cartocdn.com/light_all/17/94657/59287.png',
    headers: { 'User-Agent': 'PBRVITS-DigitalTwin-Audit/1.0' }
  }
];

function checkTile(tile) {
  return new Promise((resolve) => {
    const req = https.get(tile.url, { headers: tile.headers }, (res) => {
      resolve({
        name: tile.name,
        url: tile.url,
        statusCode: res.statusCode,
        contentType: res.headers['content-type'],
        status: res.statusCode >= 200 && res.statusCode < 300 ? 'PASS' : 'FAIL'
      });
    });
    req.on('error', (e) => {
      resolve({ name: tile.name, url: tile.url, statusCode: 0, error: e.message, status: 'FAIL' });
    });
  });
}

async function run() {
  const results = [];
  for (const t of tileTests) {
    results.push(await checkTile(t));
  }
  console.log(JSON.stringify(results, null, 2));
}

run();
