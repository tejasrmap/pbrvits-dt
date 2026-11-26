import React from 'react';
import { Html } from '@react-three/drei';

interface BuildingSignageProps {
  name: string;
  shortName: string;
  category: string;
  position: [number, number, number];
  rotation?: number;
}

export const BuildingSignage: React.FC<BuildingSignageProps> = ({
  name,
  shortName,
  position,
}) => {
  return (
    <group position={position}>
      {/* Backplate Board */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[Math.min(name.length * 0.45 + 3, 18), 1.4, 0.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Golden/Brass Outer Border */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[Math.min(name.length * 0.45 + 3.2, 18.2), 1.5, 0.05]} />
        <meshStandardMaterial color="#d97706" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* 3D HTML Crisp Text Label */}
      <Html
        position={[0, 0, 0.15]}
        center
        distanceFactor={45}
        transform
        occlude
      >
        <div className="flex flex-col items-center justify-center px-4 py-1 select-none pointer-events-none whitespace-nowrap">
          <div className="text-[12px] font-extrabold uppercase tracking-widest text-amber-300 drop-shadow-md">
            PBR VITS
          </div>
          <div className="text-[16px] font-bold text-white tracking-wide">
            {shortName}
          </div>
        </div>
      </Html>
    </group>
  );
};
