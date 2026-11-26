import type { NavNode, NavRoute } from '../types';
import { campusNavNodes } from '../data/campusPaths';
import { localToWgs84 } from '../data/gis';

/**
 * Calculates Euclidean 3D distance between two points
 */
export function calculateDistance(
  p1: [number, number, number],
  p2: [number, number, number]
): number {
  const dx = p1[0] - p2[0];
  const dy = p1[1] - p2[1];
  const dz = p1[2] - p2[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Finds shortest route between startNodeId and targetNodeId using Dijkstra's algorithm
 */
export function findShortestRoute(
  startNodeId: string,
  targetNodeId: string,
  mode: 'shortest' | 'accessible' | 'scenic' = 'shortest'
): NavRoute | null {
  const nodeMap = new Map<string, NavNode>();
  campusNavNodes.forEach((node) => nodeMap.set(node.id, { ...node, connections: [...node.connections] }));

  // Ensure bidirectional graph symmetry
  nodeMap.forEach((node, id) => {
    for (const conn of node.connections) {
      const neighbor = nodeMap.get(conn);
      if (neighbor && !neighbor.connections.includes(id)) {
        neighbor.connections.push(id);
      }
    }
  });

  if (!nodeMap.has(startNodeId) || !nodeMap.has(targetNodeId)) {
    return null;
  }

  const distances = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const unvisited = new Set<string>();

  nodeMap.forEach((_, id) => {
    distances.set(id, Infinity);
    previous.set(id, null);
    unvisited.add(id);
  });

  distances.set(startNodeId, 0);

  while (unvisited.size > 0) {
    // Find unvisited node with smallest distance
    let currentId: string | null = null;
    let smallestDist = Infinity;

    unvisited.forEach((id) => {
      const dist = distances.get(id)!;
      if (dist < smallestDist) {
        smallestDist = dist;
        currentId = id;
      }
    });

    if (!currentId || smallestDist === Infinity) break;
    if (currentId === targetNodeId) break;

    unvisited.delete(currentId);
    const currentNode = nodeMap.get(currentId)!;

    for (const neighborId of currentNode.connections) {
      if (!unvisited.has(neighborId)) continue;
      const neighborNode = nodeMap.get(neighborId);
      if (!neighborNode) continue;

      let edgeWeight = calculateDistance(currentNode.position, neighborNode.position);
      if (mode === 'scenic' && (currentNode.type === 'junction' || neighborNode.type === 'junction')) {
        edgeWeight *= 0.85; // Favors wide main boulevard avenues
      }
      const alt = distances.get(currentId)! + edgeWeight;

      if (alt < distances.get(neighborId)!) {
        distances.set(neighborId, alt);
        previous.set(neighborId, currentId);
      }
    }
  }

  // Reconstruct path
  const pathNodes: NavNode[] = [];
  let curr: string | null = targetNodeId;

  while (curr) {
    const node = nodeMap.get(curr);
    if (node) pathNodes.unshift(node);
    curr = previous.get(curr) || null;
  }

  if (pathNodes.length === 0 || pathNodes[0].id !== startNodeId) {
    return null;
  }

  // Calculate points, total distance and instructions
  const points: [number, number, number][] = pathNodes.map((n) => [
    n.position[0],
    n.position[1] + 0.35, // Slight offset above pavement
    n.position[2]
  ]);

  let totalDistance = 0;
  for (let i = 0; i < points.length - 1; i++) {
    totalDistance += calculateDistance(points[i], points[i + 1]);
  }

  // Average walking speed ~ 1.4 m/s (84 meters/minute)
  const walkingMinutes = Math.max(1, Math.round((totalDistance / 75) * 10) / 10);

  // Generate directional instructions
  const instructions: string[] = [];
  instructions.push(`Start at ${pathNodes[0].name}`);
  for (let i = 1; i < pathNodes.length - 1; i++) {
    instructions.push(`Follow walkway toward ${pathNodes[i].name}`);
  }
  instructions.push(`Arrive at ${pathNodes[pathNodes.length - 1].name}`);

  const geoPoints: [number, number][] = points.map((p) => localToWgs84(p[0], p[2]));

  return {
    nodes: pathNodes,
    points,
    geoPoints,
    distanceMeters: Math.round(totalDistance),
    walkingMinutes,
    instructions
  };
}
