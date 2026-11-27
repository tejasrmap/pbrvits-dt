const fs = require('fs');
const path = require('path');

const buildingsPath = path.resolve(__dirname, '..', 'src', 'data', 'gis', 'buildings.json');
const buildingsGeojsonPath = path.resolve(__dirname, '..', 'src', 'data', 'gis', 'buildings.geojson');

const data = JSON.parse(fs.readFileSync(buildingsPath, 'utf8'));

// Update alignmentStatus and corrections
for (const feat of data.features) {
  const p = feat.properties;
  
  if (['ece-eee-block', 'mech-civil-block', 'admin-block', 'central-library', 'main-gate'].includes(p.id)) {
    p.alignmentStatus = 'ALIGNED';
    p.verificationStatus = 'OSM-MAPPED';
    p.accuracyLevel = 'Authoritative OpenStreetMap vector geometry verified against ESRI satellite roofline';
  } else if (['girls-hostel', 'boys-hostel'].includes(p.id)) {
    p.alignmentStatus = 'UNVERIFIED';
    p.verificationStatus = 'UNVERIFIED';
    p.accuracyLevel = 'Unverified: Insufficient independent ground roof evidence; excluded from verified footprint layer';
  } else {
    p.alignmentStatus = 'PARTIALLY ALIGNED';
    p.verificationStatus = 'IMAGE-ESTIMATED';
    p.accuracyLevel = 'Partially Aligned: Campus zone location verified; roof perimeter approximate';
  }

  // Specific correction for sports-pavilion:
  // Move off the dividing road (79.982645) into the actual sports grounds boundary (Way 1297896001) at 79.98225
  if (p.id === 'sports-pavilion') {
    feat.geometry.coordinates = [
      [
        [79.98215, 14.91295],
        [79.98235, 14.91296],
        [79.98234, 14.91325],
        [79.98214, 14.91324],
        [79.98215, 14.91295]
      ]
    ];
    p.centroid = [79.982245, 14.91310];
    p.source = 'PBR VITS Sports Grounds East Sideline (OSM Way 1297896001 interior)';
    p.alignmentStatus = 'PARTIALLY ALIGNED';
  }
}

fs.writeFileSync(buildingsPath, JSON.stringify(data, null, 2), 'utf8');
fs.writeFileSync(buildingsGeojsonPath, JSON.stringify(data, null, 2), 'utf8');

console.log('Successfully updated buildings.json and buildings.geojson with alignmentStatus and sports-pavilion correction.');
