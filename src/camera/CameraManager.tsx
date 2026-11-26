import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useCampusStore } from '../store/useCampusStore';
import { FirstPersonControls } from './FirstPersonControls';

export const CameraManager: React.FC = () => {
  const { camera } = useThree();
  const orbitRef = useRef<any>(null);

  const cameraMode = useCampusStore((s) => s.cameraMode);
  const targetCameraPosition = useCampusStore((s) => s.targetCameraPosition);
  const targetLookAt = useCampusStore((s) => s.targetLookAt);
  const setCompassAngle = useCampusStore((s) => s.setCompassAngle);
  const setCameraZoom = useCampusStore((s) => s.setCameraZoom);

  // Tour state
  const isTourActive = useCampusStore((s) => s.isTourActive);
  const isTourPaused = useCampusStore((s) => s.isTourPaused);
  const tourStepIndex = useCampusStore((s) => s.tourStepIndex);
  const tourSteps = useCampusStore((s) => s.tourSteps);
  const nextTourStep = useCampusStore((s) => s.nextTourStep);

  const isAnimating = useRef(false);
  const destPos = useRef(new THREE.Vector3());
  const destLook = useRef(new THREE.Vector3());
  const tourTimer = useRef<number>(0);

  useEffect(() => {
    if (targetCameraPosition && targetLookAt && cameraMode !== 'firstPerson') {
      destPos.current.set(...targetCameraPosition);
      destLook.current.set(...targetLookAt);
      isAnimating.current = true;
    }
  }, [targetCameraPosition, targetLookAt, cameraMode]);

  // Reset timer on step change
  useEffect(() => {
    tourTimer.current = 0;
  }, [tourStepIndex]);

  useFrame((_, delta) => {
    // Sync compass rotation angle
    const angle = Math.atan2(camera.position.x, camera.position.z);
    setCompassAngle(angle);

    // Sync camera zoom
    const dist = camera.position.length();
    setCameraZoom(Math.max(10, Math.round(dist)));

    if (cameraMode === 'firstPerson') return;

    // Tour mode advancement timer
    if (isTourActive && !isTourPaused && tourSteps[tourStepIndex]) {
      tourTimer.current += delta;
      if (tourTimer.current >= tourSteps[tourStepIndex].durationSeconds) {
        tourTimer.current = 0;
        nextTourStep();
      }
    }

    // Smooth flight interpolation towards target
    if (isAnimating.current) {
      // Faster lerp during manual selection, smooth glide during tour
      const step = isTourActive ? Math.min(delta * 1.8, 0.08) : Math.min(delta * 3.5, 0.15);

      camera.position.lerp(destPos.current, step);

      if (orbitRef.current) {
        orbitRef.current.target.lerp(destLook.current, step);
        orbitRef.current.update();
      } else {
        camera.lookAt(destLook.current);
      }

      if (
        camera.position.distanceTo(destPos.current) < 0.4 &&
        (!orbitRef.current || orbitRef.current.target.distanceTo(destLook.current) < 0.4)
      ) {
        isAnimating.current = false;
      }
    }
  });

  if (cameraMode === 'firstPerson') {
    return <FirstPersonControls />;
  }

  return (
    <OrbitControls
      ref={orbitRef}
      makeDefault
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={cameraMode === 'aerial' ? 0.05 : Math.PI / 2 - 0.05} // prevent going underground
      minDistance={12}
      maxDistance={460}
      target={[0, 5, 10]}
      enabled={!isTourActive} // Lock user dragging during cinematic tour
    />
  );
};
