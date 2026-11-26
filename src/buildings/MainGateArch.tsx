import React from 'react';
import { Html } from '@react-three/drei';
import { useCampusStore } from '../store/useCampusStore';

export const MainGateArch: React.FC = () => {
  const selectBuilding = useCampusStore((s) => s.selectBuilding);
  const selectedBuilding = useCampusStore((s) => s.selectedBuilding);
  const isSelected = selectedBuilding?.id === 'main-gate';

  return (
    <group
      position={[0, 0, 102.5]}
      onClick={(e) => {
        e.stopPropagation();
        selectBuilding('main-gate');
      }}
    >
      {/* 1. Heavy Pylon Columns (Clad in Red Sandstone & Granite Base) */}
      {[-8.5, 8.5].map((xCol, idx) => (
        <group key={`pylon-${idx}`} position={[xCol, 4.5, 0]}>
          {/* Granite Base */}
          <mesh position={[0, -3.8, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.8, 1.4, 2.8]} />
            <meshStandardMaterial color="#334155" roughness={0.7} />
          </mesh>
          {/* Main Pylon Column */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2.2, 7.6, 2.2]} />
            <meshStandardMaterial
              color={isSelected ? '#38bdf8' : '#9e3a24'} // Terracotta stone
              roughness={0.75}
              metalness={0.1}
            />
          </mesh>
          {/* Column Capital */}
          <mesh position={[0, 3.9, 0]} castShadow>
            <boxGeometry args={[2.6, 0.4, 2.6]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* 2. Sweeping Overhead Institutional Arch Beam Spanning Across Entrance */}
      <group position={[0, 8.6, 0]}>
        {/* Main Arch Beam */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[20.5, 1.8, 2.0]} />
          <meshStandardMaterial
            color={isSelected ? '#0284c7' : '#1e3a8a'} // Institutional Royal Blue
            roughness={0.4}
            metalness={0.4}
          />
        </mesh>
        {/* Top Trim with Gold Accents */}
        <mesh position={[0, 1.05, 0]}>
          <boxGeometry args={[21, 0.3, 2.2]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* 3D Institutional Signage (Visible from both Highway and Campus) */}
        <Html position={[0, 0, 1.05]} center distanceFactor={45} transform occlude>
          <div className="flex flex-col items-center justify-center bg-slate-950/95 border border-amber-400/60 px-5 py-2 rounded-lg shadow-2xl select-none pointer-events-none">
            <span className="text-[12px] font-black text-amber-300 tracking-wider uppercase">
              Visvodaya Educational Society
            </span>
            <span className="text-[10px] font-bold text-white tracking-widest whitespace-nowrap">
              PBR VISVODAYA INSTITUTE OF TECHNOLOGY & SCIENCE
            </span>
          </div>
        </Html>
      </group>

      {/* 3. Security Guard Command Cabins (East & West) */}
      {[-13.5, 13.5].map((xCabin, idx) => (
        <group key={`cabin-${idx}`} position={[xCabin, 1.8, 0]}>
          {/* Cabin Walls */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[3.8, 3.6, 3.8]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.8} />
          </mesh>
          {/* Cabin Overhanging Roof */}
          <mesh position={[0, 1.95, 0]} castShadow>
            <boxGeometry args={[4.4, 0.3, 4.4]} />
            <meshStandardMaterial color="#1e3a8a" roughness={0.5} />
          </mesh>
          {/* Observation Windows */}
          <mesh position={[0, 0.2, 1.92]}>
            <boxGeometry args={[2.6, 1.4, 0.1]} />
            <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.8} transparent opacity={0.8} />
          </mesh>
        </group>
      ))}

      {/* 4. Automated Boom Barrier Arms (Entry & Exit Lanes) */}
      {[-4.2, 4.2].map((xBarrier, idx) => (
        <group key={`barrier-${idx}`} position={[xBarrier, 0.9, 0.8]}>
          <mesh position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 1.8, 16]} />
            <meshStandardMaterial color="#ef4444" roughness={0.3} />
          </mesh>
          {/* Barrier Arm */}
          <mesh
            position={[idx === 0 ? 2.2 : -2.2, 0.6, 0]}
            castShadow
          >
            <boxGeometry args={[4.4, 0.12, 0.08]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
