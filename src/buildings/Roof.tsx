import React from 'react';
import type { RoofType } from '../types';
import { createSolarTexture } from '../utils/proceduralTextures';

interface RoofProps {
  width: number;
  depth: number;
  height: number; // building height
  roofType: RoofType;
  hasSolarPanels?: boolean;
  hvacUnits?: number;
  waterTanks?: number;
  buildingColor: string;
}

export const Roof: React.FC<RoofProps> = ({
  width,
  depth,
  height,
  roofType,
  hasSolarPanels = false,
  hvacUnits = 2,
  waterTanks = 2,
  buildingColor
}) => {
  const solarTexture = createSolarTexture();
  const parapetHeight = 1.1;
  const parapetThick = 0.3;

  return (
    <group position={[0, height, 0]}>
      {/* Flat roof slab */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[width, 0.25, depth]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.9} />
      </mesh>

      {/* Parapet walls around roof perimeter */}
      {roofType !== 'sloped' && (
        <group>
          {/* North wall */}
          <mesh position={[0, parapetHeight / 2, -depth / 2 + parapetThick / 2]} castShadow receiveShadow>
            <boxGeometry args={[width, parapetHeight, parapetThick]} />
            <meshStandardMaterial color={buildingColor} roughness={0.8} />
          </mesh>
          {/* South wall */}
          <mesh position={[0, parapetHeight / 2, depth / 2 - parapetThick / 2]} castShadow receiveShadow>
            <boxGeometry args={[width, parapetHeight, parapetThick]} />
            <meshStandardMaterial color={buildingColor} roughness={0.8} />
          </mesh>
          {/* West wall */}
          <mesh position={[-width / 2 + parapetThick / 2, parapetHeight / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[parapetThick, parapetHeight, depth - parapetThick * 2]} />
            <meshStandardMaterial color={buildingColor} roughness={0.8} />
          </mesh>
          {/* East wall */}
          <mesh position={[width / 2 - parapetThick / 2, parapetHeight / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[parapetThick, parapetHeight, depth - parapetThick * 2]} />
            <meshStandardMaterial color={buildingColor} roughness={0.8} />
          </mesh>
        </group>
      )}

      {/* Sloped Roof for Industrial Workshops */}
      {roofType === 'sloped' && (
        <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
          <coneGeometry args={[Math.max(width, depth) * 0.6, 3.5, 4]} />
          <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.4} />
        </mesh>
      )}

      {/* Staircase Access Room / Headroom */}
      <group position={[-width / 4, 1.4, depth / 4]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[5, 2.8, 5]} />
          <meshStandardMaterial color={buildingColor} roughness={0.8} />
        </mesh>
        {/* Staircase Door */}
        <mesh position={[0, -0.2, 2.51]}>
          <planeGeometry args={[1.2, 2.1]} />
          <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.5} />
        </mesh>
      </group>

      {/* Overhead Water Tanks (Cylindrical Black/Blue Sintex tanks) */}
      {Array.from({ length: waterTanks }).map((_, i) => (
        <group key={`tank-${i}`} position={[width / 3.5 - i * 3.5, 1.8, -depth / 3]}>
          {/* Concrete platform */}
          <mesh position={[0, -0.6, 0]}>
            <boxGeometry args={[2.8, 0.4, 2.8]} />
            <meshStandardMaterial color="#64748b" roughness={0.9} />
          </mesh>
          {/* Water Tank */}
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[1.1, 1.1, 1.8, 16]} />
            <meshStandardMaterial color="#0284c7" roughness={0.4} metalness={0.2} />
          </mesh>
        </group>
      ))}

      {/* HVAC Chiller & Exhaust Fans */}
      {Array.from({ length: hvacUnits }).map((_, i) => (
        <group key={`hvac-${i}`} position={[-width / 4 + (i % 3) * 4.5, 0.9, -depth / 4 + Math.floor(i / 3) * 4]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2.4, 1.6, 2.0]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Top Fan Grille */}
          <mesh position={[0, 0.81, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.7, 16]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Solar Panel Arrays */}
      {hasSolarPanels && (
        <group position={[width * 0.12, 0.8, depth * 0.05]} rotation={[-0.3, 0, 0]}>
          {Array.from({ length: 6 }).map((_, r) =>
            Array.from({ length: 3 }).map((__, c) => (
              <mesh
                key={`solar-${r}-${c}`}
                position={[(c - 1) * 3.4, 0, (r - 2.5) * 2.2]}
                castShadow
              >
                <boxGeometry args={[3.2, 0.1, 2.0]} />
                <meshStandardMaterial
                  map={solarTexture}
                  color="#1e3a8a"
                  metalness={0.8}
                  roughness={0.2}
                />
              </mesh>
            ))
          )}
        </group>
      )}

      {/* Communications / Lightning Protection Mast */}
      <group position={[width / 3, 3, depth / 3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.06, 0.12, 6, 8]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 3, 0]}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} />
        </mesh>
      </group>
    </group>
  );
};
