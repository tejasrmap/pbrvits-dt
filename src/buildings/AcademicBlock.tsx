import React, { useMemo } from 'react';
import * as THREE from 'three';
import type { BuildingData, TimeOfDay } from '../types';

interface AcademicBlockProps {
  data: BuildingData;
  timeOfDay: TimeOfDay;
  isSelected: boolean;
}

export const AcademicBlock: React.FC<AcademicBlockProps> = ({ data, isSelected }) => {
  const { width, depth, height } = data.dimensions;
  const floors = data.floors || 4;
  const floorHeight = height / floors;

  const wallColor = data.color || '#f0ede6';
  const accentColor = data.secondaryColor || '#9e3a24';

  const wallMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isSelected ? '#38bdf8' : wallColor,
      roughness: 0.82,
      metalness: 0.05,
      emissive: isSelected ? '#0284c7' : '#000000',
      emissiveIntensity: isSelected ? 0.35 : 0
    });
  }, [isSelected, wallColor]);

  const brickMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isSelected ? '#0284c7' : accentColor,
      roughness: 0.78,
      metalness: 0.1
    });
  }, [isSelected, accentColor]);

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
      roughness: 0.15,
      metalness: 0.85,
      transparent: true,
      opacity: 0.85
    });
  }, []);

  const railingMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#475569',
      roughness: 0.4,
      metalness: 0.8
    });
  }, []);

  // Courtyard & U-shaped wing configuration
  const wingWidth = width * 0.28;
  const spineDepth = depth * 0.38;
  const wingDepth = depth - spineDepth;

  return (
    <group>
      {/* 1. Plinth Platform */}
      <mesh position={[0, 0.4, 0]} receiveShadow castShadow>
        <boxGeometry args={[width + 1.6, 0.8, depth + 1.6]} />
        <primitive object={concreteMaterial} attach="material" />
      </mesh>

      {/* 2. Main Longitudinal Academic Spine (Back Wing) */}
      <mesh
        position={[0, height / 2 + 0.8, -depth / 2 + spineDepth / 2]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width, height, spineDepth]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>

      {/* 3. Left & Right Forward Projecting Wings (U-Shape Courtyard) */}
      {[-1, 1].map((dir, i) => (
        <group
          key={`wing-${i}`}
          position={[
            dir * (width / 2 - wingWidth / 2),
            height / 2 + 0.8,
            depth / 2 - wingDepth / 2
          ]}
        >
          {/* Main wing block */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[wingWidth, height, wingDepth]} />
            <primitive object={wallMaterial} attach="material" />
          </mesh>

          {/* Exterior Shaded Verandah Corridors with Columns */}
          {Array.from({ length: floors }).map((_, f) => {
            const fY = -height / 2 + f * floorHeight;
            return (
              <group key={`corridor-${f}`} position={[-dir * (wingWidth / 2 + 1.2), fY, 0]}>
                {/* Corridor Floor Slab */}
                <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
                  <boxGeometry args={[2.4, 0.25, wingDepth]} />
                  <primitive object={concreteMaterial} attach="material" />
                </mesh>
                {/* Safety Railings */}
                <mesh position={[0, 0.65, 0]}>
                  <boxGeometry args={[0.08, 0.9, wingDepth]} />
                  <primitive object={railingMaterial} attach="material" />
                </mesh>
                {/* Structural Colonnade Posts */}
                {Array.from({ length: 4 }).map((_, colIdx) => (
                  <mesh
                    key={`col-${colIdx}`}
                    position={[0, floorHeight / 2, -wingDepth / 2 + 3 + colIdx * (wingDepth / 4)]}
                    castShadow
                  >
                    <cylinderGeometry args={[0.2, 0.2, floorHeight - 0.2, 12]} />
                    <primitive object={concreteMaterial} attach="material" />
                  </mesh>
                ))}
              </group>
            );
          })}
        </group>
      ))}

      {/* 4. Prominent Corner Staircase Towers (Projecting above roof) */}
      {[-1, 1].map((dir, i) => (
        <group
          key={`stair-tower-${i}`}
          position={[dir * (width / 2 - wingWidth / 2), (height + 3) / 2 + 0.8, depth / 2 + 0.6]}
        >
          <mesh castShadow receiveShadow>
            <boxGeometry args={[wingWidth * 0.7, height + 3, 3.2]} />
            <primitive object={brickMaterial} attach="material" />
          </mesh>
          {/* Vertical Glass Stairwell Glazing Slit */}
          <mesh position={[0, 0, 1.65]}>
            <boxGeometry args={[1.4, height + 1, 0.1]} />
            <primitive object={glassMaterial} attach="material" />
          </mesh>
          {/* Rooftop Machine Room / Water Tank */}
          <mesh position={[0, (height + 3) / 2 + 0.8, 0]} castShadow>
            <boxGeometry args={[wingWidth * 0.75, 1.6, 3.4]} />
            <primitive object={concreteMaterial} attach="material" />
          </mesh>
        </group>
      ))}

      {/* 5. Continuous Concrete Sunshades (Chajjas) across floor levels */}
      {Array.from({ length: floors }).map((_, f) => {
        const yPos = 0.8 + (f + 1) * floorHeight;
        return (
          <group key={`chajja-${f}`} position={[0, yPos, 0]}>
            {/* Back facade chajja */}
            <mesh position={[0, -0.15, -depth / 2 - 0.4]} castShadow receiveShadow>
              <boxGeometry args={[width + 0.4, 0.18, 0.9]} />
              <primitive object={concreteMaterial} attach="material" />
            </mesh>
          </group>
        );
      })}

      {/* 6. Realistic Window Bays with Recessed Aluminum Frames */}
      {Array.from({ length: floors }).map((_, f) => {
        const floorY = 0.8 + f * floorHeight + floorHeight * 0.52;
        const windowSpacing = 4.2;
        const winCount = Math.floor((width - 4) / windowSpacing);

        return (
          <group key={`floor-windows-${f}`}>
            {/* Windows on back spine */}
            {Array.from({ length: winCount }).map((_, wIdx) => {
              const xPos = -((winCount - 1) * windowSpacing) / 2 + wIdx * windowSpacing;
              return (
                <group key={`back-win-${wIdx}`} position={[xPos, floorY, -depth / 2 - 0.05]}>
                  <mesh>
                    <boxGeometry args={[2.2, 1.6, 0.1]} />
                    <primitive object={glassMaterial} attach="material" />
                  </mesh>
                  {/* Concrete Lintels */}
                  <mesh position={[0, 0.95, -0.2]} castShadow>
                    <boxGeometry args={[2.5, 0.12, 0.5]} />
                    <primitive object={concreteMaterial} attach="material" />
                  </mesh>
                </group>
              );
            })}
          </group>
        );
      })}

      {/* 7. Parapet Roof with Internal Drainage Coping */}
      <group position={[0, height + 0.8, 0]}>
        <mesh position={[0, 0.55, -depth / 2 + spineDepth / 2]} castShadow receiveShadow>
          <boxGeometry args={[width, 1.1, spineDepth]} />
          <primitive object={wallMaterial} attach="material" />
        </mesh>
      </group>
    </group>
  );
};
