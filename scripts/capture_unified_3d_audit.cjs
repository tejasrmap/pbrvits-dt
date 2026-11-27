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
const outputDir = path.resolve(__dirname, '..', 'public', 'audit', 'unified_3d');
const artifactDir = 'C:\\Users\\tejag\\.gemini\\antigravity\\brain\\6c1052ac-5172-424c-ae6b-d2ed8b9d72b9\\audit\\unified_3d';

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
if (!fs.existsSync(artifactDir)) fs.mkdirSync(artifactDir, { recursive: true });

function copyToArtifact(filename) {
  const src = path.join(outputDir, filename);
  const dest = path.join(artifactDir, filename);
  fs.copyFileSync(src, dest);
  const size = fs.statSync(src).size;
  console.log(`Saved & copied ${filename} (${(size / 1024).toFixed(1)} KB)`);
}

function startServer(port = 8092) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  };

  const server = http.createServer((req, res) => {
    let filePath = path.join(distDir, req.url.split('?')[0]);
    if (filePath.endsWith(path.sep) || (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory())) {
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
      console.log(`Unified 3D audit server running on http://127.0.0.1:${port}`);
      resolve(server);
    });
  });
}

async function run() {
  const server = await startServer(8092);
  const chromePath = findChrome();
  console.log(`Launching Chrome (${chromePath}) for Unified Geographic 3D Campus Audit...`);

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

  console.log('Navigating to http://127.0.0.1:8092/ ...');
  await page.goto('http://127.0.0.1:8092/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForFunction(() => typeof window.useCampusStore !== 'undefined', { timeout: 20000 });
  await new Promise(r => setTimeout(r, 4000));

  // Set 3D View Mode
  await page.evaluate(() => {
    window.useCampusStore.getState().setAppViewMode('3d');
    window.useCampusStore.getState().selectBuilding(null);
    window.useCampusStore.getState().setActiveSidebarTab(null);
  });
  await new Promise(r => setTimeout(r, 4500));

  // 1. Full 3D Campus Overview with Satellite Ground
  console.log('Capturing 01-unified-3d-campus-satellite-overview.png...');
  await page.evaluate(() => {
    if (window.gisMapInstance) {
      window.gisMapInstance.flyTo({
        center: [79.9835, 14.9132],
        zoom: 16.8,
        pitch: 55,
        bearing: -15,
        essential: true
      });
    }
  });
  await new Promise(r => setTimeout(r, 5500));
  await page.screenshot({ path: path.join(outputDir, '01-unified-3d-campus-satellite-overview.png') });
  copyToArtifact('01-unified-3d-campus-satellite-overview.png');

  // 2. Core Academic Quadrangle (Architectural Massing & Materials)
  console.log('Capturing 02-academic-quadrangle-materials.png...');
  await page.evaluate(() => {
    if (window.gisMapInstance) {
      window.gisMapInstance.flyTo({
        center: [79.98355, 14.91335],
        zoom: 17.8,
        pitch: 58,
        bearing: 0,
        essential: true
      });
    }
  });
  await new Promise(r => setTimeout(r, 5000));
  await page.screenshot({ path: path.join(outputDir, '02-academic-quadrangle-materials.png') });
  copyToArtifact('02-academic-quadrangle-materials.png');

  // 3. Main Entrance Perspective (Gate Arch + Udayagiri Road)
  console.log('Capturing 03-main-entrance-perspective.png...');
  await page.evaluate(() => {
    if (window.gisMapInstance) {
      window.gisMapInstance.flyTo({
        center: [79.983655, 14.91234],
        zoom: 18.2,
        pitch: 50,
        bearing: 0,
        essential: true
      });
    }
  });
  await new Promise(r => setTimeout(r, 5000));
  await page.screenshot({ path: path.join(outputDir, '03-main-entrance-perspective.png') });
  copyToArtifact('03-main-entrance-perspective.png');

  // 4. Natural Sports Ground (OSM Way 1297896001 - Satellite Ground)
  console.log('Capturing 04-natural-sports-ground.png...');
  await page.evaluate(() => {
    if (window.gisMapInstance) {
      window.gisMapInstance.flyTo({
        center: [79.9818, 14.9131],
        zoom: 17.2,
        pitch: 52,
        bearing: 25,
        essential: true
      });
    }
  });
  await new Promise(r => setTimeout(r, 5000));
  await page.screenshot({ path: path.join(outputDir, '04-natural-sports-ground.png') });
  copyToArtifact('04-natural-sports-ground.png');

  // 5. Eastern Boundary & Separation from Neighboring VEC
  console.log('Capturing 05-eastern-boundary-vec-separation.png...');
  await page.evaluate(() => {
    if (window.gisMapInstance) {
      window.gisMapInstance.flyTo({
        center: [79.9845, 14.9136],
        zoom: 17.3,
        pitch: 45,
        bearing: -30,
        essential: true
      });
    }
  });
  await new Promise(r => setTimeout(r, 5000));
  await page.screenshot({ path: path.join(outputDir, '05-eastern-boundary-vec-separation.png') });
  copyToArtifact('05-eastern-boundary-vec-separation.png');

  // 6. Mobile View (390x844 iPhone 12/13/14 viewport)
  console.log('Capturing 06-mobile-viewport-3d.png...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await page.evaluate(() => {
    if (window.gisMapInstance) {
      window.gisMapInstance.flyTo({
        center: [79.9835, 14.9132],
        zoom: 16.5,
        pitch: 52,
        bearing: -10,
        essential: true
      });
    }
  });
  await new Promise(r => setTimeout(r, 5500));
  await page.screenshot({ path: path.join(outputDir, '06-mobile-viewport-3d.png') });
  copyToArtifact('06-mobile-viewport-3d.png');

  await browser.close();
  server.close();
  console.log('All unified geographic 3D visual audit captures completed successfully!');
}

run().catch(err => {
  console.error('Audit capture failed:', err);
  process.exit(1);
});
