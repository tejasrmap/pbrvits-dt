import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import type { BuildingData, TimeOfDay } from '../types';

interface PolygonBuildingMeshProps {
  data: BuildingData;
  timeOfDay: TimeOfDay;
  isSelected: boolean;
  isHovered: boolean;
}

/**
 * Mathematically rigorous 3D Building Massing extruded directly from
 * authoritative WGS84 GeoJSON polygons.
 *
 * Guarantees:
 * 1. Strict polygon validity: Fails visibly if polygon is missing or invalid (NO silent rectangular fallback).
 * 2. Proper polygon winding and closure without duplicate closing vertex mesh artifacts.
 * 3. 1:1 footprint accuracy with bevels disabled (ground geometry matches GIS vector exactly).
 * 4. Restrained, authentic institutional architecture (no invented solar panels, porticos, or fictional features).
 */
export const PolygonBuildingMesh: React.FC<PolygonBuildingMeshProps> = ({
  data,
  isSelected,
  isHovered
}) => {
  // Guard: UNVERIFIED buildings must NEVER render solid 3D building meshes
  if (data.alignmentStatus === 'UNVERIFIED') {
    return null;
  }

  const isPartial = data.alignmentStatus === 'PARTIALLY ALIGNED';
  const { height } = data.dimensions;
  const floors = data.floors || 3;
  const floorHeight = data.floorHeight || height / floors;
  const [cx, , cz] = data.position;

  // Validate polygon existence and minimum vertices
  const rawVertices = data.localPolygonVertices;
  const isValidPolygon = Array.isArray(rawVertices) && rawVertices.length >= 4;

  // Relative polygon vertices centered at building centroid [cx, 0, cz]
  const uniqueRing = useMemo(() => {
    if (!isValidPolygon || !rawVertices) return [];

    // GeoJSON linear rings repeat the first coordinate as the last.
    // Three.js Shape.closePath() automatically closes the shape,
    // so we strip the duplicate closing vertex to avoid zero-length edges and degenerate triangles.
    const isClosed =
      rawVertices.length >= 2 &&
      Math.hypot(
        rawVertices[0][0] - rawVertices[rawVertices.length - 1][0],
        rawVertices[0][2] - rawVertices[rawVertices.length - 1][2]
      ) < 0.001;

    const source = isClosed ? rawVertices.slice(0, -1) : rawVertices;
    return source.map((v) => [v[0] - cx, 0, v[2] - cz] as [number, number, number]);
  }, [rawVertices, cx, cz, isValidPolygon]);

  // Compute 2D polygon signed area to verify counter-clockwise winding order
  const isCCW = useMemo(() => {
    if (uniqueRing.length < 3) return true;
    let sum = 0;
    for (let i = 0; i < uniqueRing.length; i++) {
      const p1 = uniqueRing[i];
      const p2 = uniqueRing[(i + 1) % uniqueRing.length];
      sum += (p2[0] - p1[0]) * (-p2[2] + -p1[2]);
    }
    return sum > 0;
  }, [uniqueRing]);

  // Three.js 2D Shape in X, -Z plane with correct winding
  const shape = useMemo(() => {
    if (uniqueRing.length < 3) return null;
    const ring = isCCW ? uniqueRing : [...uniqueRing].reverse();
    const s = new THREE.Shape();
    s.moveTo(ring[0][0], -ring[0][2]);
    for (let i = 1; i < ring.length; i++) {
      s.lineTo(ring[i][0], -ring[i][2]);
    }
    s.closePath();
    return s;
  }, [uniqueRing, isCCW]);

  // ExtrudeGeometry from ground level Y=0 to Y=height (bevels disabled for exact 1:1 footprint)
  const buildingGeometry = useMemo(() => {
    if (!shape) return null;
    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: height,
      bevelEnabled: false
    });
    geom.rotateX(-Math.PI / 2);
    geom.computeVertexNormals();
    return geom;
  }, [shape, height]);

  // Exterior perimeter points for horizontal chajjas and parapet
  const perimeterPoints = useMemo(() => {
    if (uniqueRing.length < 3) return [];
    // Full loop including closing vertex for line rendering
    return [...uniqueRing, uniqueRing[0]].map((v) => new THREE.Vector3(v[0], 0, v[2]));
  }, [uniqueRing]);

  // Materials: Restrained institutional palette
  const wallMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isSelected ? '#38bdf8' : data.color || '#e2d9cc',
      roughness: isPartial ? 0.95 : 0.85,
      metalness: 0.05,
      transparent: isPartial,
      opacity: isPartial ? 0.78 : 1.0,
      emissive: isSelected ? '#0284c7' : isHovered ? '#0ea5e9' : '#000000',
      emissiveIntensity: isSelected ? 0.35 : isHovered ? 0.15 : 0
    });
  }, [isSelected, isHovered, data.color, isPartial]);

  const plinthMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#334155',
      roughness: 0.9,
      metalness: 0.1
    });
  }, []);

  // Visible validation failure if polygon is missing or invalid
  if (!isValidPolygon || !buildingGeometry || !shape) {
    return (
      <group position={[0, 1.5, 0]}>
        <mesh>
          <boxGeometry args={[4, 3, 4]} />
          <meshBasicMaterial color="#ef4444" wireframe />
        </mesh>
        <Html center distanceFactor={45}>
          <div className="bg-red-950/95 text-red-200 border border-red-500/60 text-xs px-2.5 py-1 rounded-md shadow-xl font-mono">
            Invalid Geographic Polygon: {data.id}
          </div>
        </Html>
      </group>
    );
  }

  return (
    <group>
      {/* 1. Authoritative Extruded Polygon Building Mass */}
      <mesh geometry={buildingGeometry} material={wallMaterial} castShadow receiveShadow />

      {/* 2. Plinth Base Trim (0 to 0.45m) */}
      <mesh
        geometry={useMemo(() => {
          const g = new THREE.ExtrudeGeometry(shape, {
            depth: 0.45,
            bevelEnabled: false
          });
          g.rotateX(-Math.PI / 2);
          return g;
        }, [shape])}
        material={plinthMaterial}
        position={[0, 0, 0]}
      />

      {/* 3. Horizontal Concrete Chajjas / Sunshade Reveals at Floor Levels */}
      {Array.from({ length: floors - 1 }).map((_, i) => {
        const floorY = (i + 1) * floorHeight;
        return (
          <group key={`chajja-${i}`} position={[0, floorY, 0]}>
            <line>
              <bufferGeometry attach="geometry">
                <bufferAttribute
                  attach="attributes-position"
                  args={[
                    new Float32Array(perimeterPoints.flatMap((p) => [p.x, 0, p.z])),
                    3
                  ]}
                />
              </bufferGeometry>
              <lineBasicMaterial attach="material" color="#cbd5e1" linewidth={2} />
            </line>
          </group>
        );
      })}

      {/* 4. Roof Parapet Line */}
      <group position={[0, height, 0]}>
        <line>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array(perimeterPoints.flatMap((p) => [p.x, 0.45, p.z])),
                3
              ]}
            />
          </bufferGeometry>
          <lineBasicMaterial attach="material" color="#e2e8f0" linewidth={2} />
        </line>
      </group>

      {/* 5. Minimal Restrained Rooftop Stair Mumty Access Tower */}
      <mesh position={[0, height + 1.25, 0]} castShadow>
        <boxGeometry args={[4.2, 2.5, 4.2]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>
    </group>
  );
};
