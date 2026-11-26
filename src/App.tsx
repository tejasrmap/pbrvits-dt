import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { CampusScene } from './campus/CampusScene';
import { TopBar } from './components/ui/TopBar';
import { BottomControlBar } from './components/controls/BottomControlBar';
import { Sidebar } from './components/panels/Sidebar';
import { BuildingInfoPanel } from './components/panels/BuildingInfoPanel';
import { CampusSearch } from './components/search/CampusSearch';
import { HelpModal } from './components/ui/HelpModal';
import { GraphicsSettingsModal } from './components/ui/GraphicsSettingsModal';
import { CampusGISMap } from './components/gis/CampusGISMap';
import { useCampusStore } from './store/useCampusStore';

function LoadingScreen() {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-slate-100 select-none">
      <div className="w-12 h-12 rounded-2xl bg-sky-500 flex items-center justify-center text-white text-lg font-bold shadow-2xl mb-4 animate-pulse">
        PV
      </div>
      <h1 className="text-sm font-bold tracking-wider text-white">
        PBR VITS DIGITAL CAMPUS
      </h1>
      <p className="text-[11px] text-slate-400 mt-1 font-mono">
        Kavali, Andhra Pradesh &bull; 14.9132° N, 79.9836° E
      </p>
      <div className="w-36 h-1 bg-slate-800 rounded-full mt-4 overflow-hidden">
        <div className="h-full bg-sky-500 rounded-full animate-pulse" />
      </div>
    </div>
  );
}

export function App() {
  const graphicsQuality = useCampusStore((s) => s.graphicsQuality);
  const layers = useCampusStore((s) => s.layers);
  const appViewMode = useCampusStore((s) => s.appViewMode);

  // Dynamic pixel ratio scaling based on graphics profile
  const dpr = graphicsQuality === 'ultra' ? [1, 2] : graphicsQuality === 'high' ? [1, 1.5] : [1, 1];
  const enableShadows = layers.shadows && graphicsQuality !== 'low';

  const isGISActive = appViewMode === 'gis' || appViewMode === 'satellite';

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 select-none font-sans">
      {/* 1. 3D WebGL Canvas Layer (Maintained in DOM for 0-delay instant switching) */}
      <div
        className={`w-full h-full absolute inset-0 ${
          isGISActive ? 'invisible pointer-events-none' : 'visible'
        }`}
      >
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
      </div>

      {/* 2. Fullscreen Real GIS Map View Layer (MapLibre GL JS + OSM / ESRI Satellite) */}
      {isGISActive && (
        <div className="w-full h-full absolute inset-0 z-10">
          <CampusGISMap
            initialBasemap={appViewMode === 'satellite' ? 'satellite' : 'osm'}
          />
        </div>
      )}

      {/* 3. Streamlined Clean UI System */}
      <TopBar />
      <BottomControlBar />
      <Sidebar />
      <BuildingInfoPanel />
      <CampusSearch />
      <HelpModal />
      <GraphicsSettingsModal />
    </div>
  );
}

export default App;
