import React from 'react';
import { createAsphaltTexture, createPaverTexture } from '../utils/proceduralTextures';

export const Roads: React.FC = () => {
  const asphaltTexture = createAsphaltTexture();
  const paverTexture = createPaverTexture();

  return (
    <group position={[0, 0.02, 0]}>
      {/* 1. Kondapuram Road / Udayagiri State Highway (OSM Verified way 1297896011, Z = 102.5) */}
      <group position={[0, 0, 108]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[420, 14]} />
          <meshStandardMaterial map={asphaltTexture} roughness={0.65} metalness={0.1} />
        </mesh>
        {/* Center Double Yellow Line */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <planeGeometry args={[415, 0.25]} />
          <meshBasicMaterial color="#eab308" />
        </mesh>
        {/* White Shoulder Lines */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -5.5]}>
          <planeGeometry args={[415, 0.2]} />
          <meshBasicMaterial color="#f8fafc" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 5.5]}>
          <planeGeometry args={[415, 0.2]} />
          <meshBasicMaterial color="#f8fafc" />
        </mesh>
      </group>

      {/* 2. Main Entrance Boulevard (OSM way 1297901222, connecting Gate Z=102.5 to Central Quad Z=0) */}
      <group position={[-0.5, 0, 51]}>
        {/* Road Surface */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[10, 102]} />
          <meshStandardMaterial map={asphaltTexture} roughness={0.7} metalness={0.1} />
        </mesh>

        {/* Central Yellow Road Divider Line */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <planeGeometry args={[0.2, 98]} />
          <meshBasicMaterial color="#eab308" />
        </mesh>

        {/* Concrete Curbs along avenue */}
        <mesh position={[-5.2, 0.12, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.4, 0.25, 102]} />
          <meshStandardMaterial map={paverTexture} roughness={0.8} />
        </mesh>
        <mesh position={[5.2, 0.12, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.4, 0.25, 102]} />
          <meshStandardMaterial map={paverTexture} roughness={0.8} />
        </mesh>

        {/* Pedestrian Sidewalks */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-6.7, 0.01, 0]} receiveShadow>
          <planeGeometry args={[2.6, 102]} />
          <meshStandardMaterial map={paverTexture} roughness={0.85} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[6.7, 0.01, 0]} receiveShadow>
          <planeGeometry args={[2.6, 102]} />
          <meshStandardMaterial map={paverTexture} roughness={0.85} />
        </mesh>

        {/* Zebra Crossing at Gate */}
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh
            key={`zebra-gate-${i}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[-3.5 + i * 1.4, 0.02, 45]}
          >
            <planeGeometry args={[0.65, 4.0]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}

        {/* Zebra Crossing at Quad */}
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh
            key={`zebra-quad-${i}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[-3.5 + i * 1.4, 0.02, -45]}
          >
            <planeGeometry args={[0.65, 4.0]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>

      {/* 3. Central Academic Quadrangle Walkways & Cross Road (Z = 0) */}
      <group position={[0, 0, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[160, 8]} />
          <meshStandardMaterial map={asphaltTexture} roughness={0.7} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <planeGeometry args={[155, 0.2]} />
          <meshBasicMaterial color="#eab308" />
        </mesh>
      </group>

      {/* 4. North Academic & Hostel Avenue (Z = -60 to -110) */}
      <group position={[0, 0, -65]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[180, 8]} />
          <meshStandardMaterial map={asphaltTexture} roughness={0.7} />
        </mesh>
      </group>

      {/* 5. West Athletic Ground Connector Avenue (Leading to Sports Pavilion & Playground) */}
      <group position={[-95, 0, 18]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[6, 95]} />
          <meshStandardMaterial map={asphaltTexture} roughness={0.7} />
        </mesh>
      </group>

      {/* 6. East Inter-College Service Corridor (Leading to Canteen and Boys Hostel) */}
      <group position={[65, 0, -35]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[6, 120]} />
          <meshStandardMaterial map={asphaltTexture} roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
};
