import React from 'react';
import { createGrassTexture, createPaverTexture } from '../utils/proceduralTextures';

export const Terrain: React.FC = () => {
  const grassTexture = createGrassTexture();
  const paverTexture = createPaverTexture();

  return (
    <group>
      {/* 1. Primary Campus Ground with Natural Indian Institutional Tone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[750, 750, 24, 24]} />
        <meshStandardMaterial
          map={grassTexture}
          color="#859e6d" // Natural architectural lawn tone
          roughness={0.92}
          metalness={0.05}
        />
      </mesh>

      {/* 2. Natural Soil / Semi-Arid Kavali Regional Apron */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow>
        <planeGeometry args={[1200, 1200]} />
        <meshStandardMaterial color="#424536" roughness={1.0} />
      </mesh>

      {/* 3. Central Academic Quadrangle Interlocking Paver Plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[110, 65]} />
        <meshStandardMaterial map={paverTexture} roughness={0.78} />
      </mesh>

      {/* 4. Library Entrance Paved Forecourt */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[53.6, 0.02, -35.5]} receiveShadow>
        <planeGeometry args={[65, 55]} />
        <meshStandardMaterial map={paverTexture} roughness={0.8} />
      </mesh>

      {/* 5. Student & Visitor Parking Apron (West, near Highway Entrance) */}
      <group position={[-55, 0.02, 75]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[45, 50]} />
          <meshStandardMaterial color="#2d3748" roughness={0.9} />
        </mesh>
        {/* Parking Bay Divider Lines */}
        {Array.from({ length: 11 }).map((_, i) => (
          <mesh
            key={`pkg-west-${i}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[-18 + i * 3.6, 0.03, 0]}
          >
            <planeGeometry args={[0.2, 44]} />
            <meshBasicMaterial color="#f8fafc" />
          </mesh>
        ))}
      </group>

      {/* 6. Faculty & Staff Parking Lot (East, near Admin Bhavan) */}
      <group position={[85, 0.02, 10]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[40, 45]} />
          <meshStandardMaterial color="#2d3748" roughness={0.9} />
        </mesh>
        {Array.from({ length: 9 }).map((_, i) => (
          <mesh
            key={`pkg-east-${i}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[-14 + i * 3.6, 0.03, 0]}
          >
            <planeGeometry args={[0.2, 38]} />
            <meshBasicMaterial color="#f8fafc" />
          </mesh>
        ))}
      </group>

      {/* 7. Real Perimeter Boundary Wall (Georeferenced to OSM Campus Limits) */}
      <group>
        {/* South Boundary Wall (along Kondapuram Road, with central gateway opening) */}
        <mesh position={[-145, 1.25, 108]} castShadow receiveShadow>
          <boxGeometry args={[250, 2.5, 0.6]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.85} />
        </mesh>
        <mesh position={[145, 1.25, 108]} castShadow receiveShadow>
          <boxGeometry args={[250, 2.5, 0.6]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.85} />
        </mesh>

        {/* North Boundary Wall */}
        <mesh position={[0, 1.25, -145]} castShadow receiveShadow>
          <boxGeometry args={[560, 2.5, 0.6]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.85} />
        </mesh>

        {/* West Boundary Wall (Behind Sports Oval) */}
        <mesh position={[-280, 1.25, -18.5]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 2.5, 253]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.85} />
        </mesh>

        {/* East Boundary Wall */}
        <mesh position={[240, 1.25, -18.5]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 2.5, 253]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.85} />
        </mesh>
      </group>
    </group>
  );
};
