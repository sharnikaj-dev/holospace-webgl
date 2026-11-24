import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';
import type { HotspotData, WorldConfig } from '../types';
import { HotspotMarker } from '../components/HotspotMarker';
import { SceneCameraRig, type CameraGoal } from '../components/SceneCameraRig';
import { useDevicePerformance } from '../hooks/useDevicePerformance';
import { createPlanetTexture, createRingTexture } from '../utils/webgl';

interface GalaxySceneProps {
  world: WorldConfig;
  selectedHotspot: HotspotData | null;
  onSelectHotspot: (hotspot: HotspotData) => void;
  cameraGoal: CameraGoal;
  autoRotate: boolean;
  zoomStepSignal: { direction: 'in' | 'out'; nonce: number } | null;
}

const _dummy = new THREE.Object3D();
const _color = new THREE.Color();

export const GalaxyScene: React.FC<GalaxySceneProps> = ({
  world,
  selectedHotspot,
  onSelectHotspot,
  cameraGoal,
  autoRotate,
  zoomStepSignal,
}) => {
  const planetRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const stationRef = useRef<THREE.Group>(null);
  const asteroidMeshRef = useRef<THREE.InstancedMesh>(null);
  const pulsarRef = useRef<THREE.Group>(null);

  const { particleScale, isReducedMotion } = useDevicePerformance();

  const planetTexture = useMemo(
    () => createPlanetTexture('#1e1b4b', '#4338ca', '#38bdf8', 18),
    []
  );
  const ringTexture = useMemo(
    () => createRingTexture('rgba(167, 139, 250, 0.82)', 'rgba(56, 189, 248, 0.72)'),
    []
  );

  const asteroidCount = Math.round(140 * particleScale);

  const asteroidData = useMemo(() => {
    return Array.from({ length: asteroidCount }, (_, i) => {
      const angle = (i / asteroidCount) * Math.PI * 2 + (i % 5) * 0.14;
      const radius = 5.4 + ((i * 19) % 100) / 38;
      const yOffset = Math.sin(i * 1.7) * 0.55;
      const scale = 0.08 + ((i * 13) % 10) * 0.018;
      return {
        angle,
        radius,
        yOffset,
        scale,
        speed: 0.05 + (i % 7) * 0.008,
        rotOffset: i * 0.5,
      };
    });
  }, [asteroidCount]);

  useEffect(() => {
    if (!asteroidMeshRef.current) return;
    for (let i = 0; i < asteroidData.length; i++) {
      const d = asteroidData[i];
      _dummy.position.set(
        Math.cos(d.angle) * d.radius,
        d.yOffset,
        Math.sin(d.angle) * d.radius
      );
      _dummy.rotation.set(d.rotOffset, d.rotOffset * 0.7, 0);
      _dummy.scale.set(d.scale * 1.2, d.scale * 0.85, d.scale);
      _dummy.updateMatrix();
      asteroidMeshRef.current.setMatrixAt(i, _dummy.matrix);

      _color.setHSL(0.62 + (i % 4) * 0.04, 0.25, 0.45 + (i % 5) * 0.07);
      asteroidMeshRef.current.setColorAt(i, _color);
    }
    asteroidMeshRef.current.instanceMatrix.needsUpdate = true;
    if (asteroidMeshRef.current.instanceColor) {
      asteroidMeshRef.current.instanceColor.needsUpdate = true;
    }
    asteroidMeshRef.current.computeBoundingSphere();
  }, [asteroidData]);

  useEffect(() => {
    return () => {
      planetTexture.dispose();
      ringTexture.dispose();
    };
  }, [planetTexture, ringTexture]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const dt = Math.min(delta, 0.05);

    if (isReducedMotion) return;

    if (planetRef.current) planetRef.current.rotation.y += dt * 0.12;
    if (ringRef.current) ringRef.current.rotation.z += dt * 0.05;
    if (stationRef.current) {
      stationRef.current.position.y = 1.1 + Math.sin(t * 0.9) * 0.14;
      stationRef.current.rotation.y += dt * 0.22;
    }
    if (pulsarRef.current) {
      pulsarRef.current.rotation.y += dt * 1.4;
      pulsarRef.current.rotation.z = 0.35;
    }
  });

  const aetherisHotspot = world.hotspots[0];
  const relayHotspot = world.hotspots[1];

  return (
    <>
      <SceneCameraRig
        cameraGoal={cameraGoal}
        autoRotate={autoRotate}
        zoomStepSignal={zoomStepSignal}
        minDistance={3.5}
        maxDistance={26}
        maxPolarAngle={Math.PI * 0.85}
      />

      {/* Deep Space Lighting */}
      <ambientLight intensity={0.22} />
      <hemisphereLight args={['#38bdf8', '#1e1b4b', 0.45]} />
      <directionalLight position={[9, 7, 6]} intensity={2.4} color="#e0f2fe" />
      <pointLight position={[-5.8, 2.5, -5.2]} intensity={3.2} color="#a855f7" distance={22} />

      <Stars
        radius={65}
        depth={40}
        count={Math.round(2800 * particleScale)}
        factor={4}
        saturation={0.4}
        fade
        speed={isReducedMotion ? 0 : 0.35}
      />

      {/* Nebula Particle Cloud */}
      <Sparkles
        count={Math.round(160 * particleScale)}
        scale={[22, 10, 22]}
        size={3.2}
        speed={isReducedMotion ? 0 : 0.2}
        color="#8b5cf6"
        opacity={0.55}
      />
      <Sparkles
        count={Math.round(110 * particleScale)}
        scale={[18, 8, 18]}
        size={2.4}
        speed={isReducedMotion ? 0 : 0.25}
        color="#38bdf8"
        opacity={0.65}
      />

      {/* Central Ringed Exoplanet: Aetheris Prime */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          if (aetherisHotspot) onSelectHotspot(aetherisHotspot);
        }}
      >
        <mesh ref={planetRef}>
          <sphereGeometry args={[2.0, 48, 48]} />
          <meshStandardMaterial
            map={planetTexture}
            roughness={0.58}
            metalness={0.18}
            emissive="#1e1b4b"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Atmosphere Rim */}
        <mesh scale={1.06}>
          <sphereGeometry args={[2.0, 36, 36]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.14}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Ring System */}
        <mesh ref={ringRef} rotation={[Math.PI * 0.41, 0.2, 0]}>
          <ringGeometry args={[2.55, 4.35, 96]} />
          <meshStandardMaterial
            map={ringTexture}
            transparent
            opacity={0.88}
            roughness={0.32}
            metalness={0.5}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Multi-part Orbital Relay Station */}
      <group
        ref={stationRef}
        position={[4.2, 1.1, -1.5]}
        onClick={(e) => {
          e.stopPropagation();
          if (relayHotspot) onSelectHotspot(relayHotspot);
        }}
      >
        {/* Central Core Module */}
        <mesh>
          <cylinderGeometry args={[0.26, 0.26, 0.95, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.22} />
        </mesh>
        {/* Glowing Reactor Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.38, 0.045, 10, 32]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={1.8}
            metalness={0.6}
            roughness={0.2}
          />
        </mesh>
        {/* Twin Solar Arrays */}
        <mesh position={[0.92, 0, 0]}>
          <boxGeometry args={[1.15, 0.03, 0.42]} />
          <meshStandardMaterial color="#1d4ed8" metalness={0.9} roughness={0.18} />
        </mesh>
        <mesh position={[-0.92, 0, 0]}>
          <boxGeometry args={[1.15, 0.03, 0.42]} />
          <meshStandardMaterial color="#1d4ed8" metalness={0.9} roughness={0.18} />
        </mesh>
        {/* Dish Antenna */}
        <mesh position={[0, 0.56, 0]} rotation={[0.4, 0, 0]}>
          <coneGeometry args={[0.28, 0.16, 16, 1, true]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Vela Pulsar Remnant */}
      <group ref={pulsarRef} position={[-5.8, 2.5, -5.2]}>
        <mesh>
          <sphereGeometry args={[0.52, 28, 28]} />
          <meshStandardMaterial
            color="#f5d0fe"
            emissive="#a855f7"
            emissiveIntensity={2.8}
            roughness={0.1}
          />
        </mesh>
        {/* Dual Polar Plasma Jets */}
        <mesh position={[0, 1.35, 0]}>
          <coneGeometry args={[0.24, 2.4, 16]} />
          <meshBasicMaterial color="#c084fc" transparent opacity={0.35} />
        </mesh>
        <mesh position={[0, -1.35, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.24, 2.4, 16]} />
          <meshBasicMaterial color="#c084fc" transparent opacity={0.35} />
        </mesh>
      </group>

      {/* Instanced Asteroid Belt */}
      <instancedMesh
        ref={asteroidMeshRef}
        args={[undefined, undefined, asteroidCount]}
        frustumCulled={false}
      >
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial roughness={0.82} metalness={0.28} />
      </instancedMesh>

      {/* Interactive Hotspots */}
      {world.hotspots.map((spot) => (
        <HotspotMarker
          key={spot.id}
          hotspot={spot}
          isSelected={selectedHotspot?.id === spot.id}
          onSelect={onSelectHotspot}
        />
      ))}
    </>
  );
};
