import React from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Navigation,
  Compass
} from 'lucide-react';
import { useCampusStore } from '../../store/useCampusStore';
import { findShortestRoute } from '../../navigation/NavigationGraph';

export const BuildingInfoPanel: React.FC = () => {
  const selectedBuilding = useCampusStore((s) => s.selectedBuilding);
  const selectBuilding = useCampusStore((s) => s.selectBuilding);
  const setActiveSidebarTab = useCampusStore((s) => s.setActiveSidebarTab);
  const setNavigationNodes = useCampusStore((s) => s.setNavigationNodes);
  const setActiveRoute = useCampusStore((s) => s.setActiveRoute);
  const startNodeId = useCampusStore((s) => s.startNodeId);
  const routingMode = useCampusStore((s) => s.routingMode);

  if (!selectedBuilding) return null;

  const handleNavigateHere = () => {
    const targetNodeId = selectedBuilding.navNodeId || 'node-admin-entrance';
    setNavigationNodes(startNodeId, targetNodeId);
    const route = findShortestRoute(startNodeId, targetNodeId, routingMode);
    if (route) setActiveRoute(route);
    setActiveSidebarTab('navigation');
  };

  const isVerified =
    selectedBuilding.verified === 'OSM-MAPPED' || selectedBuilding.verified === 'VERIFIED';

  return (
    <aside className="absolute top-16 right-3 bottom-16 w-84 md:w-96 glass-panel rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden pointer-events-auto z-20 animate-in fade-in slide-in-from-right-4 duration-200 backdrop-blur-xl bg-slate-950/90">
      {/* Top Banner with Architectural Header */}
      <div
        className="p-4 flex items-start justify-between relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${selectedBuilding.secondaryColor || '#0284c7'}cc, #090d16)`
        }}
      >
        <div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/50 text-sky-300 border border-white/10">
            {selectedBuilding.category}
          </span>
          <h2 className="text-base font-bold text-white mt-1 leading-snug">
            {selectedBuilding.name}
          </h2>
          {selectedBuilding.shortName && (
            <div className="text-[11px] text-slate-300 font-medium">
              {selectedBuilding.shortName}
            </div>
          )}
        </div>
        <button
          onClick={() => selectBuilding(null)}
          className="p-1.5 rounded-lg bg-black/40 hover:bg-black/70 text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {/* Verification Status & Survey Classification */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
          <div className="flex items-center gap-2">
            {isVerified ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400" />
            )}
            <span className="text-slate-300 font-medium">Data Classification</span>
          </div>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
              isVerified
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
            }`}
          >
            {selectedBuilding.verified}
          </span>
        </div>

        {/* Real Geographic Coordinates */}
        <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>Geographic Coordinates (WGS84)</span>
          </div>
          <div className="font-mono text-white text-[11px] flex justify-between">
            <span>Lat: {selectedBuilding.geoCoordinates?.lat.toFixed(6) || '14.913261'}° N</span>
            <span>Lng: {selectedBuilding.geoCoordinates?.lng.toFixed(6) || '79.983666'}° E</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Local Grid: X: {selectedBuilding.position[0].toFixed(1)}m, Z: {selectedBuilding.position[2].toFixed(1)}m
          </div>
        </div>

        {/* Architectural Metrics */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-xl bg-slate-900/50 border border-white/5">
            <div className="text-slate-500 text-[10px] uppercase font-bold">Floors & Height</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {selectedBuilding.floors} Floors ({selectedBuilding.dimensions.height}m)
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/50 border border-white/5">
            <div className="text-slate-500 text-[10px] uppercase font-bold">Footprint Size</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {selectedBuilding.dimensions.width}m &times; {selectedBuilding.dimensions.depth}m
            </div>
          </div>
        </div>

        {/* Architectural Style */}
        {selectedBuilding.architecturalStyle && (
          <div className="p-2.5 rounded-xl bg-slate-900/40 border border-white/5">
            <div className="text-slate-500 text-[10px] uppercase font-bold mb-1">
              Architectural Archetype
            </div>
            <div className="text-slate-200 text-[11px]">
              {selectedBuilding.architecturalStyle}
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Overview
          </div>
          <p className="text-slate-300 leading-relaxed text-[11.5px]">
            {selectedBuilding.description}
          </p>
        </div>

        {/* Departments */}
        {selectedBuilding.departments && selectedBuilding.departments.length > 0 && (
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Academic Departments
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedBuilding.departments.map((dept, i) => (
                <span
                  key={i}
                  className="px-2 py-0.8 rounded-lg bg-slate-800/80 text-slate-200 border border-white/5 text-[10.5px]"
                >
                  {dept}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Facilities & Labs */}
        {selectedBuilding.facilities && selectedBuilding.facilities.length > 0 && (
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Laboratories & Facilities
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedBuilding.facilities.map((fac, i) => (
                <span
                  key={i}
                  className="px-2 py-0.8 rounded-lg bg-sky-950/40 text-sky-200 border border-sky-400/20 text-[10.5px]"
                >
                  {fac}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation Action */}
      <div className="p-3 border-t border-white/10 bg-slate-950/80">
        <button
          onClick={handleNavigateHere}
          className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold transition-all shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Navigation className="w-4 h-4" />
          <span>Get Walking Directions</span>
        </button>
      </div>
    </aside>
  );
};
