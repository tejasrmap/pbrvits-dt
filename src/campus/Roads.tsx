import React from 'react';
import { createAsphaltTexture, createPaverTexture } from '../utils/proceduralTextures';

export const Roads: React.FC = () => {
  const asphaltTexture = createAsphaltTexture();
  const paverTexture = createPaverTexture();

  return (
    <group position={[0, 0.02, 0]}>
      {/* 1. Grand Entrance Avenue (Connecting Main Gate Z=185 to Central Quad Z=10) */}
      <group position={[0, 0, 95]}>
        {/* Road Surface */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[12, 180]} />
          <meshStandardMaterial
            map={asphaltTexture}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>

        {/* Central Yellow Road Divider Line */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <planeGeometry args={[0.25, 175]} />
          <meshBasicMaterial color="#eab308" />
        </mesh>

        {/* White Edge Lines */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5.6, 0.01, 0]}>
          <planeGeometry args={[0.2, 175]} />
          <meshBasicMaterial color="#f8fafc" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5.6, 0.01, 0]}>
          <planeGeometry args={[0.2, 175]} />
          <meshBasicMaterial color="#f8fafc" />
        </mesh>

        {/* Concrete Curbs along avenue */}
        <mesh position={[-6.2, 0.12, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.4, 0.25, 180]} />
          <meshStandardMaterial map={paverTexture} roughness={0.8} />
        </mesh>
        <mesh position={[6.2, 0.12, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.4, 0.25, 180]} />
          <meshStandardMaterial map={paverTexture} roughness={0.8} />
        </mesh>

        {/* Pedestrian Sidewalks */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-7.7, 0.01, 0]} receiveShadow>
          <planeGeometry args={[2.6, 180]} />
          <meshStandardMaterial map={paverTexture} roughness={0.85} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[7.7, 0.01, 0]} receiveShadow>
          <planeGeometry args={[2.6, 180]} />
          <meshStandardMaterial map={paverTexture} roughness={0.85} />
        </mesh>

        {/* Zebra Crossing at Gate */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh
            key={`zebra-gate-${i}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[-4.5 + i * 1.3, 0.02, 75]}
          >
            <planeGeometry args={[0.65, 4.5]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}

        {/* Zebra Crossing at Quad */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh
            key={`zebra-quad-${i}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[-4.5 + i * 1.3, 0.02, -75]}
          >
            <planeGeometry args={[0.65, 4.5]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>

      {/* 2. East-West Academic Ring Road (Z = 10, connecting CSE Block to ECE Block) */}
      <group position={[0, 0, 10]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[210, 10]} />
          <meshStandardMaterial map={asphaltTexture} roughness={0.7} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <planeGeometry args={[205, 0.2]} />
          <meshBasicMaterial color="#eab308" />
        </mesh>
      </group>

      {/* 3. East-West Admin Ring Road (Z = 80, connecting Admin to Library) */}
      <group position={[0, 0, 80]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[180, 9]} />
          <meshStandardMaterial map={asphaltTexture} roughness={0.7} />
        </mesh>
      </group>

      {/* 4. North Boulevard (connecting Quad Z=10 to Canteen Z=-90 and Workshops Z=-150) */}
      <group position={[-25, 0, -85]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[9, 160]} />
          <meshStandardMaterial map={asphaltTexture} roughness={0.7} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <planeGeometry args={[0.2, 155]} />
          <meshBasicMaterial color="#eab308" />
        </mesh>
      </group>

      {/* 5. East Sports & Hostel Access Road */}
      <group position={[70, 0, -50]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[8, 120]} />
          <meshStandardMaterial map={asphaltTexture} roughness={0.7} />
        </mesh>
      </group>

      {/* 6. External Highway Road (NH-16 Kavali Frontage Road Z = 230) */}
      <group position={[0, 0, 230]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[520, 16]} />
          <meshStandardMaterial map={asphaltTexture} roughness={0.65} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <planeGeometry args={[510, 0.3]} />
          <meshBasicMaterial color="#eab308" />
        </mesh>
      </group>
    </group>
  );
};
