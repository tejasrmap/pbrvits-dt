import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useCampusStore } from '../store/useCampusStore';

export const RouteRenderer: React.FC = () => {
  const activeRoute = useCampusStore((s) => s.activeRoute);
  const pulseRef = useRef<THREE.Mesh>(null!);

  const { curve, startPoint, endPoint } = useMemo(() => {
    if (!activeRoute || activeRoute.points.length < 2) {
      return { curve: null, startPoint: null, endPoint: null };
    }

    const vectors = activeRoute.points.map(
      (p) => new THREE.Vector3(p[0], p[1], p[2])
    );
    const catmull = new THREE.CatmullRomCurve3(vectors, false, 'catmullrom', 0.2);

    return {
      curve: catmull,
      startPoint: activeRoute.points[0],
      endPoint: activeRoute.points[activeRoute.points.length - 1]
    };
  }, [activeRoute]);

  // Pulse animation for destination pin
  useFrame(({ clock }) => {
    if (pulseRef.current) {
      const t = clock.getElapsedTime();
      const s = 1 + Math.sin(t * 4) * 0.2;
      pulseRef.current.scale.set(s, s, s);
    }
  });

  if (!curve || !startPoint || !endPoint) return null;

  return (
    <group>
      {/* 3D Glowing Navigation Tube Path */}
      <mesh receiveShadow={false}>
        <tubeGeometry args={[curve, 100, 0.45, 8, false]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={2.5}
          roughness={0.2}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Start Waypoint Marker Pin (Green) */}
      <group position={startPoint}>
        <mesh position={[0, 1.8, 0]} castShadow>
          <sphereGeometry args={[0.9, 16, 16]} />
          <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={1.5} />
        </mesh>
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.08, 0.4, 1.6, 16]} />
          <meshStandardMaterial color="#10b981" />
        </mesh>
        <Html position={[0, 3.2, 0]} center distanceFactor={45}>
          <div className="bg-emerald-600/90 text-white text-xs font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap border border-emerald-400">
            START
          </div>
        </Html>
      </group>

      {/* Destination Waypoint Marker Pin (Red / Pulse) */}
      <group position={endPoint}>
        <mesh ref={pulseRef} position={[0, 2.2, 0]} castShadow>
          <sphereGeometry args={[1.1, 16, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={2.0} />
        </mesh>
        <mesh position={[0, 1.0, 0]}>
          <cylinderGeometry args={[0.08, 0.5, 2.0, 16]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        <Html position={[0, 3.8, 0]} center distanceFactor={45}>
          <div className="bg-rose-600/90 text-white text-xs font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap border border-rose-400">
            DESTINATION
          </div>
        </Html>
      </group>
    </group>
  );
};
