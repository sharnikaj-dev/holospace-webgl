import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import type { HotspotData, WorldConfig } from '../types';
import { HotspotMarker } from '../components/HotspotMarker';
import { SceneCameraRig, type CameraGoal } from '../components/SceneCameraRig';
import { useDevicePerformance } from '../hooks/useDevicePerformance';
import { createCyberGridTexture } from '../utils/webgl';

interface NeonCitySceneProps {
  world: WorldConfig;
  selectedHotspot: HotspotData | null;
  onSelectHotspot: (hotspot: HotspotData) => void;
  cameraGoal: CameraGoal;
  autoRotate: boolean;
  zoomStepSignal: { direction: 'in' | 'out'; nonce: number } | null;
}

interface BuildingSpec {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  accent: string;
}

export const NeonCityScene: React.FC<NeonCitySceneProps> = ({
  world,
  selectedHotspot,
  onSelectHotspot,
  cameraGoal,
  autoRotate,
  zoomStepSignal,
}) => {
  const nexusRing1 = useRef<THREE.Mesh>(null);
  const nexusRing2 = useRef<THREE.Mesh>(null);
  const droneRef = useRef<THREE.Group>(null);
  const trafficRef = useRef<THREE.Group>(null);

  const { particleScale, isReducedMotion } = useDevicePerformance();

  const gridTexture = useMemo(
    () => createCyberGridTexture('#060714', '#38bdf8', '#9333ea'),
    []
  );

  useEffect(() => {
    return () => {
      gridTexture.dispose();
    };
  }, [gridTexture]);

  // Deterministic procedural cyberpunk towers
  const buildings = useMemo<BuildingSpec[]>(() => {
    const specs: BuildingSpec[] = [];
    const coords = [
      [-6.5, -5.5], [-3.8, -5.8], [0, -6.2], [3.8, -5.6], [6.6, -5.2],
      [-7.2, -2.4], [-4.2, -2.4], [4.2, -2.2], [6.8, -2.4],
      [-6.8, 1.4], [-4.0, 1.8], [4.4, 1.6], [7.0, 1.8],
      [-6.2, 5.2], [-3.4, 5.6], [3.5, 5.4], [6.4, 5.0],
      [-9.2, -0.5], [9.0, 0.2], [-8.8, 3.8], [8.8, -3.6],
    ];
    coords.forEach(([x, z], idx) => {
      const h = 2.4 + ((idx * 17) % 10) * 0.48;
      const w = 1.15 + (idx % 3) * 0.25;
      const d = 1.15 + ((idx + 1) % 3) * 0.25;
      const accent = idx % 2 === 0 ? '#a855f7' : '#38bdf8';
      specs.push({ x, z, w, d, h, accent });
    });
    return specs;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const dt = Math.min(delta, 0.05);
    if (isReducedMotion) return;

    if (nexusRing1.current) nexusRing1.current.rotation.z += dt * 0.7;
    if (nexusRing2.current) nexusRing2.current.rotation.z -= dt * 0.5;

    if (droneRef.current) {
      droneRef.current.position.x = -3.0 + Math.sin(t * 0.7) * 0.9;
      droneRef.current.position.y = 3.2 + Math.cos(t * 1.4) * 0.18;
      droneRef.current.rotation.y = Math.cos(t * 0.7) * 0.3;
    }

    if (trafficRef.current) {
      trafficRef.current.children.forEach((child, idx) => {
        const speed = idx % 2 === 0 ? 4.5 : -4.2;
        let x = ((child.position.x + dt * speed + 14) % 28) - 14;
        if (x < -14) x += 28;
        child.position.x = x;
      });
    }
  });

  return (
    <>
      <SceneCameraRig
        cameraGoal={cameraGoal}
        autoRotate={autoRotate}
        zoomStepSignal={zoomStepSignal}
        minDistance={4.2}
        maxDistance={26}
      />

      {/* Neon Cyber Lighting */}
      <ambientLight intensity={0.22} />
      <hemisphereLight args={['#38bdf8', '#1e1b4b', 0.55]} />
      <directionalLight position={[10, 14, 8]} intensity={1.5} color="#c4b5fd" />
      <pointLight position={[0, 6.2, 0]} intensity={3.0} color="#a855f7" distance={18} />
      <pointLight position={[2.4, 3.0, 2.0]} intensity={2.0} color="#38bdf8" distance={14} />

      {/* Ground Urban Grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial
          map={gridTexture}
          roughness={0.35}
          metalness={0.7}
          emissive="#1e1b4b"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Central Nexus Spire (Multi-Part Megastructure) */}
      <group
        position={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          if (world.hotspots[0]) onSelectHotspot(world.hotspots[0]);
        }}
      >
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[1.6, 5.0, 1.6]} />
          <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[0, 5.2, 0]}>
          <cylinderGeometry args={[0.18, 0.55, 2.2, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Glowing Vertical Light Strips */}
        {[-0.81, 0.81].map((offset, idx) => (
          <mesh key={idx} position={[offset, 2.5, 0]}>
            <boxGeometry args={[0.04, 4.6, 0.18]} />
            <meshStandardMaterial
              color="#c084fc"
              emissive="#a855f7"
              emissiveIntensity={2.2}
            />
          </mesh>
        ))}
        {/* Rotating Holographic Rings */}
        <mesh ref={nexusRing1} position={[0, 5.8, 0]} rotation={[Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[1.25, 0.035, 10, 48]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2.4} />
        </mesh>
        <mesh ref={nexusRing2} position={[0, 5.8, 0]} rotation={[Math.PI / 1.8, 0.4, 0]}>
          <torusGeometry args={[1.65, 0.025, 10, 48]} />
          <meshStandardMaterial color="#c084fc" emissive="#a855f7" emissiveIntensity={2.2} />
        </mesh>
      </group>

      {/* Elevated Skybridge */}
      <group
        position={[2.2, 2.75, 0.9]}
        rotation={[0, -0.35, 0]}
        onClick={(e) => {
          e.stopPropagation();
          if (world.hotspots[1]) onSelectHotspot(world.hotspots[1]);
        }}
      >
        <mesh>
          <boxGeometry args={[4.4, 0.28, 0.72]} />
          <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.16, 0.34]}>
          <boxGeometry args={[4.4, 0.05, 0.04]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2.2} />
        </mesh>
        <mesh position={[0, 0.16, -0.34]}>
          <boxGeometry args={[4.4, 0.05, 0.04]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2.2} />
        </mesh>
      </group>

      {/* Autonomous Patrol Drone */}
      <group
        ref={droneRef}
        position={[-3.0, 3.2, 2.4]}
        onClick={(e) => {
          e.stopPropagation();
          if (world.hotspots[2]) onSelectHotspot(world.hotspots[2]);
        }}
      >
        <mesh>
          <boxGeometry args={[0.95, 0.24, 0.52]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.18} />
        </mesh>
        <mesh position={[0.45, 0, 0]}>
          <boxGeometry args={[0.14, 0.1, 0.42]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2.4} />
        </mesh>
        <mesh position={[-0.45, -0.05, 0.22]}>
          <cylinderGeometry args={[0.08, 0.08, 0.2, 12]} />
          <meshStandardMaterial color="#c084fc" emissive="#a855f7" emissiveIntensity={2.0} />
        </mesh>
        <mesh position={[-0.45, -0.05, -0.22]}>
          <cylinderGeometry args={[0.08, 0.08, 0.2, 12]} />
          <meshStandardMaterial color="#c084fc" emissive="#a855f7" emissiveIntensity={2.0} />
        </mesh>
      </group>

      {/* Surrounding Skyscrapers */}
      {buildings.map((b, idx) => (
        <group key={idx} position={[b.x, 0, b.z]}>
          <mesh position={[0, b.h / 2, 0]}>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial color="#0b1120" metalness={0.82} roughness={0.28} />
          </mesh>
          {/* Rooftop Neon Crown */}
          <mesh position={[0, b.h + 0.04, 0]}>
            <boxGeometry args={[b.w * 0.92, 0.06, b.d * 0.92]} />
            <meshStandardMaterial
              color={b.accent}
              emissive={b.accent}
              emissiveIntensity={1.8}
            />
          </mesh>
          {/* Vertical Light Spine */}
          <mesh position={[0, b.h / 2, b.d / 2 + 0.015]}>
            <boxGeometry args={[0.06, b.h * 0.84, 0.02]} />
            <meshStandardMaterial
              color={b.accent}
              emissive={b.accent}
              emissiveIntensity={1.6}
            />
          </mesh>
        </group>
      ))}

      {/* Light Traffic Streaks */}
      <group ref={trafficRef}>
        {[-3.2, -1.0, 2.6, 4.4].map((zPos, i) => (
          <mesh key={i} position={[-10 + i * 5, 1.4 + (i % 2) * 0.9, zPos]}>
            <boxGeometry args={[0.85, 0.06, 0.14]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#38bdf8' : '#c084fc'} />
          </mesh>
        ))}
      </group>

      {/* Atmospheric Cyber Particles */}
      <Sparkles
        count={Math.round(110 * particleScale)}
        scale={[20, 8, 20]}
        size={1.8}
        speed={isReducedMotion ? 0 : 0.4}
        color="#38bdf8"
        opacity={0.55}
      />

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
