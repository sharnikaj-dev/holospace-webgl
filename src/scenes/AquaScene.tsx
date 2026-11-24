import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import type { HotspotData, WorldConfig } from '../types';
import { HotspotMarker } from '../components/HotspotMarker';
import { SceneCameraRig, type CameraGoal } from '../components/SceneCameraRig';
import { useDevicePerformance } from '../hooks/useDevicePerformance';

interface AquaSceneProps {
  world: WorldConfig;
  selectedHotspot: HotspotData | null;
  onSelectHotspot: (hotspot: HotspotData) => void;
  cameraGoal: CameraGoal;
  autoRotate: boolean;
  zoomStepSignal: { direction: 'in' | 'out'; nonce: number } | null;
}

const _dummy = new THREE.Object3D();

export const AquaScene: React.FC<AquaSceneProps> = ({
  world,
  selectedHotspot,
  onSelectHotspot,
  cameraGoal,
  autoRotate,
  zoomStepSignal,
}) => {
  const jellyGroupRef = useRef<THREE.Group>(null);
  const jellyBellRef = useRef<THREE.Mesh>(null);
  const bubblesRef = useRef<THREE.InstancedMesh>(null);
  const beaconSpinRef = useRef<THREE.Mesh>(null);

  const { particleScale, isReducedMotion } = useDevicePerformance();
  const bubbleCount = Math.round(130 * particleScale);

  // Displaced Seabed Geometry
  const seabedGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(46, 46, 48, 48);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const dist = Math.hypot(x, z);
      const wave =
        Math.sin(x * 0.35) * Math.cos(z * 0.35) * 0.45 +
        Math.sin(dist * 0.25) * 0.3;
      pos.setY(i, wave - 0.3);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const bubbleSeeds = useMemo(() => {
    return Array.from({ length: bubbleCount }, (_, i) => ({
      x: Math.sin(i * 2.13) * 8.5,
      z: Math.cos(i * 1.71) * 8.5,
      yStart: (i % 15) * 0.7,
      speed: 0.65 + (i % 6) * 0.16,
      radius: 0.04 + (i % 5) * 0.018,
    }));
  }, [bubbleCount]);

  useEffect(() => {
    return () => {
      seabedGeo.dispose();
    };
  }, [seabedGeo]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const dt = Math.min(delta, 0.05);

    if (jellyGroupRef.current && !isReducedMotion) {
      jellyGroupRef.current.position.y = 3.1 + Math.sin(t * 1.1) * 0.32;
      jellyGroupRef.current.rotation.y += dt * 0.25;
    }
    if (jellyBellRef.current && !isReducedMotion) {
      const pulse = 1 + Math.sin(t * 2.8) * 0.08;
      jellyBellRef.current.scale.set(pulse, 1 / pulse, pulse);
    }
    if (beaconSpinRef.current && !isReducedMotion) {
      beaconSpinRef.current.rotation.y += dt * 0.9;
    }

    if (bubblesRef.current) {
      for (let i = 0; i < bubbleSeeds.length; i++) {
        const b = bubbleSeeds[i];
        const y = ((b.yStart + (isReducedMotion ? 0 : t * b.speed)) % 10.5) - 0.2;
        const wobbleX = b.x + Math.sin(t * 1.5 + i) * 0.12;
        _dummy.position.set(wobbleX, y, b.z);
        _dummy.scale.setScalar(b.radius);
        _dummy.updateMatrix();
        bubblesRef.current.setMatrixAt(i, _dummy.matrix);
      }
      bubblesRef.current.instanceMatrix.needsUpdate = true;
      bubblesRef.current.computeBoundingSphere();
    }
  });

  // Procedural coral branch configurations
  const coralPillars = useMemo(
    () => [
      { pos: [0, 0, 0] as [number, number, number], scale: 1.15, color: '#22d3ee' },
      { pos: [0.65, -0.1, 0.4] as [number, number, number], scale: 0.72, color: '#06b6d4' },
      { pos: [-0.6, -0.15, 0.35] as [number, number, number], scale: 0.8, color: '#38bdf8' },
      { pos: [0.25, -0.1, -0.55] as [number, number, number], scale: 0.65, color: '#2dd4bf' },
    ],
    []
  );

  return (
    <>
      <SceneCameraRig
        cameraGoal={cameraGoal}
        autoRotate={autoRotate}
        zoomStepSignal={zoomStepSignal}
        minDistance={3.2}
        maxDistance={22}
      />

      {/* Deep Ocean Atmospheric Lighting */}
      <ambientLight intensity={0.28} color="#0c4a6e" />
      <hemisphereLight args={['#38bdf8', '#020617', 0.85]} />
      <directionalLight position={[2, 14, 3]} intensity={1.9} color="#7dd3fc" />
      <pointLight position={[0, 2.5, 0]} intensity={2.4} color="#22d3ee" distance={14} />
      <pointLight position={[-3.6, 1.0, -2.6]} intensity={2.0} color="#2dd4bf" distance={10} />

      {/* Ocean Seabed */}
      <mesh geometry={seabedGeo} receiveShadow>
        <meshStandardMaterial color="#07192d" roughness={0.9} metalness={0.08} />
      </mesh>

      {/* Volumetric Surface Light Rays */}
      {[-2.8, 0.2, 3.2].map((xPos, idx) => (
        <mesh
          key={xPos}
          position={[xPos, 6.2, -1.5 + idx * 0.8]}
          rotation={[0.08, 0, -0.12 + idx * 0.08]}
        >
          <coneGeometry args={[2.2, 14, 24, 1, true]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.065}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Central Bioluminescent Coral Spire Cluster */}
      <group
        position={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          if (world.hotspots[0]) onSelectHotspot(world.hotspots[0]);
        }}
      >
        {/* Basalt Reef Base */}
        <mesh position={[0, 0.2, 0]}>
          <dodecahedronGeometry args={[1.35, 1]} />
          <meshStandardMaterial color="#0f2942" roughness={0.88} metalness={0.1} />
        </mesh>
        {coralPillars.map((c, idx) => (
          <group key={idx} position={c.pos} scale={c.scale}>
            <mesh position={[0, 1.4, 0]}>
              <cylinderGeometry args={[0.16, 0.38, 2.8, 12]} />
              <meshStandardMaterial
                color="#0e7490"
                emissive={c.color}
                emissiveIntensity={0.65}
                roughness={0.45}
              />
            </mesh>
            <mesh position={[0, 2.8, 0]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial
                color={c.color}
                emissive={c.color}
                emissiveIntensity={1.6}
                roughness={0.2}
              />
            </mesh>
            <mesh position={[0.26, 1.85, 0]} rotation={[0, 0, -0.55]}>
              <cylinderGeometry args={[0.08, 0.18, 1.1, 10]} />
              <meshStandardMaterial
                color="#0891b2"
                emissive={c.color}
                emissiveIntensity={0.8}
                roughness={0.4}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Pelagic Moon Jellyfish (Composite Bell + Core + Tentacles) */}
      <group
        ref={jellyGroupRef}
        position={[-3.2, 3.1, 1.4]}
        onClick={(e) => {
          e.stopPropagation();
          if (world.hotspots[1]) onSelectHotspot(world.hotspots[1]);
        }}
      >
        <mesh ref={jellyBellRef}>
          <sphereGeometry args={[0.68, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
          <meshPhysicalMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={0.8}
            transparent
            opacity={0.72}
            roughness={0.15}
            clearcoat={1}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, -0.05, 0]}>
          <sphereGeometry args={[0.26, 16, 16]} />
          <meshStandardMaterial
            color="#e0f2fe"
            emissive="#38bdf8"
            emissiveIntensity={2.0}
          />
        </mesh>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 0.3, -0.75, Math.sin(a) * 0.3]}
            >
              <cylinderGeometry args={[0.015, 0.005, 1.4, 6]} />
              <meshBasicMaterial color="#7dd3fc" transparent opacity={0.65} />
            </mesh>
          );
        })}
      </group>

      {/* Abyssal Research Bathysphere Node */}
      <group
        position={[3.4, 0.75, -1.2]}
        onClick={(e) => {
          e.stopPropagation();
          if (world.hotspots[2]) onSelectHotspot(world.hotspots[2]);
        }}
      >
        {/* Anchor Base */}
        <mesh position={[0, -0.55, 0]}>
          <cylinderGeometry args={[0.65, 0.85, 0.35, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.4} />
        </mesh>
        {/* Pressure Sphere */}
        <mesh>
          <sphereGeometry args={[0.58, 24, 24]} />
          <meshStandardMaterial color="#64748b" metalness={0.88} roughness={0.24} />
        </mesh>
        {/* Viewport Window */}
        <mesh position={[0, 0.05, 0.5]}>
          <cylinderGeometry args={[0.22, 0.22, 0.14, 20]} />
          <meshStandardMaterial
            color="#818cf8"
            emissive="#6366f1"
            emissiveIntensity={1.6}
            roughness={0.1}
          />
        </mesh>
        {/* Rotating Sonar Ring */}
        <mesh ref={beaconSpinRef} position={[0, 0.72, 0]}>
          <torusGeometry args={[0.32, 0.03, 8, 24]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={1.5}
          />
        </mesh>
      </group>

      {/* Hydrothermal Fissure Chimney */}
      <group
        position={[-3.6, 0.2, -2.6]}
        onClick={(e) => {
          e.stopPropagation();
          if (world.hotspots[3]) onSelectHotspot(world.hotspots[3]);
        }}
      >
        <mesh position={[0, 0.45, 0]}>
          <coneGeometry args={[0.75, 1.3, 9, 1, true]} />
          <meshStandardMaterial color="#0f172a" roughness={0.92} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.65, 0]}>
          <sphereGeometry args={[0.25, 12, 12]} />
          <meshStandardMaterial color="#2dd4bf" emissive="#14b8a6" emissiveIntensity={2.2} />
        </mesh>
      </group>

      {/* Instanced Rising Air Bubbles */}
      <instancedMesh
        ref={bubblesRef}
        args={[undefined, undefined, bubbleCount]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 10, 10]} />
        <meshPhysicalMaterial
          color="#bae6fd"
          transparent
          opacity={0.55}
          roughness={0.05}
          metalness={0.1}
        />
      </instancedMesh>

      {/* Bioluminescent Plankton */}
      <Sparkles
        count={Math.round(120 * particleScale)}
        scale={[16, 8, 16]}
        size={2.1}
        speed={isReducedMotion ? 0 : 0.3}
        color="#22d3ee"
        opacity={0.75}
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
