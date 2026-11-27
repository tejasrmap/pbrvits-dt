const fs = require('fs');
const path = require('path');
const http = require('http');
const puppeteer = require('puppeteer-core');

function findChrome() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
    path.join(process.env.PROGRAMFILES || '', 'Google', 'Chrome', 'Application', 'chrome.exe')
  ];
  for (const c of candidates) {
    if (c && fs.existsSync(c)) return c;
  }
  throw new Error('Chrome not found');
}

const distDir = path.resolve(__dirname, '..', 'dist');
const outputDir = path.resolve(__dirname, '..', 'public', 'audit', 'footprint_alignment');
const artifactDir = 'C:\\Users\\tejag\\.gemini\\antigravity\\brain\\6c1052ac-5172-424c-ae6b-d2ed8b9d72b9\\audit\\footprint_alignment';

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
if (!fs.existsSync(artifactDir)) fs.mkdirSync(artifactDir, { recursive: true });

function copyToArtifact(filename) {
  const src = path.join(outputDir, filename);
  const dest = path.join(artifactDir, filename);
  const destSubdir = path.dirname(dest);
  if (!fs.existsSync(destSubdir)) fs.mkdirSync(destSubdir, { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`Copied ${filename} to artifact directory.`);
}

// Simple static HTTP server for dist/
function startServer(port = 8089) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.mjs': 'text/javascript'
  };

  const server = http.createServer((req, res) => {
    let filePath = path.join(distDir, req.url.split('?')[0]);
    if (filePath.endsWith(path.sep) || fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    if (!fs.existsSync(filePath)) {
      filePath = path.join(distDir, 'index.html');
    }

    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading ' + req.url);
      } else {
        res.writeHead(200, {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*'
        });
        res.end(content, 'utf-8');
      }
    });
  });

  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => {
      console.log(`Local test server running on http://127.0.0.1:${port}`);
      resolve(server);
    });
  });
}

const buildingsData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'src', 'data', 'gis', 'buildings.json'), 'utf8'));

async function run() {
  const server = await startServer(8089);
  const targetUrl = 'http://127.0.0.1:8089/?audit=true';

  const chromePath = findChrome();
  console.log(`Launching Chrome (${chromePath}) for Footprint Alignment Visual Evidence Audit...`);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--use-gl=angle',
      '--use-angle=d3d11',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--window-size=1920,1080'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

  console.log('Navigating to', targetUrl);
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForFunction(() => typeof window.useCampusStore !== 'undefined', { timeout: 20000 });
  await new Promise(r => setTimeout(r, 4000));

  // Ensure satellite mode and pitch 0
  await page.evaluate(() => {
    window.useCampusStore.getState().setAppViewMode('satellite');
    if (window.gisMapInstance) {
      window.gisMapInstance.setPitch(0);
      window.gisMapInstance.setBearing(0);
    }
  });
  await new Promise(r => setTimeout(r, 4500));

  // 1. Full campus satellite with all footprints
  console.log('Capturing 01-full-campus-satellite-audit.png...');
  await page.evaluate(() => {
    if (window.gisMapInstance) {
      window.gisMapInstance.flyTo({
        center: [79.9835, 14.9132],
        zoom: 17.0,
        pitch: 0,
        bearing: 0,
        essential: true
      });
    }
  });
  await new Promise(r => setTimeout(r, 5000));
  await page.screenshot({ path: path.join(outputDir, '01-full-campus-satellite-audit.png') });
  copyToArtifact('01-full-campus-satellite-audit.png');

  // 2. Northern/western building alignment close-up
  console.log('Capturing 02-northwest-sector-audit.png...');
  await page.evaluate(() => {
    if (window.gisMapInstance) {
      window.gisMapInstance.flyTo({
        center: [79.9826, 14.9139],
        zoom: 17.6,
        pitch: 0,
        bearing: 0,
        essential: true
      });
    }
  });
  await new Promise(r => setTimeout(r, 4500));
  await page.screenshot({ path: path.join(outputDir, '02-northwest-sector-audit.png') });
  copyToArtifact('02-northwest-sector-audit.png');

  // 3. Playground and academic boundary alignment
  console.log('Capturing 03-playground-and-academic-boundary.png...');
  await page.evaluate(() => {
    if (window.gisMapInstance) {
      window.gisMapInstance.flyTo({
        center: [79.9824, 14.9131],
        zoom: 17.5,
        pitch: 0,
        bearing: 0,
        essential: true
      });
    }
  });
  await new Promise(r => setTimeout(r, 4500));
  await page.screenshot({ path: path.join(outputDir, '03-playground-and-academic-boundary.png') });
  copyToArtifact('03-playground-and-academic-boundary.png');

  // 4. Central academic buildings close-up
  console.log('Capturing 04-central-academic-cluster.png...');
  await page.evaluate(() => {
    if (window.gisMapInstance) {
      window.gisMapInstance.flyTo({
        center: [79.9835, 14.9133],
        zoom: 17.8,
        pitch: 0,
        bearing: 0,
        essential: true
      });
    }
  });
  await new Promise(r => setTimeout(r, 4500));
  await page.screenshot({ path: path.join(outputDir, '04-central-academic-cluster.png') });
  copyToArtifact('04-central-academic-cluster.png');

  // 5. Eastern academic boundary and VEC separation
  console.log('Capturing 05-eastern-boundary-vec-separation.png...');
  await page.evaluate(() => {
    if (window.gisMapInstance) {
      window.gisMapInstance.flyTo({
        center: [79.9845, 14.9136],
        zoom: 17.2,
        pitch: 0,
        bearing: 0,
        essential: true
      });
    }
  });
  await new Promise(r => setTimeout(r, 4500));
  await page.screenshot({ path: path.join(outputDir, '05-eastern-boundary-vec-separation.png') });
  copyToArtifact('05-eastern-boundary-vec-separation.png');

  // 6. Individual footprint comparisons for all 14 features
  console.log('Capturing individual building footprints...');
  const indivDir = path.join(outputDir, 'individual');
  if (!fs.existsSync(indivDir)) fs.mkdirSync(indivDir, { recursive: true });

  for (const feat of buildingsData.features) {
    const id = feat.properties.id;
    const [cLng, cLat] = feat.properties.centroid;
    console.log(`Capturing footprint close-up for ${id}...`);

    await page.evaluate((lng, lat) => {
      if (window.gisMapInstance) {
        window.gisMapInstance.flyTo({
          center: [lng, lat],
          zoom: 17.8,
          pitch: 0,
          bearing: 0,
          essential: true
        });
      }
    }, cLng, cLat);

    await new Promise(r => setTimeout(r, 3500));
    const filename = `individual/${id}-ortho.png`;
    await page.screenshot({ path: path.join(outputDir, filename) });
    copyToArtifact(filename);
  }

  // 7. Corrected satellite overlay (verified only toggle active)
  console.log('Capturing 07-corrected-satellite-overlay.png...');
  await page.evaluate(() => {
    const map = window.gisMapInstance;
    if (map) {
      // Show verified only
      if (map.getLayer('campus-buildings-verified-fill')) {
        map.setLayoutProperty('campus-buildings-verified-fill', 'visibility', 'visible');
        map.setLayoutProperty('campus-buildings-verified-stroke', 'visibility', 'visible');
      }
      if (map.getLayer('campus-buildings-estimated-fill')) {
        map.setLayoutProperty('campus-buildings-estimated-fill', 'visibility', 'none');
        map.setLayoutProperty('campus-buildings-estimated-stroke', 'visibility', 'none');
      }
      if (map.getLayer('campus-buildings-unverified-fill')) {
        map.setLayoutProperty('campus-buildings-unverified-fill', 'visibility', 'none');
        map.setLayoutProperty('campus-buildings-unverified-stroke', 'visibility', 'none');
      }
      map.flyTo({
        center: [79.9835, 14.9132],
        zoom: 17.2,
        pitch: 0,
        bearing: 0,
        essential: true
      });
    }
  });
  await new Promise(r => setTimeout(r, 5000));
  await page.screenshot({ path: path.join(outputDir, '07-corrected-satellite-overlay.png') });
  copyToArtifact('07-corrected-satellite-overlay.png');

  // 8. Final 3D overview
  console.log('Capturing 08-final-3d-overview.png...');
  await page.evaluate(() => {
    window.useCampusStore.getState().setAppViewMode('3d');
    window.useCampusStore.getState().selectBuilding(null);
    window.useCampusStore.getState().setActiveSidebarTab(null);
    window.useCampusStore.getState().flyTo([0, 110, 210], [0, 0, 0]);
  });
  await new Promise(r => setTimeout(r, 5000));
  await page.screenshot({ path: path.join(outputDir, '08-final-3d-overview.png') });
  copyToArtifact('08-final-3d-overview.png');

  await browser.close();
  server.close();
  console.log('All footprint alignment audit visual evidence successfully captured!');
}

run().catch(err => {
  console.error('Audit capture failed:', err);
  process.exit(1);
});
