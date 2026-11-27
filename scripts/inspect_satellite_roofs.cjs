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

const chromePath = findChrome();
const targetUrl = process.env.AUDIT_URL || 'https://pbrvits-dt.vercel.app/';
const outputDir = path.resolve(__dirname, '..', 'public', 'audit', 'satellite_inspection');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const buildingsData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'src', 'data', 'gis', 'buildings.json'), 'utf8'));

async function inspect() {
  console.log('Launching browser to inspect real satellite roofs...');
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
      '--window-size=1920,1080'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

  console.log('Navigating to', targetUrl);
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction(() => typeof window.useCampusStore !== 'undefined', { timeout: 30000 });
  await page.evaluate(() => {
    window.useCampusStore.getState().setAppViewMode('satellite');
    window.useCampusStore.getState().selectBuilding(null);
    window.useCampusStore.getState().setActiveSidebarTab(null);
  });
  await new Promise(r => setTimeout(r, 4000));

  // Configure map for straight-down inspection
  await page.evaluate(() => {
    const map = window.gisMapInstance;
    if (map) {
      map.setPitch(0);
      map.setBearing(0);
      // Disable 3D building extrusion height
      if (map.getLayer('campus-buildings-extrusion')) {
        map.setPaintProperty('campus-buildings-extrusion', 'fill-extrusion-height', 0);
        map.setPaintProperty('campus-buildings-extrusion', 'fill-extrusion-opacity', 0.2);
      }
      if (map.getLayer('campus-buildings-stroke')) {
        map.setPaintProperty('campus-buildings-stroke', 'line-width', 2.5);
        map.setPaintProperty('campus-buildings-stroke', 'line-color', '#ffffff');
      }
    }
  });

  // 1. Capture Full Campus Straight-Down Ortho View
  console.log('Capturing full campus ortho view...');
  await page.evaluate(() => {
    const map = window.gisMapInstance;
    if (map) {
      map.flyTo({
        center: [79.9835, 14.9132],
        zoom: 17.0,
        pitch: 0,
        bearing: 0,
        essential: true
      });
    }
  });
  await new Promise(r => setTimeout(r, 5000));
  await page.screenshot({ path: path.join(outputDir, '00-full-campus-ortho.png') });
  console.log('Captured 00-full-campus-ortho.png');

  // 2. Capture Each of the 14 Buildings Straight-Down at Zoom 18.8
  for (const feat of buildingsData.features) {
    const id = feat.properties.id;
    const [cLng, cLat] = feat.properties.centroid;
    console.log(`Inspecting building: ${id} at [${cLng}, ${cLat}]...`);

    // First: with polygon overlay
    await page.evaluate((lng, lat) => {
      const map = window.gisMapInstance;
      if (map) {
        if (map.getLayer('campus-buildings-stroke')) {
          map.setLayoutProperty('campus-buildings-stroke', 'visibility', 'visible');
        }
        if (map.getLayer('campus-buildings-extrusion')) {
          map.setLayoutProperty('campus-buildings-extrusion', 'visibility', 'visible');
        }
        map.flyTo({
          center: [lng, lat],
          zoom: 18.8,
          pitch: 0,
          bearing: 0,
          essential: true
        });
      }
    }, cLng, cLat);

    await new Promise(r => setTimeout(r, 3500));
    await page.screenshot({ path: path.join(outputDir, `${id}-overlay.png`) });

    // Second: raw satellite without polygon overlay to see the bare roof underneath
    await page.evaluate(() => {
      const map = window.gisMapInstance;
      if (map) {
        if (map.getLayer('campus-buildings-stroke')) {
          map.setLayoutProperty('campus-buildings-stroke', 'visibility', 'none');
        }
        if (map.getLayer('campus-buildings-extrusion')) {
          map.setLayoutProperty('campus-buildings-extrusion', 'visibility', 'none');
        }
      }
    });

    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(outputDir, `${id}-bare-roof.png`) });
    console.log(`Saved ${id}-overlay.png and ${id}-bare-roof.png`);
  }

  await browser.close();
  console.log('Inspection images saved to:', outputDir);
}

inspect().catch(err => {
  console.error('Inspection failed:', err);
  process.exit(1);
});
