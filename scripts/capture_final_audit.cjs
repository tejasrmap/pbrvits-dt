const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const targetUrl = process.env.AUDIT_URL || 'http://localhost:5173/';
const outputDir = path.resolve(__dirname, '..', 'public', 'audit', 'final');
const artifactDir = 'C:\\Users\\tejag\\.gemini\\antigravity\\brain\\6c1052ac-5172-424c-ae6b-d2ed8b9d72b9\\audit\\final';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
if (!fs.existsSync(artifactDir)) {
  fs.mkdirSync(artifactDir, { recursive: true });
}

function copyToArtifact(filename) {
  const src = path.join(outputDir, filename);
  const dest = path.join(artifactDir, filename);
  fs.copyFileSync(src, dest);
  console.log(`Copied ${filename} to artifact directory.`);
}

async function run() {
  console.log(`Launching Chrome for 12-View Reality-Based Geographic Audit on ${targetUrl}...`);
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
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 6000));

  // -------------------------------------------------------------
  // View 1: 01-full-campus-satellite.png
  // High-resolution satellite basemap of entire campus area
  // -------------------------------------------------------------
  console.log('Capturing 01-full-campus-satellite.png...');
  await page.evaluate(() => {
    if (window.useCampusStore) {
      window.useCampusStore.getState().setAppViewMode('satellite');
      window.useCampusStore.getState().selectBuilding(null);
      window.useCampusStore.getState().setActiveSidebarTab(null);
    }
    if (window.gisMapInstance) {
      window.gisMapInstance.flyTo({
        center: [79.9835, 14.9132],
        zoom: 16.5,
        pitch: 15,
        bearing: 0,
        essential: true
      });
    }
  });
  await new Promise(r => setTimeout(r, 4500));
  await page.screenshot({ path: path.join(outputDir, '01-full-campus-satellite.png') });
  copyToArtifact('01-full-campus-satellite.png');

  // -------------------------------------------------------------
  // View 2: 02-campus-boundary.png
  // GIS View displaying authoritative PBR VITS boundaries (Way 1297901220 & 1297896001)
  // -------------------------------------------------------------
  console.log('Capturing 02-campus-boundary.png...');
  await page.evaluate(() => {
    if (window.useCampusStore) {
      window.useCampusStore.getState().setAppViewMode('gis');
    }
    if (window.gisMapInstance) {
      window.gisMapInstance.flyTo({
        center: [79.9830, 14.9130],
        zoom: 16.8,
        pitch: 20,
        bearing: 0,
        essential: true
      });
    }
  });
  await new Promise(r => setTimeout(r, 4500));
  await page.screenshot({ path: path.join(outputDir, '02-campus-boundary.png') });
  copyToArtifact('02-campus-boundary.png');

  // -------------------------------------------------------------
  // View 3: 03-individual-building-footprints.png
  // MapLibre GIS 3D extruded footprints showing real polygon geometries
  // -------------------------------------------------------------
  console.log('Capturing 03-individual-building-footprints.png...');
  await page.evaluate(() => {
    if (window.gisMapInstance) {
      window.gisMapInstance.flyTo({
        center: [79.9835, 14.9133],
        zoom: 17.8,
        pitch: 52,
        bearing: -15,
        essential: true
      });
    }
  });
  await new Promise(r => setTimeout(r, 4500));
  await page.screenshot({ path: path.join(outputDir, '03-individual-building-footprints.png') });
  copyToArtifact('03-individual-building-footprints.png');

  // -------------------------------------------------------------
  // View 4: 04-building-overlay-on-satellite.png
  // Vector building polygons overlaid directly on ESRI satellite imagery
  // -------------------------------------------------------------
  console.log('Capturing 04-building-overlay-on-satellite.png...');
  await page.evaluate(() => {
    if (window.useCampusStore) {
      window.useCampusStore.getState().setAppViewMode('satellite');
    }
    if (window.gisMapInstance) {
      window.gisMapInstance.flyTo({
        center: [79.9836, 14.9133],
        zoom: 17.8,
        pitch: 45,
        bearing: 0,
        essential: true
      });
    }
  });
  await new Promise(r => setTimeout(r, 4500));
  await page.screenshot({ path: path.join(outputDir, '04-building-overlay-on-satellite.png') });
  copyToArtifact('04-building-overlay-on-satellite.png');

  // -------------------------------------------------------------
  // View 5: 05-main-entrance.png
  // 3D Main Entrance gateway along Udayagiri Road
  // -------------------------------------------------------------
  console.log('Capturing 05-main-entrance.png...');
  await page.evaluate(() => {
    if (window.useCampusStore) {
      window.useCampusStore.getState().setAppViewMode('3d');
      window.useCampusStore.getState().flyTo([0, 16, 138], [0, 6, 95]);
    }
  });
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: path.join(outputDir, '05-main-entrance.png') });
  copyToArtifact('05-main-entrance.png');

  // -------------------------------------------------------------
  // View 6: 06-playground.png
  // 3D Playground & Sports Pavilion (OSM Way 1297896001)
  // -------------------------------------------------------------
  console.log('Capturing 06-playground.png...');
  await page.evaluate(() => {
    if (window.useCampusStore) {
      window.useCampusStore.getState().flyTo([-150, 48, 85], [-199, 0, 0]);
    }
  });
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: path.join(outputDir, '06-playground.png') });
  copyToArtifact('06-playground.png');

  // -------------------------------------------------------------
  // View 7: 07-academic-blocks.png
  // 3D Academic Blocks (Admin Bhavan, ECE & Mech blocks) extruded from real polygons
  // -------------------------------------------------------------
  console.log('Capturing 07-academic-blocks.png...');
  await page.evaluate(() => {
    if (window.useCampusStore) {
      window.useCampusStore.getState().flyTo([20, 38, 55], [0, 8, -10]);
    }
  });
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: path.join(outputDir, '07-academic-blocks.png') });
  copyToArtifact('07-academic-blocks.png');

  // -------------------------------------------------------------
  // View 8: 08-pbr-vits-vs-vec-boundaries.png
  // GIS view demonstrating explicit separation between PBR VITS and VEC
  // -------------------------------------------------------------
  console.log('Capturing 08-pbr-vits-vs-vec-boundaries.png...');
  await page.evaluate(() => {
    if (window.useCampusStore) {
      window.useCampusStore.getState().setAppViewMode('gis');
    }
    if (window.gisMapInstance) {
      window.gisMapInstance.flyTo({
        center: [79.9845, 14.9133],
        zoom: 15.8,
        pitch: 20,
        bearing: 0,
        essential: true
      });
    }
  });
  await new Promise(r => setTimeout(r, 4500));
  await page.screenshot({ path: path.join(outputDir, '08-pbr-vits-vs-vec-boundaries.png') });
  copyToArtifact('08-pbr-vits-vs-vec-boundaries.png');

  // -------------------------------------------------------------
  // View 9: 09-3d-overview.png
  // Unobstructed full campus 3D aerial view
  // -------------------------------------------------------------
  console.log('Capturing 09-3d-overview.png...');
  await page.evaluate(() => {
    if (window.useCampusStore) {
      window.useCampusStore.getState().setAppViewMode('3d');
      window.useCampusStore.getState().selectBuilding(null);
      window.useCampusStore.getState().setActiveSidebarTab(null);
      window.useCampusStore.getState().flyTo([0, 110, 210], [0, 0, 0]);
    }
  });
  await new Promise(r => setTimeout(r, 4500));
  await page.screenshot({ path: path.join(outputDir, '09-3d-overview.png') });
  copyToArtifact('09-3d-overview.png');

  // -------------------------------------------------------------
  // View 10: 10-gis-and-3d-comparison.png
  // Close-up perspective showing Library and Admin Block massing
  // -------------------------------------------------------------
  console.log('Capturing 10-gis-and-3d-comparison.png...');
  await page.evaluate(() => {
    if (window.useCampusStore) {
      window.useCampusStore.getState().flyTo([68, 26, -2], [53.6, 8, -35.5]);
    }
  });
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: path.join(outputDir, '10-gis-and-3d-comparison.png') });
  copyToArtifact('10-gis-and-3d-comparison.png');

  // -------------------------------------------------------------
  // View 11: 11-building-selection.png
  // Building selection showing synchronized place card
  // -------------------------------------------------------------
  console.log('Capturing 11-building-selection.png...');
  await page.evaluate(() => {
    if (window.useCampusStore) {
      window.useCampusStore.getState().selectBuilding('admin-block');
      window.useCampusStore.getState().flyTo([30, 26, 45], [0, 8, 0]);
    }
  });
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: path.join(outputDir, '11-building-selection.png') });
  copyToArtifact('11-building-selection.png');

  // -------------------------------------------------------------
  // View 12: 12-mobile-view.png
  // Mobile responsive layout (390 x 844)
  // -------------------------------------------------------------
  console.log('Capturing 12-mobile-view.png...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.evaluate(() => {
    if (window.useCampusStore) {
      window.useCampusStore.getState().selectBuilding(null);
      window.useCampusStore.getState().setActiveSidebarTab(null);
      window.useCampusStore.getState().flyTo([0, 110, 210], [0, 0, 0]);
    }
  });
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: path.join(outputDir, '12-mobile-view.png') });
  copyToArtifact('12-mobile-view.png');

  await browser.close();
  console.log('All 12 reality audit screenshots captured successfully!');
}

run().catch(err => {
  console.error('Error during audit capture:', err);
  process.exit(1);
});
