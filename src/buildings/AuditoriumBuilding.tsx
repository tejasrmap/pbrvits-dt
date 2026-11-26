import React, { useMemo } from 'react';
import * as THREE from 'three';
import type { BuildingData, TimeOfDay } from '../types';

interface AuditoriumBuildingProps {
  data: BuildingData;
  timeOfDay: TimeOfDay;
  isSelected: boolean;
}

export const AuditoriumBuilding: React.FC<AuditoriumBuildingProps> = ({ data, isSelected }) => {
  const { width, depth, height } = data.dimensions;

  const wallMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isSelected ? '#38bdf8' : '#fdf8f0', // Crisp warm white convention facade
      roughness: 0.8,
      metalness: 0.05,
      emissive: isSelected ? '#0284c7' : '#000000',
      emissiveIntensity: isSelected ? 0.35 : 0
    });
  }, [isSelected]);

  const brickMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isSelected ? '#0284c7' : '#8c2d1b', // Deep maroon/terracotta accent
      roughness: 0.75,
      metalness: 0.1
    });
  }, [isSelected]);

  const concreteMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#cbd5e1',
      roughness: 0.88,
      metalness: 0.05
    });
  }, []);

  const glassMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#1e3a5f',
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.85
    });
  }, []);

  const entranceFoyerDepth = depth * 0.35;
  const stageTowerHeight = height * 1.35;

  return (
    <group>
      {/* 1. Grand Stepped Podium Entrance Plaza */}
      <mesh position={[0, 0.45, 0]} receiveShadow castShadow>
        <boxGeometry args={[width + 3, 0.9, depth + 3]} />
        <primitive object={concreteMaterial} attach="material" />
      </mesh>

      {/* 2. Main Convention Auditorium Hall */}
      <mesh position={[0, height / 2 + 0.9, -depth * 0.05]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth * 0.75]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>

      {/* 3. Stage Fly-Tower at Rear (Higher Volume for Stage & Acoustic Rafters) */}
      <mesh
        position={[0, stageTowerHeight / 2 + 0.9, -depth / 2 + 6]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width * 0.85, stageTowerHeight, 12]} />
        <primitive object={brickMaterial} attach="material" />
      </mesh>

      {/* 4. Grand Entrance Foyer (Front Facade Colonnade) */}
      <group position={[0, 0, depth / 2 - entranceFoyerDepth / 2]}>
        <mesh position={[0, (height * 0.7) / 2 + 0.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[width * 0.92, height * 0.7, entranceFoyerDepth]} />
          <primitive object={wallMaterial} attach="material" />
        </mesh>

        {/* Monumental Colonnade Pillars */}
        {[-width * 0.38, -width * 0.22, -width * 0.07, width * 0.07, width * 0.22, width * 0.38].map((xCol, idx) => (
          <mesh
            key={`aud-col-${idx}`}
            position={[xCol, (height * 0.7) / 2 + 0.9, entranceFoyerDepth / 2 + 0.4]}
            castShadow
          >
            <boxGeometry args={[0.7, height * 0.7, 0.7]} />
            <primitive object={concreteMaterial} attach="material" />
          </mesh>
        ))}

        {/* Expansive Glass Entrance Foyer Doors */}
        <mesh position={[0, 2.5 + 0.9, entranceFoyerDepth / 2 + 0.05]} castShadow>
          <boxGeometry args={[width * 0.5, 3.5, 0.2]} />
          <primitive object={glassMaterial} attach="material" />
        </mesh>

        {/* Foyer Fascia Header */}
        <mesh position={[0, height * 0.7 + 0.6 + 0.9, entranceFoyerDepth / 2 + 0.2]} castShadow>
          <boxGeometry args={[width * 0.94, 0.8, 1.2]} />
          <primitive object={concreteMaterial} attach="material" />
        </mesh>
      </group>

      {/* 5. Acoustic Side Emergency Exit Portals */}
      {[-1, 1].map((dir, i) => (
        <group key={`exit-${i}`} position={[dir * (width / 2 + 0.5), 1.8 + 0.9, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.0, 3.2, 4]} />
            <primitive object={concreteMaterial} attach="material" />
          </mesh>
        </group>
      ))}
    </group>
  );
};
