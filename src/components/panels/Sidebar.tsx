import React, { useState } from 'react';
import {
  Compass,
  Building2,
  GraduationCap,
  Sparkles,
  Trophy,
  Car,
  Navigation,
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
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'navigation', label: 'Navigation', icon: Navigation }
  ] as const;

  // Extract unique departments from buildings
  const allDepartments = Array.from(
    new Set(buildings.flatMap((b) => b.departments || []))
  );

  return (
    <aside className="absolute top-16 left-3 bottom-16 z-20 flex gap-2 pointer-events-none">
      {/* Mini Icon Tab Bar */}
      <div className="glass-panel p-1.5 rounded-2xl flex flex-col gap-1.5 pointer-events-auto border border-white/10 shadow-2xl h-fit backdrop-blur-xl bg-slate-950/80">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSidebarTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSidebarTab(isActive ? null : (tab.id as any))}
              title={tab.label}
              className={`p-2.5 rounded-xl transition-all cursor-pointer relative group ${
                isActive
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {/* Tooltip on hover */}
              <div className="absolute left-full ml-3 px-2 py-1 rounded bg-slate-900 text-xs text-white whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity border border-white/10 shadow-xl z-50">
                {tab.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Expanded Collapsible Drawer Panel */}
      {activeSidebarTab && (
        <div className="w-80 md:w-96 glass-panel rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden pointer-events-auto animate-in fade-in slide-in-from-left-4 duration-200 backdrop-blur-xl bg-slate-950/90">
          {/* Header */}
          <div className="p-3.5 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              {activeSidebarTab}
            </span>
            <button
              onClick={() => setActiveSidebarTab(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Section 1: Campus Overview */}
          {activeSidebarTab === 'overview' && (
            <div className="p-4 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                  <div className="text-slate-400 text-[11px]">Campus Grounds</div>
                  <div className="text-base font-bold text-sky-400">35+ Acres</div>
                  <div className="text-[10px] text-slate-500">Kavali, SPSR Nellore</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                  <div className="text-slate-400 text-[11px]">Key Structures</div>
                  <div className="text-base font-bold text-sky-400">{buildings.length} Assets</div>
                  <div className="text-[10px] text-slate-500">Academic & Living</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                  <div className="text-slate-400 text-[11px]">Accreditation</div>
                  <div className="text-base font-bold text-emerald-400">NAAC 'A'</div>
                  <div className="text-[10px] text-slate-500">Autonomous & Affiliated</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                  <div className="text-slate-400 text-[11px]">Geographic Datum</div>
                  <div className="text-base font-bold text-amber-400">EPSG:4326</div>
                  <div className="text-[10px] text-slate-500">WGS84 Real GIS Anchor</div>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Campus Functional Zones
                </div>
                <div className="space-y-1.5">
                  {campusZones.map((zone) => (
                    <div
                      key={zone.id}
                      onClick={() => flyTo(zone.center, [0, 0, 0])}
                      className="p-2.5 rounded-xl bg-slate-900/40 border border-white/5 hover:border-sky-400/30 transition-all cursor-pointer flex items-center justify-between"
                    >
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
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Buildings */}
          {activeSidebarTab === 'buildings' && (
            <div className="p-4 flex-1 overflow-y-auto space-y-3 text-xs">
              {/* Category Filter Pills */}
              <div className="flex gap-1 overflow-x-auto pb-1 text-[11px]">
                {['all', 'academic', 'administrative', 'library', 'hostel'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg capitalize whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-sky-500 text-white font-semibold'
                        : 'bg-slate-900/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
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
                    className="p-3 rounded-xl bg-slate-900/50 border border-white/5 hover:border-sky-400/40 transition-all cursor-pointer flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{b.name}</span>
                      <span
                        className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded border ${
                          b.verified === 'OSM-MAPPED' || b.verified === 'VERIFIED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-400/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-400/30'
                        }`}
                      >
                        {b.verified}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                      <span>{b.floors} Floors &bull; {b.category}</span>
                      <span className="text-sky-400 font-medium">Inspect &rarr;</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Academic Departments */}
          {activeSidebarTab === 'departments' && (
            <div className="p-4 flex-1 overflow-y-auto space-y-2 text-xs">
              <div className="text-[11px] text-slate-400 mb-2">
                Select an academic department to locate its faculty wings and laboratory complexes:
              </div>
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
                    className="p-3 rounded-xl bg-slate-900/50 border border-white/5 hover:border-sky-400/40 transition-all cursor-pointer flex flex-col gap-1"
                  >
                    <div className="font-bold text-white">{dept}</div>
                    <div className="text-[11px] text-sky-400 flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      <span>{parentBuilding?.shortName || parentBuilding?.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Section 4: Facilities */}
          {activeSidebarTab === 'facilities' && (
            <div className="p-4 flex-1 overflow-y-auto space-y-2 text-xs">
              {facilities.map((fac) => (
                <div
                  key={fac.id}
                  onClick={() => {
                    selectFacility(fac.id);
                    flyTo([fac.position[0] + 20, 20, fac.position[2] + 25], fac.position);
                  }}
                  className="p-3 rounded-xl bg-slate-900/50 border border-white/5 hover:border-sky-400/40 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white">{fac.name}</div>
                    <div className="text-[11px] text-slate-400">{fac.description}</div>
                  </div>
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-400/20">
                    {fac.category}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Section 5: Sports */}
          {activeSidebarTab === 'sports' && (
            <div className="p-4 flex-1 overflow-y-auto space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <div className="font-bold text-white mb-1">Visvodaya Sports Complex</div>
                <div className="text-slate-400">
                  Extensive 27,400 m² athletic oval and outdoor sports grounds situated directly to the west of the academic quadrangle (OSM Way 1297896001).
                </div>
                <button
                  onClick={() => flyTo([-160, 55, 95], [-199, 0, 0])}
                  className="mt-3 w-full py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-semibold transition-colors cursor-pointer"
                >
                  Fly to Sports Oval
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { name: '400m Athletic Running Track', desc: 'Standard 6-lane athletic clay track' },
                  { name: 'Cricket Field & Turf Pitch', desc: 'Full-dimension cricket ground with sight screens' },
                  { name: 'Basketball Court', desc: 'Standard acrylic hard court with floodlights' },
                  { name: 'Volleyball Courts', desc: 'Twin sand/clay courts with net posts' }
                ].map((s, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-900/40 border border-white/5">
                    <div className="font-semibold text-white">{s.name}</div>
                    <div className="text-[11px] text-slate-400">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 6: Parking */}
          {activeSidebarTab === 'parking' && (
            <div className="p-4 flex-1 overflow-y-auto space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <div className="font-bold text-white mb-1">Student & Visitor Parking (West)</div>
                <div className="text-slate-400">
                  Capacity for 250+ two-wheelers and 30+ cars, situated near the Main Highway Gate.
                </div>
                <button
                  onClick={() => flyTo([-55, 30, 115], [-55, 0, 75])}
                  className="mt-2 text-sky-400 hover:text-sky-300 font-semibold"
                >
                  Locate West Parking &rarr;
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <div className="font-bold text-white mb-1">Faculty & Staff Parking (East)</div>
                <div className="text-slate-400">
                  Dedicated shaded parking zone adjacent to the Administrative Bhavan.
                </div>
                <button
                  onClick={() => flyTo([85, 30, 50], [85, 0, 10])}
                  className="mt-2 text-sky-400 hover:text-sky-300 font-semibold"
                >
                  Locate East Parking &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Section 7: Navigation */}
          {activeSidebarTab === 'navigation' && (
            <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] text-slate-400 font-medium block mb-1">
                    Start Location
                  </label>
                  <select
                    value={startNodeId}
                    onChange={(e) => setNavigationNodes(e.target.value, targetNodeId)}
                    className="w-full p-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-sky-400 cursor-pointer"
                  >
                    <option value="node-main-gate">Main Entrance Gate (Highway)</option>
                    <option value="node-admin-entrance">Admin Bhavan Entrance</option>
                    <option value="node-library-entrance">Central Library</option>
                    <option value="node-sports-entrance">Sports Complex & Oval</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-medium block mb-1">
                    Destination
                  </label>
                  <select
                    value={targetNodeId}
                    onChange={(e) => setNavigationNodes(startNodeId, e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-sky-400 cursor-pointer"
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
                  className="w-full py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold transition-all shadow-lg shadow-sky-500/25 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Calculate Walking Route</span>
                </button>
              </div>

              {activeRoute && (
                <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-400/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">Active Walking Route</span>
                    <button
                      onClick={clearNavigation}
                      className="text-[10px] text-rose-400 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-300">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Distance</span>
                      <span className="text-sm font-bold text-sky-400">
                        {activeRoute.distanceMeters} m
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Est. Walk Time</span>
                      <span className="text-sm font-bold text-emerald-400">
                        {activeRoute.walkingMinutes} min
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
