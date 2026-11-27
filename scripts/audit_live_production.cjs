const fs = require('fs');
const path = require('path');
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

const outputDir = path.resolve(__dirname, '..', 'public', 'audit', 'production_live');
const artifactDir = 'C:\\Users\\tejag\\.gemini\\antigravity\\brain\\6c1052ac-5172-424c-ae6b-d2ed8b9d72b9\\audit\\production_live';

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
if (!fs.existsSync(artifactDir)) fs.mkdirSync(artifactDir, { recursive: true });

function copyToArtifact(filename) {
  const src = path.join(outputDir, filename);
  const dest = path.join(artifactDir, filename);
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(src, dest);
  const size = fs.statSync(src).size;
  console.log(`[PROD EVIDENCE] Saved & copied ${filename} (${(size / 1024).toFixed(1)} KB)`);
}

// Ensure all MapLibre satellite and vector tiles are completely finished loading
async function waitForMapSettle(page, timeoutMs = 15000) {
  await page.evaluate((timeout) => {
    return new Promise((resolve) => {
      const map = window.gisMapInstance;
      if (!map) return resolve({ status: 'no_map' });

      let settled = false;
      const done = (reason) => {
        if (!settled) {
          settled = true;
          map.off('idle', onIdle);
          clearTimeout(timer);
          resolve({ status: 'settled', reason });
        }
      };

      const onIdle = () => {
        if (map.areTilesLoaded()) {
          done('idle_and_tiles_loaded');
        }
      };

      if (map.loaded() && map.areTilesLoaded()) {
        return resolve({ status: 'already_loaded' });
      }

      map.on('idle', onIdle);
      const timer = setTimeout(() => done('timeout_safety'), timeout);
    });
  }, timeoutMs);

  // Extra stabilization time for WebGL tile rendering to settle
  await new Promise((r) => setTimeout(r, 2000));
}

const buildingsData = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '..', 'src', 'data', 'gis', 'buildings.json'), 'utf8')
);

async function run() {
  const chromePath = findChrome();
  console.log(`\n======================================================================`);
  console.log(` AUDITING LIVE PRODUCTION DEPLOYMENT: https://pbrvits-dt.vercel.app/`);
  console.log(` Chrome Path: ${chromePath}`);
  console.log(`======================================================================\n`);

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

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(err.message));

  // -------------------------------------------------------------
  // TEST 1: Direct Load of https://pbrvits-dt.vercel.app/?audit=true
  // -------------------------------------------------------------
  const auditUrl = 'https://pbrvits-dt.vercel.app/?audit=true';
  console.log(`Navigating to ${auditUrl} ...`);

  const response = await page.goto(auditUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });
  console.log(`HTTP Status: ${response.status()}`);

  await page.waitForFunction(() => typeof window.gisMapInstance !== 'undefined', { timeout: 25000 });
  await waitForMapSettle(page, 12000);

  // Inspect initial state directly upon page load WITHOUT manual interaction
  const initialAuditState = await page.evaluate(() => {
    const map = window.gisMapInstance;
    const store = window.useCampusStore ? window.useCampusStore.getState() : null;
    const auditPanel = document.querySelector('.gis-boundary-badge') || document.querySelector('.gis-audit-building-badge');
    const panelHeader = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Footprint Alignment Audit'));

    return {
      pitch: map.getPitch(),
      bearing: map.getBearing(),
      zoom: map.getZoom(),
      center: [map.getCenter().lng, map.getCenter().lat],
      appViewMode: store ? store.appViewMode : null,
      panelVisible: !!panelHeader,
      tilesLoaded: map.areTilesLoaded(),
      mapLoaded: map.loaded()
    };
  });

  console.log('\n[AUDIT MODE INITIAL STATE CHECK]');
  console.log(`  Pitch: ${initialAuditState.pitch}° (Expected: 0°)`);
  console.log(`  Bearing: ${initialAuditState.bearing}° (Expected: 0°)`);
  console.log(`  AppViewMode: ${initialAuditState.appViewMode} (Expected: satellite)`);
  console.log(`  Audit Panel Visible: ${initialAuditState.panelVisible} (Expected: true)`);
  console.log(`  Tiles Loaded: ${initialAuditState.tilesLoaded}`);

  console.log('\nCapturing 01-production-audit-mode-direct.png ...');
  await page.screenshot({ path: path.join(outputDir, '01-production-audit-mode-direct.png') });
  copyToArtifact('01-production-audit-mode-direct.png');

  // -------------------------------------------------------------
  // TEST 2: Core Academic Quadrangle (4 ALIGNED Academic Footprints)
  // -------------------------------------------------------------
  console.log('\nFocusing on 4 ALIGNED academic building footprints ...');
  await page.evaluate(() => {
    const map = window.gisMapInstance;
    map.flyTo({
      center: [79.9835, 14.9133],
      zoom: 17.8,
      pitch: 0,
      bearing: 0,
      essential: true
    });
  });
  await waitForMapSettle(page, 10000);

  console.log('Capturing 02-production-academic-quad-aligned.png ...');
  await page.screenshot({ path: path.join(outputDir, '02-production-academic-quad-aligned.png') });
  copyToArtifact('02-production-academic-quad-aligned.png');

  // -------------------------------------------------------------
  // TEST 3: Main Gate Infrastructure Portal
  // -------------------------------------------------------------
  console.log('\nFocusing on Main Gate entrance portal (aligned gateway infrastructure) ...');
  await page.evaluate(() => {
    const map = window.gisMapInstance;
    map.flyTo({
      center: [79.983655, 14.91234],
      zoom: 18.5,
      pitch: 0,
      bearing: 0,
      essential: true
    });
  });
  await waitForMapSettle(page, 10000);

  console.log('Capturing 03-production-main-gate-portal.png ...');
  await page.screenshot({ path: path.join(outputDir, '03-production-main-gate-portal.png') });
  copyToArtifact('03-production-main-gate-portal.png');

  // -------------------------------------------------------------
  // TEST 4: Sports Pavilion (PARTIALLY ALIGNED inside Sports Ground)
  // -------------------------------------------------------------
  console.log('\nFocusing on Sports Pavilion (PARTIALLY ALIGNED) ...');
  await page.evaluate(() => {
    const map = window.gisMapInstance;
    map.flyTo({
      center: [79.982245, 14.913100],
      zoom: 17.8,
      pitch: 0,
      bearing: 0,
      essential: true
    });
  });
  await waitForMapSettle(page, 10000);

  console.log('Capturing 04-production-sports-pavilion-partial.png ...');
  await page.screenshot({ path: path.join(outputDir, '04-production-sports-pavilion-partial.png') });
  copyToArtifact('04-production-sports-pavilion-partial.png');

  // -------------------------------------------------------------
  // TEST 5: Hostel Sector (UNVERIFIED & Excluded)
  // -------------------------------------------------------------
  console.log('\nFocusing on Hostel Residential Sector (UNVERIFIED) ...');
  await page.evaluate(() => {
    const map = window.gisMapInstance;
    map.flyTo({
      center: [79.9825, 14.9142],
      zoom: 17.5,
      pitch: 0,
      bearing: 0,
      essential: true
    });
  });
  await waitForMapSettle(page, 10000);

  console.log('Capturing 05-production-hostels-unverified-excluded.png ...');
  await page.screenshot({ path: path.join(outputDir, '05-production-hostels-unverified-excluded.png') });
  copyToArtifact('05-production-hostels-unverified-excluded.png');

  // -------------------------------------------------------------
  // TEST 6: Normal 3D Mode on Production (https://pbrvits-dt.vercel.app/)
  // -------------------------------------------------------------
  console.log('\nNavigating to normal 3D mode: https://pbrvits-dt.vercel.app/ ...');
  await page.goto('https://pbrvits-dt.vercel.app/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForFunction(() => typeof window.gisMapInstance !== 'undefined', { timeout: 25000 });
  await waitForMapSettle(page, 12000);

  console.log('Capturing 06-production-3d-overview.png ...');
  await page.screenshot({ path: path.join(outputDir, '06-production-3d-overview.png') });
  copyToArtifact('06-production-3d-overview.png');

  // -------------------------------------------------------------
  // TEST 7: Per-Building Close-Up Comparison for All 14 Structures
  // -------------------------------------------------------------
  console.log('\nCapturing individual per-building orthographic close-ups directly on production ...');
  const indivDir = path.join(outputDir, 'individual');
  if (!fs.existsSync(indivDir)) fs.mkdirSync(indivDir, { recursive: true });

  // Switch back to audit view for individual orthographic captures
  await page.goto(auditUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForFunction(() => typeof window.gisMapInstance !== 'undefined', { timeout: 25000 });
  await waitForMapSettle(page, 8000);

  for (const feat of buildingsData.features) {
    const id = feat.properties.id;
    const [cLng, cLat] = feat.properties.centroid;
    console.log(`Inspecting production roof alignment for ${id} ...`);

    await page.evaluate((lng, lat) => {
      const map = window.gisMapInstance;
      map.flyTo({
        center: [lng, lat],
        zoom: 18.0,
        pitch: 0,
        bearing: 0,
        essential: true
      });
    }, cLng, cLat);

    await waitForMapSettle(page, 8000);

    const filename = `individual/${id}-prod.png`;
    await page.screenshot({ path: path.join(outputDir, filename) });
    copyToArtifact(filename);
  }

  console.log('\n======================================================================');
  console.log(` PRODUCTION AUDIT COMPLETED SUCCESSFULLY!`);
  console.log(` Console Errors Captured: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.log(' Errors:', consoleErrors);
  }
  console.log('======================================================================\n');

  await browser.close();
}

run().catch((err) => {
  console.error('Production audit failed:', err);
  process.exit(1);
});
