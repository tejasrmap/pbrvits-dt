import React, { useState } from 'react';
import {
  Layers,
  Building2,
  Navigation,
  Compass,
  CheckCircle2,
  Clock,
  Sparkles,
  Route,
  Trees as TreesIcon,
  Car,
  Eye,
  Trophy
} from 'lucide-react';
import { useCampusStore } from '../../store/useCampusStore';
import { campusZones } from '../../data/campusZones';
import { campusNavNodes } from '../../data/campusPaths';
import { findShortestRoute } from '../../navigation/NavigationGraph';
import type { LayerVisibility } from '../../types';

export const Sidebar: React.FC = () => {
  const activeSidebarTab = useCampusStore((s) => s.activeSidebarTab);
  const setActiveSidebarTab = useCampusStore((s) => s.setActiveSidebarTab);
  const buildings = useCampusStore((s) => s.buildings);
  const facilities = useCampusStore((s) => s.facilities);
  const selectBuilding = useCampusStore((s) => s.selectBuilding);
  const selectFacility = useCampusStore((s) => s.selectFacility);
  const selectedBuilding = useCampusStore((s) => s.selectedBuilding);

  const layers = useCampusStore((s) => s.layers);
  const toggleLayer = useCampusStore((s) => s.toggleLayer);

  // Navigation state
  const startNodeId = useCampusStore((s) => s.startNodeId);
  const targetNodeId = useCampusStore((s) => s.targetNodeId);
  const routingMode = useCampusStore((s) => s.routingMode);
  const setRoutingMode = useCampusStore((s) => s.setRoutingMode);
  const setNavigationNodes = useCampusStore((s) => s.setNavigationNodes);
  const activeRoute = useCampusStore((s) => s.activeRoute);
  const setActiveRoute = useCampusStore((s) => s.setActiveRoute);
  const clearNavigation = useCampusStore((s) => s.clearNavigation);

  // Filter for buildings
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredBuildings = buildings.filter((b) =>
    selectedCategory === 'all' ? true : b.category === selectedCategory
  );

  const handleCalculateRoute = () => {
    const route = findShortestRoute(startNodeId, targetNodeId, routingMode);
    if (route) {
      setActiveRoute(route);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'buildings', label: 'Buildings', icon: Building2 },
    { id: 'facilities', label: 'Facilities', icon: Sparkles },
    { id: 'navigation', label: 'Routes', icon: Navigation },
    { id: 'layers', label: 'Layers', icon: Layers }
  ] as const;

  return (
    <aside className="absolute top-20 left-3 bottom-5 z-20 flex gap-2 pointer-events-none">
      {/* Mini Icon Tab Bar */}
      <div className="glass-panel p-1.5 rounded-2xl flex flex-col gap-2 pointer-events-auto border border-white/10 shadow-2xl h-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSidebarTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSidebarTab(isActive ? null : tab.id)}
              title={tab.label}
              className={`p-2.5 rounded-xl transition-all cursor-pointer relative group ${
                isActive
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-5 h-5" />
              {/* Tooltip on hover */}
              <div className="absolute left-full ml-3 px-2 py-1 rounded bg-slate-900 text-xs text-white whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity border border-white/10 shadow-xl z-50">
                {tab.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Expanded Drawer Panel */}
      {activeSidebarTab && (
        <div className="w-80 md:w-96 glass-panel rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden pointer-events-auto animate-in fade-in slide-in-from-left-4 duration-200">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white uppercase tracking-wider">
                {activeSidebarTab}
              </span>
            </div>
            <button
              onClick={() => setActiveSidebarTab(null)}
              className="text-xs text-slate-400 hover:text-white p-1 rounded hover:bg-white/5"
            >
              ✕
            </button>
          </div>

          {/* Tab 1: Campus Overview */}
          {activeSidebarTab === 'overview' && (
            <div className="p-4 overflow-y-auto space-y-4 text-xs">
              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5">
                  <div className="text-slate-400 text-[11px]">Campus Area</div>
                  <div className="text-lg font-bold text-sky-400">35+ Acres</div>
                  <div className="text-[10px] text-slate-500">Green Suburban Kavali</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5">
                  <div className="text-slate-400 text-[11px]">Key Buildings</div>
                  <div className="text-lg font-bold text-sky-400">{buildings.length} Assets</div>
                  <div className="text-[10px] text-slate-500">Academic & Living</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5">
                  <div className="text-slate-400 text-[11px]">Solar Generation</div>
                  <div className="text-lg font-bold text-amber-400">100 kW</div>
                  <div className="text-[10px] text-slate-500">Green Grid Rooftops</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5">
                  <div className="text-slate-400 text-[11px]">NAAC Status</div>
                  <div className="text-lg font-bold text-emerald-400">Grade 'A'</div>
                  <div className="text-[10px] text-slate-500">JNTUA Affiliated</div>
                </div>
              </div>

              {/* Campus Zones */}
              <div>
                <div className="text-xs font-bold text-slate-200 mb-2 uppercase tracking-wider">
                  Campus Functional Zones
                </div>
                <div className="space-y-1.5">
                  {campusZones.map((zone) => (
                    <div
                      key={zone.id}
                      className="p-2.5 rounded-xl bg-slate-800/40 border border-white/5 hover:border-sky-400/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-white flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: zone.color }}
                          />
                          {zone.name}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono px-1.5 py-0.5 rounded bg-black/40">
                          {zone.code}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{zone.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Buildings Directory */}
          {activeSidebarTab === 'buildings' && (
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Category Pills */}
              <div className="p-3 border-b border-white/5 flex gap-1.5 overflow-x-auto text-[11px]">
                {['all', 'academic', 'administrative', 'library', 'laboratory', 'hostel', 'canteen'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-colors ${
                      selectedCategory === cat
                        ? 'bg-sky-500 text-white'
                        : 'bg-slate-800/70 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Buildings List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filteredBuildings.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => selectBuilding(b.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedBuilding?.id === b.id
                        ? 'bg-sky-600/25 border-sky-400 text-white shadow-lg'
                        : 'bg-slate-800/40 border-white/5 hover:bg-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-xs text-white">{b.name}</div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-sky-300 font-mono">
                        {b.floors}F
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      {b.description}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[10px] text-slate-500">
                      <span>{b.category.toUpperCase()}</span>
                      <span
                        className={`flex items-center gap-1 font-bold ${
                          b.verified === 'OSM-MAPPED'
                            ? 'text-emerald-400'
                            : b.verified === 'IMAGE-ESTIMATED'
                            ? 'text-amber-400'
                            : 'text-purple-400'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" /> {b.verified}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Facilities Directory */}
          {activeSidebarTab === 'facilities' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {facilities.map((fac) => (
                <div
                  key={fac.id}
                  onClick={() => selectFacility(fac.id)}
                  className="p-3 rounded-xl bg-slate-800/40 border border-white/5 hover:border-sky-400/40 hover:bg-slate-800/80 transition-all cursor-pointer text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{fac.name}</span>
                    <span className="text-[10px] text-sky-400 uppercase font-mono px-1.5 py-0.5 rounded bg-sky-500/10">
                      {fac.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{fac.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Route Planner & Navigation */}
          {activeSidebarTab === 'navigation' && (
            <div className="p-4 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">
                  Start Location
                </label>
                <select
                  value={startNodeId}
                  onChange={(e) => setNavigationNodes(e.target.value, targetNodeId)}
                  className="w-full mt-1 px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white outline-none focus:border-sky-400"
                >
                  {campusNavNodes.map((n) => (
                    <option key={`start-${n.id}`} value={n.id}>
                      {n.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">
                  Destination
                </label>
                <select
                  value={targetNodeId}
                  onChange={(e) => setNavigationNodes(startNodeId, e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white outline-none focus:border-sky-400"
                >
                  {campusNavNodes.map((n) => (
                    <option key={`dest-${n.id}`} value={n.id}>
                      {n.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">
                    Routing Preference
                  </label>
                  {routingMode === 'accessible' && (
                    <span className="text-[9px] font-mono text-amber-400 uppercase">
                      Approximate / Beta
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-1.5 mt-1">
                  {(
                    [
                      { id: 'shortest', label: 'Shortest' },
                      { id: 'scenic', label: 'Main Path' },
                      { id: 'accessible', label: 'Accessible*' }
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setRoutingMode(m.id);
                        if (activeRoute) {
                          const r = findShortestRoute(startNodeId, targetNodeId, m.id);
                          if (r) setActiveRoute(r);
                        }
                      }}
                      className={`py-1.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                        routingMode === m.id
                          ? 'bg-sky-500 text-white shadow'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
                {routingMode === 'accessible' && (
                  <p className="text-[10px] text-slate-400 mt-1 italic">
                    *Approximate: Prioritizes ground plinth entrances and paved pathways pending surveyed barrier-free elevation audit.
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCalculateRoute}
                  className="flex-1 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
                >
                  <Route className="w-4 h-4" /> Find Route
                </button>
                {activeRoute && (
                  <button
                    onClick={clearNavigation}
                    className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Route Summary */}
              {activeRoute && (
                <div className="p-3.5 rounded-xl bg-sky-950/40 border border-sky-400/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>Walking Distance:</span>
                    <span className="text-sky-300">{activeRoute.distanceMeters} meters</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>Estimated Walk Time:</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> ~{activeRoute.walkingMinutes} min
                    </span>
                  </div>
                  <div className="pt-2 border-t border-white/10 space-y-1">
                    <div className="text-[10px] font-bold uppercase text-slate-400">
                      Step-by-Step Directions:
                    </div>
                    {activeRoute.instructions.map((step, idx) => (
                      <div key={`step-${idx}`} className="text-[11px] text-slate-300 flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center text-[9px] font-bold">
                          {idx + 1}
                        </span>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 5: Layer Controls */}
          {activeSidebarTab === 'layers' && (
            <div className="p-4 space-y-2 text-xs">
              <div className="text-slate-400 text-[11px] mb-3">
                Toggle 3D Digital Twin GIS overlays and architectural subsystems:
              </div>
              {(
                [
                  { key: 'buildings', label: '3D Buildings & Facades', icon: Building2 },
                  { key: 'roads', label: 'Road Network & Crosswalks', icon: Car },
                  { key: 'trees', label: 'Procedural Trees & Palms', icon: TreesIcon },
                  { key: 'sports', label: 'Athletic Track & Courts', icon: Trophy },
                  { key: 'grass', label: 'Lawn & Garden Landscaping', icon: Sparkles },
                  { key: 'navigation', label: 'Navigation Path Visualization', icon: Route },
                  { key: 'boundary', label: 'Perimeter Wall & Entrance Arch', icon: Eye }
                ] as const
              ).map((item) => {
                const Icon = item.icon;
                const active = layers[item.key as keyof LayerVisibility];
                return (
                  <div
                    key={item.key}
                    onClick={() => toggleLayer(item.key as keyof LayerVisibility)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-white/5 hover:bg-slate-800/80 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5 text-slate-200">
                      <Icon className="w-4 h-4 text-sky-400" />
                      <span>{item.label}</span>
                    </div>
                    <div
                      className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
                        active ? 'bg-sky-500' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          active ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
