import React from 'react';
import {
  Search,
  Sliders,
  HelpCircle,
  Play,
  Building2,
  Sparkles,
  Map as MapIcon,
  Globe
} from 'lucide-react';
import { useCampusStore } from '../../store/useCampusStore';

export const TopBar: React.FC = () => {
  const appViewMode = useCampusStore((s) => s.appViewMode);
  const setAppViewMode = useCampusStore((s) => s.setAppViewMode);
  const setSearchOpen = useCampusStore((s) => s.setSearchOpen);
  const setHelpModalOpen = useCampusStore((s) => s.setHelpModalOpen);
  const setGraphicsSettingsModalOpen = useCampusStore((s) => s.setGraphicsSettingsModalOpen);
  const setActiveSidebarTab = useCampusStore((s) => s.setActiveSidebarTab);
  const activeSidebarTab = useCampusStore((s) => s.activeSidebarTab);
  const startTour = useCampusStore((s) => s.startTour);
  const isTourActive = useCampusStore((s) => s.isTourActive);

  return (
    <header className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between gap-2 pointer-events-none">
      {/* Left: Institutional Logo and Title */}
      <div className="flex items-center gap-2.5 pointer-events-auto">
        <div className="glass-panel px-3 py-1.5 rounded-2xl flex items-center gap-2.5 border border-white/10 shadow-2xl backdrop-blur-xl bg-slate-950/80">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-black text-white text-xs shadow-md ring-2 ring-sky-400/20">
            PV
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xs font-bold tracking-tight text-white">
                PBR VITS
              </h1>
              <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30">
                Digital Twin
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
              14.91326° N, 79.98367° E &bull; Kavali, AP
            </p>
          </div>
        </div>
      </div>

      {/* Center: Main Navigation Modes (Explore, Campus Map, Buildings, Facilities, Guided Tour) */}
      <nav className="glass-panel p-1 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-1 pointer-events-auto backdrop-blur-xl bg-slate-950/80 hidden md:flex">
        <button
          onClick={() => {
            setAppViewMode('3d');
            setActiveSidebarTab(null);
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            appViewMode === '3d' && !activeSidebarTab
              ? 'bg-sky-500 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Explore</span>
        </button>

        <button
          onClick={() => {
            setAppViewMode('gis');
            setActiveSidebarTab(null);
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            appViewMode === 'gis'
              ? 'bg-sky-500 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <MapIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span>Campus Map</span>
        </button>

        <button
          onClick={() => setActiveSidebarTab(activeSidebarTab === 'buildings' ? null : 'buildings')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeSidebarTab === 'buildings'
              ? 'bg-sky-500 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-sky-400" />
          <span>Buildings</span>
        </button>

        <button
          onClick={() => setActiveSidebarTab(activeSidebarTab === 'facilities' ? null : 'facilities')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeSidebarTab === 'facilities'
              ? 'bg-sky-500 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Facilities</span>
        </button>

        <button
          onClick={() => {
            setAppViewMode('3d');
            startTour();
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            isTourActive
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Guided Tour</span>
        </button>
      </nav>

      {/* Right: Search, Settings, Help */}
      <div className="flex items-center gap-1.5 pointer-events-auto">
        {/* Quick Search Trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          title="Search Campus (⌘K)"
          className="glass-panel px-3 py-1.5 rounded-xl border border-white/10 hover:border-sky-400/40 text-slate-200 hover:text-white flex items-center gap-2 transition-all cursor-pointer shadow-xl backdrop-blur-xl bg-slate-950/80"
        >
          <Search className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-xs text-slate-400 hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline text-[10px] font-mono px-1 py-0.5 rounded bg-white/10 text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* Settings Button */}
        <button
          onClick={() => setGraphicsSettingsModalOpen(true)}
          title="Campus Settings & Environment"
          className="glass-panel p-2 rounded-xl border border-white/10 hover:border-sky-400/40 text-slate-300 hover:text-white transition-all cursor-pointer shadow-xl backdrop-blur-xl bg-slate-950/80"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>

        {/* Help Button */}
        <button
          onClick={() => setHelpModalOpen(true)}
          title="Navigation & Controls Help"
          className="glass-panel p-2 rounded-xl border border-white/10 hover:border-sky-400/40 text-slate-300 hover:text-white transition-all cursor-pointer shadow-xl backdrop-blur-xl bg-slate-950/80"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
