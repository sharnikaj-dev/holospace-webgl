import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import type { HotspotData, WorldConfig } from '../types';
import { HotspotMarker } from '../components/HotspotMarker';
import { SceneCameraRig, type CameraGoal } from '../components/SceneCameraRig';
import { useDevicePerformance } from '../hooks/useDevicePerformance';

interface ForestSceneProps {
  world: WorldConfig;
  selectedHotspot: HotspotData | null;
  onSelectHotspot: (hotspot: HotspotData) => void;
  cameraGoal: CameraGoal;
  autoRotate: boolean;
  zoomStepSignal: { direction: 'in' | 'out'; nonce: number } | null;
}

export const ForestScene: React.FC<ForestSceneProps> = ({
  world,
  selectedHotspot,
  onSelectHotspot,
  cameraGoal,
  autoRotate,
  zoomStepSignal,
}) => {
  const wispRef = useRef<THREE.Group>(null);
  const crystalGroupRef = useRef<THREE.Group>(null);

  const { particleScale, isReducedMotion } = useDevicePerformance();

  const terrainGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(50, 50, 44, 44);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const dist = Math.hypot(x, z);
      // Flat central glade rising smoothly at perimeter
      const hill = Math.max(0, dist - 5.5) * 0.12 + Math.sin(x * 0.4) * Math.cos(z * 0.4) * 0.25;
      pos.setY(i, hill - 0.15);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useEffect(() => {
    return () => {
      terrainGeo.dispose();
    };
  }, [terrainGeo]);

  const trees = useMemo(
    () => [
      { pos: [-3.4, 0, -1.6] as [number, number, number], scale: 1.25, glow: '#2dd4bf' },
      { pos: [4.2, 0.2, -3.5] as [number, number, number], scale: 1.1, glow: '#38bdf8' },
      { pos: [-5.6, 0.3, 2.4] as [number, number, number], scale: 1.05, glow: '#a78bfa' },
      { pos: [5.4, 0.2, 2.8] as [number, number, number], scale: 1.2, glow: '#2dd4bf' },
      { pos: [-1.2, 0.3, -5.8] as [number, number, number], scale: 1.35, glow: '#818cf8' },
      { pos: [1.8, 0.4, -6.5] as [number, number, number], scale: 0.95, glow: '#38bdf8' },
      { pos: [-6.8, 0.5, -4.4] as [number, number, number], scale: 1.3, glow: '#2dd4bf' },
      { pos: [7.2, 0.6, -1.2] as [number, number, number], scale: 1.15, glow: '#a78bfa' },
    ],
    []
  );

  const mushrooms = useMemo(
    () => [
      [3.5, 0.05, -2.5],
      [3.9, 0.05, -2.2],
      [3.2, 0.05, -2.8],
      [-2.2, 0.02, 2.6],
      [-2.5, 0.02, 2.3],
    ] as [number, number, number][],
    []
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (isReducedMotion) return;

    if (wispRef.current) {
      wispRef.current.position.y = 1.85 + Math.sin(t * 1.6) * 0.28;
      wispRef.current.position.x = 3.2 + Math.cos(t * 0.9) * 0.35;
      wispRef.current.rotation.y = t * 1.2;
    }

    if (crystalGroupRef.current) {
      crystalGroupRef.current.rotation.y = Math.sin(t * 0.25) * 0.06;
    }
  });

  return (
    <>
      <SceneCameraRig
        cameraGoal={cameraGoal}
        autoRotate={autoRotate}
        zoomStepSignal={zoomStepSignal}
        minDistance={3.2}
        maxDistance={22}
      />

      {/* Nocturnal Enchanted Lighting */}
      <ambientLight intensity={0.24} color="#1e293b" />
      <hemisphereLight args={['#38bdf8', '#052e16', 0.65]} />
      <directionalLight position={[-6, 12, 8]} intensity={1.1} color="#c4b5fd" />
      <pointLight position={[0, 1.8, 0]} intensity={2.8} color="#2dd4bf" distance={13} />
      <pointLight position={[3.2, 2.0, 1.4]} intensity={2.0} color="#c084fc" distance={10} />

      {/* Mossy Forest Terrain */}
      <mesh geometry={terrainGeo} receiveShadow>
        <meshStandardMaterial color="#091b1e" roughness={0.94} metalness={0.04} />
      </mesh>

      {/* Central Sanctuary Crystal Altar */}
      <group
        ref={crystalGroupRef}
        position={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          if (world.hotspots[0]) onSelectHotspot(world.hotspots[0]);
        }}
      >
        {/* Engraved Stone Dais */}
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[1.65, 1.85, 0.24, 12]} />
          <meshStandardMaterial color="#1e293b" roughness={0.85} metalness={0.12} />
        </mesh>
        <mesh position={[0, 0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.25, 1.42, 32]} />
          <meshBasicMaterial color="#2dd4bf" transparent opacity={0.75} />
        </mesh>
        {/* Faceted Arcane Crystals */}
        {[
          { pos: [0, 1.25, 0] as [number, number, number], r: 0.34, h: 2.2, rot: [0, 0, 0] as [number, number, number], col: '#2dd4bf' },
          { pos: [0.55, 0.85, 0.35] as [number, number, number], r: 0.22, h: 1.45, rot: [0.22, 0.4, -0.24] as [number, number, number], col: '#38bdf8' },
          { pos: [-0.52, 0.9, -0.28] as [number, number, number], r: 0.24, h: 1.55, rot: [-0.2, 0.2, 0.26] as [number, number, number], col: '#a855f7' },
          { pos: [0.18, 0.72, -0.58] as [number, number, number], r: 0.18, h: 1.15, rot: [-0.25, 0.5, -0.1] as [number, number, number], col: '#2dd4bf' },
        ].map((c, idx) => (
          <mesh key={idx} position={c.pos} rotation={c.rot}>
            <cylinderGeometry args={[0.04, c.r, c.h, 6]} />
            <meshPhysicalMaterial
              color={c.col}
              emissive={c.col}
              emissiveIntensity={0.85}
              roughness={0.12}
              metalness={0.2}
              clearcoat={1}
            />
          </mesh>
        ))}
      </group>

      {/* Multi-part Ancient Glowing Trees */}
      {trees.map((tree, idx) => (
        <group
          key={idx}
          position={tree.pos}
          scale={tree.scale}
          onClick={(e) => {
            if (idx === 0 && world.hotspots[1]) {
              e.stopPropagation();
              onSelectHotspot(world.hotspots[1]);
            }
          }}
        >
          {/* Tapered Trunk */}
          <mesh position={[0, 1.4, 0]}>
            <cylinderGeometry args={[0.18, 0.42, 2.8, 9]} />
            <meshStandardMaterial color="#1f1a24" roughness={0.95} />
          </mesh>
          {/* Layered Glowing Canopy */}
          <mesh position={[0, 2.9, 0]}>
            <dodecahedronGeometry args={[1.25, 1]} />
            <meshStandardMaterial
              color="#0f3d47"
              emissive={tree.glow}
              emissiveIntensity={0.45}
              roughness={0.65}
            />
          </mesh>
          <mesh position={[0.65, 2.55, 0.35]}>
            <dodecahedronGeometry args={[0.78, 1]} />
            <meshStandardMaterial
              color="#115e59"
              emissive={tree.glow}
              emissiveIntensity={0.65}
              roughness={0.6}
            />
          </mesh>
          <mesh position={[-0.6, 2.65, -0.3]}>
            <dodecahedronGeometry args={[0.72, 1]} />
            <meshStandardMaterial
              color="#1e3a5f"
              emissive={tree.glow}
              emissiveIntensity={0.6}
              roughness={0.6}
            />
          </mesh>
        </group>
      ))}

      {/* Astral Spirit Wisp */}
      <group
        ref={wispRef}
        position={[3.2, 1.85, 1.4]}
        onClick={(e) => {
          e.stopPropagation();
          if (world.hotspots[2]) onSelectHotspot(world.hotspots[2]);
        }}
      >
        <mesh>
          <sphereGeometry args={[0.2, 18, 18]} />
          <meshStandardMaterial
            color="#f5d0fe"
            emissive="#c084fc"
            emissiveIntensity={2.6}
          />
        </mesh>
        <mesh rotation={[Math.PI / 3, 0.3, 0]}>
          <torusGeometry args={[0.42, 0.015, 8, 28]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
        </mesh>
      </group>

      {/* Bioluminescent Mushroom Colonies */}
      {mushrooms.map((pos, idx) => (
        <group
          key={idx}
          position={pos}
          scale={0.7 + (idx % 3) * 0.22}
          onClick={(e) => {
            if (idx < 3 && world.hotspots[3]) {
              e.stopPropagation();
              onSelectHotspot(world.hotspots[3]);
            }
          }}
        >
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.06, 0.09, 0.44, 8]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.46, 0]}>
            <sphereGeometry args={[0.26, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial
              color="#a78bfa"
              emissive={idx % 2 === 0 ? '#a855f7' : '#2dd4bf'}
              emissiveIntensity={1.5}
              roughness={0.25}
            />
          </mesh>
        </group>
      ))}

      {/* Floating Forest Fireflies */}
      <Sparkles
        count={Math.round(140 * particleScale)}
        scale={[15, 6, 15]}
        size={2.6}
        speed={isReducedMotion ? 0 : 0.35}
        color="#2dd4bf"
        opacity={0.8}
      />
      <Sparkles
        count={Math.round(80 * particleScale)}
        scale={[14, 5, 14]}
        size={2.2}
        speed={isReducedMotion ? 0 : 0.28}
        color="#c084fc"
        opacity={0.7}
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
