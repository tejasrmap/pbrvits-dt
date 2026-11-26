import React from 'react';
import { createPaverTexture } from '../utils/proceduralTextures';

interface BuildingBaseProps {
  width: number;
  depth: number;
  height?: number;
}

export const BuildingBase: React.FC<BuildingBaseProps> = ({
  width,
  depth,
  height = 0.6
}) => {
  const paverTexture = createPaverTexture();

  return (
    <group position={[0, height / 2, 0]}>
      {/* Foundation plinth */}
      <mesh receiveShadow castShadow>
        <boxGeometry args={[width + 1.6, height, depth + 1.6]} />
        <meshStandardMaterial
          map={paverTexture}
          color="#94a3b8"
          roughness={0.85}
        />
      </mesh>

      {/* Surrounding paved pedestrian walkway apron */}
      <mesh position={[0, -height / 2 + 0.05, 0]} receiveShadow>
        <boxGeometry args={[width + 5, 0.1, depth + 5]} />
        <meshStandardMaterial
          map={paverTexture}
          color="#cbd5e1"
          roughness={0.9}
        />
      </mesh>
    </group>
  );
};
