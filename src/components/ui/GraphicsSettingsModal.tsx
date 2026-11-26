import React from 'react';
import { X, Sliders } from 'lucide-react';
import { useCampusStore } from '../../store/useCampusStore';
import type { GraphicsQuality } from '../../types';

export const GraphicsSettingsModal: React.FC = () => {
  const graphicsSettingsModalOpen = useCampusStore((s) => s.graphicsSettingsModalOpen);
  const setGraphicsSettingsModalOpen = useCampusStore((s) => s.setGraphicsSettingsModalOpen);
  const graphicsQuality = useCampusStore((s) => s.graphicsQuality);
  const setGraphicsQuality = useCampusStore((s) => s.setGraphicsQuality);
  const layers = useCampusStore((s) => s.layers);
  const toggleLayer = useCampusStore((s) => s.toggleLayer);

  if (!graphicsSettingsModalOpen) return null;

  const presets: Array<{
    id: GraphicsQuality;
    title: string;
    description: string;
    badge: string;
  }> = [
    {
      id: 'low',
      title: 'Performance',
      description: 'Optimized for mobile devices and integrated graphics. Disables high-res shadows.',
      badge: '60+ FPS'
    },
    {
      id: 'medium',
      title: 'Balanced',
      description: 'Smooth performance with standard shadows and optimized instanced foliage.',
      badge: 'Balanced'
    },
    {
      id: 'high',
      title: 'High (Recommended)',
      description: 'Crisp procedural PBR textures, soft directional sun shadows, and full foliage density.',
      badge: 'HD Quality'
    },
    {
      id: 'ultra',
      title: 'Ultra Visualization',
      description: 'Full 2K shadow maps, maximum procedural terrain details, and nocturnal light glows.',
      badge: 'Cinematic'
    }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none animate-in fade-in duration-200"
      onClick={() => setGraphicsSettingsModalOpen(false)}
    >
      <div
        className="w-full max-w-lg glass-panel-glow rounded-3xl overflow-hidden shadow-2xl border border-sky-400/40 text-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-slate-900 to-sky-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Graphics & Performance Engine</h2>
              <p className="text-xs text-slate-400">Optimize 3D WebGL rendering for your device</p>
            </div>
          </div>
          <button
            onClick={() => setGraphicsSettingsModalOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quality Presets */}
        <div className="p-5 space-y-4 text-xs">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Render Quality Preset
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presets.map((preset) => {
                const isSelected = graphicsQuality === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => setGraphicsQuality(preset.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-sky-600/25 border-sky-400 text-white shadow-lg ring-1 ring-sky-400/40'
                        : 'bg-slate-800/40 border-white/5 hover:bg-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-white">{preset.title}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-sky-300">
                          {preset.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">{preset.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subsystem Toggles */}
          <div className="pt-2 border-t border-white/10">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Hardware Subsystem Toggles
            </div>
            <div className="space-y-2">
              <div
                onClick={() => toggleLayer('shadows')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-white/5 cursor-pointer hover:bg-slate-800/70"
              >
                <div>
                  <div className="font-semibold text-white">Dynamic Directional Sun Shadows</div>
                  <div className="text-[10px] text-slate-400">Calculates real-time shadows based on sun angle</div>
                </div>
                <div
                  className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
                    layers.shadows ? 'bg-sky-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      layers.shadows ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>

              <div
                onClick={() => toggleLayer('trees')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-white/5 cursor-pointer hover:bg-slate-800/70"
              >
                <div>
                  <div className="font-semibold text-white">Instanced Vegetation & Tree Canopy</div>
                  <div className="text-[10px] text-slate-400">High-performance GPU instancing for palms and shade trees</div>
                </div>
                <div
                  className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
                    layers.trees ? 'bg-sky-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      layers.trees ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-900/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            Current Profile: <strong className="text-sky-300 uppercase">{graphicsQuality}</strong>
          </span>
          <button
            onClick={() => setGraphicsSettingsModalOpen(false)}
            className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-lg"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
