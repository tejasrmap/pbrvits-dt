import React from 'react';
import { useCampusStore } from '../store/useCampusStore';
import { Terrain } from './Terrain';
import { Roads } from './Roads';
import { MainGateArch } from '../buildings/MainGateArch';
import { Building } from '../buildings/Building';
import { SportsFacilities } from './SportsFacilities';
import { Trees } from './Trees';
import { StreetFurniture } from './StreetFurniture';
import { Landscaping } from './Landscaping';
import { CampusBoundary } from './CampusBoundary';
import { Lighting } from './Lighting';
import { Sky } from './Sky';
import { RouteRenderer } from '../navigation/RouteRenderer';
import { CameraManager } from '../camera/CameraManager';

export const CampusScene: React.FC = () => {
  const buildings = useCampusStore((s) => s.buildings);
  const timeOfDay = useCampusStore((s) => s.timeOfDay);
  const layers = useCampusStore((s) => s.layers);

  return (
    <>
      <CameraManager />
      <Sky timeOfDay={timeOfDay} />
      <Lighting timeOfDay={timeOfDay} />

      {/* Surrounding Context & Farmland */}
      <CampusBoundary />

      {/* Campus Ground Terrain */}
      {layers.grass && <Terrain />}

      {/* Campus Road Network */}
      {layers.roads && <Roads />}

      {/* Iconic Entrance Gateway Arch */}
      {layers.boundary && <MainGateArch />}

      {/* Campus Buildings */}
      {layers.buildings && (
        <group>
          {buildings.map((b) => (
            <Building key={b.id} data={b} timeOfDay={timeOfDay} />
          ))}
        </group>
      )}

      {/* Athletic Ground & Outdoor Sports */}
      {layers.sports && <SportsFacilities />}

      {/* Procedural Landscaping & Gardens */}
      {layers.grass && <Landscaping />}

      {/* Instanced High-Performance Trees */}
      {layers.trees && <Trees />}

      {/* Street Furniture, Lighting Poles & Flagpole */}
      <StreetFurniture timeOfDay={timeOfDay} />

      {/* Active Navigation Route */}
      {layers.navigation && <RouteRenderer />}
    </>
  );
};
