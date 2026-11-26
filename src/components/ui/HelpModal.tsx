import React from 'react';
import { X, Eye, Footprints, ShieldCheck } from 'lucide-react';
import { useCampusStore } from '../../store/useCampusStore';

export const HelpModal: React.FC = () => {
  const helpModalOpen = useCampusStore((s) => s.helpModalOpen);
  const setHelpModalOpen = useCampusStore((s) => s.setHelpModalOpen);

  if (!helpModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md select-none"
      onClick={() => setHelpModalOpen(false)}
    >
      <div
        className="w-full max-w-xl glass-panel-glow rounded-2xl overflow-hidden shadow-2xl border border-sky-400/40 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-slate-900 to-sky-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center font-bold text-white shadow-md">
              PV
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                PBR VITS Digital Twin Guide
              </h2>
              <p className="text-xs text-sky-300">
                How to navigate, explore, and inspect the 3D Campus
              </p>
            </div>
          </div>
          <button
            onClick={() => setHelpModalOpen(false)}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto max-h-[75vh] space-y-4 text-xs">
          {/* Section 1: Navigation Controls */}
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Eye className="w-4 h-4 text-sky-400" />
              Camera Controls
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-white/5">
                <span className="font-semibold text-white">Left Click + Drag</span>
                <p className="text-slate-400 mt-0.5">Orbit and rotate camera angle around campus</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-white/5">
                <span className="font-semibold text-white">Right Click + Drag</span>
                <p className="text-slate-400 mt-0.5">Pan horizontally across the campus terrain</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-white/5">
                <span className="font-semibold text-white">Scroll Wheel</span>
                <p className="text-slate-400 mt-0.5">Zoom in closer or pull out to campus overview</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-white/5">
                <span className="font-semibold text-white">Click Compass Dial</span>
                <p className="text-slate-400 mt-0.5">Instantly re-orient camera heading to True North</p>
              </div>
            </div>
          </div>

          {/* Section 2: First-Person Mode */}
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Footprints className="w-4 h-4 text-sky-400" />
              First-Person Walking Mode
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5 space-y-1.5 text-slate-300">
              <p>• Switch to <span className="text-sky-300 font-semibold">Walk</span> mode via the top bar.</p>
              <p>• Use <span className="text-sky-300 font-semibold">W, A, S, D</span> or arrow keys to walk along roads and pedestrian pathways.</p>
              <p>• Hold <span className="text-sky-300 font-semibold">Shift</span> to sprint at 2x walking speed.</p>
              <p>• Real-time collision detection prevents walking through solid building walls.</p>
              <p>• Press <span className="text-sky-300 font-semibold">Esc</span> at any time to return to orbital camera.</p>
            </div>
          </div>

          {/* Section 3: Digital Twin Features */}
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Real GIS & Geographic Capabilities
            </div>
            <div className="space-y-1.5 text-slate-300">
              <div className="p-2 rounded-lg bg-slate-800/40">
                <strong className="text-white">Real GIS Map Mode:</strong> Interactive MapLibre GL engine with OpenStreetMap, ESRI World Satellite imagery, and Topographic layers centered at 14.91326° N, 79.98367° E.
              </div>
              <div className="p-2 rounded-lg bg-slate-800/40">
                <strong className="text-white">Cadastral Data Accuracy:</strong> Buildings and sports ground boundaries are georeferenced from OpenStreetMap survey ways (1297901220, 1297896001, 1297903395, 1297903402) with transparent VERIFIED, APPROXIMATE, and ESTIMATED classifications.
              </div>
              <div className="p-2 rounded-lg bg-slate-800/40">
                <strong className="text-white">3D & GIS Synchronization:</strong> Selecting a building, searching a facility, or planning an A* pedestrian route synchronizes seamlessly across both the 2D GIS map and the 3D Digital Twin.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-900/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            PBR VITS • Kavali, AP • NAAC 'A' Grade
          </span>
          <button
            onClick={() => setHelpModalOpen(false)}
            className="px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-lg transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
