import { create } from 'zustand';
import type {
  BuildingData,
  CampusFacility,
  CameraMode,
  TimeOfDay,
  GraphicsQuality,
  LayerVisibility,
  NavRoute,
  TourStep,
  AppViewMode
} from '../types';
import type { BasemapId } from '../data/gis';
import { campusBuildings } from '../data/buildings';
import { campusFacilities } from '../data/facilities';
import { campusTourSteps } from '../data/campusTour';

interface CampusState {
  // Buildings
  buildings: BuildingData[];
  selectedBuilding: BuildingData | null;
  hoveredBuilding: BuildingData | null;
  
  // Facilities
  facilities: CampusFacility[];
  selectedFacility: CampusFacility | null;

  // Environment & View Modes
  appViewMode: AppViewMode;
  activeBasemap: BasemapId;
  timeOfDay: TimeOfDay;
  cameraMode: CameraMode;
  graphicsQuality: GraphicsQuality;
  targetCameraPosition: [number, number, number] | null;
  targetLookAt: [number, number, number] | null;
  compassAngle: number; // in radians
  cameraZoom: number;

  // Cinematic Tour State
  isTourActive: boolean;
  tourStepIndex: number;
  isTourPaused: boolean;
  tourSteps: TourStep[];

  // Layers
  layers: LayerVisibility;

  // Navigation
  startNodeId: string;
  targetNodeId: string;
  routingMode: 'shortest' | 'accessible' | 'scenic';
  activeRoute: NavRoute | null;
  isNavigating: boolean;

  // UI Panels
  activeSidebarTab: 'overview' | 'buildings' | 'facilities' | 'navigation' | 'layers' | 'departments' | 'sports' | 'parking' | null;
  searchOpen: boolean;
  searchQuery: string;
  isFullscreen: boolean;
  helpModalOpen: boolean;
  graphicsSettingsModalOpen: boolean;
  showcaseWelcomeOpen: boolean;

  // First-person state
  isFirstPersonWalking: boolean;
  firstPersonPosition: [number, number, number];

  // Actions
  setAppViewMode: (mode: AppViewMode) => void;
  setActiveBasemap: (basemap: BasemapId) => void;
  selectBuilding: (id: string | null) => void;
  hoverBuilding: (id: string | null) => void;
  selectFacility: (id: string | null) => void;
  setTimeOfDay: (time: TimeOfDay) => void;
  setCameraMode: (mode: CameraMode) => void;
  setGraphicsQuality: (quality: GraphicsQuality) => void;
  flyTo: (position: [number, number, number], lookAt: [number, number, number]) => void;
  resetCameraTarget: () => void;
  setCompassAngle: (angle: number) => void;
  setCameraZoom: (zoom: number) => void;
  toggleLayer: (layer: keyof LayerVisibility) => void;
  setNavigationNodes: (startId: string, targetId: string) => void;
  setRoutingMode: (mode: 'shortest' | 'accessible' | 'scenic') => void;
  setActiveRoute: (route: NavRoute | null) => void;
  clearNavigation: () => void;
  setActiveSidebarTab: (tab: 'overview' | 'buildings' | 'facilities' | 'navigation' | 'layers' | 'departments' | 'sports' | 'parking' | null) => void;
  setSearchOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  toggleFullscreen: () => void;
  setHelpModalOpen: (open: boolean) => void;
  setGraphicsSettingsModalOpen: (open: boolean) => void;
  setShowcaseWelcomeOpen: (open: boolean) => void;
  setFirstPersonPosition: (pos: [number, number, number]) => void;

  // Tour Actions
  startTour: () => void;
  pauseTour: () => void;
  resumeTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  stopTour: () => void;
}

export const useCampusStore = create<CampusState>((set, get) => ({
  buildings: campusBuildings,
  selectedBuilding: null,
  hoveredBuilding: null,

  facilities: campusFacilities,
  selectedFacility: null,

  appViewMode:
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('audit') === 'true'
      ? 'satellite'
      : '3d',
  activeBasemap: 'satellite',
  timeOfDay: 'day',
  cameraMode: 'orbit',
  graphicsQuality: 'high',
  targetCameraPosition: null,
  targetLookAt: null,
  compassAngle: 0,
  cameraZoom: 1,

  // Tour
  isTourActive: false,
  tourStepIndex: 0,
  isTourPaused: false,
  tourSteps: campusTourSteps,

  layers: {
    buildings: true,
    roads: true,
    trees: true,
    grass: true,
    parking: true,
    campusLabels: true,
    facilities: true,
    navigation: true,
    boundary: true,
    sports: true,
    shadows: true
  },

  startNodeId: "node-main-gate",
  targetNodeId: "node-admin-entrance",
  routingMode: 'shortest',
  activeRoute: null,
  isNavigating: false,

  activeSidebarTab: null,
  searchOpen: false,
  searchQuery: '',
  isFullscreen: false,
  helpModalOpen: false,
  graphicsSettingsModalOpen: false,
  showcaseWelcomeOpen: false,

  isFirstPersonWalking: false,
  firstPersonPosition: [0, 1.7, 160],

  setAppViewMode: (appViewMode) => {
    if (appViewMode === 'firstPerson') {
      set({
        appViewMode: 'firstPerson',
        cameraMode: 'firstPerson',
        isTourActive: false,
        isFirstPersonWalking: true
      });
    } else if (appViewMode === '3d') {
      set({
        appViewMode:
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('audit') === 'true'
      ? 'satellite'
      : '3d',
        cameraMode: 'orbit',
        isFirstPersonWalking: false
      });
    } else {
      set({
        appViewMode,
        isFirstPersonWalking: false,
        isTourActive: false
      });
    }
  },

  setActiveBasemap: (activeBasemap) => set({ activeBasemap }),

  selectBuilding: (id) => {
    if (!id) {
      set({ selectedBuilding: null });
      return;
    }
    const b = get().buildings.find(item => item.id === id) || null;
    if (b) {
      set({
        selectedBuilding: b,
        selectedFacility: null,
        targetCameraPosition: [b.position[0] + 35, b.dimensions.height + 25, b.position[2] + 45],
        targetLookAt: [b.position[0], b.dimensions.height * 0.45, b.position[2]]
      });
    }
  },

  hoverBuilding: (id) => {
    if (!id) {
      set({ hoveredBuilding: null });
      return;
    }
    const b = get().buildings.find(item => item.id === id) || null;
    set({ hoveredBuilding: b });
  },

  selectFacility: (id) => {
    if (!id) {
      set({ selectedFacility: null });
      return;
    }
    const f = get().facilities.find(item => item.id === id) || null;
    if (f) {
      set({
        selectedFacility: f,
        targetCameraPosition: [f.position[0] + 25, f.position[1] + 18, f.position[2] + 30],
        targetLookAt: [f.position[0], f.position[1], f.position[2]]
      });
    }
  },

  setTimeOfDay: (timeOfDay) => set({ timeOfDay }),

  setCameraMode: (cameraMode) => {
    if (cameraMode === 'aerial') {
      set({
        cameraMode: 'aerial',
        isTourActive: false,
        targetCameraPosition: [0, 280, 20],
        targetLookAt: [0, 0, 0]
      });
    } else if (cameraMode === 'firstPerson') {
      set({
        cameraMode: 'firstPerson',
        isTourActive: false,
        isFirstPersonWalking: true
      });
    } else if (cameraMode === 'orbit') {
      set({
        cameraMode: 'orbit',
        isTourActive: false,
        isFirstPersonWalking: false,
        targetCameraPosition: [0, 95, 210],
        targetLookAt: [0, 10, 15]
      });
    } else if (cameraMode === 'tour') {
      get().startTour();
    } else {
      set({ cameraMode });
    }
  },

  setGraphicsQuality: (graphicsQuality) => set({ graphicsQuality }),

  flyTo: (position, lookAt) => {
    set({
      targetCameraPosition: position,
      targetLookAt: lookAt
    });
  },

  resetCameraTarget: () => {
    set({
      targetCameraPosition: [0, 95, 210],
      targetLookAt: [0, 10, 15],
      cameraMode: 'orbit',
      isTourActive: false,
      selectedBuilding: null,
      selectedFacility: null
    });
  },

  setCompassAngle: (compassAngle) => set({ compassAngle }),
  setCameraZoom: (cameraZoom) => set({ cameraZoom }),

  toggleLayer: (layer) => {
    set((state) => ({
      layers: {
        ...state.layers,
        [layer]: !state.layers[layer]
      }
    }));
  },

  setNavigationNodes: (startNodeId, targetNodeId) => {
    set({ startNodeId, targetNodeId, isNavigating: true });
  },

  setRoutingMode: (routingMode) => set({ routingMode }),

  setActiveRoute: (activeRoute) => set({ activeRoute, isNavigating: !!activeRoute }),

  clearNavigation: () => set({ activeRoute: null, isNavigating: false }),

  setActiveSidebarTab: (activeSidebarTab) => set({ activeSidebarTab }),

  setSearchOpen: (searchOpen) => set({ searchOpen }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  toggleFullscreen: () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      set({ isFullscreen: true });
    } else {
      document.exitFullscreen().catch(() => {});
      set({ isFullscreen: false });
    }
  },

  setHelpModalOpen: (helpModalOpen) => set({ helpModalOpen }),
  setGraphicsSettingsModalOpen: (graphicsSettingsModalOpen) => set({ graphicsSettingsModalOpen }),
  setShowcaseWelcomeOpen: (showcaseWelcomeOpen) => set({ showcaseWelcomeOpen }),

  setFirstPersonPosition: (firstPersonPosition) => set({ firstPersonPosition }),

  // Tour logic
  startTour: () => {
    const steps = get().tourSteps;
    if (steps.length === 0) return;
    const firstStep = steps[0];
    set({
      isTourActive: true,
      tourStepIndex: 0,
      isTourPaused: false,
      cameraMode: 'tour',
      activeSidebarTab: null,
      selectedBuilding: firstStep.buildingId ? get().buildings.find(b => b.id === firstStep.buildingId) || null : null,
      timeOfDay: firstStep.timeOfDay || get().timeOfDay,
      targetCameraPosition: firstStep.position,
      targetLookAt: firstStep.lookAt
    });
  },

  pauseTour: () => set({ isTourPaused: true }),
  resumeTour: () => set({ isTourPaused: false }),

  nextTourStep: () => {
    const steps = get().tourSteps;
    const nextIdx = (get().tourStepIndex + 1) % steps.length;
    const step = steps[nextIdx];
    set({
      tourStepIndex: nextIdx,
      selectedBuilding: step.buildingId ? get().buildings.find(b => b.id === step.buildingId) || null : null,
      timeOfDay: step.timeOfDay || get().timeOfDay,
      targetCameraPosition: step.position,
      targetLookAt: step.lookAt
    });
  },

  prevTourStep: () => {
    const steps = get().tourSteps;
    const prevIdx = (get().tourStepIndex - 1 + steps.length) % steps.length;
    const step = steps[prevIdx];
    set({
      tourStepIndex: prevIdx,
      selectedBuilding: step.buildingId ? get().buildings.find(b => b.id === step.buildingId) || null : null,
      timeOfDay: step.timeOfDay || get().timeOfDay,
      targetCameraPosition: step.position,
      targetLookAt: step.lookAt
    });
  },

  stopTour: () => {
    set({
      isTourActive: false,
      isTourPaused: false,
      cameraMode: 'orbit',
      selectedBuilding: null,
      targetCameraPosition: [0, 95, 210],
      targetLookAt: [0, 10, 15]
    });
  }
}));
