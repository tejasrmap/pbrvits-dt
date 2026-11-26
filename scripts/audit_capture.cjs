const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const targetUrl = 'https://pbrvits-dt.vercel.app/';
const outputDir = path.resolve(__dirname, '..', 'public', 'audit');
const artifactDir = 'C:\\Users\\tejag\\.gemini\\antigravity\\brain\\6c1052ac-5172-424c-ae6b-d2ed8b9d72b9\\audit';

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
  console.log('Launching Chrome from:', chromePath);
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

  // Collect console messages
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  console.log('Navigating to', targetUrl);
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout ? page.waitForTimeout(4000) : new Promise(r => setTimeout(r, 4000));

  // Dismiss welcome modal if present
  try {
    const welcomeCloseBtn = await page.$('button[title="Close"], button:has-text("Enter Campus"), button:has-text("Explore")');
    if (welcomeCloseBtn) {
      await welcomeCloseBtn.click();
      console.log('Dismissed modal');
    }
  } catch (e) {}

  // 1. Switch to Satellite / GIS view
  console.log('Switching to Satellite view...');
  await page.evaluate(() => {
    // Find button containing Satellite
    const buttons = Array.from(document.querySelectorAll('button'));
    const satBtn = buttons.find(b => b.textContent && b.textContent.includes('Satellite'));
    if (satBtn) satBtn.click();
    else {
      const gisBtn = buttons.find(b => b.textContent && b.textContent.includes('Campus GIS'));
      if (gisBtn) gisBtn.click();
    }
  });

  // Wait for MapLibre tiles and rendering
  await new Promise(r => setTimeout(r, 5000));

  // -------------------------------------------------------------
  // Screenshot 1: 01-full-campus-satellite.png
  // Full campus satellite view (ESRI World Imagery)
  // -------------------------------------------------------------
  console.log('Capturing 01-full-campus-satellite.png...');
  await page.screenshot({ path: path.join(outputDir, '01-full-campus-satellite.png') });
  copyToArtifact('01-full-campus-satellite.png');

  // -------------------------------------------------------------
  // Screenshot 2: 02-satellite-building-alignment.png
  // Zoomed-in satellite view showing real building footprints vs satellite imagery
  // -------------------------------------------------------------
  console.log('Zooming in for 02-satellite-building-alignment.png...');
  await page.evaluate(() => {
    // Zoom in on MapLibre map if accessible, or click zoom button 3 times
    const zoomInBtn = Array.from(document.querySelectorAll('button')).find(b => b.title === 'Zoom In' || b.getAttribute('aria-label') === 'Zoom In');
    if (zoomInBtn) {
      zoomInBtn.click();
      zoomInBtn.click();
    }
  });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: path.join(outputDir, '02-satellite-building-alignment.png') });
  copyToArtifact('02-satellite-building-alignment.png');

  // -------------------------------------------------------------
  // Screenshot 3: 03-osm-campus-map.png
  // Switch to OSM Streets
  // -------------------------------------------------------------
  console.log('Switching to OSM Streets for 03-osm-campus-map.png...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const osmBtn = buttons.find(b => b.textContent && (b.textContent.includes('Streets') || b.textContent.includes('OSM') || b.textContent.includes('osm')));
    if (osmBtn) osmBtn.click();
  });
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: path.join(outputDir, '03-osm-campus-map.png') });
  copyToArtifact('03-osm-campus-map.png');

  // -------------------------------------------------------------
  // Screenshot 4: 04-boundary-and-gis-layers.png
  // Open layer menu
  // -------------------------------------------------------------
  console.log('Opening layer menu for 04-boundary-and-gis-layers.png...');
  await page.evaluate(() => {
    const layerBtn = Array.from(document.querySelectorAll('button')).find(b => b.title === 'Toggle GIS Vector Layers');
    if (layerBtn) layerBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outputDir, '04-boundary-and-gis-layers.png') });
  copyToArtifact('04-boundary-and-gis-layers.png');

  // Close layer menu
  await page.evaluate(() => {
    const layerBtn = Array.from(document.querySelectorAll('button')).find(b => b.title === 'Toggle GIS Vector Layers');
    if (layerBtn) layerBtn.click();
  });

  // -------------------------------------------------------------
  // Screenshot 5: 05-building-selection-dossier.png
  // Click on a building or select one in store
  // -------------------------------------------------------------
  console.log('Selecting Central Library for 05-building-selection-dossier.png...');
  await page.evaluate(() => {
    // Look for building cards or sidebar, or click on the map center
    const buildingsTab = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Buildings'));
    if (buildingsTab) buildingsTab.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.evaluate(() => {
    const libBtn = Array.from(document.querySelectorAll('*')).find(el => el.textContent && el.textContent.includes('Central Library') && el.tagName === 'BUTTON');
    if (libBtn) {
      libBtn.click();
    } else {
      // Direct click on map center or first building
      const anyBuilding = Array.from(document.querySelectorAll('button, div')).find(el => el.textContent && (el.textContent.includes('Admin') || el.textContent.includes('Library')));
      if (anyBuilding) anyBuilding.click();
    }
  });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: path.join(outputDir, '05-building-selection-dossier.png') });
  copyToArtifact('05-building-selection-dossier.png');

  // -------------------------------------------------------------
  // Screenshot 6: 06-gis-navigation-route.png
  // Calculate route between Gate and Library
  // -------------------------------------------------------------
  console.log('Opening Navigation for 06-gis-navigation-route.png...');
  await page.evaluate(() => {
    const navTab = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Navigation') || b.title === 'Navigation' || b.getAttribute('aria-label') === 'Navigation');
    if (navTab) navTab.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.evaluate(() => {
    // Select dropdowns or trigger route calculate
    const selects = Array.from(document.querySelectorAll('select'));
    if (selects.length >= 2) {
      selects[0].selectedIndex = 1;
      selects[0].dispatchEvent(new Event('change', { bubbles: true }));
      selects[1].selectedIndex = 2;
      selects[1].dispatchEvent(new Event('change', { bubbles: true }));
    }
    const calcBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && (b.textContent.includes('Find Route') || b.textContent.includes('Calculate') || b.textContent.includes('Route')));
    if (calcBtn) calcBtn.click();
  });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: path.join(outputDir, '06-gis-navigation-route.png') });
  copyToArtifact('06-gis-navigation-route.png');

  // -------------------------------------------------------------
  // Screenshot 7: 07-3d-campus-gis-minimap.png
  // Switch back to 3D Twin view and open mini-map
  // -------------------------------------------------------------
  console.log('Switching to 3D Twin for 07-3d-campus-gis-minimap.png...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const twinBtn = buttons.find(b => b.textContent && b.textContent.includes('3D Twin'));
    if (twinBtn) twinBtn.click();
  });
  await new Promise(r => setTimeout(r, 4000));
  await page.evaluate(() => {
    // Open minimap if button exists
    const miniMapBtn = Array.from(document.querySelectorAll('button')).find(b => b.title === 'Open GIS MiniMap' || (b.textContent && b.textContent.includes('MiniMap')));
    if (miniMapBtn) miniMapBtn.click();
  });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: path.join(outputDir, '07-3d-campus-gis-minimap.png') });
  copyToArtifact('07-3d-campus-gis-minimap.png');

  // -------------------------------------------------------------
  // Screenshot 8: 08-mobile-gis.png
  // Set mobile viewport (390 x 844) and switch to GIS
  // -------------------------------------------------------------
  console.log('Switching to mobile viewport for 08-mobile-gis.png...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const gisBtn = buttons.find(b => b.textContent && (b.textContent.includes('Campus GIS') || b.textContent.includes('GIS')));
    if (gisBtn) gisBtn.click();
  });
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: path.join(outputDir, '08-mobile-gis.png') });
  copyToArtifact('08-mobile-gis.png');

  await browser.close();
  console.log('All 8 screenshots captured successfully!');
}

run().catch(err => {
  console.error('Error during audit capture:', err);
  process.exit(1);
});
