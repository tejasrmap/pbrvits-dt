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
    <div className="absolute top-16 right-4 w-76 md:w-80 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden pointer-events-auto z-20 animate-in fade-in slide-in-from-right-4 duration-150 select-none">
      {/* Header */}
      <div className="p-3.5 border-b border-white/10 flex items-start justify-between bg-slate-800/40">
        <div>
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-sky-400">
            {selectedBuilding.category}
          </span>
          <h2 className="text-sm font-bold text-white mt-0.5 leading-tight">
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
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3.5 space-y-2.5 text-xs">
        {/* Verification Status */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/30 border border-white/5">
          <div className="flex items-center gap-1.5">
            {isVerified ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span className="text-slate-300 text-[11px]">Classification</span>
          </div>
          <span
            className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase font-mono ${
              isVerified
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-400/30'
                : 'bg-amber-500/10 text-amber-400 border border-amber-400/30'
            }`}
          >
            {selectedBuilding.verified}
          </span>
        </div>

        {/* Coordinates */}
        <div className="p-2 rounded-xl bg-slate-800/30 border border-white/5 text-[10.5px] font-mono text-slate-300 space-y-0.5">
          <div className="flex items-center gap-1 text-slate-400 text-[9.5px] font-sans font-semibold uppercase">
            <Compass className="w-3 h-3 text-sky-400" />
            <span>WGS84 Coordinates</span>
          </div>
          <div className="flex justify-between text-white">
            <span>Lat: {selectedBuilding.geoCoordinates?.lat.toFixed(6) || '14.913261'}° N</span>
            <span>Lng: {selectedBuilding.geoCoordinates?.lng.toFixed(6) || '79.983666'}° E</span>
          </div>
        </div>

        {/* Floors & Dimensions */}
        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
          <div className="p-2 rounded-xl bg-slate-800/20 border border-white/5">
            <span className="text-slate-400 text-[9.5px] block uppercase font-medium">Floors</span>
            <span className="font-bold text-white">{selectedBuilding.floors} Levels</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/20 border border-white/5">
            <span className="text-slate-400 text-[9.5px] block uppercase font-medium">Height</span>
            <span className="font-bold text-white">{selectedBuilding.dimensions.height} meters</span>
          </div>
        </div>

        {/* Overview */}
        <p className="text-[11px] text-slate-300 leading-relaxed">
          {selectedBuilding.description}
        </p>

        {/* Departments */}
        {selectedBuilding.departments && selectedBuilding.departments.length > 0 && (
          <div>
            <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Departments
            </span>
            <div className="flex flex-wrap gap-1">
              {selectedBuilding.departments.map((d, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 rounded bg-slate-800/60 text-slate-300 text-[10px] border border-white/5"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action */}
      <div className="p-3 border-t border-white/10 bg-slate-900/60">
        <button
          onClick={handleNavigateHere}
          className="w-full py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold transition-all shadow-md shadow-sky-500/20 flex items-center justify-center gap-1.5 cursor-pointer text-xs"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Get Directions</span>
        </button>
      </div>
    </div>
  );
};
