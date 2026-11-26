import React from 'react';
import {
  Footprints,
  LogOut,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Zap
} from 'lucide-react';
import { useCampusStore } from '../../store/useCampusStore';

export const FirstPersonHUD: React.FC = () => {
  const cameraMode = useCampusStore((s) => s.cameraMode);
  const setCameraMode = useCampusStore((s) => s.setCameraMode);
  const firstPersonPosition = useCampusStore((s) => s.firstPersonPosition);

  if (cameraMode !== 'firstPerson') return null;

  const triggerKey = (code: string, down: boolean) => {
    window.dispatchEvent(
      new KeyboardEvent(down ? 'keydown' : 'keyup', { code, bubbles: true })
    );
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-30 select-none">
      {/* Center Screen Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full bg-sky-400/80 ring-4 ring-sky-400/20 shadow-md" />
      </div>

      {/* Top Banner Notice */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 glass-panel px-4 py-2.5 rounded-xl border border-sky-400/40 shadow-2xl flex items-center gap-3">
        <Footprints className="w-5 h-5 text-sky-400 animate-pulse shrink-0" />
        <div>
          <div className="text-xs font-bold text-white">Campus Walkthrough Mode</div>
          <div className="text-[11px] text-slate-300">
            Click screen to lock mouse. Use <span className="font-semibold text-sky-300">W, A, S, D</span> or on-screen arrows to walk.
          </div>
        </div>
        <button
          onClick={() => setCameraMode('orbit')}
          className="ml-2 px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 pointer-events-auto transition-colors cursor-pointer shadow-lg"
        >
          <LogOut className="w-3.5 h-3.5" />
          Exit (Esc)
        </button>
      </div>

      {/* On-screen Virtual D-Pad (Accessible for laptops/touchpads/mobile) */}
      <div className="absolute bottom-6 left-6 pointer-events-auto flex flex-col items-center gap-1 glass-panel p-2.5 rounded-2xl border border-white/10 shadow-2xl">
        <button
          onMouseDown={() => triggerKey('KeyW', true)}
          onMouseUp={() => triggerKey('KeyW', false)}
          onTouchStart={() => triggerKey('KeyW', true)}
          onTouchEnd={() => triggerKey('KeyW', false)}
          title="Walk Forward (W)"
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-sky-600 text-slate-200 active:bg-sky-500 transition-colors shadow cursor-pointer"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1">
          <button
            onMouseDown={() => triggerKey('KeyA', true)}
            onMouseUp={() => triggerKey('KeyA', false)}
            onTouchStart={() => triggerKey('KeyA', true)}
            onTouchEnd={() => triggerKey('KeyA', false)}
            title="Step Left (A)"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-sky-600 text-slate-200 active:bg-sky-500 transition-colors shadow cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onMouseDown={() => triggerKey('ShiftLeft', true)}
            onMouseUp={() => triggerKey('ShiftLeft', false)}
            onTouchStart={() => triggerKey('ShiftLeft', true)}
            onTouchEnd={() => triggerKey('ShiftLeft', false)}
            title="Sprint / Run (Shift)"
            className="p-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white active:bg-amber-400 transition-colors shadow cursor-pointer"
          >
            <Zap className="w-4 h-4" />
          </button>
          <button
            onMouseDown={() => triggerKey('KeyD', true)}
            onMouseUp={() => triggerKey('KeyD', false)}
            onTouchStart={() => triggerKey('KeyD', true)}
            onTouchEnd={() => triggerKey('KeyD', false)}
            title="Step Right (D)"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-sky-600 text-slate-200 active:bg-sky-500 transition-colors shadow cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <button
          onMouseDown={() => triggerKey('KeyS', true)}
          onMouseUp={() => triggerKey('KeyS', false)}
          onTouchStart={() => triggerKey('KeyS', true)}
          onTouchEnd={() => triggerKey('KeyS', false)}
          title="Walk Backward (S)"
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-sky-600 text-slate-200 active:bg-sky-500 transition-colors shadow cursor-pointer"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Coordinates Readout */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-panel px-4 py-1.5 rounded-lg border border-white/10 text-[11px] text-slate-400 font-mono">
        Pos: X: {firstPersonPosition[0].toFixed(1)}m | Y: {firstPersonPosition[1].toFixed(1)}m | Z: {firstPersonPosition[2].toFixed(1)}m
      </div>
    </div>
  );
};
