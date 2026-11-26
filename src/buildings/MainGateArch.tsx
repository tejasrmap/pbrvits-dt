import React from 'react';
import { Html } from '@react-three/drei';
import { useCampusStore } from '../store/useCampusStore';

export const MainGateArch: React.FC = () => {
  const selectBuilding = useCampusStore((s) => s.selectBuilding);
  const timeOfDay = useCampusStore((s) => s.timeOfDay);
  const isNight = timeOfDay === 'night';

  return (
    <group
      position={[0, 0, 185]}
      onClick={(e) => {
        e.stopPropagation();
        selectBuilding('main-gate');
      }}
    >
      {/* Central Grand Archway Beam */}
      <mesh position={[0, 8.5, 0]} castShadow>
        <boxGeometry args={[26, 2.2, 2.5]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Decorative Gold Header Trim */}
      <mesh position={[0, 9.8, 0]}>
        <boxGeometry args={[26.4, 0.4, 2.6]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Visvodaya Emblem Crest on Archway */}
      <mesh position={[0, 10.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.3, 32]} />
        <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Main Arch Text Banner */}
      <Html position={[0, 8.5, 1.35]} center distanceFactor={40} transform occlude>
        <div className="flex flex-col items-center justify-center bg-slate-900/90 border border-amber-400/50 px-6 py-1.5 rounded shadow-2xl select-none pointer-events-none">
          <span className="text-[14px] font-extrabold text-amber-300 tracking-wider">
            VISVODAYA EDUCATIONAL SOCIETY
          </span>
          <span className="text-[11px] font-bold text-white tracking-widest">
            PBR VISVODAYA INSTITUTE OF TECHNOLOGY & SCIENCE
          </span>
        </div>
      </Html>

      {/* Left Main Pillar Column */}
      <mesh position={[-11, 4.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 8.5, 3.2]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.7} />
      </mesh>
      {/* Right Main Pillar Column */}
      <mesh position={[11, 4.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 8.5, 3.2]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.7} />
      </mesh>

      {/* Security Guard Cabins (East & West) */}
      {[-16, 16].map((x, i) => (
        <group key={`cabin-${i}`} position={[x, 0, 0]}>
          {/* Cabin body */}
          <mesh position={[0, 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[4.5, 4, 4.5]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.6} />
          </mesh>
          {/* Cabin roof */}
          <mesh position={[0, 4.2, 0]}>
            <boxGeometry args={[5.2, 0.4, 5.2]} />
            <meshStandardMaterial color="#1e3a8a" roughness={0.5} />
          </mesh>
          {/* Cabin observation windows */}
          <mesh position={[0, 2.2, 2.26]}>
            <planeGeometry args={[3.2, 1.6]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.8} transparent opacity={0.7} />
          </mesh>
        </group>
      ))}

      {/* Boom Barrier Gates */}
      <group position={[-5, 0.9, 1]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 1.8, 16]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        {/* Arm */}
        <mesh position={[2.5, 0.7, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[5, 0.12, 0.12]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>
      <group position={[5, 0.9, 1]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 1.8, 16]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        {/* Arm */}
        <mesh position={[-2.5, 0.7, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[5, 0.12, 0.12]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Night Gate Spotlight Illumination */}
      {isNight && (
        <group position={[0, 10, 2]}>
          <pointLight color="#fef08a" intensity={30} distance={35} decay={2} />
        </group>
      )}
    </group>
  );
};
