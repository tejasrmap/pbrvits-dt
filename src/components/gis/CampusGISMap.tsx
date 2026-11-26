import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  Layers,
  Compass,
  Plus,
  Minus,
  Navigation,
  Globe,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Eye
} from 'lucide-react';
import {
  PBR_VITS_ORIGIN,
  BASEMAP_PROVIDERS,
  type BasemapId,
  campusBoundaryGeoJSON,
  buildingsGeoJSON,
  roadsGeoJSON,
  pathwaysGeoJSON,
  sportsFacilitiesGeoJSON
} from '../../data/gis';
import { useCampusStore } from '../../store/useCampusStore';

interface CampusGISMapProps {
  initialBasemap?: BasemapId;
  onClose?: () => void;
  className?: string;
}

export const CampusGISMap: React.FC<CampusGISMapProps> = ({
  initialBasemap = 'satellite',
  className = ''
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);

  const selectedBuilding = useCampusStore((s) => s.selectedBuilding);
  const selectBuilding = useCampusStore((s) => s.selectBuilding);
  const activeRoute = useCampusStore((s) => s.activeRoute);
  const appViewMode = useCampusStore((s) => s.appViewMode);
  const setAppViewMode = useCampusStore((s) => s.setAppViewMode);

  const [currentBasemap, setCurrentBasemap] = useState<BasemapId>(initialBasemap);
  const [cursorCoords, setCursorCoords] = useState<{ lng: number; lat: number }>({
    lng: PBR_VITS_ORIGIN.lng,
    lat: PBR_VITS_ORIGIN.lat
  });
  const [mapZoom, setLocalMapZoom] = useState<number>(17);
  const [mapPitch, setLocalMapPitch] = useState<number>(45);
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);
  const [layerVisibility, setLayerVisibility] = useState({
    boundary: true,
    buildings: true,
    roads: true,
    pathways: true,
    sports: true,
    labels: true
  });

  const getStyleForBasemap = useCallback((basemapId: BasemapId): maplibregl.StyleSpecification => {
    const provider = BASEMAP_PROVIDERS[basemapId];
    return {
      version: 8,
      sources: {
        'basemap-tiles': {
          type: 'raster',
          tiles: [provider.url],
          tileSize: 256,
          attribution: provider.attribution,
          maxzoom: provider.maxZoom
        }
      },
      layers: [
        {
          id: 'basemap-layer',
          type: 'raster',
          source: 'basemap-tiles',
          minzoom: 0,
          maxzoom: 22
        }
      ]
    };
  }, []);

  const addCampusVectorLayers = useCallback((map: maplibregl.Map) => {
    // 1. Campus Boundary Source & Layers
    if (!map.getSource('campus-boundary')) {
      map.addSource('campus-boundary', {
        type: 'geojson',
        data: campusBoundaryGeoJSON as any
      });

      map.addLayer({
        id: 'campus-boundary-fill',
        type: 'fill',
        source: 'campus-boundary',
        paint: {
          'fill-color': [
            'match',
            ['get', 'id'],
            'pbr-vits-academic-boundary', '#0284c7',
            'pbr-vits-playground-boundary', '#16a34a',
            '#0369a1'
          ],
          'fill-opacity': 0.12
        }
      });

      map.addLayer({
        id: 'campus-boundary-stroke',
        type: 'line',
        source: 'campus-boundary',
        paint: {
          'line-color': [
            'match',
            ['get', 'id'],
            'pbr-vits-academic-boundary', '#38bdf8',
            'pbr-vits-playground-boundary', '#4ade80',
            '#0ea5e9'
          ],
          'line-width': 2.5,
          'line-dasharray': [2, 1]
        }
      });
    }

    // 2. Sports Facilities / Grounds
    if (!map.getSource('sports-facilities')) {
      map.addSource('sports-facilities', {
        type: 'geojson',
        data: sportsFacilitiesGeoJSON as any
      });

      map.addLayer({
        id: 'sports-facilities-fill',
        type: 'fill',
        source: 'sports-facilities',
        paint: {
          'fill-color': '#22c55e',
          'fill-opacity': 0.25
        }
      });

      map.addLayer({
        id: 'sports-facilities-stroke',
        type: 'line',
        source: 'sports-facilities',
        paint: {
          'line-color': '#16a34a',
          'line-width': 2
        }
      });
    }

    // 3. Roads & Avenues
    if (!map.getSource('campus-roads')) {
      map.addSource('campus-roads', {
        type: 'geojson',
        data: roadsGeoJSON as any
      });

      map.addLayer({
        id: 'campus-roads-casing',
        type: 'line',
        source: 'campus-roads',
        paint: {
          'line-color': '#0f172a',
          'line-width': ['interpolate', ['linear'], ['zoom'], 15, 6, 18, 14],
          'line-opacity': 0.8
        }
      });

      map.addLayer({
        id: 'campus-roads-inner',
        type: 'line',
        source: 'campus-roads',
        paint: {
          'line-color': [
            'match',
            ['get', 'category'],
            'primary', '#f59e0b',
            'campus_artery', '#38bdf8',
            '#cbd5e1'
          ],
          'line-width': ['interpolate', ['linear'], ['zoom'], 15, 4, 18, 10]
        }
      });
    }

    // 4. Pedestrian Pathways
    if (!map.getSource('campus-pathways')) {
      map.addSource('campus-pathways', {
        type: 'geojson',
        data: pathwaysGeoJSON as any
      });

      map.addLayer({
        id: 'campus-pathways-line',
        type: 'line',
        source: 'campus-pathways',
        paint: {
          'line-color': '#38bdf8',
          'line-width': 2.5,
          'line-dasharray': [3, 2]
        }
      });
    }

    // 5. Buildings 3D Footprint Extrusion & Polygons
    if (!map.getSource('campus-buildings')) {
      map.addSource('campus-buildings', {
        type: 'geojson',
        data: buildingsGeoJSON as any
      });

      map.addLayer({
        id: 'campus-buildings-extrusion',
        type: 'fill-extrusion',
        source: 'campus-buildings',
        paint: {
          'fill-extrusion-color': [
            'match',
            ['get', 'verificationStatus'],
            'VERIFIED', '#0284c7',
            'APPROXIMATE', '#d97706',
            'ESTIMATED', '#9333ea',
            '#64748b'
          ],
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.85
        }
      });

      map.addLayer({
        id: 'campus-buildings-stroke',
        type: 'line',
        source: 'campus-buildings',
        paint: {
          'line-color': '#ffffff',
          'line-width': 1.5,
          'line-opacity': 0.9
        }
      });
    }

    // 6. Active Walking Route
    if (!map.getSource('active-route')) {
      map.addSource('active-route', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      map.addLayer({
        id: 'active-route-glow',
        type: 'line',
        source: 'active-route',
        paint: {
          'line-color': '#00f5ff',
          'line-width': 8,
          'line-blur': 4,
          'line-opacity': 0.7
        }
      });

      map.addLayer({
        id: 'active-route-line',
        type: 'line',
        source: 'active-route',
        paint: {
          'line-color': '#ffffff',
          'line-width': 3.5
        }
      });
    }
  }, []);

  // Initialize MapLibre
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getStyleForBasemap(currentBasemap),
      center: [PBR_VITS_ORIGIN.lng, PBR_VITS_ORIGIN.lat],
      zoom: 17.2,
      pitch: 45,
      bearing: 0
    });

    mapRef.current = map;
    popupRef.current = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 15,
      className: 'gis-building-popup'
    });

    map.on('load', () => {
      addCampusVectorLayers(map);
    });

    map.on('mousemove', (e: maplibregl.MapMouseEvent) => {
      setCursorCoords({
        lng: Number(e.lngLat.lng.toFixed(6)),
        lat: Number(e.lngLat.lat.toFixed(6))
      });
    });

    map.on('zoom', () => {
      setLocalMapZoom(Number(map.getZoom().toFixed(1)));
    });

    map.on('pitch', () => {
      setLocalMapPitch(Math.round(map.getPitch()));
    });

    // Hover tooltip for buildings
    map.on('mousemove', 'campus-buildings-extrusion', (e: any) => {
      if (!e.features || e.features.length === 0) return;
      map.getCanvas().style.cursor = 'pointer';

      const feat = e.features[0];
      const props = feat.properties as any;
      const statusColor =
        props.verificationStatus === 'VERIFIED'
          ? '#22c55e'
          : props.verificationStatus === 'APPROXIMATE'
          ? '#f59e0b'
          : '#a855f7';

      const statusBadge = `
        <span style="display:inline-flex;align-items:center;gap:3px;font-size:10px;font-weight:700;color:${statusColor};background:${statusColor}22;padding:2px 6px;border-radius:4px;border:1px solid ${statusColor}44;">
          ● ${props.verificationStatus}
        </span>
      `;

      const html = `
        <div style="background:#0f172a;color:#f8fafc;padding:10px;border-radius:8px;font-family:sans-serif;font-size:12px;border:1px solid rgba(255,255,255,0.15);box-shadow:0 10px 25px rgba(0,0,0,0.5);max-width:260px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
            <strong style="font-size:13px;color:#38bdf8;">${props.name}</strong>
          </div>
          <div style="margin-bottom:6px;">${statusBadge}</div>
          <div style="color:#94a3b8;font-size:11px;margin-bottom:4px;"><strong>Category:</strong> ${props.category} | ${props.floors} Floors (${props.height}m)</div>
          <div style="color:#cbd5e1;font-size:10px;border-top:1px solid #1e293b;padding-top:4px;"><strong>Source:</strong> ${props.source}</div>
          <div style="color:#38bdf8;font-size:10px;margin-top:6px;font-style:italic;">Click to select and view 3D dossier</div>
        </div>
      `;

      popupRef.current?.setLngLat(e.lngLat).setHTML(html).addTo(map);
    });

    map.on('mouseleave', 'campus-buildings-extrusion', () => {
      map.getCanvas().style.cursor = '';
      popupRef.current?.remove();
    });

    // Click building on map
    map.on('click', 'campus-buildings-extrusion', (e: any) => {
      if (!e.features || e.features.length === 0) return;
      const bId = e.features[0].properties?.id;
      if (bId) {
        selectBuilding(bId);
      }
    });

    return () => {
      popupRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, [getStyleForBasemap, currentBasemap, addCampusVectorLayers, selectBuilding]);

  // Sync selected building to Map center
  useEffect(() => {
    if (!mapRef.current || !selectedBuilding) return;
    const bId = selectedBuilding.id;

    // Find geo coords from buildingsGeoJSON
    const feat = (buildingsGeoJSON as any).features.find((f: any) => f.id === bId);
    if (feat && feat.properties?.centroid) {
      const [lng, lat] = feat.properties.centroid;
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 18.5,
        pitch: 55,
        essential: true,
        duration: 1500
      });
    }
  }, [selectedBuilding]);

  // Sync Active Route to GIS Map
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    if (!map.isStyleLoaded()) return;

    const source = map.getSource('active-route') as maplibregl.GeoJSONSource;
    if (!source) return;

    if (activeRoute && activeRoute.geoPoints && activeRoute.geoPoints.length > 1) {
      source.setData({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              distanceMeters: activeRoute.distanceMeters,
              walkingMinutes: activeRoute.walkingMinutes
            },
            geometry: {
              type: 'LineString',
              coordinates: activeRoute.geoPoints
            }
          }
        ]
      });

      // Fit map bounds to route
      const bounds = new maplibregl.LngLatBounds();
      activeRoute.geoPoints.forEach((coord) => bounds.extend(coord as [number, number]));
      map.fitBounds(bounds, { padding: 60, maxZoom: 18.5, duration: 1200 });
    } else {
      source.setData({
        type: 'FeatureCollection',
        features: []
      });
    }
  }, [activeRoute]);

  // Toggle basemap style
  const handleBasemapChange = (newBasemap: BasemapId) => {
    setCurrentBasemap(newBasemap);
    if (!mapRef.current) return;
    const map = mapRef.current;
    const center = map.getCenter();
    const zoom = map.getZoom();
    const pitch = map.getPitch();
    const bearing = map.getBearing();

    map.setStyle(getStyleForBasemap(newBasemap));
    map.once('style.load', () => {
      addCampusVectorLayers(map);
      map.setCenter(center);
      map.setZoom(zoom);
      map.setPitch(pitch);
      map.setBearing(bearing);
    });
  };

  // Toggle overlay layer visibility
  const toggleLayer = (layerKey: keyof typeof layerVisibility) => {
    const updated = !layerVisibility[layerKey];
    setLayerVisibility((prev) => ({ ...prev, [layerKey]: updated }));

    if (!mapRef.current) return;
    const map = mapRef.current;

    const layerMap: Record<string, string[]> = {
      boundary: ['campus-boundary-fill', 'campus-boundary-stroke'],
      buildings: ['campus-buildings-extrusion', 'campus-buildings-stroke'],
      roads: ['campus-roads-casing', 'campus-roads-inner'],
      pathways: ['campus-pathways-line'],
      sports: ['sports-facilities-fill', 'sports-facilities-stroke']
    };

    const targetLayerIds = layerMap[layerKey] || [];
    targetLayerIds.forEach((id) => {
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, 'visibility', updated ? 'visible' : 'none');
      }
    });
  };

  return (
    <div className={`relative w-full h-full bg-slate-950 overflow-hidden select-none ${className}`}>
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left: GIS Header Pill */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="glass-panel px-3.5 py-2 rounded-xl border border-white/10 shadow-2xl flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>PBR VITS Campus GIS</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30">
                EPSG:4326 WGS84
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Anchor: 14.91326° N, 79.98367° E | Kavali, AP
            </div>
          </div>
        </div>

        {/* View Mode Switcher Pill */}
        <div className="glass-panel p-1 rounded-xl border border-white/10 shadow-xl flex items-center gap-1">
          <button
            onClick={() => setAppViewMode('3d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              appViewMode === '3d'
                ? 'bg-sky-500 text-white shadow-lg'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>3D Digital Twin</span>
          </button>
          <button
            onClick={() => setAppViewMode('gis')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              appViewMode === 'gis'
                ? 'bg-sky-500 text-white shadow-lg'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>GIS Map</span>
          </button>
          <button
            onClick={() => {
              setAppViewMode('firstPerson');
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>First Person</span>
          </button>
        </div>
      </div>

      {/* Top Right: Basemap Selector & Layer Control */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        {/* Basemap Switcher Dropdown */}
        <div className="glass-panel p-1 rounded-xl border border-white/10 shadow-xl flex items-center gap-1">
          {(['satellite', 'osm', 'topo', 'cartoDark'] as BasemapId[]).map((bm) => (
            <button
              key={bm}
              onClick={() => handleBasemapChange(bm)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer capitalize ${
                currentBasemap === bm
                  ? 'bg-sky-500/90 text-white font-semibold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {bm === 'osm' ? 'Streets' : bm === 'cartoDark' ? 'Light' : bm}
            </button>
          ))}
        </div>

        {/* Layer Toggles Menu Button */}
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            title="Toggle GIS Vector Layers"
            className="glass-panel p-2.5 rounded-xl border border-white/10 hover:border-sky-400/50 shadow-xl text-slate-200 hover:text-white transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4" />
          </button>

          {showLayerMenu && (
            <div className="absolute right-0 top-12 glass-panel p-3 rounded-2xl border border-white/15 shadow-2xl w-56 flex flex-col gap-2 z-20">
              <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                GIS Vector Overlays
              </div>
              {[
                { key: 'boundary', label: 'Cadastral Boundary', color: '#38bdf8' },
                { key: 'buildings', label: '3D Building Footprints', color: '#0284c7' },
                { key: 'roads', label: 'Road Network', color: '#f59e0b' },
                { key: 'pathways', label: 'Pedestrian Walkways', color: '#38bdf8' },
                { key: 'sports', label: 'Sports Grounds (OSM)', color: '#22c55e' }
              ].map(({ key, label, color }) => (
                <label
                  key={key}
                  className="flex items-center justify-between text-xs text-slate-200 hover:bg-white/5 p-1.5 rounded-lg cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                    {label}
                  </span>
                  <input
                    type="checkbox"
                    checked={(layerVisibility as any)[key]}
                    onChange={() => toggleLayer(key as any)}
                    className="rounded accent-sky-500"
                  />
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Middle: Interactive Map Controls */}
      <div className="absolute right-4 top-24 z-10 flex flex-col gap-2">
        <button
          onClick={() => mapRef.current?.zoomIn()}
          title="Zoom In"
          className="glass-panel p-2 rounded-xl border border-white/10 hover:border-sky-400 shadow-xl text-slate-200 hover:text-white transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => mapRef.current?.zoomOut()}
          title="Zoom Out"
          className="glass-panel p-2 rounded-xl border border-white/10 hover:border-sky-400 shadow-xl text-slate-200 hover:text-white transition-all cursor-pointer"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            if (!mapRef.current) return;
            const newPitch = mapPitch > 20 ? 0 : 55;
            mapRef.current.easeTo({ pitch: newPitch, duration: 800 });
          }}
          title="Toggle 2D / 2.5D Tilt View"
          className="glass-panel p-2 rounded-xl border border-white/10 hover:border-sky-400 shadow-xl text-slate-200 hover:text-white transition-all cursor-pointer text-[10px] font-bold"
        >
          {mapPitch > 20 ? '2D' : '3D'}
        </button>
        <button
          onClick={() => {
            mapRef.current?.easeTo({ bearing: 0, pitch: 45, duration: 800 });
          }}
          title="Reset North Orientation"
          className="glass-panel p-2 rounded-xl border border-white/10 hover:border-sky-400 shadow-xl text-slate-200 hover:text-white transition-all cursor-pointer"
        >
          <Compass className="w-4 h-4 text-rose-400" />
        </button>
        <button
          onClick={() => {
            mapRef.current?.flyTo({
              center: [PBR_VITS_ORIGIN.lng, PBR_VITS_ORIGIN.lat],
              zoom: 17.2,
              pitch: 45,
              bearing: 0,
              duration: 1200
            });
          }}
          title="Recenter on PBR VITS Academic Core"
          className="glass-panel p-2 rounded-xl border border-white/10 hover:border-sky-400 shadow-xl text-slate-200 hover:text-white transition-all cursor-pointer"
        >
          <Navigation className="w-4 h-4 text-sky-400" />
        </button>
      </div>

      {/* Bottom Left: GIS Legend */}
      <div className="absolute bottom-6 left-4 z-10 glass-panel p-3 rounded-2xl border border-white/10 shadow-2xl max-w-xs flex flex-col gap-2">
        <div className="text-[11px] font-bold text-white flex items-center justify-between">
          <span>Cadastral Verification Legend</span>
          <span className="text-[9px] text-slate-400">PBR VITS GIS</span>
        </div>
        <div className="flex flex-col gap-1.5 text-[10px] text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span><strong>VERIFIED:</strong> OSM Footprint & GPS Survey (Admin, ECE, Mech, Library, Gate)</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span><strong>APPROXIMATE:</strong> Architectural evidence (CSE, Workshops, Auditorium, Sports)</span>
          </div>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span><strong>ESTIMATED:</strong> Zone sector estimate (Hostels, Canteen)</span>
          </div>
        </div>
      </div>

      {/* Bottom Center: Live Coordinates Readout */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 glass-panel px-4 py-1.5 rounded-full border border-white/10 shadow-xl font-mono text-[11px] text-slate-300 flex items-center gap-4">
        <div>
          <span className="text-slate-400">LAT:</span>{' '}
          <strong className="text-white">{cursorCoords.lat.toFixed(6)}° N</strong>
        </div>
        <div className="w-1 h-3 bg-white/20" />
        <div>
          <span className="text-slate-400">LON:</span>{' '}
          <strong className="text-white">{cursorCoords.lng.toFixed(6)}° E</strong>
        </div>
        <div className="w-1 h-3 bg-white/20" />
        <div>
          <span className="text-slate-400">ZOOM:</span>{' '}
          <strong className="text-sky-400">{mapZoom}</strong>
        </div>
      </div>

      {/* Bottom Right: Active Route Details Pill if active */}
      {activeRoute && (
        <div className="absolute bottom-6 right-4 z-10 glass-panel p-3 rounded-2xl border border-sky-400/30 shadow-2xl max-w-sm flex flex-col gap-1 animate-in fade-in">
          <div className="text-xs font-bold text-sky-300 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Active GIS Pedestrian Route</span>
          </div>
          <div className="text-[11px] text-slate-200">
            Distance: <strong>{activeRoute.distanceMeters} m</strong> (~{activeRoute.walkingMinutes} min walk)
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            {activeRoute.instructions[0]} &rarr; {activeRoute.instructions[activeRoute.instructions.length - 1]}
          </div>
        </div>
      )}
    </div>
  );
};
