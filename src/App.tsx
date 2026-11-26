import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { CampusScene } from './campus/CampusScene';
import { TopBar } from './components/ui/TopBar';
import { Sidebar } from './components/panels/Sidebar';
import { BuildingInfoPanel } from './components/panels/BuildingInfoPanel';
import { CampusSearch } from './components/search/CampusSearch';
import { CompassHUD } from './components/dashboard/CompassHUD';
import { FirstPersonHUD } from './components/controls/FirstPersonHUD';
import { HelpModal } from './components/ui/HelpModal';
import { CinematicTourHUD } from './components/ui/CinematicTourHUD';
import { ShowcaseWelcomeModal } from './components/ui/ShowcaseWelcomeModal';
import { GraphicsSettingsModal } from './components/ui/GraphicsSettingsModal';
import { useCampusStore } from './store/useCampusStore';
import { Sparkles } from 'lucide-react';

function LoadingScreen() {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-slate-100 select-none">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-2xl ring-4 ring-sky-500/20 mb-6 animate-pulse">
        PV
      </div>
      <h1 className="text-xl font-bold tracking-wider text-white">
        PBR VITS DIGITAL TWIN
      </h1>
      <p className="text-xs text-sky-400 mt-1 font-mono tracking-widest uppercase">
        Procedural Campus Environment Loading...
      </p>
      <div className="w-48 h-1.5 bg-slate-800 rounded-full mt-6 overflow-hidden">
        <div className="h-full bg-sky-500 rounded-full animate-pulse" />
      </div>
      <div className="text-[11px] text-slate-500 mt-4 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-sky-400" />
        Kavali, SPSR Nellore District, Andhra Pradesh
      </div>
    </div>
  );
}

export function App() {
  const graphicsQuality = useCampusStore((s) => s.graphicsQuality);
  const layers = useCampusStore((s) => s.layers);

  // Dynamic pixel ratio scaling based on graphics profile
  const dpr = graphicsQuality === 'ultra' ? [1, 2] : graphicsQuality === 'high' ? [1, 1.5] : [1, 1];
  const enableShadows = layers.shadows && graphicsQuality !== 'low';

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 select-none font-sans">
      {/* 3D WebGL Canvas */}
      <Suspense fallback={<LoadingScreen />}>
        <Canvas
          shadows={enableShadows}
          dpr={dpr as any}
          camera={{
            position: [0, 95, 210],
            fov: 48,
            near: 0.5,
            far: 1500
          }}
          gl={{
            antialias: graphicsQuality !== 'low',
            powerPreference: 'high-performance'
          }}
          className="w-full h-full"
        >
          <CampusScene />
        </Canvas>
      </Suspense>

      {/* UI Overlay Systems */}
      <TopBar />
      <Sidebar />
      <BuildingInfoPanel />
      <CompassHUD />
      <FirstPersonHUD />
      <CinematicTourHUD />
      <CampusSearch />
      <HelpModal />
      <ShowcaseWelcomeModal />
      <GraphicsSettingsModal />
    </div>
  );
}

export default App;
