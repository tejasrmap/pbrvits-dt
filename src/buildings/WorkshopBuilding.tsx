import React, { useMemo } from 'react';
import * as THREE from 'three';
import type { BuildingData, TimeOfDay } from '../types';

interface WorkshopBuildingProps {
  data: BuildingData;
  timeOfDay: TimeOfDay;
  isSelected: boolean;
}

export const WorkshopBuilding: React.FC<WorkshopBuildingProps> = ({ data, isSelected }) => {
  const { width, depth, height } = data.dimensions;

  const wallMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isSelected ? '#38bdf8' : '#e2e8f0',
      roughness: 0.9,
      metalness: 0.05,
      emissive: isSelected ? '#0284c7' : '#000000',
      emissiveIntensity: isSelected ? 0.35 : 0
    });
  }, [isSelected]);

  const roofSheetMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#475569', // Dark corrugated metal industrial roofing
      roughness: 0.4,
      metalness: 0.6
    });
  }, []);

  const shutterDoorMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#334155', // Steel roll-up industrial shutter
      roughness: 0.5,
      metalness: 0.7
    });
  }, []);

  const yellowSafetyMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#eab308',
      roughness: 0.4,
      metalness: 0.2
    });
  }, []);

  const concreteMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#94a3b8',
      roughness: 0.9,
      metalness: 0.05
    });
  }, []);

  return (
    <group>
      {/* 1. Heavy Reinforced Concrete Plinth & Loading Apron */}
      <mesh position={[0, 0.4, 0]} receiveShadow castShadow>
        <boxGeometry args={[width + 2, 0.8, depth + 4]} />
        <primitive object={concreteMaterial} attach="material" />
      </mesh>

      {/* 2. Main High-Bay Masonry Walls */}
      <mesh position={[0, height / 2 + 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>

      {/* 3. Authentic Pitched Gabled Industrial Roof with North-Light Monitor */}
      <group position={[0, height + 0.8, 0]}>
        {/* Slanted Roof Sheets */}
        <mesh position={[0, 2.2, 0]} rotation={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[width + 1.5, 0.3, depth + 1.2]} />
          <primitive object={roofSheetMaterial} attach="material" />
        </mesh>

        {/* Elevated Center Clerestory Monitor for Natural Daylight */}
        <group position={[0, 3.2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[width * 0.7, 1.8, depth * 0.4]} />
            <primitive object={roofSheetMaterial} attach="material" />
          </mesh>
          {/* Glass Louver Vents */}
          <mesh position={[0, 0, depth * 0.2 + 0.05]}>
            <boxGeometry args={[width * 0.65, 1.2, 0.1]} />
            <meshStandardMaterial color="#60a5fa" transparent opacity={0.7} />
          </mesh>
        </group>
      </group>

      {/* 4. Industrial Heavy Machinery Shutter Bays (Front Facade) */}
      <group position={[0, 0.8, depth / 2 + 0.1]}>
        {[-width * 0.3, -width * 0.1, width * 0.1, width * 0.3].map((xBay, idx) => (
          <group key={`shutter-bay-${idx}`} position={[xBay, 2.5, 0]}>
            {/* Shutter Door */}
            <mesh castShadow>
              <boxGeometry args={[5.2, 4.8, 0.3]} />
              <primitive object={shutterDoorMaterial} attach="material" />
            </mesh>
            {/* Yellow / Black Hazard Header */}
            <mesh position={[0, 2.6, 0.15]}>
              <boxGeometry args={[5.6, 0.5, 0.1]} />
              <primitive object={yellowSafetyMaterial} attach="material" />
            </mesh>
          </group>
        ))}
      </group>

      {/* 5. Concrete Service Columns & Buttresses */}
      {[-width / 2, -width / 4, 0, width / 4, width / 2].map((xCol, idx) => (
        <mesh key={`buttress-${idx}`} position={[xCol, height / 2 + 0.8, -depth / 2 - 0.3]} castShadow>
          <boxGeometry args={[0.8, height, 0.6]} />
          <primitive object={concreteMaterial} attach="material" />
        </mesh>
      ))}
    </group>
  );
};
