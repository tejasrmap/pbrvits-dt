import React from 'react';
import {
  Crosshair,
  ShieldCheck,
  X,
  Layers
} from 'lucide-react';
import { buildingsGeoJSON } from '../../data/gis';

export interface AuditLayerState {
  footprints: boolean;
  verifiedOnly: boolean;
  campusBoundary: boolean;
  playground: boolean;
  roads: boolean;
  vecBoundary: boolean;
}

interface FootprintAuditPanelProps {
  isOpen: boolean;
  onClose: () => void;
  auditLayers: AuditLayerState;
  onToggleLayer: (key: keyof AuditLayerState) => void;
  onSetVerifiedOnly: (verifiedOnly: boolean) => void;
  onFlyToBuilding: (buildingId: string) => void;
  selectedBuildingId: string | null;
  currentZoom: number;
  currentPitch: number;
}

export const FootprintAuditPanel: React.FC<FootprintAuditPanelProps> = ({
  isOpen,
  onClose,
  auditLayers,
  onToggleLayer,
  onSetVerifiedOnly,
  onFlyToBuilding,
  selectedBuildingId,
  currentZoom,
  currentPitch
}) => {
  if (!isOpen) return null;

  const buildings = (buildingsGeoJSON as any).features || [];
  const alignedAcademic = buildings.filter(
    (b: any) => b.properties?.alignmentStatus === 'ALIGNED' && b.properties?.id !== 'main-gate'
  );
  const alignedInfra = buildings.filter(
    (b: any) => b.properties?.alignmentStatus === 'ALIGNED' && b.properties?.id === 'main-gate'
  );
  const partialCount = buildings.filter(
    (b: any) => b.properties?.alignmentStatus === 'PARTIALLY ALIGNED'
  ).length;
  const unverifiedCount = buildings.filter(
    (b: any) => b.properties?.alignmentStatus === 'UNVERIFIED'
  ).length;

  return (
    <div className="absolute top-20 left-4 z-20 w-84 glass-panel p-4 rounded-2xl border border-sky-500/40 shadow-2xl backdrop-blur-xl text-white flex flex-col gap-3 max-h-[calc(100vh-120px)] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-500/20 border border-sky-400/40 text-sky-400">
            <Crosshair className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>Footprint Alignment Audit</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                DEV
              </span>
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Pitch: {currentPitch}° | Zoom: {currentZoom} | Nadir View
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          title="Exit Audit Mode"
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Alignment Verification Metrics */}
      <div className="grid grid-cols-4 gap-1 text-center">
        <div className="p-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex flex-col items-center">
          <span className="text-sm font-bold text-emerald-400">{alignedAcademic.length}</span>
          <span className="text-[9px] text-emerald-300/80 uppercase font-semibold">Academic</span>
          <span className="text-[8px] text-slate-400">OSM Aligned</span>
        </div>
        <div className="p-1.5 rounded-xl bg-sky-950/40 border border-sky-500/30 flex flex-col items-center">
          <span className="text-sm font-bold text-sky-400">{alignedInfra.length}</span>
          <span className="text-[9px] text-sky-300/80 uppercase font-semibold">Gateway</span>
          <span className="text-[8px] text-slate-400">Portal</span>
        </div>
        <div className="p-1.5 rounded-xl bg-amber-950/40 border border-amber-500/30 flex flex-col items-center">
          <span className="text-sm font-bold text-amber-400">{partialCount}</span>
          <span className="text-[9px] text-amber-300/80 uppercase font-semibold">Partial</span>
          <span className="text-[8px] text-slate-400">Zone Approx</span>
        </div>
        <div className="p-1.5 rounded-xl bg-rose-950/40 border border-rose-500/30 flex flex-col items-center">
          <span className="text-sm font-bold text-rose-400">{unverifiedCount}</span>
          <span className="text-[9px] text-rose-300/80 uppercase font-semibold">Excluded</span>
          <span className="text-[8px] text-slate-400">Hostels</span>
        </div>
      </div>

      {/* Layer Toggles */}
      <div className="flex flex-col gap-1.5">
        <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
          <span>Inspection Layer Controls</span>
          <Layers className="w-3 h-3 text-slate-400" />
        </div>

        {/* Footprint filter tabs: All vs Verified Only */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-900/80 border border-white/10 text-[10px]">
          <button
            onClick={() => onSetVerifiedOnly(false)}
            className={`flex-1 py-1 rounded font-medium transition-colors cursor-pointer ${
              !auditLayers.verifiedOnly ? 'bg-sky-500 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Features ({buildings.length})
          </button>
          <button
            onClick={() => onSetVerifiedOnly(true)}
            className={`flex-1 py-1 rounded font-medium transition-colors cursor-pointer flex items-center justify-center gap-1 ${
              auditLayers.verifiedOnly ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            Verified ({alignedAcademic.length + alignedInfra.length})
          </button>
        </div>

        {/* Layer Checkboxes */}
        <div className="flex flex-col gap-1 text-[11px] bg-slate-900/50 p-2 rounded-xl border border-white/5">
          <label className="flex items-center justify-between hover:bg-white/5 px-1.5 py-1 rounded cursor-pointer">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Building Footprints</span>
            </span>
            <input
              type="checkbox"
              checked={auditLayers.footprints}
              onChange={() => onToggleLayer('footprints')}
              className="accent-emerald-500 rounded"
            />
          </label>

          <label className="flex items-center justify-between hover:bg-white/5 px-1.5 py-1 rounded cursor-pointer">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>PBR VITS Academic Boundary (OSM 1297901220)</span>
            </span>
            <input
              type="checkbox"
              checked={auditLayers.campusBoundary}
              onChange={() => onToggleLayer('campusBoundary')}
              className="accent-sky-500 rounded"
            />
          </label>

          <label className="flex items-center justify-between hover:bg-white/5 px-1.5 py-1 rounded cursor-pointer">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span>Sports Ground Boundary (OSM 1297896001)</span>
            </span>
            <input
              type="checkbox"
              checked={auditLayers.playground}
              onChange={() => onToggleLayer('playground')}
              className="accent-green-500 rounded"
            />
          </label>

          <label className="flex items-center justify-between hover:bg-white/5 px-1.5 py-1 rounded cursor-pointer">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Roads & Pathways</span>
            </span>
            <input
              type="checkbox"
              checked={auditLayers.roads}
              onChange={() => onToggleLayer('roads')}
              className="accent-amber-500 rounded"
            />
          </label>

          <label className="flex items-center justify-between hover:bg-white/5 px-1.5 py-1 rounded cursor-pointer">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              <span>Neighboring VEC Parcel (OSM 1297901221)</span>
            </span>
            <input
              type="checkbox"
              checked={auditLayers.vecBoundary}
              onChange={() => onToggleLayer('vecBoundary')}
              className="accent-orange-500 rounded"
            />
          </label>
        </div>
      </div>

      {/* Building Inspector Navigator */}
      <div className="flex flex-col gap-1.5">
        <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
          Individual Building Inspector (Zoom 17.8 Ortho)
        </div>
        <select
          value={selectedBuildingId || ''}
          onChange={(e) => {
            if (e.target.value) onFlyToBuilding(e.target.value);
          }}
          className="w-full bg-slate-900 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-400 cursor-pointer"
        >
          <option value="">-- Select Feature to Inspect --</option>
          {buildings.map((b: any) => {
            const p = b.properties;
            const prefix =
              p.id === 'main-gate'
                ? '🔵 [ALIGNED GATEWAY]'
                : p.alignmentStatus === 'ALIGNED'
                ? '🟢 [ALIGNED ACADEMIC]'
                : p.alignmentStatus === 'PARTIALLY ALIGNED'
                ? '🟡 [PARTIAL ZONE]'
                : '🔴 [UNVERIFIED EXCLUDED]';
            return (
              <option key={p.id} value={p.id}>
                {prefix} {p.shortName || p.name}
              </option>
            );
          })}
        </select>
      </div>

      {/* Legend & Verification Criteria */}
      <div className="text-[10px] text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-white/5 flex flex-col gap-1.5 font-mono">
        <div className="text-slate-300 font-bold mb-0.5">Geometry Source Distinctions:</div>
        <div className="text-emerald-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shrink-0" />
          <span>OSM-Mapped Academic (4): Vector ways sitting directly on satellite rooflines</span>
        </div>
        <div className="text-sky-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-400 inline-block shrink-0" />
          <span>OSM-Mapped Gateway (1): Main entrance arch on Udayagiri frontage</span>
        </div>
        <div className="text-amber-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block shrink-0" />
          <span>Image-Estimated Zonal (7): Campus sector verified; polygon approximate</span>
        </div>
        <div className="text-rose-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-400 inline-block shrink-0" />
          <span>Unverified Hostels (2): No roof visible; excluded from 3D models</span>
        </div>
        <div className="border-t border-white/10 pt-1 text-[9px] text-slate-400 leading-tight">
          * Non-Survey Grade: Geographic GIS alignment referenced to ESRI imagery and OSM ways; does not represent total-station or legal cadastral survey.
        </div>
      </div>
    </div>
  );
};
