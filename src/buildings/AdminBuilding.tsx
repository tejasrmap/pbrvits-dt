import React, { useMemo } from 'react';
import * as THREE from 'three';
import type { BuildingData, TimeOfDay } from '../types';

interface AdminBuildingProps {
  data: BuildingData;
  timeOfDay: TimeOfDay;
  isSelected: boolean;
}

export const AdminBuilding: React.FC<AdminBuildingProps> = ({ data, isSelected }) => {
  const { width, depth, height } = data.dimensions;
  const floors = data.floors || 3;
  const floorHeight = height / floors;

  // Authentic architectural materials
  const wallMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isSelected ? '#38bdf8' : '#f5ede0', // Warm cream stucco
      roughness: 0.85,
      metalness: 0.05,
      emissive: isSelected ? '#0284c7' : '#000000',
      emissiveIntensity: isSelected ? 0.35 : 0
    });
  }, [isSelected]);

  const brickAccentMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isSelected ? '#0284c7' : '#9e3a24', // Terracotta brick accent
      roughness: 0.8,
      metalness: 0.1
    });
  }, [isSelected]);

  const concreteMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#cbd5e1', // Fair-faced concrete for chajjas & plinths
      roughness: 0.9,
      metalness: 0.05
    });
  }, []);

  const columnMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#ffffff', // Crisp white monumental portico pillars
      roughness: 0.4,
      metalness: 0.1
    });
  }, []);

  const glassMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#1e3a5f',
      roughness: 0.15,
      metalness: 0.9,
      transparent: true,
      opacity: 0.85
    });
  }, []);

  const graniteStairsMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#334155', // Polished dark grey granite stairs
      roughness: 0.6,
      metalness: 0.2
    });
  }, []);

  const porticoWidth = 14;
  const porticoDepth = 7;
  const porticoHeight = floorHeight * 2.2;

  return (
    <group>
      {/* 1. Plinth Foundation Platform */}
      <mesh position={[0, 0.45, 0]} receiveShadow castShadow>
        <boxGeometry args={[width + 2, 0.9, depth + 2]} />
        <primitive object={concreteMaterial} attach="material" />
      </mesh>

      {/* 2. Main Building Body (Central Core Mass) */}
      <mesh position={[0, height / 2 + 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>

      {/* 3. Symmetrical Flanking Wings (East & West) */}
      {[-1, 1].map((dir, i) => (
        <group key={`wing-${i}`} position={[dir * (width / 2 + 4), (height * 0.85) / 2 + 0.9, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[8, height * 0.85, depth * 0.85]} />
            <primitive object={wallMaterial} attach="material" />
          </mesh>
          {/* Vertical Terracotta Accent Ribs */}
          {[-2, 0, 2].map((xOffset, j) => (
            <mesh key={`rib-${j}`} position={[xOffset, 0, depth * 0.425 + 0.15]} castShadow>
              <boxGeometry args={[0.5, height * 0.85, 0.3]} />
              <primitive object={brickAccentMaterial} attach="material" />
            </mesh>
          ))}
        </group>
      ))}

      {/* 4. Floor-to-Floor Horizontal Cornices (Banding) */}
      {Array.from({ length: floors }).map((_, f) => {
        const yPos = 0.9 + (f + 1) * floorHeight;
        return (
          <group key={`cornice-${f}`} position={[0, yPos, 0]}>
            {/* Front & Back continuous concrete sunshade (Chajja) */}
            <mesh position={[0, -0.15, depth / 2 + 0.5]} castShadow receiveShadow>
              <boxGeometry args={[width + 0.8, 0.2, 1.2]} />
              <primitive object={concreteMaterial} attach="material" />
            </mesh>
            <mesh position={[0, -0.15, -depth / 2 - 0.5]} castShadow receiveShadow>
              <boxGeometry args={[width + 0.8, 0.2, 1.2]} />
              <primitive object={concreteMaterial} attach="material" />
            </mesh>
          </group>
        );
      })}

      {/* 5. Authentic Classical Entrance Portico (South Facade) */}
      <group position={[0, 0, depth / 2 + porticoDepth / 2]}>
        {/* Portico Roof Canopy / Pediment */}
        <mesh position={[0, porticoHeight + 0.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[porticoWidth + 1, 0.8, porticoDepth + 1]} />
          <primitive object={concreteMaterial} attach="material" />
        </mesh>

        {/* Triangular Pediment Fascia */}
        <mesh position={[0, porticoHeight + 1.8, porticoDepth / 2 - 0.2]} castShadow>
          <boxGeometry args={[porticoWidth - 1, 1.0, 0.4]} />
          <primitive object={brickAccentMaterial} attach="material" />
        </mesh>

        {/* 4 Grand Colossal Pillars (White Classical Columns) */}
        {[-5.2, -1.8, 1.8, 5.2].map((xCol, idx) => (
          <group key={`pillar-${idx}`} position={[xCol, (porticoHeight / 2) + 0.9, porticoDepth / 2 - 0.6]}>
            {/* Column Shaft */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.45, 0.5, porticoHeight, 16]} />
              <primitive object={columnMaterial} attach="material" />
            </mesh>
            {/* Capital & Base */}
            <mesh position={[0, porticoHeight / 2 - 0.2, 0]}>
              <boxGeometry args={[1.2, 0.4, 1.2]} />
              <primitive object={concreteMaterial} attach="material" />
            </mesh>
            <mesh position={[0, -porticoHeight / 2 + 0.2, 0]}>
              <boxGeometry args={[1.2, 0.4, 1.2]} />
              <primitive object={concreteMaterial} attach="material" />
            </mesh>
          </group>
        ))}

        {/* Monumental Granite Entrance Steps */}
        {Array.from({ length: 6 }).map((_, stepIdx) => (
          <mesh
            key={`step-${stepIdx}`}
            position={[0, 0.15 + stepIdx * 0.15, porticoDepth / 2 + 0.4 + (5 - stepIdx) * 0.45]}
            receiveShadow
          >
            <boxGeometry args={[porticoWidth - 1, 0.16, 0.5]} />
            <primitive object={graniteStairsMaterial} attach="material" />
          </mesh>
        ))}

        {/* Double Entrance Glass Doors */}
        <mesh position={[0, 2.2 + 0.9, -porticoDepth / 2 + 0.1]} castShadow>
          <boxGeometry args={[4.2, 3.2, 0.2]} />
          <primitive object={glassMaterial} attach="material" />
        </mesh>
      </group>

      {/* 6. Realistic Window Arrays with Concrete Frames & Chajjas */}
      {Array.from({ length: floors }).map((_, f) => {
        const floorY = 0.9 + f * floorHeight + floorHeight * 0.55;
        const windowSpacing = 4.8;
        const countX = Math.floor((width - 4) / windowSpacing);

        return (
          <group key={`floor-windows-${f}`}>
            {Array.from({ length: countX }).map((_, wIdx) => {
              const xPos = -((countX - 1) * windowSpacing) / 2 + wIdx * windowSpacing;
              // Skip windows behind the entrance portico on ground/first floor
              if (f < 2 && Math.abs(xPos) < porticoWidth / 2) return null;

              return (
                <group key={`win-${wIdx}`} position={[xPos, floorY, depth / 2 + 0.05]}>
                  {/* Glass Pane */}
                  <mesh>
                    <boxGeometry args={[2.4, 1.8, 0.1]} />
                    <primitive object={glassMaterial} attach="material" />
                  </mesh>
                  {/* Concrete Sunshade / Chajja */}
                  <mesh position={[0, 1.15, 0.35]} castShadow>
                    <boxGeometry args={[2.8, 0.12, 0.7]} />
                    <primitive object={concreteMaterial} attach="material" />
                  </mesh>
                </group>
              );
            })}
          </group>
        );
      })}

      {/* 7. Parapet Roof with Institutional Clock Tower & Water Tank Enclosure */}
      <group position={[0, height + 0.9, 0]}>
        {/* Parapet Wall Perimeter */}
        <mesh position={[0, 0.6, depth / 2 - 0.15]} castShadow receiveShadow>
          <boxGeometry args={[width, 1.2, 0.3]} />
          <primitive object={concreteMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 0.6, -depth / 2 + 0.15]} castShadow receiveShadow>
          <boxGeometry args={[width, 1.2, 0.3]} />
          <primitive object={concreteMaterial} attach="material" />
        </mesh>
        <mesh position={[-width / 2 + 0.15, 0.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.3, 1.2, depth]} />
          <primitive object={concreteMaterial} attach="material" />
        </mesh>
        <mesh position={[width / 2 - 0.15, 0.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.3, 1.2, depth]} />
          <primitive object={concreteMaterial} attach="material" />
        </mesh>

        {/* Central Roof Stairhead & Clock Crest */}
        <group position={[0, 2.0, depth * 0.1]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[7, 4.0, 6]} />
            <primitive object={brickAccentMaterial} attach="material" />
          </mesh>
          {/* Institutional Clock Face */}
          <mesh position={[0, 0.5, 3.05]}>
            <circleGeometry args={[1.1, 24]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
        </group>

        {/* Overhead Water Tank Tower */}
        <group position={[width * 0.35, 2.5, -depth * 0.3]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[2.2, 2.2, 3.2, 16]} />
            <primitive object={concreteMaterial} attach="material" />
          </mesh>
        </group>
      </group>
    </group>
  );
};
