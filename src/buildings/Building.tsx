import React from 'react';
import { Html } from '@react-three/drei';
import type { BuildingData, TimeOfDay } from '../types';
import { useCampusStore } from '../store/useCampusStore';
import { AdminBuilding } from './AdminBuilding';
import { AcademicBlock } from './AcademicBlock';
import { LibraryBuilding } from './LibraryBuilding';
import { WorkshopBuilding } from './WorkshopBuilding';
import { AuditoriumBuilding } from './AuditoriumBuilding';
import { HostelBuilding } from './HostelBuilding';

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

  // If this is the main gate, it's rendered distinctly by MainGateArch
  if (data.id === 'main-gate') {
    return null;
  }

  const { height } = data.dimensions;

  // Dispatch to authentic architectural archetype
  const renderArchitecturalModel = () => {
    switch (data.id) {
      case 'admin-block':
        return <AdminBuilding data={data} timeOfDay={timeOfDay} isSelected={isSelected} />;
      case 'central-library':
        return <LibraryBuilding data={data} timeOfDay={timeOfDay} isSelected={isSelected} />;
      case 'central-workshops':
        return <WorkshopBuilding data={data} timeOfDay={timeOfDay} isSelected={isSelected} />;
      case 'auditorium':
        return <AuditoriumBuilding data={data} timeOfDay={timeOfDay} isSelected={isSelected} />;
      case 'boys-hostel':
      case 'girls-hostel':
        return <HostelBuilding data={data} timeOfDay={timeOfDay} isSelected={isSelected} />;
      case 'ece-eee-block':
      case 'mech-civil-block':
      case 'cse-it-block':
      case 'sh-mba-block':
      default:
        return <AcademicBlock data={data} timeOfDay={timeOfDay} isSelected={isSelected} />;
    }
  };

  const statusBadgeColor =
    data.verified === 'OSM-MAPPED' || data.verified === 'VERIFIED'
      ? 'text-emerald-400 border-emerald-400/40 bg-emerald-500/10'
      : data.verified === 'IMAGE-VERIFIED' || data.verified === 'IMAGE-ESTIMATED'
      ? 'text-amber-400 border-amber-400/40 bg-amber-500/10'
      : 'text-purple-400 border-purple-400/40 bg-purple-500/10';

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
      {/* Premium Minimal Floating Pill on hover or selection */}
      {(isHovered || isSelected) && (
        <Html position={[0, height + 4.5, 0]} center distanceFactor={65}>
          <div className="pointer-events-none transform -translate-y-2 transition-all duration-200">
            <div
              className={`px-3 py-1.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2.5 whitespace-nowrap border backdrop-blur-md ${
                isSelected
                  ? 'bg-slate-900/95 text-white border-sky-400 ring-4 ring-sky-500/20'
                  : 'bg-slate-950/90 text-slate-100 border-white/20'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isSelected ? 'bg-sky-400 ring-2 ring-sky-300' : 'bg-emerald-400 animate-pulse'
                }`}
              />
              <span className="font-bold tracking-tight">{data.shortName || data.name}</span>
              <span className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded border ${statusBadgeColor}`}>
                {data.verified}
              </span>
            </div>
          </div>
        </Html>
      )}

      {/* Render the specialized architectural model */}
      {renderArchitecturalModel()}
    </group>
  );
};
