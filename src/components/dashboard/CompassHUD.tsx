import React from 'react';
import { Navigation2 } from 'lucide-react';
import { useCampusStore } from '../../store/useCampusStore';

export const CompassHUD: React.FC = () => {
  const compassAngle = useCampusStore((s) => s.compassAngle);
  const cameraZoom = useCampusStore((s) => s.cameraZoom);
  const resetCameraTarget = useCampusStore((s) => s.resetCameraTarget);

  // Approximate scale bar calculation in meters based on distance
  const scaleMeters = cameraZoom > 250 ? 100 : cameraZoom > 120 ? 50 : 25;
  const scalePixelWidth = 80;

  return (
    <div className="absolute bottom-5 right-5 z-20 flex flex-col items-end gap-3 pointer-events-none select-none">
      {/* Interactive Compass Dial */}
      <button
        onClick={resetCameraTarget}
        title="Click to reset North orientation"
        className="glass-panel p-2.5 rounded-full pointer-events-auto border border-white/10 hover:border-sky-400/50 shadow-2xl transition-transform hover:scale-105 active:scale-95 cursor-pointer group"
      >
        <div
          className="w-10 h-10 relative flex items-center justify-center transition-transform duration-75"
          style={{ transform: `rotate(${-compassAngle}rad)` }}
        >
          {/* North Red Arrow */}
          <div className="absolute -top-1 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[13px] border-b-rose-500" />
          <span className="absolute -top-4 text-[10px] font-black text-rose-400 tracking-tighter">
            N
          </span>
          {/* South White Arrow */}
          <div className="absolute -bottom-1 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[13px] border-t-slate-300" />
          <Navigation2 className="w-5 h-5 text-sky-400 opacity-40 group-hover:opacity-80 transition-opacity" />
        </div>
      </button>

      {/* Dynamic Ground Scale Indicator */}
      <div className="glass-panel px-3 py-1.5 rounded-lg flex flex-col items-center gap-1 border border-white/10 shadow-xl pointer-events-auto">
        <div className="flex items-center justify-between w-full text-[10px] text-slate-300 font-mono">
          <span>0</span>
          <span>{scaleMeters}m</span>
        </div>
        <div
          className="h-1.5 bg-sky-500/80 rounded-full border border-sky-300/40"
          style={{ width: `${scalePixelWidth}px` }}
        />
        <div className="text-[9px] text-slate-400 font-medium">
          Scale 1:1 Real Geometry
        </div>
      </div>
    </div>
  );
};
