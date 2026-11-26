import React from 'react';
import { createRunningTrackTexture, createGrassTexture } from '../utils/proceduralTextures';
import { useCampusStore } from '../store/useCampusStore';

export const SportsFacilities: React.FC = () => {
  const trackTexture = createRunningTrackTexture();
  const grassTexture = createGrassTexture();
  const selectFacility = useCampusStore((s) => s.selectFacility);

  return (
    <group position={[-140, 0, 18]}>
      {/* 400m Athletic Running Track Oval (OSM Verified way 1297896001) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.03, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          selectFacility('fac-sports-ground');
        }}
      >
        <planeGeometry args={[110, 75]} />
        <meshStandardMaterial map={trackTexture} roughness={0.8} />
      </mesh>

      {/* Inner Cricket / Football Grass Pitch */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.04, 0]}
        receiveShadow
      >
        <planeGeometry args={[92, 58]} />
        <meshStandardMaterial map={grassTexture} roughness={0.9} />
      </mesh>

      {/* Cricket Pitch Strip (Clay / Turf) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
        <planeGeometry args={[5, 24]} />
        <meshStandardMaterial color="#d4a373" roughness={0.9} />
      </mesh>
      {/* Crease lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.055, 9.5]}>
        <planeGeometry args={[3.2, 0.15]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.055, -9.5]}>
        <planeGeometry args={[3.2, 0.15]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Basketball Court (East of track) */}
      <group
        position={[45, 0, -25]}
        onClick={(e) => {
          e.stopPropagation();
          selectFacility('fac-basketball-court');
        }}
      >
        {/* Acrylic Court Surface */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
          <planeGeometry args={[18, 30]} />
          <meshStandardMaterial color="#0284c7" roughness={0.6} />
        </mesh>
        {/* Court Boundary Lines */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 0]}>
          <planeGeometry args={[15, 28]} />
          <meshBasicMaterial color="#ea580c" />
        </mesh>
        {/* Center circle */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
          <ringGeometry args={[2.2, 2.35, 24]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Basketball Hoops */}
        {[-14, 14].map((z, idx) => (
          <group key={`hoop-${idx}`} position={[0, 0, z]}>
            {/* Pole */}
            <mesh position={[0, 2.2, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, 4.4, 8]} />
              <meshStandardMaterial color="#475569" metalness={0.7} />
            </mesh>
            {/* Backboard */}
            <mesh position={[0, 3.5, idx === 0 ? 0.6 : -0.6]} castShadow>
              <boxGeometry args={[1.8, 1.2, 0.08]} />
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </mesh>
            {/* Rim */}
            <mesh
              position={[0, 3.1, idx === 0 ? 0.9 : -0.9]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <torusGeometry args={[0.25, 0.02, 8, 16]} />
              <meshStandardMaterial color="#ea580c" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Volleyball Court with Net */}
      <group
        position={[45, 0, 25]}
        onClick={(e) => {
          e.stopPropagation();
          selectFacility('fac-volleyball-court');
        }}
      >
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
          <planeGeometry args={[14, 22]} />
          <meshStandardMaterial color="#d97706" roughness={0.95} />
        </mesh>
        {/* Volleyball Net */}
        <mesh position={[0, 1.4, 0]}>
          <boxGeometry args={[12, 1, 0.05]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.65} wireframe />
        </mesh>
        {/* Net Poles */}
        {[-6, 6].map((x, i) => (
          <mesh key={`vpole-${i}`} position={[x, 1.3, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 2.6, 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
