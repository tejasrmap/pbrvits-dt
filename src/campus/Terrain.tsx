import React from 'react';
import { createGrassTexture, createPaverTexture } from '../utils/proceduralTextures';

export const Terrain: React.FC = () => {
  const grassTexture = createGrassTexture();
  const paverTexture = createPaverTexture();

  return (
    <group>
      {/* Primary Campus Ground (600m x 600m) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[600, 600, 16, 16]} />
        <meshStandardMaterial
          map={grassTexture}
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      {/* Subtle elevation soil apron around campus perimeter */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow>
        <planeGeometry args={[900, 900]} />
        <meshStandardMaterial color="#2d3725" roughness={1.0} />
      </mesh>

      {/* Central Quadrangle Paved Plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 10]} receiveShadow>
        <planeGeometry args={[60, 50]} />
        <meshStandardMaterial map={paverTexture} roughness={0.8} />
      </mesh>

      {/* Two-Wheeler / Four-Wheeler Parking Lot (West) */}
      <group position={[-40, 0.02, 125]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[35, 45]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>
        {/* Parking Bay Lines */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh
            key={`pkg-line-${i}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[-12 + i * 3.4, 0.03, 0]}
          >
            <planeGeometry args={[0.2, 38]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>

      {/* East Faculty Parking Lot */}
      <group position={[85, 0.02, -40]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 40]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>
        {Array.from({ length: 7 }).map((_, i) => (
          <mesh
            key={`pkg-line-east-${i}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[-10 + i * 3.4, 0.03, 0]}
          >
            <planeGeometry args={[0.2, 32]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>

      {/* Campus Boundary Wall & Pillars (240m x 240m perimeter) */}
      <group>
        {/* South Wall with Entrance Gap */}
        <mesh position={[-130, 1.25, 220]} castShadow receiveShadow>
          <boxGeometry args={[220, 2.5, 0.6]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
        </mesh>
        <mesh position={[130, 1.25, 220]} castShadow receiveShadow>
          <boxGeometry args={[220, 2.5, 0.6]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
        </mesh>
        {/* North Wall */}
        <mesh position={[0, 1.25, -220]} castShadow receiveShadow>
          <boxGeometry args={[480, 2.5, 0.6]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
        </mesh>
        {/* West Wall */}
        <mesh position={[-240, 1.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 2.5, 440]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
        </mesh>
        {/* East Wall */}
        <mesh position={[240, 1.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 2.5, 440]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
};
