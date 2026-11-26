import React from 'react';
import { useCampusStore } from '../store/useCampusStore';

export const Landscaping: React.FC = () => {
  const selectFacility = useCampusStore((s) => s.selectFacility);

  return (
    <group>
      {/* 1. Central Fountain in front of Visvodaya Auditorium & Quad */}
      <group
        position={[0, 0, -20]}
        onClick={(e) => {
          e.stopPropagation();
          selectFacility('fac-auditorium-hall');
        }}
      >
        {/* Outer Circular Granite Basin Ring */}
        <mesh position={[0, 0.45, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[6.5, 7.0, 0.9, 32]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
        </mesh>

        {/* Water Surface inside fountain */}
        <mesh position={[0, 0.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[6.2, 32]} />
          <meshStandardMaterial
            color="#38bdf8"
            roughness={0.1}
            metalness={0.9}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Tiered Center Fountain Pedestal */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <cylinderGeometry args={[1.4, 1.6, 1.2, 16]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.85, 0]} castShadow>
          <cylinderGeometry args={[2.2, 2.2, 0.25, 24]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
        </mesh>
        <mesh position={[0, 2.3, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.7, 0.8, 16]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        {/* Top Water Spray Jet */}
        <mesh position={[0, 2.9, 0]}>
          <coneGeometry args={[0.4, 1.0, 16]} />
          <meshStandardMaterial color="#bae6fd" transparent opacity={0.65} roughness={0.1} />
        </mesh>
      </group>

      {/* 2. Manicured Formal Flowerbeds & Hedges along Entrance Avenue (Z = 20 to 90) */}
      {Array.from({ length: 4 }).map((_, i) => (
        <group key={`flowerbed-${i}`}>
          {/* West Hedge */}
          <mesh position={[-11.5, 0.35, 24 + i * 18]} castShadow receiveShadow>
            <boxGeometry args={[1.8, 0.7, 12]} />
            <meshStandardMaterial color="#2d5a27" roughness={0.8} />
          </mesh>
          {/* East Hedge */}
          <mesh position={[11.5, 0.35, 24 + i * 18]} castShadow receiveShadow>
            <boxGeometry args={[1.8, 0.7, 12]} />
            <meshStandardMaterial color="#2d5a27" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* 3. Central Academic Quad Garden Beds */}
      {[-1, 1].map((dir, i) => (
        <group key={`quad-garden-${i}`} position={[dir * 25, 0.2, 0]}>
          <mesh receiveShadow castShadow>
            <cylinderGeometry args={[4.5, 4.8, 0.4, 24]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[4.2, 4.2, 0.15, 24]} />
            <meshStandardMaterial color="#2d5a27" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
