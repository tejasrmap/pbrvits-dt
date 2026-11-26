import React from 'react';
import {
  Search,
  Sliders,
  HelpCircle,
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

  return (
    <header className="absolute top-3 left-4 right-4 z-30 flex items-center justify-between gap-3 pointer-events-none select-none">
      {/* 1. Left: Institutional Identity */}
      <div className="flex items-center gap-2.5 pointer-events-auto">
        <div className="bg-slate-900/85 hover:bg-slate-900/95 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-2.5 border border-white/10 shadow-lg transition-all">
          <div className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center font-bold text-white text-[11px] shadow-sm">
            PV
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold tracking-tight text-white">
              PBR VITS
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              &bull;
            </span>
            <span className="text-[10px] text-sky-400 font-medium tracking-wide">
              Digital Campus
            </span>
          </div>
        </div>
      </div>

      {/* 2. Center: Primary Navigation Segments */}
      <nav className="bg-slate-900/85 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-lg flex items-center gap-1 pointer-events-auto hidden md:flex">
        <button
          onClick={() => {
            setAppViewMode('3d');
            setActiveSidebarTab(null);
          }}
          className={`px-3.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            appViewMode === '3d' && !activeSidebarTab
              ? 'bg-sky-500 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Explore</span>
        </button>

        <button
          onClick={() => setActiveSidebarTab(activeSidebarTab === 'buildings' ? null : 'buildings')}
          className={`px-3.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeSidebarTab === 'buildings'
              ? 'bg-sky-500 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-sky-400" />
          <span>Buildings</span>
        </button>

        <button
          onClick={() => {
            setAppViewMode(appViewMode === 'gis' ? '3d' : 'gis');
            setActiveSidebarTab(null);
          }}
          className={`px-3.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            appViewMode === 'gis'
              ? 'bg-sky-500 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <MapIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span>Campus Map</span>
        </button>

        <button
          onClick={() => setActiveSidebarTab(activeSidebarTab === 'facilities' ? null : 'facilities')}
          className={`px-3.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeSidebarTab === 'facilities'
              ? 'bg-sky-500 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Facilities</span>
        </button>
      </nav>

      {/* 3. Right: Utility Controls (Search, Settings, Help) */}
      <div className="flex items-center gap-1.5 pointer-events-auto">
        <button
          onClick={() => setSearchOpen(true)}
          title="Search Campus (⌘K)"
          className="bg-slate-900/85 hover:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 hover:border-sky-400/40 text-slate-200 hover:text-white flex items-center gap-2 transition-all cursor-pointer shadow-lg"
        >
          <Search className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-xs text-slate-300 hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline text-[9px] font-mono px-1 py-0.2 rounded bg-white/10 text-slate-400">
            ⌘K
          </kbd>
        </button>

        <button
          onClick={() => setGraphicsSettingsModalOpen(true)}
          title="Environment & Lighting Settings"
          className="bg-slate-900/85 hover:bg-slate-900/95 backdrop-blur-md p-2 rounded-full border border-white/10 hover:border-sky-400/40 text-slate-300 hover:text-white transition-all cursor-pointer shadow-lg"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setHelpModalOpen(true)}
          title="Help & Controls Guide"
          className="bg-slate-900/85 hover:bg-slate-900/95 backdrop-blur-md p-2 rounded-full border border-white/10 hover:border-sky-400/40 text-slate-300 hover:text-white transition-all cursor-pointer shadow-lg"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
