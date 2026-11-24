import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { CanvasViewport } from '../components/CanvasViewport';
import { useDevicePerformance } from '../hooks/useDevicePerformance';
import { createPlanetTexture, createRingTexture } from '../utils/webgl';

const _targetPos = new THREE.Vector3();

const HeroPlanetRig: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const gimbalRef = useRef<THREE.Group>(null);

  const { camera, pointer } = useThree();
  const { particleScale, isReducedMotion } = useDevicePerformance();

  const planetTexture = useMemo(
    () => createPlanetTexture('#172554', '#5b21b6', '#38bdf8', 16),
    []
  );
  const ringTexture = useMemo(
    () => createRingTexture('rgba(139, 92, 246, 0.72)', 'rgba(56, 189, 248, 0.8)'),
    []
  );

  useEffect(() => {
    return () => {
      planetTexture.dispose();
      ringTexture.dispose();
    };
  }, [planetTexture, ringTexture]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const dt = Math.min(delta, 0.05);

    if (!isReducedMotion) {
      if (planetRef.current) {
        planetRef.current.rotation.y += dt * 0.14;
      }
      if (ring1Ref.current) {
        ring1Ref.current.rotation.z += dt * 0.08;
      }
      if (ring2Ref.current) {
        ring2Ref.current.rotation.z -= dt * 0.11;
      }
      if (gimbalRef.current) {
        gimbalRef.current.rotation.y = Math.sin(t * 0.25) * 0.35;
        gimbalRef.current.rotation.x = Math.cos(t * 0.2) * 0.18;
      }
      if (groupRef.current) {
        groupRef.current.position.y = Math.sin(t * 0.6) * 0.16;
      }
    }

    // Smooth mouse-based camera parallax
    _targetPos.set(
      1.6 + pointer.x * 0.95,
      0.75 + pointer.y * 0.55,
      8.8
    );
    camera.position.x = THREE.MathUtils.damp(camera.position.x, _targetPos.x, 3.2, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, _targetPos.y, 3.2, dt);
    camera.lookAt(1.3, 0, 0);
  });

  const particleCount = Math.round(110 * particleScale);

  return (
    <>
      <ambientLight intensity={0.28} />
      <hemisphereLight args={['#38bdf8', '#1e1b4b', 0.55]} />
      <directionalLight position={[6, 5, 5]} intensity={2.2} color="#e0e7ff" />
      <pointLight position={[-5, -2, -4]} intensity={1.8} color="#9333ea" distance={18} />
      <pointLight position={[3, 2, 4]} intensity={1.4} color="#38bdf8" distance={14} />

      <Stars
        radius={45}
        depth={35}
        count={Math.round(1800 * particleScale)}
        factor={3.4}
        saturation={0.3}
        fade
        speed={isReducedMotion ? 0 : 0.45}
      />

      <Sparkles
        count={particleCount}
        scale={[14, 9, 10]}
        size={2.2}
        speed={isReducedMotion ? 0 : 0.35}
        color="#38bdf8"
        opacity={0.7}
      />

      {/* Positioned slightly right on desktop to balance left hero copy */}
      <group ref={groupRef} position={[2.2, 0.1, 0]}>
        {/* Core Exoplanet */}
        <mesh ref={planetRef}>
          <sphereGeometry args={[1.85, 48, 48]} />
          <meshStandardMaterial
            map={planetTexture}
            roughness={0.55}
            metalness={0.22}
            emissive="#1e1b4b"
            emissiveIntensity={0.35}
          />
        </mesh>

        {/* Atmospheric Rim Shell */}
        <mesh scale={1.055}>
          <sphereGeometry args={[1.85, 36, 36]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.11}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Primary Planetary Ring */}
        <mesh ref={ring1Ref} rotation={[Math.PI * 0.42, 0.22, 0]}>
          <ringGeometry args={[2.35, 3.65, 96]} />
          <meshStandardMaterial
            map={ringTexture}
            transparent
            opacity={0.85}
            roughness={0.3}
            metalness={0.6}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        {/* Secondary Astrolabe Ring */}
        <mesh ref={ring2Ref} rotation={[-Math.PI * 0.35, -0.35, 0]}>
          <torusGeometry args={[2.85, 0.025, 12, 96]} />
          <meshStandardMaterial
            color="#a78bfa"
            emissive="#7c3aed"
            emissiveIntensity={1.4}
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>

        {/* Gyroscopic Astrolabe Nodes */}
        <group ref={gimbalRef}>
          <mesh rotation={[0.4, 0.8, 0]}>
            <torusGeometry args={[3.25, 0.016, 8, 96]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.45} />
          </mesh>
          <mesh position={[3.25, 0, 0]}>
            <octahedronGeometry args={[0.14, 0]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={2}
              metalness={0.9}
              roughness={0.15}
            />
          </mesh>
          <mesh position={[-2.9, 1.45, 0.5]}>
            <sphereGeometry args={[0.18, 20, 20]} />
            <meshStandardMaterial
              color="#c4b5fd"
              roughness={0.35}
              metalness={0.75}
            />
          </mesh>
        </group>
      </group>
    </>
  );
};

export const HeroScene: React.FC = () => {
  return (
    <CanvasViewport
      cameraPosition={[1.6, 0.75, 8.8]}
      fov={46}
      backgroundColor="#05060a"
      fogColor="#05060a"
      fogDensity={0.02}
      fallbackTitle="HoloSpace Cosmic Core"
    >
      <HeroPlanetRig />
    </CanvasViewport>
  );
};
