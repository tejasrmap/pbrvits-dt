import React from 'react';
import { useCampusStore } from '../store/useCampusStore';
import { MainGateArch } from '../buildings/MainGateArch';
import { Building } from '../buildings/Building';
import { CampusBoundary } from './CampusBoundary';
import { Lighting } from './Lighting';
import { Sky } from './Sky';
import { RouteRenderer } from '../navigation/RouteRenderer';
import { CameraManager } from '../camera/CameraManager';
import { StreetFurniture } from './StreetFurniture';

export const CampusScene: React.FC = () => {
  const buildings = useCampusStore((s) => s.buildings);
  const timeOfDay = useCampusStore((s) => s.timeOfDay);
  const layers = useCampusStore((s) => s.layers);

  // Exclude unverified buildings (e.g. hostels with unverified roof geometry)
  const verifiedBuildings = buildings.filter(
    (b) => (b as any).alignmentStatus !== 'UNVERIFIED'
  );

  return (
    <>
      <CameraManager />
      <Sky timeOfDay={timeOfDay} />
      <Lighting timeOfDay={timeOfDay} />

      {/* Surrounding Geographic Campus Boundary */}
      <CampusBoundary />

      {/* Iconic Entrance Gateway Arch */}
      {layers.boundary && <MainGateArch />}

      {/* Authoritatively Verified Campus Buildings */}
      {layers.buildings && (
        <group>
          {verifiedBuildings.map((b) => (
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
