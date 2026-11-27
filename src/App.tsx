import { TopBar } from './components/ui/TopBar';
import { BottomControlBar } from './components/controls/BottomControlBar';
import { Sidebar } from './components/panels/Sidebar';
import { BuildingInfoPanel } from './components/panels/BuildingInfoPanel';
import { CampusSearch } from './components/search/CampusSearch';
import { HelpModal } from './components/ui/HelpModal';
import { GraphicsSettingsModal } from './components/ui/GraphicsSettingsModal';
import { CampusGISMap } from './components/gis/CampusGISMap';
import { useCampusStore } from './store/useCampusStore';

export function App() {
  if (typeof window !== 'undefined') {
    (window as any).useCampusStore = useCampusStore;
  }
  const appViewMode = useCampusStore((s) => s.appViewMode);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 select-none font-sans">
      {/* Unified Geographically Grounded 3D Campus (MapLibre GL JS + Real Satellite Ground) */}
      <div className="w-full h-full absolute inset-0 z-0">
        <CampusGISMap
          initialBasemap={appViewMode === 'gis' ? 'osm' : 'satellite'}
        />
      </div>

      {/* Streamlined Clean UI System */}
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
