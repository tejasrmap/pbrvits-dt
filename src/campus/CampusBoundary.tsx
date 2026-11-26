import React from 'react';

export const CampusBoundary: React.FC = () => {
  return (
    <group>
      {/* Surrounding Farmland & Landscape Masses outside campus bounds */}
      {/* North External Landscape */}
      <mesh position={[0, -0.15, -340]} receiveShadow>
        <planeGeometry args={[720, 200]} />
        <meshStandardMaterial color="#2d3725" roughness={1.0} />
      </mesh>
      {/* South External Landscape (Across Highway) */}
      <mesh position={[0, -0.15, 360]} receiveShadow>
        <planeGeometry args={[720, 200]} />
        <meshStandardMaterial color="#354028" roughness={1.0} />
      </mesh>
      {/* West External Landscape */}
      <mesh position={[-360, -0.15, 0]} receiveShadow>
        <planeGeometry args={[220, 720]} />
        <meshStandardMaterial color="#2c3a26" roughness={1.0} />
      </mesh>
      {/* East External Landscape */}
      <mesh position={[360, -0.15, 0]} receiveShadow>
        <planeGeometry args={[220, 720]} />
        <meshStandardMaterial color="#33422a" roughness={1.0} />
      </mesh>

      {/* Distant Kavali Landscape Hills Silhouette */}
      <group position={[0, 0, -420]}>
        {[-220, -110, 0, 110, 220].map((x, i) => (
          <mesh key={`hill-${i}`} position={[x, 15 + (i % 3) * 8, 0]}>
            <coneGeometry args={[75 + (i % 2) * 20, 35 + (i % 3) * 10, 16]} />
            <meshStandardMaterial color="#1e293b" roughness={1.0} />
          </mesh>
        ))}
      </group>

      {/* Highway Signboard "VISVODAYA / PBR VITS CAMPUS" */}
      <group position={[18, 0, 225]} rotation={[0, Math.PI, 0]}>
        {/* Support Posts */}
        <mesh position={[-2.5, 2.5, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 5, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>
        <mesh position={[2.5, 2.5, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 5, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>
        {/* Signboard */}
        <mesh position={[0, 4.2, 0]}>
          <boxGeometry args={[6.5, 1.8, 0.1]} />
          <meshStandardMaterial color="#15803d" roughness={0.4} />
        </mesh>
        {/* Border */}
        <mesh position={[0, 4.2, 0.06]}>
          <boxGeometry args={[6.3, 1.6, 0.02]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
};
