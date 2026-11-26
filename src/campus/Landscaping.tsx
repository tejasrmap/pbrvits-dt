import React from 'react';
import { useCampusStore } from '../store/useCampusStore';

export const Landscaping: React.FC = () => {
  const selectFacility = useCampusStore((s) => s.selectFacility);

  return (
    <group>
      {/* 1. Central Fountain in front of Visvodaya Auditorium */}
      <group
        position={[0, 0, -20]}
        onClick={(e) => {
          e.stopPropagation();
          selectFacility('fac-auditorium-hall');
        }}
      >
        {/* Outer Circular Granite Basin Ring */}
        <mesh position={[0, 0.45, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[7, 7.5, 0.9, 32]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
        </mesh>

        {/* Water Surface inside fountain */}
        <mesh position={[0, 0.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[6.6, 32]} />
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
          <cylinderGeometry args={[1.5, 1.8, 1.2, 16]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.9, 0]} castShadow>
          <cylinderGeometry args={[2.5, 2.5, 0.3, 24]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
        </mesh>
        <mesh position={[0, 2.4, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.8, 1.0, 16]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        {/* Top Spout Water Spray Jet */}
        <mesh position={[0, 3.1, 0]}>
          <coneGeometry args={[0.5, 1.2, 16]} />
          <meshStandardMaterial color="#bae6fd" transparent opacity={0.65} roughness={0.1} />
        </mesh>
      </group>

      {/* 2. Manicured Formal Flowerbeds & Hedges along Entrance Avenue */}
      {Array.from({ length: 6 }).map((_, i) => (
        <group key={`flowerbed-${i}`}>
          {/* West Hedge */}
          <mesh position={[-12.5, 0.35, 30 + i * 24]} castShadow receiveShadow>
            <boxGeometry args={[2.2, 0.7, 14]} />
            <meshStandardMaterial color="#166534" roughness={0.9} />
          </mesh>
          {/* East Hedge */}
          <mesh position={[12.5, 0.35, 30 + i * 24]} castShadow receiveShadow>
            <boxGeometry args={[2.2, 0.7, 14]} />
            <meshStandardMaterial color="#166534" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* 3. Temple / Meditation Garden Pavilion (West Campus) */}
      <group position={[-120, 0, 0]}>
        {/* Garden Mound */}
        <mesh position={[0, 0.25, 0]} receiveShadow>
          <cylinderGeometry args={[12, 14, 0.5, 24]} />
          <meshStandardMaterial color="#15803d" roughness={0.9} />
        </mesh>
        {/* Meditation Mandapam Pillars */}
        {[
          [-3, -3], [3, -3], [-3, 3], [3, 3]
        ].map(([px, pz], pidx) => (
          <mesh key={`mand-p-${pidx}`} position={[px, 2, pz]} castShadow>
            <cylinderGeometry args={[0.25, 0.3, 4, 16]} />
            <meshStandardMaterial color="#fef08a" roughness={0.6} />
          </mesh>
        ))}
        {/* Sloped Pagoda/Temple Roof */}
        <mesh position={[0, 4.8, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[5.5, 2.2, 4]} />
          <meshStandardMaterial color="#dc2626" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
};
