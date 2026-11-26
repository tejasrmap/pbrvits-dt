import React from 'react';

interface EntranceProps {
  width: number;
  height: number;
  depth: number;
  color: string;
  hasPillars?: boolean;
  hasCanopy?: boolean;
}

export const Entrance: React.FC<EntranceProps> = ({
  width,
  height,
  depth,
  color,
  hasPillars = true,
  hasCanopy = true
}) => {
  const canopyWidth = Math.min(width * 0.45, 14);
  const canopyDepth = 5.5;
  const canopyHeight = height * 0.85;

  return (
    <group position={[0, 0, depth / 2]}>
      {/* Entrance Plinth Steps */}
      <mesh position={[0, 0.25, canopyDepth / 2]} receiveShadow>
        <boxGeometry args={[canopyWidth + 2, 0.5, canopyDepth]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.7} />
      </mesh>

      {/* Glass Double Entrance Doors */}
      <mesh position={[0, 1.8, 0.1]}>
        <planeGeometry args={[canopyWidth * 0.55, 3.2]} />
        <meshStandardMaterial
          color="#38bdf8"
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.75}
        />
      </mesh>

      {/* Door Frame */}
      <mesh position={[0, 1.8, 0.05]}>
        <boxGeometry args={[canopyWidth * 0.58, 3.3, 0.15]} />
        <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Entrance Canopy */}
      {hasCanopy && (
        <group position={[0, canopyHeight, canopyDepth / 2]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[canopyWidth + 1.2, 0.4, canopyDepth + 1]} />
            <meshStandardMaterial color={color} roughness={0.6} />
          </mesh>

          {/* Canopy Fascia trim */}
          <mesh position={[0, -0.05, canopyDepth / 2 + 0.5]}>
            <boxGeometry args={[canopyWidth + 1.2, 0.35, 0.1]} />
            <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.6} />
          </mesh>
        </group>
      )}

      {/* Classical Portico Pillars */}
      {hasPillars && (
        <group>
          {[-canopyWidth * 0.42, canopyWidth * 0.42].map((x, idx) => (
            <group key={`pillar-${idx}`} position={[x, 0, canopyDepth - 0.6]}>
              {/* Pillar Base */}
              <mesh position={[0, 0.35, 0]}>
                <boxGeometry args={[0.9, 0.7, 0.9]} />
                <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
              </mesh>
              {/* Column Shaft */}
              <mesh position={[0, canopyHeight / 2, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.32, 0.36, canopyHeight, 16]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.6} />
              </mesh>
              {/* Capital Header */}
              <mesh position={[0, canopyHeight - 0.25, 0]}>
                <boxGeometry args={[0.9, 0.5, 0.9]} />
                <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
              </mesh>
            </group>
          ))}
        </group>
      )}
    </group>
  );
};
