import React, { useRef } from 'react';
import * as THREE from 'three';
import { useCampusStore } from '../store/useCampusStore';
import type { TimeOfDay } from '../types';

interface LightingProps {
  timeOfDay: TimeOfDay;
}

export const Lighting: React.FC<LightingProps> = ({ timeOfDay }) => {
  const sunLightRef = useRef<THREE.DirectionalLight>(null!);
  const layers = useCampusStore((s) => s.layers);
  const graphicsQuality = useCampusStore((s) => s.graphicsQuality);

  // Shadow resolution based on graphics quality
  const shadowMapSize = graphicsQuality === 'ultra' ? 2048 : graphicsQuality === 'high' ? 1024 : 512;
  const enableShadows = layers.shadows && graphicsQuality !== 'low';

  // Lighting configurations for Day, Golden Hour, Sunset, Night
  const config = {
    day: {
      sunColor: '#fffbeb',
      sunIntensity: 2.2,
      sunPosition: [120, 150, 100] as [number, number, number],
      hemiSkyColor: '#bae6fd',
      hemiGroundColor: '#365314',
      hemiIntensity: 0.8,
      ambientIntensity: 0.6,
      ambientColor: '#ffffff'
    },
    goldenHour: {
      sunColor: '#fde047',
      sunIntensity: 2.4,
      sunPosition: [-150, 65, 80] as [number, number, number],
      hemiSkyColor: '#fde68a',
      hemiGroundColor: '#582a0d',
      hemiIntensity: 0.75,
      ambientIntensity: 0.55,
      ambientColor: '#fef3c7'
    },
    sunset: {
      sunColor: '#fdba74',
      sunIntensity: 1.9,
      sunPosition: [-170, 35, -80] as [number, number, number],
      hemiSkyColor: '#fb923c',
      hemiGroundColor: '#451a03',
      hemiIntensity: 0.6,
      ambientIntensity: 0.45,
      ambientColor: '#fed7aa'
    },
    night: {
      sunColor: '#38bdf8',
      sunIntensity: 0.25, // Moonlight
      sunPosition: [80, 110, 80] as [number, number, number],
      hemiSkyColor: '#0f172a',
      hemiGroundColor: '#020617',
      hemiIntensity: 0.35,
      ambientIntensity: 0.3,
      ambientColor: '#1e293b'
    }
  }[timeOfDay] || {
    sunColor: '#fffbeb',
    sunIntensity: 2.2,
    sunPosition: [120, 150, 100] as [number, number, number],
    hemiSkyColor: '#bae6fd',
    hemiGroundColor: '#365314',
    hemiIntensity: 0.8,
    ambientIntensity: 0.6,
    ambientColor: '#ffffff'
  };

  return (
    <group>
      {/* Directional Sun / Golden Hour / Moon */}
      <directionalLight
        ref={sunLightRef}
        position={config.sunPosition}
        color={config.sunColor}
        intensity={config.sunIntensity}
        castShadow={enableShadows}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-camera-near={10}
        shadow-camera-far={450}
        shadow-camera-left={-220}
        shadow-camera-right={220}
        shadow-camera-top={220}
        shadow-camera-bottom={-220}
        shadow-bias={-0.0004}
      />

      {/* Hemisphere Natural Environmental Light */}
      <hemisphereLight
        color={config.hemiSkyColor}
        groundColor={config.hemiGroundColor}
        intensity={config.hemiIntensity}
      />

      {/* Base Ambient Fill */}
      <ambientLight color={config.ambientColor} intensity={config.ambientIntensity} />
    </group>
  );
};
