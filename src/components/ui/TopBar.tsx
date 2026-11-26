import React from 'react';
import {
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Search,
  Compass,
  Eye,
  Footprints,
  Maximize2,
  Minimize2,
  RotateCcw,
  HelpCircle,
  Sparkles,
  Sliders
} from 'lucide-react';
import { useCampusStore } from '../../store/useCampusStore';
import type { TimeOfDay, CameraMode } from '../../types';

export const TopBar: React.FC = () => {
  const timeOfDay = useCampusStore((s) => s.timeOfDay);
  const setTimeOfDay = useCampusStore((s) => s.setTimeOfDay);
  const cameraMode = useCampusStore((s) => s.cameraMode);
  const setCameraMode = useCampusStore((s) => s.setCameraMode);
  const resetCameraTarget = useCampusStore((s) => s.resetCameraTarget);
  const isFullscreen = useCampusStore((s) => s.isFullscreen);
  const toggleFullscreen = useCampusStore((s) => s.toggleFullscreen);
  const setSearchOpen = useCampusStore((s) => s.setSearchOpen);
  const setHelpModalOpen = useCampusStore((s) => s.setHelpModalOpen);
  const setGraphicsSettingsModalOpen = useCampusStore((s) => s.setGraphicsSettingsModalOpen);
  const startTour = useCampusStore((s) => s.startTour);
  const isTourActive = useCampusStore((s) => s.isTourActive);

  return (
    <header className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between gap-2.5 pointer-events-none">
      {/* Brand & Campus Identity */}
      <div className="glass-panel px-3.5 py-2 rounded-xl flex items-center gap-3 pointer-events-auto border border-white/10 shadow-2xl">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-600 to-indigo-500 flex items-center justify-center font-black text-white text-sm shadow-md ring-2 ring-sky-400/30">
          PV
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xs sm:text-sm font-bold tracking-wide text-white">
              PBR VITS
            </h1>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-sky-500/20 text-sky-300 border border-sky-400/30 tracking-wider">
              Digital Twin
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
            Visvodaya Institute of Technology & Science, Kavali
          </p>
        </div>
      </div>

      {/* Center Search Trigger */}
      <button
        onClick={() => setSearchOpen(true)}
        className="glass-panel px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs text-slate-300 hover:text-white hover:border-sky-400/50 transition-all duration-200 pointer-events-auto shadow-xl group cursor-pointer"
      >
        <Search className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
        <span className="hidden md:inline">Search buildings, departments, labs...</span>
        <span className="md:hidden">Search</span>
        <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-400 rounded border border-slate-700">
          Ctrl+K
        </kbd>
      </button>

      {/* Right Controls: Showcase Tour, Time of Day, Camera Mode, Viewport */}
      <div className="glass-panel px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 sm:gap-2 pointer-events-auto shadow-2xl">
        {/* Guided Showcase Tour Button */}
        <button
          onClick={startTour}
          title="Start Guided Showcase Tour"
          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
            isTourActive
              ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400/50 animate-pulse'
              : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Tour</span>
        </button>

        <div className="h-4 w-[1px] bg-slate-700/80" />

        {/* Time of Day Switcher: Day, Golden Hour, Sunset, Night */}
        <div className="flex items-center bg-slate-900/80 p-0.5 rounded-lg border border-slate-700/60">
          {(
            [
              { id: 'day', label: 'Day', icon: Sun },
              { id: 'goldenHour', label: 'Golden', icon: Sunrise },
              { id: 'sunset', label: 'Sunset', icon: Sunset },
              { id: 'night', label: 'Night', icon: Moon }
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            const active = timeOfDay === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTimeOfDay(item.id as TimeOfDay)}
                title={`${item.label} Lighting`}
                className={`p-1.5 rounded-md text-xs transition-all flex items-center gap-1 cursor-pointer ${
                  active
                    ? 'bg-sky-500 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="h-4 w-[1px] bg-slate-700/80 hidden sm:block" />

        {/* Camera Mode Switcher */}
        <div className="hidden sm:flex items-center bg-slate-900/80 p-0.5 rounded-lg border border-slate-700/60">
          {(
            [
              { id: 'orbit', label: 'Orbit', icon: Eye },
              { id: 'aerial', label: 'Aerial', icon: Compass },
              { id: 'firstPerson', label: 'Walk', icon: Footprints }
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            const active = cameraMode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCameraMode(item.id as CameraMode)}
                title={`${item.label} Camera`}
                className={`p-1.5 rounded-md text-xs transition-all flex items-center gap-1 cursor-pointer ${
                  active
                    ? 'bg-sky-500 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="h-4 w-[1px] bg-slate-700/80" />

        {/* Graphics Settings */}
        <button
          onClick={() => setGraphicsSettingsModalOpen(true)}
          title="Graphics Quality & Performance"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>

        {/* Camera Reset */}
        <button
          onClick={resetCameraTarget}
          title="Reset Camera View"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer hidden sm:block"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>

        {/* Help / Guide */}
        <button
          onClick={() => setHelpModalOpen(true)}
          title="Controls & Campus Info"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
