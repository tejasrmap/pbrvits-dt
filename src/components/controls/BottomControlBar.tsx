import React, { useState } from 'react';
import {
  Globe,
  Layers,
  Map as MapIcon,
  ChevronUp,
  RotateCcw
} from 'lucide-react';
import { useCampusStore } from '../../store/useCampusStore';

export const BottomControlBar: React.FC = () => {
  const appViewMode = useCampusStore((s) => s.appViewMode);
  const setAppViewMode = useCampusStore((s) => s.setAppViewMode);
  const flyTo = useCampusStore((s) => s.flyTo);
  const resetCameraTarget = useCampusStore((s) => s.resetCameraTarget);

  const [presetDropdownOpen, setPresetDropdownOpen] = useState(false);
  const [selectedPresetName, setSelectedPresetName] = useState('Campus Overview');

  const presets = [
    {
      id: 'overview',
      name: 'Campus Overview',
      pos: [0, 105, 205] as [number, number, number],
      look: [0, 0, 0] as [number, number, number]
    },
    {
      id: 'gate',
      name: 'Main Gate',
      pos: [0, 18, 140] as [number, number, number],
      look: [0, 6, 95] as [number, number, number]
    },
    {
      id: 'academic',
      name: 'Academic Blocks',
      pos: [20, 40, 60] as [number, number, number],
      look: [0, 8, -10] as [number, number, number]
    },
    {
      id: 'library',
      name: 'Library',
      pos: [65, 30, -5] as [number, number, number],
      look: [53.6, 6, -35.5] as [number, number, number]
    },
    {
      id: 'playground',
      name: 'Playground',
      pos: [-160, 50, 90] as [number, number, number],
      look: [-199, 0, 0] as [number, number, number]
    }
  ];

  const handleSelectPreset = (p: (typeof presets)[0]) => {
    setSelectedPresetName(p.name);
    setPresetDropdownOpen(false);
    if (appViewMode !== '3d') setAppViewMode('3d');
    flyTo(p.pos, p.look);
  };

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center pointer-events-auto select-none">
      <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-xl flex items-center gap-1 relative">
        {/* View Modes: 3D, Map, Satellite */}
        <button
          onClick={() => setAppViewMode('3d')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            appViewMode === '3d'
              ? 'bg-sky-500 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>3D</span>
        </button>

        <button
          onClick={() => setAppViewMode('gis')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            appViewMode === 'gis'
              ? 'bg-sky-500 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Map</span>
        </button>

        <button
          onClick={() => setAppViewMode('satellite')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            appViewMode === 'satellite'
              ? 'bg-sky-500 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <MapIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span>Satellite</span>
        </button>

        <div className="w-[1px] h-4 bg-white/15 mx-0.5" />

        {/* Camera Preset Dropdown */}
        <div className="relative">
          <button
            onClick={() => setPresetDropdownOpen(!presetDropdownOpen)}
            className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{selectedPresetName}</span>
            <ChevronUp
              className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                presetDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {presetDropdownOpen && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-44 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl p-1 flex flex-col gap-0.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                Camera Presets
              </div>
              {presets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                    selectedPresetName === p.name
                      ? 'bg-sky-500 text-white font-medium'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reset Camera View Button */}
        <button
          onClick={resetCameraTarget}
          title="Reset Camera View"
          className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
