import React from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  X,
  Sparkles
} from 'lucide-react';
import { useCampusStore } from '../../store/useCampusStore';

export const CinematicTourHUD: React.FC = () => {
  const isTourActive = useCampusStore((s) => s.isTourActive);
  const isTourPaused = useCampusStore((s) => s.isTourPaused);
  const tourStepIndex = useCampusStore((s) => s.tourStepIndex);
  const tourSteps = useCampusStore((s) => s.tourSteps);
  const pauseTour = useCampusStore((s) => s.pauseTour);
  const resumeTour = useCampusStore((s) => s.resumeTour);
  const nextTourStep = useCampusStore((s) => s.nextTourStep);
  const prevTourStep = useCampusStore((s) => s.prevTourStep);
  const stopTour = useCampusStore((s) => s.stopTour);

  if (!isTourActive) return null;

  const currentStep = tourSteps[tourStepIndex] || tourSteps[0];
  const totalSteps = tourSteps.length;

  return (
    <div className="absolute inset-x-0 bottom-6 z-40 flex justify-center px-4 pointer-events-none select-none">
      <div className="w-full max-w-3xl glass-panel-glow p-4 rounded-2xl border border-sky-400/40 shadow-2xl pointer-events-auto flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Top Header Row */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-400/30">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-400">
                  CINEMATIC CAMPUS TOUR
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/10">
                  {tourStepIndex + 1} / {totalSteps}
                </span>
              </div>
              <h3 className="text-base font-bold text-white tracking-wide">
                {currentStep.title}
              </h3>
            </div>
          </div>

          {/* Tour Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevTourStep}
              title="Previous Location"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {isTourPaused ? (
              <button
                onClick={resumeTour}
                title="Resume Tour"
                className="p-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/30 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={pauseTour}
                title="Pause Tour"
                className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
              >
                <Pause className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={nextTourStep}
              title="Next Location"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <div className="h-6 w-[1px] bg-white/10 mx-1" />

            <button
              onClick={stopTour}
              title="Exit Tour"
              className="px-3 py-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg"
            >
              <X className="w-3.5 h-3.5" />
              Exit
            </button>
          </div>
        </div>

        {/* Subtitle Description */}
        <p className="text-xs text-slate-300 leading-relaxed">
          {currentStep.subtitle}
        </p>

        {/* Stepper Progress Indicator Dots */}
        <div className="flex items-center gap-1.5 pt-1">
          {tourSteps.map((_, i) => (
            <div
              key={`dot-${i}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === tourStepIndex
                  ? 'flex-1 bg-sky-400 shadow-sm shadow-sky-400/50'
                  : i < tourStepIndex
                  ? 'w-4 bg-sky-700'
                  : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
