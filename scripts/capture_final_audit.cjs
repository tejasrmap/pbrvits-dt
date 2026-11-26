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
  console.log('Launching Chrome for Final Reality-Based Audit Capture...');
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
  // Premium campus overview (Cinematic aerial perspective)
  // -------------------------------------------------------------
  console.log('Capturing 01-premium-campus-overview.png...');
  await page.screenshot({ path: path.join(outputDir, '01-premium-campus-overview.png') });
  copyToArtifact('01-premium-campus-overview.png');

  // -------------------------------------------------------------
  // Screenshot 2: 02-actual-campus-3d-model.png
  // Actual campus 3D model (Isometric angle showing architectural blocks)
  // -------------------------------------------------------------
  console.log('Adjusting camera for 02-actual-campus-3d-model.png...');
  await page.evaluate(() => {
    // Click on Academic Quad preset in bottom bar
    const quadBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Academic Quad'));
    if (quadBtn) quadBtn.click();
  });
  await new Promise(r => setTimeout(r, 4000));
  console.log('Capturing 02-actual-campus-3d-model.png...');
  await page.screenshot({ path: path.join(outputDir, '02-actual-campus-3d-model.png') });
  copyToArtifact('02-actual-campus-3d-model.png');

  // -------------------------------------------------------------
  // Screenshot 3: 03-main-entrance.png
  // Main entrance gate view
  // -------------------------------------------------------------
  console.log('Focusing Main Entrance for 03-main-entrance.png...');
  await page.evaluate(() => {
    const gateBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Main Entrance'));
    if (gateBtn) gateBtn.click();
  });
  await new Promise(r => setTimeout(r, 4000));
  console.log('Capturing 03-main-entrance.png...');
  await page.screenshot({ path: path.join(outputDir, '03-main-entrance.png') });
  copyToArtifact('03-main-entrance.png');

  // -------------------------------------------------------------
  // Screenshot 4: 04-academic-building-close-up.png
  // Close-up on Admin Bhavan or Central Library
  // -------------------------------------------------------------
  console.log('Selecting Admin Bhavan for 04-academic-building-close-up.png...');
  await page.evaluate(() => {
    const buildingsNav = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Buildings'));
    if (buildingsNav) buildingsNav.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.evaluate(() => {
    const adminCard = Array.from(document.querySelectorAll('*')).find(el => el.textContent && el.textContent.includes('Administrative & Executive'));
    if (adminCard) adminCard.click();
  });
  await new Promise(r => setTimeout(r, 4000));
  console.log('Capturing 04-academic-building-close-up.png...');
  await page.screenshot({ path: path.join(outputDir, '04-academic-building-close-up.png') });
  copyToArtifact('04-academic-building-close-up.png');

  // -------------------------------------------------------------
  // Screenshot 5: 05-playground.png
  // Sports pavilion and athletic oval
  // -------------------------------------------------------------
  console.log('Focusing Playground for 05-playground.png...');
  await page.evaluate(() => {
    const ovalBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Athletic Oval'));
    if (ovalBtn) ovalBtn.click();
  });
  await new Promise(r => setTimeout(r, 4000));
  console.log('Capturing 05-playground.png...');
  await page.screenshot({ path: path.join(outputDir, '05-playground.png') });
  copyToArtifact('05-playground.png');

  // -------------------------------------------------------------
  // Screenshot 6: 06-gis-street-map.png
  // Switch to GIS Map (OSM streets)
  // -------------------------------------------------------------
  console.log('Switching to GIS Street Map for 06-gis-street-map.png...');
  await page.evaluate(() => {
    const gisBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && (b.textContent.includes('Campus GIS') || b.textContent.includes('Campus Map')));
    if (gisBtn) gisBtn.click();
  });
  await new Promise(r => setTimeout(r, 3500));
  await page.evaluate(() => {
    const osmBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && (b.textContent.includes('Streets') || b.textContent.includes('OSM') || b.textContent.includes('osm')));
    if (osmBtn) osmBtn.click();
  });
  await new Promise(r => setTimeout(r, 4000));
  console.log('Capturing 06-gis-street-map.png...');
  await page.screenshot({ path: path.join(outputDir, '06-gis-street-map.png') });
  copyToArtifact('06-gis-street-map.png');

  // -------------------------------------------------------------
  // Screenshot 7: 07-gis-satellite-map.png
  // Switch to Satellite basemap
  // -------------------------------------------------------------
  console.log('Switching to Satellite basemap for 07-gis-satellite-map.png...');
  await page.evaluate(() => {
    const satBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && (b.textContent.includes('Satellite') || b.textContent.includes('satellite')));
    if (satBtn) satBtn.click();
  });
  await new Promise(r => setTimeout(r, 4500));
  console.log('Capturing 07-gis-satellite-map.png...');
  await page.screenshot({ path: path.join(outputDir, '07-gis-satellite-map.png') });
  copyToArtifact('07-gis-satellite-map.png');

  // -------------------------------------------------------------
  // Screenshot 8: 08-building-selection-panel.png
  // Building selection panel with architectural dossier
  // -------------------------------------------------------------
  console.log('Selecting building in 3D for 08-building-selection-panel.png...');
  await page.evaluate(() => {
    const exploreBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && (b.textContent.includes('3D Twin') || b.textContent.includes('Explore')));
    if (exploreBtn) exploreBtn.click();
  });
  await new Promise(r => setTimeout(r, 3000));
  await page.evaluate(() => {
    const buildingsNav = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Buildings'));
    if (buildingsNav) buildingsNav.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.evaluate(() => {
    const libCard = Array.from(document.querySelectorAll('*')).find(el => el.textContent && el.textContent.includes('Central Library'));
    if (libCard) libCard.click();
  });
  await new Promise(r => setTimeout(r, 3000));
  console.log('Capturing 08-building-selection-panel.png...');
  await page.screenshot({ path: path.join(outputDir, '08-building-selection-panel.png') });
  copyToArtifact('08-building-selection-panel.png');

  // -------------------------------------------------------------
  // Screenshot 9: 09-navigation-route.png
  // Active navigation route plotted
  // -------------------------------------------------------------
  console.log('Calculating route for 09-navigation-route.png...');
  await page.evaluate(() => {
    const navBtn = Array.from(document.querySelectorAll('button')).find(b => b.title === 'Navigation' || (b.textContent && b.textContent.includes('Navigation')));
    if (navBtn) navBtn.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.evaluate(() => {
    const calcBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Calculate'));
    if (calcBtn) calcBtn.click();
  });
  await new Promise(r => setTimeout(r, 3000));
  console.log('Capturing 09-navigation-route.png...');
  await page.screenshot({ path: path.join(outputDir, '09-navigation-route.png') });
  copyToArtifact('09-navigation-route.png');

  // -------------------------------------------------------------
  // Screenshot 10: 10-mobile-experience.png
  // Mobile responsive layout (390 x 844)
  // -------------------------------------------------------------
  console.log('Switching to mobile viewport (390 x 844) for 10-mobile-experience.png...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.evaluate(() => {
    // Reset camera target or presets
    const overviewPreset = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Campus Aerial'));
    if (overviewPreset) overviewPreset.click();
  });
  await new Promise(r => setTimeout(r, 4000));
  console.log('Capturing 10-mobile-experience.png...');
  await page.screenshot({ path: path.join(outputDir, '10-mobile-experience.png') });
  copyToArtifact('10-mobile-experience.png');

  await browser.close();
  console.log('All 10 required audit screenshots captured successfully!');
}

run().catch(err => {
  console.error('Error during final audit capture:', err);
  process.exit(1);
});
