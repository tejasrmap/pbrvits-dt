import React from 'react';
import type { WindowStyle, TimeOfDay } from '../types';

interface WindowProps {
  position: [number, number, number];
  width: number;
  height: number;
  style: WindowStyle;
  timeOfDay: TimeOfDay;
}

export const Window: React.FC<WindowProps> = ({
  position,
  width,
  height,
  style,
  timeOfDay
}) => {
  const isNight = timeOfDay === 'night';
  const isGoldenHour = timeOfDay === 'goldenHour';
  const isSunset = timeOfDay === 'sunset';

  // Night window emission: some windows lit up with warm incandescent/fluorescent light
  const isLit = isNight && ((position[0] * 13 + position[1] * 7 + position[2] * 5) % 10 > 3);
  const lightColor = ((position[0] + position[1]) % 3 === 0) ? '#fef08a' : '#bfdbfe';

  return (
    <group position={position}>
      {/* Window Frame */}
      <mesh castShadow={false} receiveShadow>
        <boxGeometry args={[width, height, 0.2]} />
        <meshStandardMaterial
          color="#334155"
          roughness={0.5}
          metalness={0.6}
        />
      </mesh>

      {/* Glass Pane */}
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[width * 0.9, height * 0.88]} />
        <meshStandardMaterial
          color={isLit ? lightColor : isGoldenHour ? '#fde047' : isSunset ? '#fdba74' : '#60a5fa'}
          roughness={0.15}
          metalness={0.8}
          transparent
          opacity={isLit ? 0.95 : 0.65}
          emissive={isLit ? lightColor : '#000000'}
          emissiveIntensity={isLit ? 1.4 : 0}
        />
      </mesh>

      {/* Window Sill */}
      <mesh position={[0, -height / 2 - 0.06, 0.15]}>
        <boxGeometry args={[width + 0.15, 0.12, 0.35]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>

      {/* Sun Louver / Shade (common in AP climate) */}
      {(style === 'standard' || style === 'large') && (
        <mesh position={[0, height / 2 + 0.08, 0.25]}>
          <boxGeometry args={[width + 0.25, 0.1, 0.55]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.7} />
        </mesh>
      )}

      {/* Window Grills / Mullions for Lab & Standard styles */}
      {style === 'lab' && (
        <group position={[0, 0, 0.1]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.04, height * 0.85, 0.05]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[width * 0.85, 0.04, 0.05]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>
      )}
    </group>
  );
};
