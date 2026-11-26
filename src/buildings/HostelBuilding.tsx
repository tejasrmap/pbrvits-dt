import React, { useMemo } from 'react';
import * as THREE from 'three';
import type { BuildingData, TimeOfDay } from '../types';

interface HostelBuildingProps {
  data: BuildingData;
  timeOfDay: TimeOfDay;
  isSelected: boolean;
}

export const HostelBuilding: React.FC<HostelBuildingProps> = ({ data, isSelected }) => {
  const { width, depth, height } = data.dimensions;
  const floors = data.floors || 4;
  const floorHeight = height / floors;

  const wallMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isSelected ? '#38bdf8' : '#e8ded1', // Light warm beige
      roughness: 0.85,
      metalness: 0.05,
      emissive: isSelected ? '#0284c7' : '#000000',
      emissiveIntensity: isSelected ? 0.35 : 0
    });
  }, [isSelected]);

  const balconyMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isSelected ? '#0284c7' : '#8c2d19', // Terracotta balcony balustrades
      roughness: 0.8,
      metalness: 0.1
    });
  }, [isSelected]);

  const concreteMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#cbd5e1',
      roughness: 0.9,
      metalness: 0.05
    });
  }, []);

  const glassMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#1e3a5f',
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.8
    });
  }, []);

  const balconyUnitWidth = 3.6;
  const balconyCount = Math.floor((width - 4) / balconyUnitWidth);

  return (
    <group>
      {/* 1. Plinth Base */}
      <mesh position={[0, 0.4, 0]} receiveShadow castShadow>
        <boxGeometry args={[width + 1.2, 0.8, depth + 1.2]} />
        <primitive object={concreteMaterial} attach="material" />
      </mesh>

      {/* 2. Main Residential Hostel Mass */}
      <mesh position={[0, height / 2 + 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>

      {/* 3. Modular Repetitive Balcony Insets & Balustrades across floors */}
      {Array.from({ length: floors }).map((_, f) => {
        const floorY = 0.8 + f * floorHeight;
        return (
          <group key={`hostel-balconies-${f}`} position={[0, floorY, depth / 2 + 0.1]}>
            {Array.from({ length: balconyCount }).map((_, bIdx) => {
              const xPos = -((balconyCount - 1) * balconyUnitWidth) / 2 + bIdx * balconyUnitWidth;
              return (
                <group key={`balcony-${bIdx}`} position={[xPos, 0, 0]}>
                  {/* Balcony Projection Slab */}
                  <mesh position={[0, 0.12, 0.7]} receiveShadow castShadow>
                    <boxGeometry args={[balconyUnitWidth - 0.4, 0.2, 1.4]} />
                    <primitive object={concreteMaterial} attach="material" />
                  </mesh>
                  {/* Terracotta Solid Balustrade */}
                  <mesh position={[0, 0.55, 1.35]} castShadow>
                    <boxGeometry args={[balconyUnitWidth - 0.4, 0.85, 0.15]} />
                    <primitive object={balconyMaterial} attach="material" />
                  </mesh>
                  {/* Room Window / Door */}
                  <mesh position={[0, 1.4, -0.05]}>
                    <boxGeometry args={[1.6, 1.8, 0.1]} />
                    <primitive object={glassMaterial} attach="material" />
                  </mesh>
                </group>
              );
            })}
          </group>
        );
      })}

      {/* 4. Attached Dining Mess Hall Annex (Ground Floor / Low Elevation) */}
      <group position={[width / 2 + 8, 2.2 + 0.8, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[16, 4.4, depth * 0.7]} />
          <primitive object={wallMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 2.3, 0]} castShadow>
          <boxGeometry args={[16.6, 0.3, depth * 0.7 + 0.6]} />
          <primitive object={concreteMaterial} attach="material" />
        </mesh>
      </group>

      {/* 5. Rooftop Parapet and RCC Water Tank Towers */}
      <group position={[0, height + 0.8, 0]}>
        <mesh position={[0, 0.5, depth / 2 - 0.15]} castShadow receiveShadow>
          <boxGeometry args={[width, 1.0, 0.3]} />
          <primitive object={concreteMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 0.5, -depth / 2 + 0.15]} castShadow receiveShadow>
          <boxGeometry args={[width, 1.0, 0.3]} />
          <primitive object={concreteMaterial} attach="material" />
        </mesh>
        {/* Overhead Water Tank Batteries */}
        {[-width * 0.3, width * 0.3].map((xTank, idx) => (
          <mesh key={`tank-${idx}`} position={[xTank, 2.0, 0]} castShadow>
            <cylinderGeometry args={[1.8, 1.8, 2.8, 16]} />
            <primitive object={concreteMaterial} attach="material" />
          </mesh>
        ))}
      </group>
    </group>
  );
};
