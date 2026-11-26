import React from 'react';

export const CampusBoundary: React.FC = () => {
  return (
    <group>
      {/* 1. Surrounding Agricultural Buffer Landscape Masses */}
      {/* North Landscape Apron (Towards Kovali bypass / fields) */}
      <mesh position={[0, -0.15, -280]} receiveShadow>
        <planeGeometry args={[800, 260]} />
        <meshStandardMaterial color="#3b4028" roughness={1.0} />
      </mesh>

      {/* South Landscape Apron (Across Udayagiri / Kondapuram Road) */}
      <mesh position={[0, -0.15, 240]} receiveShadow>
        <planeGeometry args={[800, 240]} />
        <meshStandardMaterial color="#3e3d2a" roughness={1.0} />
      </mesh>

      {/* West Landscape Apron (Farmlands beyond Athletic Oval) */}
      <mesh position={[-420, -0.15, 0]} receiveShadow>
        <planeGeometry args={[260, 800]} />
        <meshStandardMaterial color="#364028" roughness={1.0} />
      </mesh>

      {/* East Landscape Apron (Beyond College East Wall) */}
      <mesh position={[380, -0.15, 0]} receiveShadow>
        <planeGeometry args={[260, 800]} />
        <meshStandardMaterial color="#383e29" roughness={1.0} />
      </mesh>

      {/* 2. Distant Kavali Regional Low Hillocks on Northern Horizon */}
      <group position={[0, 0, -380]}>
        {[-260, -130, 0, 130, 260].map((x, i) => (
          <mesh key={`distant-hill-${i}`} position={[x, 12 + (i % 3) * 6, 0]}>
            <coneGeometry args={[90 + (i % 2) * 25, 28 + (i % 3) * 8, 16]} />
            <meshStandardMaterial color="#1e293b" roughness={1.0} />
          </mesh>
        ))}
      </group>

      {/* 3. Highway Institutional Landmark Signboard (Along Kondapuram Road at Z = 114) */}
      <group position={[18, 0, 114]} rotation={[0, Math.PI, 0]}>
        {/* Steel Support Uprights */}
        <mesh position={[-2.4, 2.4, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 4.8, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[2.4, 2.4, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 4.8, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Institutional Signboard Surface */}
        <mesh position={[0, 4.0, 0]}>
          <boxGeometry args={[6.2, 1.6, 0.1]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* High-visibility White Border */}
        <mesh position={[0, 4.0, 0.06]}>
          <boxGeometry args={[6.0, 1.4, 0.02]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
};
