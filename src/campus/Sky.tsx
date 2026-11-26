import React from 'react';
import { Stars } from '@react-three/drei';
import type { TimeOfDay } from '../types';

interface SkyProps {
  timeOfDay: TimeOfDay;
}

export const Sky: React.FC<SkyProps> = ({ timeOfDay }) => {
  const isNight = timeOfDay === 'night';
  const isGoldenHour = timeOfDay === 'goldenHour';
  const isSunset = timeOfDay === 'sunset';

  const fogColor = isNight
    ? '#090d16'
    : isGoldenHour
    ? '#ffedd5'
    : isSunset
    ? '#7c2d12'
    : '#e0f2fe';

  const skyDomeColor = isNight
    ? '#050811'
    : isGoldenHour
    ? '#fb923c'
    : isSunset
    ? '#c2410c'
    : '#38bdf8';

  return (
    <group>
      {/* Exponential Distance Atmospheric Fog */}
      <fogExp2 attach="fog" args={[fogColor, 0.0016]} />

      {/* Sky Background Sphere Dome */}
      <mesh scale={[-1, 1, 1]}>
        <sphereGeometry args={[700, 32, 16]} />
        <meshBasicMaterial color={skyDomeColor} side={2} />
      </mesh>

      {/* Night Sky Stars */}
      {isNight && (
        <Stars
          radius={450}
          depth={80}
          count={3500}
          factor={4}
          saturation={0.5}
          fade
          speed={0.8}
        />
      )}
    </group>
  );
};
