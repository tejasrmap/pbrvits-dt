const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const targetUrl = 'https://pbrvits-dt.vercel.app/';
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
  console.log('Launching Chrome for Radical Reality-Based Audit Capture...');
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
  await new Promise(r => setTimeout(r, 5000));

  // -------------------------------------------------------------
  // Screenshot 1: 01-premium-campus-overview.png
  // Desktop campus overview (Unobstructed aerial view)
  // -------------------------------------------------------------
  console.log('Capturing 01-premium-campus-overview.png...');
  await page.evaluate(() => {
    if (window.useCampusStore) {
      window.useCampusStore.getState().setAppViewMode('3d');
      window.useCampusStore.getState().flyTo([0, 105, 205], [0, 0, 0]);
      window.useCampusStore.getState().selectBuilding(null);
      window.useCampusStore.getState().setActiveSidebarTab(null);
    }
  });
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: path.join(outputDir, '01-premium-campus-overview.png') });
  copyToArtifact('01-premium-campus-overview.png');

  // -------------------------------------------------------------
  // Screenshot 2: 02-actual-campus-3d-model.png
  // Close-up of Academic Blocks (Admin Bhavan, ECE & Mech blocks)
  // -------------------------------------------------------------
  console.log('Capturing 02-actual-campus-3d-model.png...');
  await page.evaluate(() => {
    if (window.useCampusStore) {
      window.useCampusStore.getState().flyTo([20, 38, 55], [0, 8, -10]);
    }
  });
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: path.join(outputDir, '02-actual-campus-3d-model.png') });
  copyToArtifact('02-actual-campus-3d-model.png');

  // -------------------------------------------------------------
  // Screenshot 3: 03-main-entrance.png
  // Main Entrance gateway on Udayagiri Road
  // -------------------------------------------------------------
  console.log('Capturing 03-main-entrance.png...');
  await page.evaluate(() => {
    if (window.useCampusStore) {
      window.useCampusStore.getState().flyTo([0, 16, 138], [0, 6, 95]);
    }
  });
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: path.join(outputDir, '03-main-entrance.png') });
  copyToArtifact('03-main-entrance.png');

  // -------------------------------------------------------------
  // Screenshot 4: 04-academic-building-close-up.png
  // Library Close-up (Glazed atrium & canopy)
  // -------------------------------------------------------------
  console.log('Capturing 04-academic-building-close-up.png...');
  await page.evaluate(() => {
    if (window.useCampusStore) {
      window.useCampusStore.getState().flyTo([68, 26, -2], [53.6, 8, -35.5]);
    }
  });
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: path.join(outputDir, '04-academic-building-close-up.png') });
  copyToArtifact('04-academic-building-close-up.png');

  // -------------------------------------------------------------
  // Screenshot 5: 05-playground.png
  // Playground & Sports Pavilion
  // -------------------------------------------------------------
  console.log('Capturing 05-playground.png...');
  await page.evaluate(() => {
    if (window.useCampusStore) {
      window.useCampusStore.getState().flyTo([-150, 48, 85], [-199, 0, 0]);
    }
  });
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: path.join(outputDir, '05-playground.png') });
  copyToArtifact('05-playground.png');

  // -------------------------------------------------------------
  // Screenshot 6: 06-gis-street-map.png
  // GIS Street mode (OSM with clean restrained overlays)
  // -------------------------------------------------------------
  console.log('Capturing 06-gis-street-map.png...');
  await page.evaluate(() => {
    if (window.useCampusStore) {
      window.useCampusStore.getState().setAppViewMode('gis');
    }
  });
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: path.join(outputDir, '06-gis-street-map.png') });
  copyToArtifact('06-gis-street-map.png');

  // -------------------------------------------------------------
  // Screenshot 7: 07-gis-satellite-map.png
  // GIS Satellite mode
  // -------------------------------------------------------------
  console.log('Capturing 07-gis-satellite-map.png...');
  await page.evaluate(() => {
    if (window.useCampusStore) {
      window.useCampusStore.getState().setAppViewMode('satellite');
    }
  });
  await new Promise(r => setTimeout(r, 4500));
  await page.screenshot({ path: path.join(outputDir, '07-gis-satellite-map.png') });
  copyToArtifact('07-gis-satellite-map.png');

  // -------------------------------------------------------------
  // Screenshot 8: 08-building-selection-panel.png
  // Building selection with compact Apple Maps-style card
  // -------------------------------------------------------------
  console.log('Capturing 08-building-selection-panel.png...');
  await page.evaluate(() => {
    if (window.useCampusStore) {
      window.useCampusStore.getState().setAppViewMode('3d');
      window.useCampusStore.getState().selectBuilding('admin-block');
      window.useCampusStore.getState().flyTo([30, 26, 45], [0, 8, 0]);
    }
  });
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: path.join(outputDir, '08-building-selection-panel.png') });
  copyToArtifact('08-building-selection-panel.png');

  // -------------------------------------------------------------
  // Screenshot 9: 09-navigation-route.png
  // Active Navigation Route
  // -------------------------------------------------------------
  console.log('Capturing 09-navigation-route.png...');
  await page.evaluate(() => {
    if (window.useCampusStore) {
      window.useCampusStore.getState().setActiveSidebarTab('navigation');
      const calcBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Calculate'));
      if (calcBtn) calcBtn.click();
    }
  });
  await new Promise(r => setTimeout(r, 3500));
  await page.screenshot({ path: path.join(outputDir, '09-navigation-route.png') });
  copyToArtifact('09-navigation-route.png');

  // -------------------------------------------------------------
  // Screenshot 10: 10-mobile-experience.png
  // Mobile responsive layout (390 x 844)
  // -------------------------------------------------------------
  console.log('Capturing 10-mobile-experience.png...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.evaluate(() => {
    if (window.useCampusStore) {
      window.useCampusStore.getState().selectBuilding(null);
      window.useCampusStore.getState().setActiveSidebarTab(null);
      window.useCampusStore.getState().flyTo([0, 105, 205], [0, 0, 0]);
    }
  });
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: path.join(outputDir, '10-mobile-experience.png') });
  copyToArtifact('10-mobile-experience.png');

  await browser.close();
  console.log('All 10 radical reconstruction screenshots captured successfully!');
}

run().catch(err => {
  console.error('Error during final audit capture:', err);
  process.exit(1);
});
