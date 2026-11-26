import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { useCampusStore } from '../store/useCampusStore';
import { campusBuildings } from '../data/buildings';

export const FirstPersonControls: React.FC = () => {
  const { camera, gl } = useThree();
  const setCameraMode = useCampusStore((s) => s.setCameraMode);
  const setFirstPersonPosition = useCampusStore((s) => s.setFirstPersonPosition);

  const keys = useRef<{ [key: string]: boolean }>({});
  const isLocked = useRef(false);
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));

  // Building collision boxes
  const buildingBoxes = useRef(
    campusBuildings.map((b) => {
      const halfW = b.dimensions.width / 2 + 1.2;
      const halfD = b.dimensions.depth / 2 + 1.2;
      return {
        id: b.id,
        minX: b.position[0] - halfW,
        maxX: b.position[0] + halfW,
        minZ: b.position[2] - halfD,
        maxZ: b.position[2] + halfD
      };
    })
  );

  useEffect(() => {
    // Initial camera position at entrance
    camera.position.set(0, 1.7, 160);
    camera.rotation.set(0, Math.PI, 0);
    euler.current.setFromQuaternion(camera.quaternion);

    const onKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
      if (e.code === 'Escape') {
        if (isLocked.current) {
          document.exitPointerLock?.();
        }
        setCameraMode('orbit');
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isLocked.current) return;

      const movementX = e.movementX || 0;
      const movementY = e.movementY || 0;

      euler.current.y -= movementX * 0.0022;
      euler.current.x -= movementY * 0.0022;

      // Clamp pitch so player cannot flip upside down
      euler.current.x = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, euler.current.x));

      camera.quaternion.setFromEuler(euler.current);
    };

    const onPointerLockChange = () => {
      isLocked.current = document.pointerLockElement === gl.domElement;
    };

    const onClickCanvas = () => {
      if (!isLocked.current) {
        gl.domElement.requestPointerLock?.();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('pointerlockchange', onPointerLockChange);
    gl.domElement.addEventListener('click', onClickCanvas);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      gl.domElement.removeEventListener('click', onClickCanvas);
      if (document.pointerLockElement === gl.domElement) {
        document.exitPointerLock?.();
      }
    };
  }, [camera, gl, setCameraMode]);

  useFrame((_, delta) => {
    // Frame delta clamped to avoid huge jumps on frame drops
    const dt = Math.min(delta, 0.1);
    // Velocity smoothing for realistic acceleration and deceleration
    const targetSpeed = keys.current['ShiftLeft'] || keys.current['ShiftRight'] ? 14 : 7.5;

    const moveDirection = new THREE.Vector3();
    if (keys.current['KeyW'] || keys.current['ArrowUp']) moveDirection.z -= 1;
    if (keys.current['KeyS'] || keys.current['ArrowDown']) moveDirection.z += 1;
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) moveDirection.x -= 1;
    if (keys.current['KeyD'] || keys.current['ArrowRight']) moveDirection.x += 1;

    if (moveDirection.lengthSq() > 0) {
      moveDirection.normalize();

      // Transform direction relative to yaw (Y-axis only)
      const yaw = euler.current.y;
      const moveX = (moveDirection.x * Math.cos(yaw) + moveDirection.z * Math.sin(yaw)) * targetSpeed * dt;
      const moveZ = (-moveDirection.x * Math.sin(yaw) + moveDirection.z * Math.cos(yaw)) * targetSpeed * dt;

      const newX = camera.position.x + moveX;
      const newZ = camera.position.z + moveZ;

      // Check collision against building boxes with sliding buffer
      let collidesX = false;
      let collidesZ = false;

      for (const box of buildingBoxes.current) {
        if (newX >= box.minX && newX <= box.maxX && camera.position.z >= box.minZ && camera.position.z <= box.maxZ) {
          collidesX = true;
        }
        if (camera.position.x >= box.minX && camera.position.x <= box.maxX && newZ >= box.minZ && newZ <= box.maxZ) {
          collidesZ = true;
        }
      }

      // Campus boundary check (-235 to 235)
      if (!collidesX && Math.abs(newX) < 235) {
        camera.position.x = newX;
      }
      if (!collidesZ && Math.abs(newZ) < 235) {
        camera.position.z = newZ;
      }
    }

    // Emergency Unstuck Safeguard: If somehow inside any building box, eject to nearest edge
    for (const box of buildingBoxes.current) {
      if (
        camera.position.x >= box.minX &&
        camera.position.x <= box.maxX &&
        camera.position.z >= box.minZ &&
        camera.position.z <= box.maxZ
      ) {
        // Push to nearest boundary edge
        const dMinX = Math.abs(camera.position.x - box.minX);
        const dMaxX = Math.abs(camera.position.x - box.maxX);
        const dMinZ = Math.abs(camera.position.z - box.minZ);
        const dMaxZ = Math.abs(camera.position.z - box.maxZ);
        const minD = Math.min(dMinX, dMaxX, dMinZ, dMaxZ);
        if (minD === dMinX) camera.position.x = box.minX - 0.5;
        else if (minD === dMaxX) camera.position.x = box.maxX + 0.5;
        else if (minD === dMinZ) camera.position.z = box.minZ - 0.5;
        else camera.position.z = box.maxZ + 0.5;
      }
    }

    // Always maintain eye height (1.7m above ground)
    camera.position.y = 1.7;

    setFirstPersonPosition([camera.position.x, camera.position.y, camera.position.z]);
  });

  return null;
};
