import React, { useMemo, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';

export const Trees: React.FC = () => {
  // 1. Avenue Ashoka Trees along Grand Entrance Avenue
  const avenueAshokaCount = 28;
  const ashokaTrunkRef = useRef<THREE.InstancedMesh>(null!);
  const ashokaFoliageRef = useRef<THREE.InstancedMesh>(null!);

  // 2. Shade Trees (Neem / Gulmohar) scattered in lawns
  const shadeCount = 45;
  const shadeTrunkRef = useRef<THREE.InstancedMesh>(null!);
  const shadeFoliageRef = useRef<THREE.InstancedMesh>(null!);

  // 3. Royal Palm Trees along perimeter and gardens
  const palmCount = 35;
  const palmTrunkRef = useRef<THREE.InstancedMesh>(null!);
  const palmCrownRef = useRef<THREE.InstancedMesh>(null!);

  // Generate deterministic positions for trees
  const avenuePositions = useMemo(() => {
    const list: [number, number, number][] = [];
    for (let i = 0; i < 14; i++) {
      const z = 20 + i * 11;
      list.push([-9.5, 0, z]);
      list.push([9.5, 0, z]);
    }
    return list;
  }, []);

  const shadePositions = useMemo(() => {
    const list: [number, number, number][] = [];
    const seeds = [
      [-30, 0, 40], [-45, 0, 30], [-25, 0, -20], [-50, 0, -50],
      [30, 0, 40], [45, 0, 30], [25, 0, -20], [50, 0, -50],
      [-110, 0, 30], [-130, 0, -30], [-80, 0, 60],
      [90, 0, 60], [110, 0, -60], [140, 0, -40],
      [-20, 0, -110], [-40, 0, -130], [20, 0, -130],
      [-10, 0, 160], [10, 0, 160], [-120, 0, 100], [120, 0, 100],
      [-70, 0, 110], [70, 0, 110], [-140, 0, -100], [150, 0, -80]
    ];
    for (let i = 0; i < shadeCount; i++) {
      if (i < seeds.length) {
        list.push(seeds[i] as [number, number, number]);
      } else {
        const angle = (i / shadeCount) * Math.PI * 2;
        const radius = 90 + ((i * 17) % 60);
        list.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
      }
    }
    return list;
  }, []);

  const palmPositions = useMemo(() => {
    const list: [number, number, number][] = [];
    for (let i = 0; i < palmCount; i++) {
      const angle = (i / palmCount) * Math.PI * 2;
      const radius = 175 + ((i * 7) % 30);
      list.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
    }
    return list;
  }, []);

  // Update instanced meshes on mount
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();

    // Setup Ashoka Avenue Trees
    if (ashokaTrunkRef.current && ashokaFoliageRef.current) {
      avenuePositions.forEach((pos, i) => {
        // Trunk
        dummy.position.set(pos[0], 1.6, pos[2]);
        dummy.scale.set(1, 1, 1);
        dummy.rotation.set(0, (i * 0.4) % Math.PI, 0);
        dummy.updateMatrix();
        ashokaTrunkRef.current.setMatrixAt(i, dummy.matrix);

        // Foliage (Columnar cone)
        dummy.position.set(pos[0], 5.0, pos[2]);
        dummy.scale.set(1.1 + (i % 3) * 0.1, 1.1 + (i % 2) * 0.15, 1.1 + (i % 3) * 0.1);
        dummy.updateMatrix();
        ashokaFoliageRef.current.setMatrixAt(i, dummy.matrix);
      });
      ashokaTrunkRef.current.instanceMatrix.needsUpdate = true;
      ashokaFoliageRef.current.instanceMatrix.needsUpdate = true;
    }

    // Setup Shade Trees
    if (shadeTrunkRef.current && shadeFoliageRef.current) {
      shadePositions.forEach((pos, i) => {
        const scaleRand = 0.85 + ((i * 3) % 4) * 0.1;
        // Trunk
        dummy.position.set(pos[0], 1.8 * scaleRand, pos[2]);
        dummy.scale.set(scaleRand, scaleRand, scaleRand);
        dummy.rotation.set(0, (i * 0.7) % (Math.PI * 2), 0);
        dummy.updateMatrix();
        shadeTrunkRef.current.setMatrixAt(i, dummy.matrix);

        // Canopy sphere
        dummy.position.set(pos[0], 4.8 * scaleRand, pos[2]);
        dummy.scale.set(scaleRand * 1.2, scaleRand * 0.8, scaleRand * 1.2);
        dummy.updateMatrix();
        shadeFoliageRef.current.setMatrixAt(i, dummy.matrix);
      });
      shadeTrunkRef.current.instanceMatrix.needsUpdate = true;
      shadeFoliageRef.current.instanceMatrix.needsUpdate = true;
    }

    // Setup Royal Palm Trees
    if (palmTrunkRef.current && palmCrownRef.current) {
      palmPositions.forEach((pos, i) => {
        const heightScale = 1.0 + ((i * 5) % 5) * 0.15;
        dummy.position.set(pos[0], 4.2 * heightScale, pos[2]);
        dummy.scale.set(1, heightScale, 1);
        dummy.rotation.set(0, (i * 0.9) % Math.PI, 0);
        dummy.updateMatrix();
        palmTrunkRef.current.setMatrixAt(i, dummy.matrix);

        // Crown
        dummy.position.set(pos[0], 8.4 * heightScale, pos[2]);
        dummy.scale.set(1.4, 1.2, 1.4);
        dummy.updateMatrix();
        palmCrownRef.current.setMatrixAt(i, dummy.matrix);
      });
      palmTrunkRef.current.instanceMatrix.needsUpdate = true;
      palmCrownRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [avenuePositions, shadePositions, palmPositions]);

  return (
    <group>
      {/* 1. Ashoka Trees */}
      <instancedMesh
        ref={ashokaTrunkRef}
        args={[undefined, undefined, avenueAshokaCount]}
        castShadow
      >
        <cylinderGeometry args={[0.16, 0.22, 3.2, 8]} />
        <meshStandardMaterial color="#4a3728" roughness={0.9} />
      </instancedMesh>
      <instancedMesh
        ref={ashokaFoliageRef}
        args={[undefined, undefined, avenueAshokaCount]}
        castShadow
        receiveShadow
      >
        <coneGeometry args={[1.3, 5.5, 9]} />
        <meshStandardMaterial color="#1f4b20" roughness={0.7} />
      </instancedMesh>

      {/* 2. Neem & Shade Trees */}
      <instancedMesh
        ref={shadeTrunkRef}
        args={[undefined, undefined, shadeCount]}
        castShadow
      >
        <cylinderGeometry args={[0.3, 0.45, 3.6, 8]} />
        <meshStandardMaterial color="#3e2723" roughness={0.9} />
      </instancedMesh>
      <instancedMesh
        ref={shadeFoliageRef}
        args={[undefined, undefined, shadeCount]}
        castShadow
        receiveShadow
      >
        <dodecahedronGeometry args={[3.4, 1]} />
        <meshStandardMaterial color="#2e6930" roughness={0.75} />
      </instancedMesh>

      {/* 3. Royal Palm Trees */}
      <instancedMesh
        ref={palmTrunkRef}
        args={[undefined, undefined, palmCount]}
        castShadow
      >
        <cylinderGeometry args={[0.2, 0.32, 8.4, 8]} />
        <meshStandardMaterial color="#78716c" roughness={0.8} />
      </instancedMesh>
      <instancedMesh
        ref={palmCrownRef}
        args={[undefined, undefined, palmCount]}
        castShadow
      >
        <coneGeometry args={[3.2, 2.2, 7]} />
        <meshStandardMaterial color="#15803d" roughness={0.65} />
      </instancedMesh>
    </group>
  );
};
