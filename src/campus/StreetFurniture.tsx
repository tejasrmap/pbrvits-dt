import React from 'react';
import type { TimeOfDay } from '../types';

interface StreetFurnitureProps {
  timeOfDay: TimeOfDay;
}

export const StreetFurniture: React.FC<StreetFurnitureProps> = ({ timeOfDay }) => {
  const isNight = timeOfDay === 'night';
  const isSunset = timeOfDay === 'sunset';
  const isGoldenHour = timeOfDay === 'goldenHour';

  // Light positions along the main avenue and ring roads
  const lampPositions: [number, number, number][] = [
    [-7.5, 0, 30], [7.5, 0, 30],
    [-7.5, 0, 70], [7.5, 0, 70],
    [-7.5, 0, 110], [7.5, 0, 110],
    [-7.5, 0, 150], [7.5, 0, 150],
    [-35, 0, 80], [35, 0, 80],
    [-65, 0, 10], [65, 0, 10],
    [-25, 0, -40], [25, 0, -40],
    [-25, 0, -120], [25, 0, -120]
  ];

  // Bench positions in gardens and quad
  const benchPositions: [number, number, number, number][] = [
    [-12, 0, 20, 0], [12, 0, 20, Math.PI],
    [-12, 0, 60, 0], [12, 0, 60, Math.PI],
    [-12, 0, 100, 0], [12, 0, 100, Math.PI],
    [-18, 0, -10, Math.PI / 2], [18, 0, -10, -Math.PI / 2]
  ];

  return (
    <group>
      {/* 1. Indian National Flagpole in Central Quadrangle */}
      <group position={[0, 0, 10]}>
        {/* Tiered circular marble plinth */}
        <mesh position={[0, 0.25, 0]} receiveShadow>
          <cylinderGeometry args={[2.5, 2.8, 0.5, 24]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.65, 0]} receiveShadow>
          <cylinderGeometry args={[1.8, 2.0, 0.4, 24]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
        {/* Stainless steel flagpole */}
        <mesh position={[0, 7.5, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.12, 14, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Gold Finial Sphere */}
        <mesh position={[0, 14.6, 0]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Indian National Tricolor Flag (Saffron, White, Green) */}
        <group position={[1.4, 13.2, 0]}>
          {/* Saffron */}
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[2.8, 0.35, 0.04]} />
            <meshStandardMaterial color="#f97316" roughness={0.6} />
          </mesh>
          {/* White with Ashoka Chakra */}
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[2.8, 0.35, 0.04]} />
            <meshStandardMaterial color="#ffffff" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.1, 0.03]}>
            <circleGeometry args={[0.14, 16]} />
            <meshBasicMaterial color="#1e3a8a" />
          </mesh>
          {/* Green */}
          <mesh position={[0, -0.25, 0]}>
            <boxGeometry args={[2.8, 0.35, 0.04]} />
            <meshStandardMaterial color="#15803d" roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* 2. Streetlight Poles with LED Luminaires */}
      {lampPositions.map((pos, idx) => (
        <group key={`lamp-${idx}`} position={pos}>
          {/* Concrete Base */}
          <mesh position={[0, 0.25, 0]} castShadow>
            <cylinderGeometry args={[0.25, 0.32, 0.5, 8]} />
            <meshStandardMaterial color="#64748b" roughness={0.8} />
          </mesh>
          {/* Steel Column Pole */}
          <mesh position={[0, 3.2, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.1, 6.0, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Curved Arm */}
          <mesh position={[pos[0] > 0 ? -0.5 : 0.5, 6.2, 0]}>
            <boxGeometry args={[1.0, 0.08, 0.08]} />
            <meshStandardMaterial color="#334155" metalness={0.7} />
          </mesh>
          {/* LED Lantern Head */}
          <mesh position={[pos[0] > 0 ? -1.0 : 1.0, 6.1, 0]}>
            <boxGeometry args={[0.5, 0.15, 0.3]} />
            <meshStandardMaterial
              color={isNight || isSunset || isGoldenHour ? '#fef08a' : '#94a3b8'}
              emissive={isNight || isSunset || isGoldenHour ? '#fef08a' : '#000000'}
              emissiveIntensity={isNight ? 2.5 : isSunset ? 1.0 : isGoldenHour ? 0.6 : 0}
            />
          </mesh>

          {/* Night Illumination Light Source */}
          {isNight && (
            <pointLight
              position={[pos[0] > 0 ? -1.0 : 1.0, 5.8, 0]}
              color="#fef08a"
              intensity={18}
              distance={25}
              decay={2}
            />
          )}
        </group>
      ))}

      {/* 3. Park Benches */}
      {benchPositions.map(([x, y, z, rot], idx) => (
        <group key={`bench-${idx}`} position={[x, y, z]} rotation={[0, rot, 0]}>
          {/* Metal legs */}
          {[-0.9, 0.9].map((lx, li) => (
            <mesh key={`bleg-${li}`} position={[lx, 0.3, 0]} castShadow>
              <boxGeometry args={[0.08, 0.6, 0.5]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} />
            </mesh>
          ))}
          {/* Wooden Seat Slats */}
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[2.0, 0.06, 0.55]} />
            <meshStandardMaterial color="#854d0e" roughness={0.6} />
          </mesh>
          {/* Backrest */}
          <mesh position={[0, 0.8, -0.22]} rotation={[-0.15, 0, 0]} castShadow>
            <boxGeometry args={[2.0, 0.4, 0.06]} />
            <meshStandardMaterial color="#854d0e" roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
