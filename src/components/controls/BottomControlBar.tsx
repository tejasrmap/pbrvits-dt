import React from 'react';
import {
  Globe,
  Layers,
  Map as MapIcon,
  Footprints
} from 'lucide-react';
import { useCampusStore } from '../../store/useCampusStore';
import type { AppViewMode } from '../../types';

export const BottomControlBar: React.FC = () => {
  const appViewMode = useCampusStore((s) => s.appViewMode);
  const setAppViewMode = useCampusStore((s) => s.setAppViewMode);
  const flyTo = useCampusStore((s) => s.flyTo);

  const presets = [
    {
      id: 'overview',
      name: 'Campus Aerial',
      pos: [0, 110, 195] as [number, number, number],
      look: [0, 0, 0] as [number, number, number]
    },
    {
      id: 'gate',
      name: 'Main Entrance',
      pos: [0, 18, 145] as [number, number, number],
      look: [0, 6, 95] as [number, number, number]
    },
    {
      id: 'quad',
      name: 'Academic Quad',
      pos: [25, 45, 65] as [number, number, number],
      look: [0, 8, -10] as [number, number, number]
    },
    {
      id: 'sports',
      name: 'Athletic Oval',
      pos: [-160, 55, 95] as [number, number, number],
      look: [-199, 0, 0] as [number, number, number]
    }
  ];

  const modes: { id: AppViewMode; label: string; icon: any }[] = [
    { id: '3d', label: '3D Twin', icon: Globe },
    { id: 'gis', label: 'Campus GIS', icon: Layers },
    { id: 'satellite', label: 'Satellite', icon: MapIcon },
    { id: 'firstPerson', label: 'Walk', icon: Footprints }
  ];

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col sm:flex-row items-center gap-2 pointer-events-auto">
      {/* Primary View Switcher Pill */}
      <div className="glass-panel p-1 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-1 backdrop-blur-xl bg-slate-950/80">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = appViewMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setAppViewMode(mode.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25 ring-2 ring-sky-400/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Camera Presets (Only visible in 3D mode) */}
      {appViewMode === '3d' && (
        <div className="glass-panel px-2 py-1 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-1 backdrop-blur-xl bg-slate-950/70 hidden md:flex">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => flyTo(p.pos, p.look)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap"
            >
              {p.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
