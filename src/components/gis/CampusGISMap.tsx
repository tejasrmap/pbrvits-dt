import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Ensure web worker resolves reliably without cross-origin or bundling failure
if (typeof window !== 'undefined') {
  maplibregl.setWorkerUrl('/maplibre-gl-worker.mjs');
}
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
  Eye,
  Crosshair
} from 'lucide-react';
import { FootprintAuditPanel, type AuditLayerState } from './FootprintAuditPanel';
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
  const boundaryMarkersRef = useRef<maplibregl.Marker[]>([]);
  const auditMarkersRef = useRef<maplibregl.Marker[]>([]);

  const selectedBuilding = useCampusStore((s) => s.selectedBuilding);
  const selectBuilding = useCampusStore((s) => s.selectBuilding);
  const activeRoute = useCampusStore((s) => s.activeRoute);
  const appViewMode = useCampusStore((s) => s.appViewMode);
  const setAppViewMode = useCampusStore((s) => s.setAppViewMode);

  const [isAuditMode, setIsAuditMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      return p.get('audit') === 'true';
    }
    return false;
  });

  const [auditLayers, setAuditLayers] = useState<AuditLayerState>({
    footprints: true,
    verifiedOnly: false,
    campusBoundary: true,
    playground: true,
    roads: true,
    vecBoundary: true
  });

  const [currentBasemap, setCurrentBasemap] = useState<BasemapId>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      if (p.get('audit') === 'true') return 'satellite';
    }
    return initialBasemap;
  });
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
            'neighboring-vec-campus', '#f59e0b',
            '#0369a1'
          ],
          'fill-opacity': 0.06
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
            'neighboring-vec-campus', '#f59e0b',
            '#0ea5e9'
          ],
          'line-width': 2.0,
          'line-dasharray': [3, 2]
        }
      });

      // Individual boundary layers for granular audit toggling
      map.addLayer({
        id: 'campus-boundary-academic-stroke',
        type: 'line',
        source: 'campus-boundary',
        filter: ['==', ['get', 'id'], 'pbr-vits-academic-boundary'],
        layout: { visibility: 'none' },
        paint: {
          'line-color': '#38bdf8',
          'line-width': 2.5,
          'line-dasharray': [3, 2]
        }
      });

      map.addLayer({
        id: 'campus-boundary-playground-stroke',
        type: 'line',
        source: 'campus-boundary',
        filter: ['==', ['get', 'id'], 'pbr-vits-playground-boundary'],
        layout: { visibility: 'none' },
        paint: {
          'line-color': '#4ade80',
          'line-width': 2.5,
          'line-dasharray': [3, 2]
        }
      });

      map.addLayer({
        id: 'campus-boundary-vec-stroke',
        type: 'line',
        source: 'campus-boundary',
        filter: ['==', ['get', 'id'], 'neighboring-vec-campus'],
        layout: { visibility: 'none' },
        paint: {
          'line-color': '#f59e0b',
          'line-width': 2.5,
          'line-dasharray': [4, 2]
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
          'fill-opacity': 0.15
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
        filter: [
          'all',
          ['!=', ['get', 'id'], 'main-gate'],
          ['!=', ['get', 'alignmentStatus'], 'UNVERIFIED']
        ],
        paint: {
          'fill-extrusion-color': [
            'match',
            ['get', 'id'],
            'admin-block', '#f6f0e6', // Visvodaya Bhavan warm institutional limestone
            'ece-eee-block', '#ece6dc', // ECE academic concrete masonry
            'mech-civil-block', '#e2ded6', // Mechanical engineering masonry
            'central-library', '#dbe4ee', // Central Library slate-blue tone
            'sh-mba-block', '#eae4dc', // S&H classroom wing
            'canteen-cafeteria', '#ded7cc', // Student dining pavilion
            'central-workshops', '#d2cdc4', // High-bay mechanical workshops
            'solar-substation', '#64748b', // Electrical utility enclosure
            'sports-pavilion', '#e2dcd3', // Athletics ground pavilion
            '#e2e8f0'
          ],
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': [
            'case',
            ['==', ['get', 'alignmentStatus'], 'PARTIALLY ALIGNED'], 0.72,
            0.92
          ]
        }
      });

      map.addLayer({
        id: 'campus-buildings-stroke',
        type: 'line',
        source: 'campus-buildings',
        filter: [
          'all',
          ['!=', ['get', 'id'], 'main-gate'],
          ['!=', ['get', 'alignmentStatus'], 'UNVERIFIED']
        ],
        paint: {
          'line-color': '#ffffff',
          'line-width': 1.5,
          'line-opacity': 0.85
        }
      });

      // Audit 2D Footprint Overlays (Extrusion-free nadir comparison)
      // 1. ALIGNED (OSM-Mapped / Ground Verified) - Emerald Green
      map.addLayer({
        id: 'campus-buildings-verified-fill',
        type: 'fill',
        source: 'campus-buildings',
        filter: ['==', ['get', 'alignmentStatus'], 'ALIGNED'],
        layout: { visibility: 'none' },
        paint: {
          'fill-color': '#22c55e',
          'fill-opacity': 0.15
        }
      });
      map.addLayer({
        id: 'campus-buildings-verified-stroke',
        type: 'line',
        source: 'campus-buildings',
        filter: ['==', ['get', 'alignmentStatus'], 'ALIGNED'],
        layout: { visibility: 'none' },
        paint: {
          'line-color': '#22c55e',
          'line-width': 2.5
        }
      });

      // 2. PARTIALLY ALIGNED (Campus Zone Estimated) - Amber
      map.addLayer({
        id: 'campus-buildings-estimated-fill',
        type: 'fill',
        source: 'campus-buildings',
        filter: ['==', ['get', 'alignmentStatus'], 'PARTIALLY ALIGNED'],
        layout: { visibility: 'none' },
        paint: {
          'fill-color': '#f59e0b',
          'fill-opacity': 0.10
        }
      });
      map.addLayer({
        id: 'campus-buildings-estimated-stroke',
        type: 'line',
        source: 'campus-buildings',
        filter: ['==', ['get', 'alignmentStatus'], 'PARTIALLY ALIGNED'],
        layout: { visibility: 'none' },
        paint: {
          'line-color': '#f59e0b',
          'line-width': 2.0,
          'line-dasharray': [4, 3]
        }
      });

      // 3. UNVERIFIED (Estimated Quad - Excluded from Verified Layer) - Crimson Red
      map.addLayer({
        id: 'campus-buildings-unverified-fill',
        type: 'fill',
        source: 'campus-buildings',
        filter: ['==', ['get', 'alignmentStatus'], 'UNVERIFIED'],
        layout: { visibility: 'none' },
        paint: {
          'fill-color': '#ef4444',
          'fill-opacity': 0.06
        }
      });
      map.addLayer({
        id: 'campus-buildings-unverified-stroke',
        type: 'line',
        source: 'campus-buildings',
        filter: ['==', ['get', 'alignmentStatus'], 'UNVERIFIED'],
        layout: { visibility: 'none' },
        paint: {
          'line-color': '#ef4444',
          'line-width': 1.5,
          'line-dasharray': [2, 2]
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

    const isAuditParam = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('audit') === 'true';
    const initialPitch = isAuditParam || isAuditMode ? 0 : appViewMode === '3d' ? 55 : appViewMode === 'satellite' ? 0 : 45;
    const initialBearing = isAuditParam || isAuditMode ? 0 : appViewMode === '3d' ? -15 : 0;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getStyleForBasemap(currentBasemap),
      center: [PBR_VITS_ORIGIN.lng, PBR_VITS_ORIGIN.lat],
      zoom: 17.0,
      pitch: initialPitch,
      bearing: initialBearing,
      maxPitch: 75
    });

    mapRef.current = map;
    (window as any).gisMapInstance = map;
    popupRef.current = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 15,
      className: 'gis-building-popup'
    });

    map.on('load', () => {
      addCampusVectorLayers(map);

      if (isAuditParam || isAuditMode) {
        map.setPitch(0);
        map.setBearing(0);
      }

      // Add realistic 3D sunlight
      map.setLight({
        anchor: 'viewport',
        color: '#ffffff',
        intensity: 0.52,
        position: [1.2, 210, 52]
      });

      // Create boundary label badges
      const createBadge = (text: string, color: string, dotColor: string) => {
        const el = document.createElement('div');
        el.className = 'gis-boundary-badge';
        el.style.cssText = `background: ${color}; backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.4); color: white; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; box-shadow: 0 4px 12px rgba(0,0,0,0.4); pointer-events: none; display: flex; align-items: center; gap: 5px;`;
        el.innerHTML = `<span style="width: 7px; height: 7px; border-radius: 50%; background: ${dotColor};"></span>${text}`;
        return el;
      };

      const m1 = new maplibregl.Marker({ element: createBadge('PBR VITS Academic Campus', 'rgba(14, 165, 233, 0.9)', '#38bdf8') })
        .setLngLat([79.9835, 14.9133])
        .addTo(map);

      const m2 = new maplibregl.Marker({ element: createBadge('PBR VITS Sports Grounds', 'rgba(22, 163, 74, 0.9)', '#4ade80') })
        .setLngLat([79.9818, 14.9130])
        .addTo(map);

      const m3 = new maplibregl.Marker({ element: createBadge('Neighboring: Visvodaya Engg College (VEC)', 'rgba(217, 119, 6, 0.9)', '#fde047') })
        .setLngLat([79.9858, 14.9133])
        .addTo(map);

      boundaryMarkersRef.current = [m1, m2, m3];
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
        props.verificationStatus === 'OSM-MAPPED'
          ? '#22c55e'
          : props.verificationStatus === 'IMAGE-ESTIMATED'
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
      boundaryMarkersRef.current.forEach((m) => m.remove());
      boundaryMarkersRef.current = [];
      popupRef.current?.remove();
      map.remove();
      mapRef.current = null;
      delete (window as any).gisMapInstance;
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
  const handleBasemapChange = useCallback((newBasemap: BasemapId) => {
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
  }, [addCampusVectorLayers, getStyleForBasemap]);

  // Sync appViewMode with basemap and camera
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (appViewMode === '3d') {
      if (currentBasemap !== 'satellite') handleBasemapChange('satellite');
      map.easeTo({ pitch: 55, bearing: -15, duration: 800 });
    } else if (appViewMode === 'satellite') {
      if (currentBasemap !== 'satellite') handleBasemapChange('satellite');
      map.easeTo({ pitch: 0, bearing: 0, duration: 800 });
    } else if (appViewMode === 'gis') {
      if (currentBasemap === 'satellite') handleBasemapChange('osm');
      map.easeTo({ pitch: 45, bearing: 0, duration: 800 });
    } else if (appViewMode === 'firstPerson') {
      if (currentBasemap !== 'satellite') handleBasemapChange('satellite');
      map.easeTo({ pitch: 75, zoom: 18.5, duration: 900 });
    }
  }, [appViewMode, currentBasemap, handleBasemapChange]);

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

  // Handle toggling Audit Mode
  const handleToggleAuditMode = useCallback(() => {
    setIsAuditMode((prev) => {
      const nextState = !prev;
      if (!mapRef.current) return nextState;
      const map = mapRef.current;

      if (nextState) {
        if (currentBasemap !== 'satellite') {
          handleBasemapChange('satellite');
        }
        map.easeTo({
          pitch: 0,
          bearing: 0,
          zoom: Math.max(map.getZoom(), 17.2),
          duration: 900
        });
      } else {
        map.easeTo({
          pitch: 45,
          bearing: 0,
          duration: 900
        });
      }
      return nextState;
    });
  }, [currentBasemap, handleBasemapChange]);

  const handleAuditToggleLayer = useCallback((key: keyof AuditLayerState) => {
    setAuditLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleAuditSetVerifiedOnly = useCallback((verifiedOnly: boolean) => {
    setAuditLayers((prev) => ({ ...prev, verifiedOnly }));
  }, []);

  const handleAuditFlyToBuilding = useCallback((buildingId: string) => {
    if (!mapRef.current) return;
    const feat = (buildingsGeoJSON as any).features.find((f: any) => f.id === buildingId);
    if (feat && feat.properties?.centroid) {
      const [lng, lat] = feat.properties.centroid;
      selectBuilding(buildingId);
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 17.8,
        pitch: 0,
        bearing: 0,
        essential: true,
        duration: 1200
      });
    }
  }, [selectBuilding]);

  // Synchronize Audit Mode visual layers & markers
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    if (!map.isStyleLoaded()) return;

    // Manage Markers
    auditMarkersRef.current.forEach((m) => m.remove());
    auditMarkersRef.current = [];

    if (isAuditMode) {
      // Disable 3D extrusion and default stroke
      if (map.getLayer('campus-buildings-extrusion')) {
        map.setLayoutProperty('campus-buildings-extrusion', 'visibility', 'none');
      }
      if (map.getLayer('campus-buildings-stroke')) {
        map.setLayoutProperty('campus-buildings-stroke', 'visibility', 'none');
      }

      // Audit Footprint Layers
      const showVerified = auditLayers.footprints;
      const showEstimated = auditLayers.footprints && !auditLayers.verifiedOnly;

      if (map.getLayer('campus-buildings-verified-fill')) {
        map.setLayoutProperty('campus-buildings-verified-fill', 'visibility', showVerified ? 'visible' : 'none');
        map.setLayoutProperty('campus-buildings-verified-stroke', 'visibility', showVerified ? 'visible' : 'none');
      }
      if (map.getLayer('campus-buildings-estimated-fill')) {
        map.setLayoutProperty('campus-buildings-estimated-fill', 'visibility', showEstimated ? 'visible' : 'none');
        map.setLayoutProperty('campus-buildings-estimated-stroke', 'visibility', showEstimated ? 'visible' : 'none');
      }
      if (map.getLayer('campus-buildings-unverified-fill')) {
        map.setLayoutProperty('campus-buildings-unverified-fill', 'visibility', showEstimated ? 'visible' : 'none');
        map.setLayoutProperty('campus-buildings-unverified-stroke', 'visibility', showEstimated ? 'visible' : 'none');
      }

      // Granular Boundaries
      if (map.getLayer('campus-boundary-stroke')) {
        map.setLayoutProperty('campus-boundary-stroke', 'visibility', 'none');
      }
      if (map.getLayer('campus-boundary-academic-stroke')) {
        map.setLayoutProperty('campus-boundary-academic-stroke', 'visibility', auditLayers.campusBoundary ? 'visible' : 'none');
      }
      if (map.getLayer('campus-boundary-playground-stroke')) {
        map.setLayoutProperty('campus-boundary-playground-stroke', 'visibility', auditLayers.playground ? 'visible' : 'none');
      }
      if (map.getLayer('campus-boundary-vec-stroke')) {
        map.setLayoutProperty('campus-boundary-vec-stroke', 'visibility', auditLayers.vecBoundary ? 'visible' : 'none');
      }

      // Roads
      if (map.getLayer('campus-roads-inner')) {
        map.setLayoutProperty('campus-roads-inner', 'visibility', auditLayers.roads ? 'visible' : 'none');
        map.setLayoutProperty('campus-roads-casing', 'visibility', auditLayers.roads ? 'visible' : 'none');
      }
      if (map.getLayer('campus-pathways-line')) {
        map.setLayoutProperty('campus-pathways-line', 'visibility', auditLayers.roads ? 'visible' : 'none');
      }

      // Render building centroid badges
      if (auditLayers.footprints) {
        const features = (buildingsGeoJSON as any).features || [];
        features.forEach((feat: any) => {
          const status = feat.properties?.alignmentStatus || 'PARTIALLY ALIGNED';
          if (auditLayers.verifiedOnly && status !== 'ALIGNED') return;

          const isMainGate = feat.properties.id === 'main-gate';
          const label = isMainGate
            ? 'ALIGNED GATEWAY'
            : status === 'ALIGNED'
            ? 'ALIGNED ACADEMIC'
            : status === 'PARTIALLY ALIGNED'
            ? 'PARTIAL ZONE'
            : 'UNVERIFIED EXCLUDED';

          const color = isMainGate
            ? '#38bdf8'
            : status === 'ALIGNED'
            ? '#22c55e'
            : status === 'PARTIALLY ALIGNED'
            ? '#f59e0b'
            : '#ef4444';

          const el = document.createElement('div');
          el.className = 'gis-audit-building-badge';
          el.style.cssText = `background: rgba(15,23,42,0.92); backdrop-filter: blur(6px); border: 1.5px solid ${color}; border-radius: 6px; padding: 2px 7px; font-family: monospace; font-size: 10px; font-weight: 700; color: ${color}; box-shadow: 0 4px 14px rgba(0,0,0,0.7); pointer-events: none; display: flex; align-items: center; gap: 4px; white-space: nowrap;`;
          el.innerHTML = `<span style="width:6px; height:6px; border-radius:50%; background:${color};"></span>${feat.properties.id} <span style="font-size:9px; opacity:0.8;">[${label}]</span>`;

          const m = new maplibregl.Marker({ element: el })
            .setLngLat(feat.properties.centroid)
            .addTo(map);
          auditMarkersRef.current.push(m);
        });
      }
    } else {
      // Normal Mode
      if (map.getLayer('campus-buildings-extrusion')) {
        map.setLayoutProperty('campus-buildings-extrusion', 'visibility', 'visible');
      }
      if (map.getLayer('campus-buildings-stroke')) {
        map.setLayoutProperty('campus-buildings-stroke', 'visibility', 'visible');
      }
      if (map.getLayer('campus-buildings-verified-fill')) {
        map.setLayoutProperty('campus-buildings-verified-fill', 'visibility', 'none');
        map.setLayoutProperty('campus-buildings-verified-stroke', 'visibility', 'none');
        map.setLayoutProperty('campus-buildings-estimated-fill', 'visibility', 'none');
        map.setLayoutProperty('campus-buildings-estimated-stroke', 'visibility', 'none');
        map.setLayoutProperty('campus-buildings-unverified-fill', 'visibility', 'none');
        map.setLayoutProperty('campus-buildings-unverified-stroke', 'visibility', 'none');
      }
      if (map.getLayer('campus-boundary-stroke')) {
        map.setLayoutProperty('campus-boundary-stroke', 'visibility', 'visible');
      }
      if (map.getLayer('campus-boundary-academic-stroke')) {
        map.setLayoutProperty('campus-boundary-academic-stroke', 'visibility', 'none');
        map.setLayoutProperty('campus-boundary-playground-stroke', 'visibility', 'none');
        map.setLayoutProperty('campus-boundary-vec-stroke', 'visibility', 'none');
      }
    }
  }, [isAuditMode, auditLayers]);

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
          <button
            onClick={handleToggleAuditMode}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isAuditMode
                ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/30'
                : 'text-amber-300 hover:text-white hover:bg-amber-500/20 border border-amber-500/30'
            }`}
            title="Toggle Orthographic Footprint Alignment Audit Mode (Pitch: 0°)"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Audit Mode</span>
          </button>
        </div>

        {/* Footprint Alignment Audit Overlay Panel */}
        <FootprintAuditPanel
          isOpen={isAuditMode}
          onClose={handleToggleAuditMode}
          auditLayers={auditLayers}
          onToggleLayer={handleAuditToggleLayer}
          onSetVerifiedOnly={handleAuditSetVerifiedOnly}
          onFlyToBuilding={handleAuditFlyToBuilding}
          selectedBuildingId={selectedBuilding?.id || null}
          currentZoom={mapZoom}
          currentPitch={mapPitch}
        />
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
                { key: 'boundary', label: 'Campus Boundary (OSM-Mapped)', color: '#38bdf8' },
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
          <span>Geographic Source & Verification Status</span>
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
