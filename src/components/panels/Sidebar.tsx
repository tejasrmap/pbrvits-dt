import React, { useState } from 'react';
import {
  Compass,
  Building2,
  GraduationCap,
  Sparkles,
  Trophy,
  Navigation,
  Layers,
  X
} from 'lucide-react';
import { useCampusStore } from '../../store/useCampusStore';
import { campusZones } from '../../data/campusZones';
import { findShortestRoute } from '../../navigation/NavigationGraph';

export const Sidebar: React.FC = () => {
  const activeSidebarTab = useCampusStore((s) => s.activeSidebarTab);
  const setActiveSidebarTab = useCampusStore((s) => s.setActiveSidebarTab);
  const buildings = useCampusStore((s) => s.buildings);
  const facilities = useCampusStore((s) => s.facilities);
  const selectBuilding = useCampusStore((s) => s.selectBuilding);
  const selectFacility = useCampusStore((s) => s.selectFacility);
  const flyTo = useCampusStore((s) => s.flyTo);
  const layers = useCampusStore((s) => s.layers);
  const toggleLayer = useCampusStore((s) => s.toggleLayer);

  // Navigation state
  const startNodeId = useCampusStore((s) => s.startNodeId);
  const targetNodeId = useCampusStore((s) => s.targetNodeId);
  const routingMode = useCampusStore((s) => s.routingMode);
  const setNavigationNodes = useCampusStore((s) => s.setNavigationNodes);
  const activeRoute = useCampusStore((s) => s.activeRoute);
  const setActiveRoute = useCampusStore((s) => s.setActiveRoute);
  const clearNavigation = useCampusStore((s) => s.clearNavigation);

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
    { id: 'departments', label: 'Departments', icon: GraduationCap },
    { id: 'facilities', label: 'Facilities', icon: Sparkles },
    { id: 'sports', label: 'Sports', icon: Trophy },
    { id: 'navigation', label: 'Navigation', icon: Navigation },
    { id: 'layers', label: 'Layers', icon: Layers }
  ] as const;

  const allDepartments = Array.from(
    new Set(buildings.flatMap((b) => b.departments || []))
  );

  return (
    <aside className="absolute top-16 left-3 bottom-16 z-20 flex gap-2 pointer-events-none select-none">
      {/* 1. Collapsed Icon Strip Dock */}
      <div className="bg-slate-900/85 backdrop-blur-md p-1 rounded-2xl flex flex-col gap-1 pointer-events-auto border border-white/10 shadow-lg h-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSidebarTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSidebarTab(isActive ? null : (tab.id as any))}
              title={tab.label}
              className={`p-2 rounded-xl transition-all cursor-pointer relative group ${
                isActive
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <div className="absolute left-full ml-2.5 px-2 py-1 rounded bg-slate-900 text-xs text-white whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity border border-white/10 shadow-xl z-50">
                {tab.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. Slide-out Panel (Only rendered when a section is active) */}
      {activeSidebarTab && (
        <div className="w-76 md:w-80 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden pointer-events-auto animate-in fade-in slide-in-from-left-4 duration-150">
          {/* Header */}
          <div className="px-3.5 py-3 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              {activeSidebarTab}
            </span>
            <button
              onClick={() => setActiveSidebarTab(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Section: Overview */}
          {activeSidebarTab === 'overview' && (
            <div className="p-3.5 overflow-y-auto space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-white/5">
                  <div className="text-slate-400 text-[10px]">Campus Area</div>
                  <div className="text-sm font-bold text-sky-400">35+ Acres</div>
                  <div className="text-[10px] text-slate-500">Autonomous Core</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-white/5">
                  <div className="text-slate-400 text-[10px]">Key Assets</div>
                  <div className="text-sm font-bold text-sky-400">{buildings.length} Blocks</div>
                  <div className="text-[10px] text-slate-500">Academic & Living</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-white/5">
                  <div className="text-slate-400 text-[10px]">Accreditation</div>
                  <div className="text-sm font-bold text-emerald-400">NAAC 'A'</div>
                  <div className="text-[10px] text-slate-500">JNTUA Affiliated</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-white/5">
                  <div className="text-slate-400 text-[10px]">Geographic Anchor</div>
                  <div className="text-sm font-bold text-amber-400">EPSG:4326</div>
                  <div className="text-[10px] text-slate-500">14.9132° N, 79.9836° E</div>
                </div>
              </div>

              {/* Geographic Demarcation Alert */}
              <div className="p-2.5 rounded-xl bg-sky-950/40 border border-sky-400/20 text-[11px] text-sky-200">
                <span className="font-bold text-white block mb-0.5">Campus Demarcation:</span>
                This model represents PBR VITS exclusively. Neighboring sister institutions (Visvodaya Engineering College & Trust compounds) are geographically distinguished outside the campus perimeter.
              </div>

              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Campus Functional Zones
                </div>
                <div className="space-y-1">
                  {campusZones.map((zone) => (
                    <div
                      key={zone.id}
                      onClick={() => flyTo(zone.center, [0, 0, 0])}
                      className="p-2 rounded-xl bg-slate-800/30 border border-white/5 hover:border-sky-400/30 transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="font-semibold text-white flex items-center gap-2 text-[11px]">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: zone.color }}
                        />
                        {zone.name}
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono px-1 py-0.5 rounded bg-black/40">
                        {zone.code}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section: Buildings */}
          {activeSidebarTab === 'buildings' && (
            <div className="p-3.5 flex-1 overflow-y-auto space-y-2 text-xs">
              <div className="flex gap-1 overflow-x-auto pb-1 text-[10px]">
                {['all', 'academic', 'administrative', 'library', 'hostel'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-0.8 rounded-lg capitalize whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-sky-500 text-white font-semibold'
                        : 'bg-slate-800/50 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                {filteredBuildings.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => {
                      selectBuilding(b.id);
                      flyTo(
                        [b.position[0] + 25, b.dimensions.height + 20, b.position[2] + 35],
                        b.position
                      );
                    }}
                    className="p-2.5 rounded-xl bg-slate-800/30 border border-white/5 hover:border-sky-400/30 transition-all cursor-pointer flex flex-col gap-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{b.name}</span>
                      <span
                        className={`text-[8.5px] uppercase font-mono px-1.5 py-0.2 rounded border ${
                          b.verified === 'OSM-MAPPED' || b.verified === 'VERIFIED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-400/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-400/30'
                        }`}
                      >
                        {b.verified}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center justify-between">
                      <span>{b.floors} Floors &bull; {b.category}</span>
                      <span className="text-sky-400">View &rarr;</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Departments */}
          {activeSidebarTab === 'departments' && (
            <div className="p-3.5 flex-1 overflow-y-auto space-y-1.5 text-xs">
              {allDepartments.map((dept, idx) => {
                const parentBuilding = buildings.find((b) => b.departments?.includes(dept));
                return (
                  <div
                    key={`dept-${idx}`}
                    onClick={() => {
                      if (parentBuilding) {
                        selectBuilding(parentBuilding.id);
                        flyTo(
                          [parentBuilding.position[0] + 25, parentBuilding.dimensions.height + 20, parentBuilding.position[2] + 35],
                          parentBuilding.position
                        );
                      }
                    }}
                    className="p-2.5 rounded-xl bg-slate-800/30 border border-white/5 hover:border-sky-400/30 transition-all cursor-pointer flex flex-col gap-0.5"
                  >
                    <div className="font-bold text-white text-[11.5px]">{dept}</div>
                    <div className="text-[10px] text-sky-400 flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      <span>{parentBuilding?.shortName || parentBuilding?.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Section: Facilities */}
          {activeSidebarTab === 'facilities' && (
            <div className="p-3.5 flex-1 overflow-y-auto space-y-1.5 text-xs">
              {facilities.map((fac) => (
                <div
                  key={fac.id}
                  onClick={() => {
                    selectFacility(fac.id);
                    flyTo([fac.position[0] + 20, 20, fac.position[2] + 25], fac.position);
                  }}
                  className="p-2.5 rounded-xl bg-slate-800/30 border border-white/5 hover:border-sky-400/30 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white text-[11.5px]">{fac.name}</div>
                    <div className="text-[10px] text-slate-400">{fac.description}</div>
                  </div>
                  <span className="text-[8.5px] uppercase font-mono px-1 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-400/20">
                    {fac.category}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Section: Sports */}
          {activeSidebarTab === 'sports' && (
            <div className="p-3.5 flex-1 overflow-y-auto space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-800/40 border border-white/5">
                <div className="font-bold text-white mb-0.5">Visvodaya Sports Complex</div>
                <div className="text-[11px] text-slate-400">
                  27,400 m² athletic oval and sports grounds directly west of the academic quadrangle (OSM Way 1297896001).
                </div>
                <button
                  onClick={() => flyTo([-160, 50, 90], [-199, 0, 0])}
                  className="mt-2 w-full py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-semibold transition-colors cursor-pointer text-xs"
                >
                  Fly to Sports Oval
                </button>
              </div>

              <div className="space-y-1.5">
                {[
                  { name: '400m Athletic Track', desc: 'Standard 6-lane clay running track' },
                  { name: 'Cricket Field & Pitch', desc: 'Full-dimension cricket ground' },
                  { name: 'Basketball Court', desc: 'Standard acrylic hard court' },
                  { name: 'Volleyball Courts', desc: 'Twin sand/clay courts' }
                ].map((s, i) => (
                  <div key={i} className="p-2 rounded-xl bg-slate-800/20 border border-white/5">
                    <div className="font-semibold text-white text-[11px]">{s.name}</div>
                    <div className="text-[10px] text-slate-400">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Navigation */}
          {activeSidebarTab === 'navigation' && (
            <div className="p-3.5 flex-1 overflow-y-auto space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 font-medium block mb-1">
                  Start Point
                </label>
                <select
                  value={startNodeId}
                  onChange={(e) => setNavigationNodes(e.target.value, targetNodeId)}
                  className="w-full p-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-sky-400 cursor-pointer text-xs"
                >
                  <option value="node-main-gate">Main Entrance Gate (Highway)</option>
                  <option value="node-admin-entrance">Admin Bhavan Entrance</option>
                  <option value="node-library-entrance">Central Library</option>
                  <option value="node-sports-entrance">Sports Complex & Oval</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-medium block mb-1">
                  Destination
                </label>
                <select
                  value={targetNodeId}
                  onChange={(e) => setNavigationNodes(startNodeId, e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-sky-400 cursor-pointer text-xs"
                >
                  <option value="node-library-entrance">Central Library</option>
                  <option value="node-admin-entrance">Admin Bhavan</option>
                  <option value="node-auditorium-entrance">Central Auditorium</option>
                  <option value="node-sports-entrance">Sports Complex & Oval</option>
                  <option value="node-main-gate">Main Entrance Gate</option>
                </select>
              </div>

              <button
                onClick={handleCalculateRoute}
                className="w-full py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold transition-all shadow-md shadow-sky-500/20 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Calculate Route</span>
              </button>

              {activeRoute && (
                <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-400/30 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">Walking Route</span>
                    <button
                      onClick={clearNavigation}
                      className="text-[10px] text-rose-400 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-300">
                    <div>
                      <span className="text-[9px] text-slate-400 block">Distance</span>
                      <span className="text-xs font-bold text-sky-400">
                        {activeRoute.distanceMeters} m
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block">Est. Time</span>
                      <span className="text-xs font-bold text-emerald-400">
                        {activeRoute.walkingMinutes} min
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Section: Layers */}
          {activeSidebarTab === 'layers' && (
            <div className="p-3.5 flex-1 overflow-y-auto space-y-1 text-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                3D Scene Layers
              </div>
              {[
                { key: 'buildings', label: 'Buildings' },
                { key: 'roads', label: 'Road Network' },
                { key: 'trees', label: 'Trees & Vegetation' },
                { key: 'grass', label: 'Campus Lawns' },
                { key: 'boundary', label: 'Boundary Wall & Gate' },
                { key: 'sports', label: 'Sports Grounds' },
                { key: 'shadows', label: 'Real-time Shadows' }
              ].map(({ key, label }) => (
                <label
                  key={key}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-800/30 hover:bg-slate-800/60 cursor-pointer text-slate-200"
                >
                  <span>{label}</span>
                  <input
                    type="checkbox"
                    checked={(layers as any)[key]}
                    onChange={() => toggleLayer(key as any)}
                    className="accent-sky-500 rounded cursor-pointer"
                  />
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
