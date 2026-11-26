const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const targetUrl = process.env.AUDIT_URL || 'https://pbrvits-dt.vercel.app/';
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
  console.log(`Launching Chrome for 12-View Reality-Based Production Audit on ${targetUrl}...`);
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
  // Screenshot 1: 01-full-campus-overview.png
  // Desktop campus overview (Unobstructed aerial view)
  // -------------------------------------------------------------
  console.log('Capturing 01-full-campus-overview.png...');
  await page.evaluate(() => {
    if (window.useCampusStore) {
      window.useCampusStore.getState().setAppViewMode('3d');
      window.useCampusStore.getState().flyTo([0, 105, 205], [0, 0, 0]);
      window.useCampusStore.getState().selectBuilding(null);
      window.useCampusStore.getState().setActiveSidebarTab(null);
    }
  });
  await new Promise(r => setTimeout(r, 4500));
  await page.screenshot({ path: path.join(outputDir, '01-full-campus-overview.png') });
  copyToArtifact('01-full-campus-overview.png');

  // -------------------------------------------------------------
  // Screenshot 2: 02-correct-campus-boundary.png
  // GIS View showing PBR VITS official boundary polygon
  // -------------------------------------------------------------
  console.log('Capturing 02-correct-campus-boundary.png...');
  await page.evaluate(() => {
    if (window.useCampusStore) {
      window.useCampusStore.getState().setAppViewMode('gis');
      window.useCampusStore.getState().selectBuilding(null);
      window.useCampusStore.getState().setActiveSidebarTab(null);
    }
    if (window.gisMapInstance) {
      window.gisMapInstance.flyTo({
        center: [79.9830, 14.9130],
        zoom: 16.5,
        pitch: 25,
        bearing: 0,
        essential: true
      });
    }
  });
  await new Promise(r => setTimeout(r, 4500));
  await page.screenshot({ path: path.join(outputDir, '02-correct-campus-boundary.png') });
  copyToArtifact('02-correct-campus-boundary.png');

  // -------------------------------------------------------------
  // Screenshot 3: 03-pbr-vits-vs-vec-separation.png
  // GIS View showing PBR VITS boundaries separated from neighboring VEC
  // -------------------------------------------------------------
  console.log('Capturing 03-pbr-vits-vs-vec-separation.png...');
  await page.evaluate(() => {
    if (window.gisMapInstance) {
      window.gisMapInstance.flyTo({
        center: [79.9845, 14.9132],
        zoom: 15.8,
        pitch: 20,
        bearing: 0,
        essential: true
      });
    }
  });
  await new Promise(r => setTimeout(r, 4500));
  await page.screenshot({ path: path.join(outputDir, '03-pbr-vits-vs-vec-separation.png') });
  copyToArtifact('03-pbr-vits-vs-vec-separation.png');

  // -------------------------------------------------------------
  // Screenshot 4: 04-actual-building-footprints.png
  // GIS 3D footprint extrusion overlay aligned with roads
  // -------------------------------------------------------------
  console.log('Capturing 04-actual-building-footprints.png...');
  await page.evaluate(() => {
    if (window.gisMapInstance) {
      window.gisMapInstance.flyTo({
        center: [79.9835, 14.9133],
        zoom: 17.5,
        pitch: 52,
        bearing: -15,
        essential: true
      });
    }
  });
  await new Promise(r => setTimeout(r, 4500));
  await page.screenshot({ path: path.join(outputDir, '04-actual-building-footprints.png') });
  copyToArtifact('04-actual-building-footprints.png');

  // -------------------------------------------------------------
  // Screenshot 5: 05-main-entrance.png
  // 3D Main Entrance gateway on Udayagiri Road
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
  // Screenshot 6: 06-playground.png
  // 3D Playground & Sports Pavilion (Western open field)
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
  // Screenshot 7: 07-academic-blocks.png
  // 3D Academic Blocks (Admin Bhavan, ECE & Mech blocks)
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
  // Screenshot 8: 08-library.png
  // 3D Library Close-up (Glazed atrium & sunshade canopy)
  // -------------------------------------------------------------
  console.log('Capturing 08-library.png...');
  await page.evaluate(() => {
    if (window.useCampusStore) {
      window.useCampusStore.getState().flyTo([68, 26, -2], [53.6, 8, -35.5]);
    }
  });
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: path.join(outputDir, '08-library.png') });
  copyToArtifact('08-library.png');

  // -------------------------------------------------------------
  // Screenshot 9: 09-campus-street-map.png
  // GIS Street mode (OSM with clean restrained overlays)
  // -------------------------------------------------------------
  console.log('Capturing 09-campus-street-map.png...');
  await page.evaluate(() => {
    if (window.useCampusStore) {
      window.useCampusStore.getState().setAppViewMode('gis');
    }
    if (window.gisMapInstance) {
      window.gisMapInstance.flyTo({
        center: [79.9830, 14.9130],
        zoom: 17.0,
        pitch: 45,
        bearing: 0,
        essential: true
      });
    }
  });
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: path.join(outputDir, '09-campus-street-map.png') });
  copyToArtifact('09-campus-street-map.png');

  // -------------------------------------------------------------
  // Screenshot 10: 10-satellite-alignment.png
  // GIS Satellite mode (ESRI World Imagery basemap)
  // -------------------------------------------------------------
  console.log('Capturing 10-satellite-alignment.png...');
  await page.evaluate(() => {
    if (window.useCampusStore) {
      window.useCampusStore.getState().setAppViewMode('satellite');
    }
    if (window.gisMapInstance) {
      window.gisMapInstance.flyTo({
        center: [79.9835, 14.9132],
        zoom: 17.2,
        pitch: 40,
        bearing: 0,
        essential: true
      });
    }
  });
  await new Promise(r => setTimeout(r, 4500));
  await page.screenshot({ path: path.join(outputDir, '10-satellite-alignment.png') });
  copyToArtifact('10-satellite-alignment.png');

  // -------------------------------------------------------------
  // Screenshot 11: 11-building-selection.png
  // Building selection with compact Apple Maps-style place card
  // -------------------------------------------------------------
  console.log('Capturing 11-building-selection.png...');
  await page.evaluate(() => {
    if (window.useCampusStore) {
      window.useCampusStore.getState().setAppViewMode('3d');
      window.useCampusStore.getState().selectBuilding('admin-block');
      window.useCampusStore.getState().flyTo([30, 26, 45], [0, 8, 0]);
    }
  });
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: path.join(outputDir, '11-building-selection.png') });
  copyToArtifact('11-building-selection.png');

  // -------------------------------------------------------------
  // Screenshot 12: 12-mobile-interface.png
  // Mobile responsive layout (390 x 844)
  // -------------------------------------------------------------
  console.log('Capturing 12-mobile-interface.png...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.evaluate(() => {
    if (window.useCampusStore) {
      window.useCampusStore.getState().selectBuilding(null);
      window.useCampusStore.getState().setActiveSidebarTab(null);
      window.useCampusStore.getState().flyTo([0, 105, 205], [0, 0, 0]);
    }
  });
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: path.join(outputDir, '12-mobile-interface.png') });
  copyToArtifact('12-mobile-interface.png');

  await browser.close();
  console.log('All 12 reality-based audit screenshots captured successfully!');
}

run().catch(err => {
  console.error('Error during final audit capture:', err);
  process.exit(1);
});
