import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useDevicePerformance } from '../hooks/useDevicePerformance';

export interface CameraGoal {
  position: [number, number, number];
  target: [number, number, number];
  nonce: number;
}

interface SceneCameraRigProps {
  cameraGoal: CameraGoal;
  autoRotate: boolean;
  zoomStepSignal?: { direction: 'in' | 'out'; nonce: number } | null;
  minDistance?: number;
  maxDistance?: number;
  maxPolarAngle?: number;
}

const _desiredPos = new THREE.Vector3();
const _desiredTarget = new THREE.Vector3();
const _offset = new THREE.Vector3();

export const SceneCameraRig: React.FC<SceneCameraRigProps> = ({
  cameraGoal,
  autoRotate,
  zoomStepSignal,
  minDistance = 3.2,
  maxDistance = 24,
  maxPolarAngle = Math.PI * 0.48,
}) => {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const { camera } = useThree();
  const { isSoftwareGl, isReducedMotion } = useDevicePerformance();

  const transitioningRef = useRef(false);
  const goalPosRef = useRef(new THREE.Vector3(...cameraGoal.position));
  const goalTargetRef = useRef(new THREE.Vector3(...cameraGoal.target));

  useEffect(() => {
    goalPosRef.current.set(...cameraGoal.position);
    goalTargetRef.current.set(...cameraGoal.target);
    transitioningRef.current = true;
  }, [cameraGoal]);

  useEffect(() => {
    if (!zoomStepSignal || !controlsRef.current) return;
    const ctrl = controlsRef.current;
    _offset.copy(camera.position).sub(ctrl.target);
    const currentDist = _offset.length();
    const factor = zoomStepSignal.direction === 'in' ? 0.78 : 1.28;
    const nextDist = THREE.MathUtils.clamp(currentDist * factor, minDistance, maxDistance);
    _offset.setLength(nextDist);
    goalTargetRef.current.copy(ctrl.target);
    goalPosRef.current.copy(ctrl.target).add(_offset);
    transitioningRef.current = true;
  }, [zoomStepSignal, camera, minDistance, maxDistance]);

  useFrame((_, delta) => {
    const ctrl = controlsRef.current;
    if (!ctrl) return;

    if (transitioningRef.current) {
      const lambda = isReducedMotion ? 20 : 5.5;
      _desiredPos.copy(goalPosRef.current);
      _desiredTarget.copy(goalTargetRef.current);

      camera.position.x = THREE.MathUtils.damp(camera.position.x, _desiredPos.x, lambda, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, _desiredPos.y, lambda, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, _desiredPos.z, lambda, delta);

      ctrl.target.x = THREE.MathUtils.damp(ctrl.target.x, _desiredTarget.x, lambda, delta);
      ctrl.target.y = THREE.MathUtils.damp(ctrl.target.y, _desiredTarget.y, lambda, delta);
      ctrl.target.z = THREE.MathUtils.damp(ctrl.target.z, _desiredTarget.z, lambda, delta);

      const posDist = camera.position.distanceToSquared(_desiredPos);
      const tgtDist = ctrl.target.distanceToSquared(_desiredTarget);
      if (posDist < 0.0005 && tgtDist < 0.0005) {
        camera.position.copy(_desiredPos);
        ctrl.target.copy(_desiredTarget);
        transitioningRef.current = false;
      }
    }

    ctrl.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping={!isSoftwareGl}
      dampingFactor={0.06}
      autoRotate={autoRotate && !isReducedMotion}
      autoRotateSpeed={0.65}
      minDistance={minDistance}
      maxDistance={maxDistance}
      maxPolarAngle={maxPolarAngle}
      onStart={() => {
        transitioningRef.current = false;
      }}
    />
  );
};
