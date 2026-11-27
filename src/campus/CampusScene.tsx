import React from 'react';
import { useCampusStore, select3DBuildings } from '../store/useCampusStore';
import { MainGateArch } from '../buildings/MainGateArch';
import { Building } from '../buildings/Building';
import { CampusBoundary } from './CampusBoundary';
import { Lighting } from './Lighting';
import { Sky } from './Sky';
import { RouteRenderer } from '../navigation/RouteRenderer';
import { CameraManager } from '../camera/CameraManager';
import { StreetFurniture } from './StreetFurniture';

export const CampusScene: React.FC = () => {
  // Use the single authoritative 3D rendering selector
  const buildings3D = useCampusStore((s) => select3DBuildings(s.buildings));
  const timeOfDay = useCampusStore((s) => s.timeOfDay);
  const layers = useCampusStore((s) => s.layers);

  return (
    <>
      <CameraManager />
      <Sky timeOfDay={timeOfDay} />
      <Lighting timeOfDay={timeOfDay} />

      {/* Surrounding Geographic Campus Boundary */}
      <CampusBoundary />

      {/* Iconic Entrance Gateway Arch (Infrastructure) */}
      {layers.boundary && <MainGateArch />}

      {/* Permitted 3D Campus Buildings (Filtered: ALIGNED & PARTIALLY ALIGNED only; Hostels Excluded) */}
      {layers.buildings && (
        <group>
          {buildings3D.map((b) => (
            <Building key={b.id} data={b} timeOfDay={timeOfDay} />
          ))}
        </group>
      )}

      {/* Street Furniture, Lighting Poles & Flagpole */}
      <StreetFurniture timeOfDay={timeOfDay} />

      {/* Active Navigation Route */}
      {layers.navigation && <RouteRenderer />}
    </>
  );
};
