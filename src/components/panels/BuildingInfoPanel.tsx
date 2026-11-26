import React from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Navigation,
  Sparkles,
  Phone,
  Clock,
  MapPin,
  Layers
} from 'lucide-react';
import { useCampusStore } from '../../store/useCampusStore';
import { findShortestRoute } from '../../navigation/NavigationGraph';

export const BuildingInfoPanel: React.FC = () => {
  const selectedBuilding = useCampusStore((s) => s.selectedBuilding);
  const selectBuilding = useCampusStore((s) => s.selectBuilding);
  const setActiveSidebarTab = useCampusStore((s) => s.setActiveSidebarTab);
  const setNavigationNodes = useCampusStore((s) => s.setNavigationNodes);
  const setActiveRoute = useCampusStore((s) => s.setActiveRoute);
  const setAppViewMode = useCampusStore((s) => s.setAppViewMode);
  const startNodeId = useCampusStore((s) => s.startNodeId);
  const routingMode = useCampusStore((s) => s.routingMode);

  if (!selectedBuilding) return null;

  const handleNavigateHere = () => {
    // Exact mapping to building's configured nav node
    const targetNodeId = selectedBuilding.navNodeId || 'node-admin-entrance';
    setNavigationNodes(startNodeId, targetNodeId);
    const route = findShortestRoute(startNodeId, targetNodeId, routingMode);
    if (route) setActiveRoute(route);
    setActiveSidebarTab('navigation');
  };

  return (
    <aside className="absolute top-20 right-3 bottom-5 w-84 md:w-96 glass-panel rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden pointer-events-auto z-20 animate-in fade-in slide-in-from-right-4 duration-200">
      {/* Top Banner / Color Accent */}
      <div
        className="h-24 p-4 flex items-start justify-between relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${selectedBuilding.secondaryColor || '#0284c7'}dd, #0f172a)`
        }}
      >
        <div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/40 text-sky-300 border border-white/10">
            {selectedBuilding.category}
          </span>
          <h2 className="text-base font-bold text-white mt-1 leading-snug">
            {selectedBuilding.name}
          </h2>
        </div>
        <button
          onClick={() => selectBuilding(null)}
          className="p-1 rounded-lg bg-black/30 hover:bg-black/60 text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Verification Status */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-white/5">
          <div className="flex items-center gap-2">
            {selectedBuilding.verified === 'VERIFIED' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400" />
            )}
            <span className="text-slate-300 font-medium">Asset Accuracy</span>
          </div>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
              selectedBuilding.verified === 'VERIFIED'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                : selectedBuilding.verified === 'APPROXIMATE'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30'
                : selectedBuilding.verified === 'ESTIMATED'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
            }`}
          >
            {selectedBuilding.verified}
          </span>
        </div>

        {/* Description */}
        <div>
          <div className="text-[11px] font-bold uppercase text-slate-400 mb-1">
            Overview
          </div>
          <p className="text-slate-300 leading-relaxed">
            {selectedBuilding.description}
          </p>
        </div>

        {/* Building Geometry Dossier */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-white/5 text-center">
            <div className="text-slate-400 text-[10px]">Floors</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {selectedBuilding.floors} Levels
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-white/5 text-center">
            <div className="text-slate-400 text-[10px]">Height</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {selectedBuilding.dimensions.height}m
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-white/5 text-center">
            <div className="text-slate-400 text-[10px]">Footprint</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {selectedBuilding.dimensions.width}×{selectedBuilding.dimensions.depth}m
            </div>
          </div>
        </div>

        {/* Architectural Style & Solar */}
        {selectedBuilding.architecturalStyle && (
          <div className="p-2.5 rounded-xl bg-slate-800/40 border border-white/5">
            <div className="text-[10px] text-slate-400 uppercase font-bold">
              Architecture & Infrastructure
            </div>
            <div className="text-slate-200 mt-1 font-medium">
              {selectedBuilding.architecturalStyle}
            </div>
            {selectedBuilding.hasSolarPanels && (
              <div className="text-[11px] text-amber-300 mt-1 flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5" /> Equipped with Rooftop Solar Grid
              </div>
            )}
          </div>
        )}

        {/* Departments */}
        {selectedBuilding.departments.length > 0 && (
          <div>
            <div className="text-[11px] font-bold uppercase text-slate-400 mb-1.5">
              Academic Departments & Units
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedBuilding.departments.map((dept, i) => (
                <span
                  key={`dept-${i}`}
                  className="px-2 py-1 rounded-lg bg-sky-500/10 text-sky-300 border border-sky-400/20 text-[11px] font-medium"
                >
                  {dept}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Facilities */}
        {selectedBuilding.facilities.length > 0 && (
          <div>
            <div className="text-[11px] font-bold uppercase text-slate-400 mb-1.5">
              In-Building Facilities
            </div>
            <ul className="space-y-1">
              {selectedBuilding.facilities.map((fac, i) => (
                <li
                  key={`fac-${i}`}
                  className="flex items-center gap-2 text-slate-300 text-[11px]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  {fac}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Geographic Coordinates & Source */}
        {selectedBuilding.geoCoordinates && (
          <div className="p-2.5 rounded-xl bg-slate-800/40 border border-white/5 space-y-1">
            <div className="text-[10px] text-sky-400 uppercase font-bold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>Geographic Position (WGS84)</span>
            </div>
            <div className="font-mono text-[11px] text-white">
              {selectedBuilding.geoCoordinates.lat.toFixed(6)}° N, {selectedBuilding.geoCoordinates.lng.toFixed(6)}° E
            </div>
            {selectedBuilding.source && (
              <div className="text-[10px] text-slate-400">
                <strong className="text-slate-300">Source:</strong> {selectedBuilding.source}
              </div>
            )}
            {selectedBuilding.accuracyLevel && (
              <div className="text-[10px] text-slate-400">
                <strong className="text-slate-300">Accuracy:</strong> {selectedBuilding.accuracyLevel}
              </div>
            )}
          </div>
        )}

        {/* Contact & Hours */}
        <div className="p-3 rounded-xl bg-slate-800/40 border border-white/5 space-y-1.5 text-[11px] text-slate-300">
          {selectedBuilding.hours && (
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>{selectedBuilding.hours}</span>
            </div>
          )}
          {selectedBuilding.contact && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{selectedBuilding.contact}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation & GIS Button */}
      <div className="p-3 border-t border-white/10 bg-slate-900/60 flex flex-col gap-2">
        <button
          onClick={handleNavigateHere}
          className="w-full py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer text-xs"
        >
          <Navigation className="w-4 h-4" />
          Get Walking Directions
        </button>
        <button
          onClick={() => setAppViewMode('gis')}
          className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white font-semibold rounded-xl flex items-center justify-center gap-2 border border-sky-400/20 transition-all cursor-pointer text-xs"
        >
          <Layers className="w-4 h-4 text-sky-400" />
          Focus in Campus GIS Map
        </button>
      </div>
    </aside>
  );
};
