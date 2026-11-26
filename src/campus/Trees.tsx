import React, { useMemo, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';

export const Trees: React.FC = () => {
  // 1. Avenue Ashoka Trees (Polyalthia longifolia) along Entrance Boulevard
  const avenueAshokaCount = 16;
  const ashokaTrunkRef = useRef<THREE.InstancedMesh>(null!);
  const ashokaFoliageRef = useRef<THREE.InstancedMesh>(null!);

  // 2. Shade Trees (Neem / Gulmohar / Peepal) in Academic Courtyards & Lawns
  const shadeCount = 36;
  const shadeTrunkRef = useRef<THREE.InstancedMesh>(null!);
  const shadeFoliageRef = useRef<THREE.InstancedMesh>(null!);

  // 3. Royal Palm Trees along Athletic Perimeter & Gardens
  const palmCount = 28;
  const palmTrunkRef = useRef<THREE.InstancedMesh>(null!);
  const palmCrownRef = useRef<THREE.InstancedMesh>(null!);

  // Avenue trees neatly aligned along the entrance boulevard (Z = 15m to 92m, inside the gate)
  const avenuePositions = useMemo(() => {
    const list: [number, number, number][] = [];
    for (let i = 0; i < 8; i++) {
      const z = 18 + i * 10;
      list.push([-8.5, 0, z]);
      list.push([8.5, 0, z]);
    }
    return list;
  }, []);

  // Carefully curated shade trees in verified open spaces within campus boundary
  const shadePositions = useMemo(() => {
    return [
      // Central quad lawns
      [-28, 0, 32], [-42, 0, 24], [-24, 0, -18], [-48, 0, -42],
      [28, 0, 32], [42, 0, 24], [24, 0, -18], [48, 0, -42],
      // Library forecourt
      [75, 0, -15], [82, 0, -55], [35, 0, -65],
      // Mechanical & Workshops quad
      [-95, 0, -25], [-115, 0, -45], [-85, 0, 45],
      // Auditorium entrance grove
      [-25, 0, -85], [15, 0, -85], [-35, 0, -115], [25, 0, -115],
      // Parking buffers
      [-78, 0, 65], [-35, 0, 95], [68, 0, 35], [78, 0, -5],
      // Sports field spectator shade
      [-140, 0, 35], [-140, 0, -25], [-160, 0, 55], [-160, 0, -45],
      // North campus boundary green belt
      [-60, 0, -135], [-20, 0, -135], [20, 0, -135], [60, 0, -135],
      [-100, 0, -135], [100, 0, -135], [-180, 0, -120], [-220, 0, -90],
      // East perimeter
      [140, 0, -30], [140, 0, 20], [120, 0, 60], [150, 0, -75]
    ] as [number, number, number][];
  }, []);

  // Perimeter palms bounding the athletic field & eastern garden
  const palmPositions = useMemo(() => {
    const list: [number, number, number][] = [];
    // West sports field line
    for (let i = 0; i < 16; i++) {
      list.push([-265, 0, -90 + i * 11]);
    }
    // East perimeter line
    for (let i = 0; i < 12; i++) {
      list.push([175, 0, -60 + i * 13]);
    }
    return list;
  }, []);

  // Update instanced meshes on mount
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();

    // 1. Avenue Ashoka Trees (Columnar)
    if (ashokaTrunkRef.current && ashokaFoliageRef.current) {
      avenuePositions.forEach((pos, i) => {
        dummy.position.set(pos[0], 1.2, pos[2]);
        dummy.scale.set(1, 1, 1);
        dummy.rotation.set(0, (i * 0.4) % Math.PI, 0);
        dummy.updateMatrix();
        ashokaTrunkRef.current.setMatrixAt(i, dummy.matrix);

        dummy.position.set(pos[0], 4.2, pos[2]);
        dummy.scale.set(0.95 + (i % 3) * 0.08, 1.0 + (i % 2) * 0.12, 0.95 + (i % 3) * 0.08);
        dummy.updateMatrix();
        ashokaFoliageRef.current.setMatrixAt(i, dummy.matrix);
      });
      ashokaTrunkRef.current.instanceMatrix.needsUpdate = true;
      ashokaFoliageRef.current.instanceMatrix.needsUpdate = true;
    }

    // 2. Broad Shade Trees (Neem / Gulmohar)
    if (shadeTrunkRef.current && shadeFoliageRef.current) {
      shadePositions.forEach((pos, i) => {
        dummy.position.set(pos[0], 1.6, pos[2]);
        dummy.scale.set(1.1 + (i % 3) * 0.1, 1.1 + (i % 2) * 0.15, 1.1 + (i % 3) * 0.1);
        dummy.rotation.set(0, (i * 0.8) % (Math.PI * 2), 0);
        dummy.updateMatrix();
        shadeTrunkRef.current.setMatrixAt(i, dummy.matrix);

        dummy.position.set(pos[0], 4.8, pos[2]);
        dummy.scale.set(1.4 + (i % 4) * 0.15, 1.2 + (i % 2) * 0.15, 1.4 + (i % 4) * 0.15);
        dummy.updateMatrix();
        shadeFoliageRef.current.setMatrixAt(i, dummy.matrix);
      });
      shadeTrunkRef.current.instanceMatrix.needsUpdate = true;
      shadeFoliageRef.current.instanceMatrix.needsUpdate = true;
    }

    // 3. Royal Palms
    if (palmTrunkRef.current && palmCrownRef.current) {
      palmPositions.forEach((pos, i) => {
        dummy.position.set(pos[0], 3.5, pos[2]);
        dummy.scale.set(1, 1 + (i % 3) * 0.15, 1);
        dummy.rotation.set(0, (i * 0.5) % Math.PI, 0);
        dummy.updateMatrix();
        palmTrunkRef.current.setMatrixAt(i, dummy.matrix);

        dummy.position.set(pos[0], 7.2 + (i % 3) * 0.8, pos[2]);
        dummy.scale.set(1.3, 1, 1.3);
        dummy.updateMatrix();
        palmCrownRef.current.setMatrixAt(i, dummy.matrix);
      });
      palmTrunkRef.current.instanceMatrix.needsUpdate = true;
      palmCrownRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [avenuePositions, shadePositions, palmPositions]);

  return (
    <group>
      {/* 1. Ashoka Trees along Entrance Avenue */}
      <instancedMesh
        ref={ashokaTrunkRef}
        args={[undefined as any, undefined as any, avenueAshokaCount]}
        castShadow
      >
        <cylinderGeometry args={[0.18, 0.22, 2.4, 8]} />
        <meshStandardMaterial color="#4a3728" roughness={0.9} />
      </instancedMesh>
      <instancedMesh
        ref={ashokaFoliageRef}
        args={[undefined as any, undefined as any, avenueAshokaCount]}
        castShadow
        receiveShadow
      >
        <coneGeometry args={[1.3, 5.2, 8]} />
        <meshStandardMaterial color="#2d5a27" roughness={0.8} />
      </instancedMesh>

      {/* 2. Broad Canopy Shade Trees (Neem/Gulmohar) */}
      <instancedMesh
        ref={shadeTrunkRef}
        args={[undefined as any, undefined as any, shadeCount]}
        castShadow
      >
        <cylinderGeometry args={[0.35, 0.45, 3.2, 8]} />
        <meshStandardMaterial color="#3e2723" roughness={0.9} />
      </instancedMesh>
      <instancedMesh
        ref={shadeFoliageRef}
        args={[undefined as any, undefined as any, shadeCount]}
        castShadow
        receiveShadow
      >
        <dodecahedronGeometry args={[3.2, 1]} />
        <meshStandardMaterial color="#38662d" roughness={0.85} />
      </instancedMesh>

      {/* 3. Royal Palm Trees */}
      <instancedMesh
        ref={palmTrunkRef}
        args={[undefined as any, undefined as any, palmCount]}
        castShadow
      >
        <cylinderGeometry args={[0.22, 0.32, 7.0, 8]} />
        <meshStandardMaterial color="#5d4037" roughness={0.8} />
      </instancedMesh>
      <instancedMesh
        ref={palmCrownRef}
        args={[undefined as any, undefined as any, palmCount]}
        castShadow
      >
        <sphereGeometry args={[2.8, 8, 8]} />
        <meshStandardMaterial color="#2e7d32" roughness={0.8} />
      </instancedMesh>
    </group>
  );
};
