import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import type { BuildingData, TimeOfDay } from '../types';
import { Window } from './Window';
import { Roof } from './Roof';
import { Entrance } from './Entrance';
import { BuildingBase } from './BuildingBase';
import { BuildingSignage } from './BuildingSignage';
import { createConcretePlasterTexture } from '../utils/proceduralTextures';
import { useCampusStore } from '../store/useCampusStore';

interface BuildingProps {
  data: BuildingData;
  timeOfDay: TimeOfDay;
}

export const Building: React.FC<BuildingProps> = ({ data, timeOfDay }) => {
  const selectedBuilding = useCampusStore((s) => s.selectedBuilding);
  const hoveredBuilding = useCampusStore((s) => s.hoveredBuilding);
  const selectBuilding = useCampusStore((s) => s.selectBuilding);
  const hoverBuilding = useCampusStore((s) => s.hoverBuilding);

  const isSelected = selectedBuilding?.id === data.id;
  const isHovered = hoveredBuilding?.id === data.id;

  const { width, depth, height } = data.dimensions;
  const floorCount = data.floors;
  const floorHeight = data.floorHeight || height / floorCount;

  // Window grid layout
  const windowSpacingX = 4.6;
  const windowCountX = Math.max(2, Math.floor((width - 6) / windowSpacingX));
  const windowSpacingZ = 4.6;
  const windowCountZ = Math.max(2, Math.floor((depth - 6) / windowSpacingZ));

  const plasterTexture = useMemo(() => createConcretePlasterTexture(), []);

  // Materials
  const wallMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: plasterTexture,
      color: isSelected ? '#38bdf8' : data.color,
      roughness: 0.76,
      metalness: 0.12,
      emissive: isSelected ? '#0284c7' : '#000000',
      emissiveIntensity: isSelected ? 0.35 : 0
    });
  }, [data.color, isSelected, plasterTexture]);

  const accentMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: data.secondaryColor || '#475569',
      roughness: 0.6,
      metalness: 0.25
    });
  }, [data.secondaryColor]);

  const wingType = data.wingType || 'standard';

  return (
    <group
      position={data.position}
      rotation={[0, data.rotation, 0]}
      onClick={(e) => {
        e.stopPropagation();
        selectBuilding(data.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        hoverBuilding(data.id);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        hoverBuilding(null);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* 3D Floating Pill on hover or selection */}
      {(isHovered || isSelected) && (
        <Html position={[0, height + 6.0, 0]} center distanceFactor={70}>
          <div className="pointer-events-none transform -translate-y-2 transition-all duration-200">
            <div
              className={`px-3 py-1.5 rounded-lg shadow-2xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap border ${
                isSelected
                  ? 'bg-sky-500 text-white border-sky-300 ring-4 ring-sky-500/30'
                  : 'bg-slate-900/95 text-slate-100 border-sky-400/40 backdrop-blur-md'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{data.name}</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-black/40 text-sky-300">
                {data.category}
              </span>
            </div>
          </div>
        </Html>
      )}

      {/* Building Base Plinth */}
      <BuildingBase width={width} depth={depth} height={0.7} />

      {/* Main Structural Core Mass */}
      <mesh
        position={[0, height / 2 + 0.35, 0]}
        castShadow
        receiveShadow
        material={wallMaterial}
      >
        <boxGeometry args={[width, height, depth]} />
      </mesh>

      {/* Stepped Architectural Wings for Academic Blocks (CSE, ECE, Admin) */}
      {wingType === 'stepped' && (
        <group>
          {/* Left Wing */}
          <mesh
            position={[-width * 0.38, (height * 0.9) / 2 + 0.35, depth * 0.12]}
            castShadow
            receiveShadow
            material={wallMaterial}
          >
            <boxGeometry args={[width * 0.28, height * 0.9, depth * 1.15]} />
          </mesh>
          {/* Right Wing */}
          <mesh
            position={[width * 0.38, (height * 0.9) / 2 + 0.35, depth * 0.12]}
            castShadow
            receiveShadow
            material={wallMaterial}
          >
            <boxGeometry args={[width * 0.28, height * 0.9, depth * 1.15]} />
          </mesh>
          {/* Wing Accent Trim Band */}
          <mesh
            position={[0, height * 0.9 + 0.4, depth * 0.12]}
            material={accentMaterial}
          >
            <boxGeometry args={[width * 1.05, 0.35, depth * 1.18]} />
          </mesh>
        </group>
      )}

      {/* Atrium Glass Foyer for Central Library */}
      {wingType === 'atrium' && (
        <group position={[0, height * 0.45 + 0.35, depth / 2 + 1.2]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[width * 0.65, height * 0.85, 2.4]} />
            <meshStandardMaterial
              color="#38bdf8"
              roughness={0.1}
              metalness={0.85}
              transparent
              opacity={0.75}
            />
          </mesh>
          {/* Vertical Blue Architectural Sun Fins */}
          {[-width * 0.26, -width * 0.13, 0, width * 0.13, width * 0.26].map((fx, fi) => (
            <mesh key={`fin-${fi}`} position={[fx, 0, 1.3]} castShadow>
              <boxGeometry args={[0.3, height * 0.88, 0.5]} />
              <meshStandardMaterial color={data.secondaryColor || '#1e3a8a'} roughness={0.4} />
            </mesh>
          ))}
        </group>
      )}

      {/* Industrial High-Bay Details for Workshops */}
      {wingType === 'industrial' && (
        <group position={[0, 0, depth / 2 + 0.1]}>
          {/* Heavy Equipment Roller Shutters */}
          {[-12, 0, 12].map((rx, ri) => (
            <group key={`shutter-${ri}`} position={[rx, 2.2, 0]}>
              <mesh>
                <boxGeometry args={[5.2, 4.2, 0.2]} />
                <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
              </mesh>
              {/* Shutter Horizontal Slats */}
              {Array.from({ length: 7 }).map((_, si) => (
                <mesh key={`slat-${si}`} position={[0, -1.8 + si * 0.6, 0.12]}>
                  <boxGeometry args={[5.0, 0.08, 0.05]} />
                  <meshBasicMaterial color="#1e293b" />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      )}

      {/* Floor Divider Accent Bands */}
      {Array.from({ length: floorCount + 1 }).map((_, fIdx) => (
        <mesh
          key={`floor-band-${fIdx}`}
          position={[0, fIdx * floorHeight + 0.35, 0]}
          receiveShadow
          material={accentMaterial}
        >
          <boxGeometry args={[width + 0.4, 0.3, depth + 0.4]} />
        </mesh>
      ))}

      {/* Front Entrance & Portico */}
      <Entrance
        width={width}
        depth={depth}
        height={floorHeight}
        color={data.secondaryColor || data.color}
        hasPillars={data.hasPillars ?? true}
        hasCanopy={data.hasCanopy ?? true}
      />

      {/* Building Facade Signage Plate */}
      <BuildingSignage
        name={data.name}
        shortName={data.shortName}
        category={data.category}
        position={[0, Math.min(height * 0.82, floorHeight * 2.2), depth / 2 + 0.3]}
      />

      {/* Front Facade Windows (Z = +depth/2) */}
      {Array.from({ length: floorCount }).map((_, fIdx) => {
        const floorY = fIdx * floorHeight + floorHeight * 0.55 + 0.35;
        return Array.from({ length: windowCountX }).map((__, wIdx) => {
          const posX = (wIdx - (windowCountX - 1) / 2) * windowSpacingX;
          if (fIdx === 0 && Math.abs(posX) < 5) return null; // entrance cutout

          return (
            <Window
              key={`front-win-${fIdx}-${wIdx}`}
              position={[posX, floorY, depth / 2 + 0.05]}
              width={2.2}
              height={1.7}
              style={data.windowStyle}
              timeOfDay={timeOfDay}
            />
          );
        });
      })}

      {/* Back Facade Windows (Z = -depth/2) */}
      {Array.from({ length: floorCount }).map((_, fIdx) => {
        const floorY = fIdx * floorHeight + floorHeight * 0.55 + 0.35;
        return Array.from({ length: windowCountX }).map((__, wIdx) => {
          const posX = (wIdx - (windowCountX - 1) / 2) * windowSpacingX;
          return (
            <group key={`back-win-${fIdx}-${wIdx}`} rotation={[0, Math.PI, 0]}>
              <Window
                position={[-posX, floorY, depth / 2 + 0.05]}
                width={2.2}
                height={1.7}
                style={data.windowStyle}
                timeOfDay={timeOfDay}
              />
            </group>
          );
        });
      })}

      {/* Left Facade Windows (X = -width/2) */}
      {Array.from({ length: floorCount }).map((_, fIdx) => {
        const floorY = fIdx * floorHeight + floorHeight * 0.55 + 0.35;
        return Array.from({ length: windowCountZ }).map((__, wIdx) => {
          const posZ = (wIdx - (windowCountZ - 1) / 2) * windowSpacingZ;
          return (
            <group key={`left-win-${fIdx}-${wIdx}`} rotation={[0, -Math.PI / 2, 0]}>
              <Window
                position={[posZ, floorY, width / 2 + 0.05]}
                width={2.2}
                height={1.7}
                style={data.windowStyle}
                timeOfDay={timeOfDay}
              />
            </group>
          );
        });
      })}

      {/* Right Facade Windows (X = +width/2) */}
      {Array.from({ length: floorCount }).map((_, fIdx) => {
        const floorY = fIdx * floorHeight + floorHeight * 0.55 + 0.35;
        return Array.from({ length: windowCountZ }).map((__, wIdx) => {
          const posZ = (wIdx - (windowCountZ - 1) / 2) * windowSpacingZ;
          return (
            <group key={`right-win-${fIdx}-${wIdx}`} rotation={[0, Math.PI / 2, 0]}>
              <Window
                position={[-posZ, floorY, width / 2 + 0.05]}
                width={2.2}
                height={1.7}
                style={data.windowStyle}
                timeOfDay={timeOfDay}
              />
            </group>
          );
        });
      })}

      {/* Exterior Balconies for Academic / Hostel blocks */}
      {data.hasBalconies && (
        <group>
          {Array.from({ length: floorCount - 1 }).map((_, fIdx) => {
            const bY = (fIdx + 1) * floorHeight + 0.35;
            return (
              <group key={`balcony-${fIdx}`} position={[0, bY, depth / 2 + 0.9]}>
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[width * 0.8, 0.25, 1.8]} />
                  <meshStandardMaterial color={data.secondaryColor || '#64748b'} />
                </mesh>
                <mesh position={[0, 0.55, 0.85]}>
                  <boxGeometry args={[width * 0.8, 0.9, 0.1]} />
                  <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
                </mesh>
              </group>
            );
          })}
        </group>
      )}

      {/* Rooftop Architecture */}
      <Roof
        width={width}
        depth={depth}
        height={height + 0.35}
        roofType={data.roofType}
        hasSolarPanels={data.hasSolarPanels}
        hvacUnits={data.hvacUnits}
        waterTanks={data.waterTanks}
        buildingColor={data.color}
      />

      {/* Selection Glow Indicator Ring on the ground */}
      {isSelected && (
        <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[Math.max(width, depth) * 0.55, Math.max(width, depth) * 0.55 + 1.2, 32]} />
          <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
};
