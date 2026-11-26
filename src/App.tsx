import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { CampusScene } from './campus/CampusScene';
import { TopBar } from './components/ui/TopBar';
import { BottomControlBar } from './components/controls/BottomControlBar';
import { Sidebar } from './components/panels/Sidebar';
import { BuildingInfoPanel } from './components/panels/BuildingInfoPanel';
import { CampusSearch } from './components/search/CampusSearch';
import { CompassHUD } from './components/dashboard/CompassHUD';
import { FirstPersonHUD } from './components/controls/FirstPersonHUD';
import { HelpModal } from './components/ui/HelpModal';
import { CinematicTourHUD } from './components/ui/CinematicTourHUD';
import { ShowcaseWelcomeModal } from './components/ui/ShowcaseWelcomeModal';
import { GraphicsSettingsModal } from './components/ui/GraphicsSettingsModal';
import { CampusGISMap } from './components/gis/CampusGISMap';
import { useCampusStore } from './store/useCampusStore';
import { Sparkles, Map as MapIcon, Maximize2 } from 'lucide-react';

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
        Real GIS Campus Environment Loading...
      </p>
      <div className="w-48 h-1.5 bg-slate-800 rounded-full mt-6 overflow-hidden">
        <div className="h-full bg-sky-500 rounded-full animate-pulse" />
      </div>
      <div className="text-[11px] text-slate-500 mt-4 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-sky-400" />
        Kavali, SPSR Nellore District, Andhra Pradesh (14.9132° N, 79.9836° E)
      </div>
    </div>
  );
}

export function App() {
  const graphicsQuality = useCampusStore((s) => s.graphicsQuality);
  const layers = useCampusStore((s) => s.layers);
  const appViewMode = useCampusStore((s) => s.appViewMode);
  const setAppViewMode = useCampusStore((s) => s.setAppViewMode);
  const [miniMapOpen, setMiniMapOpen] = useState(false);

  // Dynamic pixel ratio scaling based on graphics profile
  const dpr = graphicsQuality === 'ultra' ? [1, 2] : graphicsQuality === 'high' ? [1, 1.5] : [1, 1];
  const enableShadows = layers.shadows && graphicsQuality !== 'low';

  const isGISActive = appViewMode === 'gis' || appViewMode === 'satellite';

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 select-none font-sans">
      {/* 3D WebGL Canvas Layer (Maintained in DOM for 0-delay instant switching) */}
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

      {/* Fullscreen Real GIS Map View Layer (MapLibre GL JS + OSM / ESRI Satellite) */}
      {isGISActive && (
        <div className="w-full h-full absolute inset-0 z-10">
          <CampusGISMap
            initialBasemap={appViewMode === 'satellite' ? 'satellite' : 'osm'}
          />
        </div>
      )}

      {/* Picture-in-Picture GIS Mini-Map in 3D Mode */}
      {!isGISActive && (
        <div className="absolute bottom-5 left-5 z-20 pointer-events-auto">
          {miniMapOpen ? (
            <div className="w-72 h-52 rounded-2xl overflow-hidden glass-panel border border-sky-400/40 shadow-2xl relative flex flex-col">
              <div className="h-6 bg-slate-900/90 px-2 flex items-center justify-between text-[10px] font-bold text-sky-300">
                <span>Campus GIS MiniMap</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setAppViewMode('gis')}
                    title="Maximize GIS Map"
                    className="p-0.5 hover:text-white cursor-pointer"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setMiniMapOpen(false)}
                    className="p-0.5 hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="flex-1 w-full relative">
                <CampusGISMap initialBasemap="osm" />
              </div>
            </div>
          ) : (
            <button
              onClick={() => setMiniMapOpen(true)}
              title="Open Real GIS MiniMap"
              className="glass-panel px-3 py-2 rounded-xl border border-white/10 hover:border-sky-400 shadow-xl flex items-center gap-2 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer group"
            >
              <MapIcon className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>GIS Map</span>
            </button>
          )}
        </div>
      )}

      {/* UI Overlay Systems (Shared and Synchronized between 3D & GIS) */}
      <TopBar />
      <BottomControlBar />
      <Sidebar />
      <BuildingInfoPanel />
      {!isGISActive && <CompassHUD />}
      {!isGISActive && <FirstPersonHUD />}
      {!isGISActive && <CinematicTourHUD />}
      <CampusSearch />
      <HelpModal />
      <ShowcaseWelcomeModal />
      <GraphicsSettingsModal />
    </div>
  );
}

export default App;
