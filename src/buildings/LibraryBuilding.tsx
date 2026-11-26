import React, { useMemo } from 'react';
import * as THREE from 'three';
import type { BuildingData, TimeOfDay } from '../types';

interface LibraryBuildingProps {
  data: BuildingData;
  timeOfDay: TimeOfDay;
  isSelected: boolean;
}

export const LibraryBuilding: React.FC<LibraryBuildingProps> = ({ data, isSelected }) => {
  const { width, depth, height } = data.dimensions;
  const floors = data.floors || 3;
  const floorHeight = height / floors;

  const wallMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isSelected ? '#38bdf8' : '#f8fafc',
      roughness: 0.85,
      metalness: 0.05,
      emissive: isSelected ? '#0284c7' : '#000000',
      emissiveIntensity: isSelected ? 0.35 : 0
    });
  }, [isSelected]);

  const blueGlazingMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#0284c7', // Reflective architectural solar blue glass
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.9
    });
  }, []);

  const concreteMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#cbd5e1',
      roughness: 0.88,
      metalness: 0.05
    });
  }, []);

  const louvreMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#0f172a', // Dark architectural solar fins
      roughness: 0.4,
      metalness: 0.6
    });
  }, []);

  const atriumWidth = width * 0.38;

  return (
    <group>
      {/* 1. Plinth Platform */}
      <mesh position={[0, 0.4, 0]} receiveShadow castShadow>
        <boxGeometry args={[width + 2, 0.8, depth + 2]} />
        <primitive object={concreteMaterial} attach="material" />
      </mesh>

      {/* 2. Main Structural Body */}
      <mesh position={[0, height / 2 + 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>

      {/* 3. Central Glazed Multi-Story Atrium Curtain Wall (Grand Entrance Facade) */}
      <group position={[0, height / 2 + 0.8, depth / 2 + 0.2]}>
        {/* Continuous Glass Facade */}
        <mesh castShadow>
          <boxGeometry args={[atriumWidth, height - 1.2, 0.4]} />
          <primitive object={blueGlazingMaterial} attach="material" />
        </mesh>

        {/* Structural Aluminum Mullions Grid */}
        {[-atriumWidth / 3, 0, atriumWidth / 3].map((xMullion, idx) => (
          <mesh key={`mullion-${idx}`} position={[xMullion, 0, 0.25]}>
            <boxGeometry args={[0.2, height - 1.2, 0.15]} />
            <primitive object={louvreMaterial} attach="material" />
          </mesh>
        ))}
        {Array.from({ length: floors }).map((_, f) => (
          <mesh key={`transom-${f}`} position={[0, -height / 2 + (f + 1) * floorHeight, 0.25]}>
            <boxGeometry args={[atriumWidth, 0.2, 0.15]} />
            <primitive object={louvreMaterial} attach="material" />
          </mesh>
        ))}
      </group>

      {/* 4. Projecting Geometric Entrance Canopy */}
      <group position={[0, floorHeight + 0.8, depth / 2 + 3.2]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[atriumWidth + 2, 0.4, 6]} />
          <primitive object={concreteMaterial} attach="material" />
        </mesh>
        {/* Support Columns */}
        {[-atriumWidth / 2 - 0.5, atriumWidth / 2 + 0.5].map((xCol, idx) => (
          <mesh key={`canopy-col-${idx}`} position={[xCol, -(floorHeight / 2) + 0.2, 2.5]} castShadow>
            <cylinderGeometry args={[0.25, 0.25, floorHeight, 16]} />
            <primitive object={concreteMaterial} attach="material" />
          </mesh>
        ))}
      </group>

      {/* 5. Flanking Reading Hall Wings with Vertical Brise-Soleil Fins */}
      {[-1, 1].map((dir, i) => (
        <group key={`fins-${i}`} position={[dir * (width / 2 - (width - atriumWidth) / 4), height / 2 + 0.8, depth / 2 + 0.2]}>
          {Array.from({ length: 6 }).map((_, finIdx) => (
            <mesh
              key={`fin-${finIdx}`}
              position={[-((width - atriumWidth) / 4) + finIdx * 2.8 + 1.4, 0, 0.4]}
              castShadow
            >
              <boxGeometry args={[0.15, height - 2, 0.8]} />
              <primitive object={concreteMaterial} attach="material" />
            </mesh>
          ))}
        </group>
      ))}

      {/* 6. Recessed Rooftop Terrace & Parapet */}
      <group position={[0, height + 0.8, 0]}>
        <mesh position={[0, 0.6, depth / 2 - 0.2]} castShadow receiveShadow>
          <boxGeometry args={[width, 1.2, 0.3]} />
          <primitive object={concreteMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 0.6, -depth / 2 + 0.2]} castShadow receiveShadow>
          <boxGeometry args={[width, 1.2, 0.3]} />
          <primitive object={concreteMaterial} attach="material" />
        </mesh>
        {/* Rooftop Skylight Dome above Atrium */}
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[atriumWidth * 0.35, atriumWidth * 0.4, 1.2, 24]} />
          <primitive object={blueGlazingMaterial} attach="material" />
        </mesh>
      </group>
    </group>
  );
};
