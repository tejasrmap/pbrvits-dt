import React from 'react';
import {
  Play,
  Compass,
  Building2,
  Navigation,
  Sun,
  ShieldCheck,
  X
} from 'lucide-react';
import { useCampusStore } from '../../store/useCampusStore';

export const ShowcaseWelcomeModal: React.FC = () => {
  const showcaseWelcomeOpen = useCampusStore((s) => s.showcaseWelcomeOpen);
  const setShowcaseWelcomeOpen = useCampusStore((s) => s.setShowcaseWelcomeOpen);
  const startTour = useCampusStore((s) => s.startTour);

  if (!showcaseWelcomeOpen) return null;

  const handleStartTour = () => {
    setShowcaseWelcomeOpen(false);
    startTour();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none animate-in fade-in duration-300">
      <div
        className="w-full max-w-2xl glass-panel-glow rounded-3xl overflow-hidden shadow-2xl border border-sky-400/40 text-slate-100 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Corner Button */}
        <button
          onClick={() => setShowcaseWelcomeOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Header Banner */}
        <div className="p-8 pb-6 bg-gradient-to-br from-slate-900 via-sky-950/80 to-slate-950 border-b border-white/10 relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />

          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-widest bg-sky-500/20 text-sky-300 border border-sky-400/30">
              SMART CAMPUS GIS TWIN
            </span>
            <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> OSM GEOREFERENCED
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            PBR VITS DIGITAL TWIN
          </h1>
          <p className="text-sm font-semibold text-sky-400 mt-1 tracking-wide">
            Real GIS Campus Map & 3D Environment (14.91326° N, 79.98367° E)
          </p>
          <p className="text-xs text-slate-400 mt-1">
            PBR Visvodaya Institute of Technology & Science • Kondapuram Rd, Kavali, SPSR Nellore, AP
          </p>
        </div>

        {/* Feature Grid */}
        <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/40 text-xs">
          <div className="p-3 rounded-2xl bg-slate-800/40 border border-white/5 flex flex-col items-center text-center">
            <Building2 className="w-5 h-5 text-sky-400 mb-1.5" />
            <div className="font-bold text-white">14 Key Assets</div>
            <div className="text-[10px] text-slate-400">Academic & Living</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/40 border border-white/5 flex flex-col items-center text-center">
            <Compass className="w-5 h-5 text-indigo-400 mb-1.5" />
            <div className="font-bold text-white">GIS Map & Satellite</div>
            <div className="text-[10px] text-slate-400">MapLibre + OSM</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/40 border border-white/5 flex flex-col items-center text-center">
            <Navigation className="w-5 h-5 text-emerald-400 mb-1.5" />
            <div className="font-bold text-white">A* Navigation</div>
            <div className="text-[10px] text-slate-400">Pedestrian Wayfinding</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/40 border border-white/5 flex flex-col items-center text-center">
            <Sun className="w-5 h-5 text-amber-400 mb-1.5" />
            <div className="font-bold text-white">Diurnal Cycles</div>
            <div className="text-[10px] text-slate-400">Day • Sunset • Night</div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-6 pt-4 flex flex-col sm:flex-row items-center gap-3 bg-slate-900/60 border-t border-white/10">
          <button
            onClick={handleStartTour}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-sky-500/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer group"
          >
            <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
            Start Guided Showcase Tour
          </button>
          <button
            onClick={() => setShowcaseWelcomeOpen(false)}
            className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-sm transition-colors cursor-pointer border border-white/10"
          >
            Explore Freely
          </button>
        </div>
      </div>
    </div>
  );
};
