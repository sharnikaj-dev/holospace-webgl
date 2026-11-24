import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import type { HotspotData, WorldConfig } from '../types';
import { HotspotMarker } from '../components/HotspotMarker';
import { SceneCameraRig, type CameraGoal } from '../components/SceneCameraRig';
import { useDevicePerformance } from '../hooks/useDevicePerformance';

interface AbstractSceneProps {
  world: WorldConfig;
  selectedHotspot: HotspotData | null;
  onSelectHotspot: (hotspot: HotspotData) => void;
  cameraGoal: CameraGoal;
  autoRotate: boolean;
  zoomStepSignal: { direction: 'in' | 'out'; nonce: number } | null;
}

export const AbstractScene: React.FC<AbstractSceneProps> = ({
  world,
  selectedHotspot,
  onSelectHotspot,
  cameraGoal,
  autoRotate,
  zoomStepSignal,
}) => {
  const knotRef = useRef<THREE.Mesh>(null);
  const gimbal1Ref = useRef<THREE.Mesh>(null);
  const gimbal2Ref = useRef<THREE.Mesh>(null);
  const gimbal3Ref = useRef<THREE.Mesh>(null);
  const satellitesRef = useRef<THREE.Group>(null);
  const wavePlaneRef = useRef<THREE.Mesh>(null);

  const { particleScale, isReducedMotion } = useDevicePerformance();

  const waveGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(24, 24, 42, 42);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, []);

  useEffect(() => {
    return () => {
      waveGeo.dispose();
    };
  }, [waveGeo]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const dt = Math.min(delta, 0.05);

    if (!isReducedMotion) {
      if (knotRef.current) {
        knotRef.current.rotation.x += dt * 0.25;
        knotRef.current.rotation.y += dt * 0.35;
      }
      if (gimbal1Ref.current) gimbal1Ref.current.rotation.z += dt * 0.45;
      if (gimbal2Ref.current) gimbal2Ref.current.rotation.x -= dt * 0.38;
      if (gimbal3Ref.current) gimbal3Ref.current.rotation.y += dt * 0.52;

      if (satellitesRef.current) {
        satellitesRef.current.rotation.y += dt * 0.28;
        satellitesRef.current.children.forEach((child, idx) => {
          child.rotation.x += dt * (0.4 + idx * 0.1);
          child.rotation.y += dt * 0.5;
        });
      }

      if (wavePlaneRef.current) {
        const pos = waveGeo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i);
          const z = pos.getZ(i);
          const dist = Math.hypot(x, z);
          const y = Math.sin(dist * 0.85 - t * 2.1) * 0.32 * Math.exp(-dist * 0.06);
          pos.setY(i, y);
        }
        pos.needsUpdate = true;
      }
    }
  });

  const satelliteCoords: [number, number, number][] = useMemo(
    () => [
      [3.4, 1.8, -1.6],
      [-3.5, 2.0, 1.4],
      [2.4, 2.8, 2.8],
      [-2.2, 0.8, -3.2],
      [0, 3.6, -2.8],
      [0, 0.4, 3.6],
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
        maxPolarAngle={Math.PI * 0.82}
      />

      {/* Experimental Studio Lighting */}
      <ambientLight intensity={0.25} />
      <hemisphereLight args={['#a855f7', '#0f172a', 0.6]} />
      <directionalLight position={[6, 10, 6]} intensity={2.2} color="#f5d0fe" />
      <pointLight position={[-4, 3, -4]} intensity={2.6} color="#38bdf8" distance={16} />
      <pointLight position={[4, 1, 4]} intensity={2.2} color="#ec4899" distance={16} />

      {/* Central Iridescent Torus Knot */}
      <group position={[0, 1.5, 0]}>
        <mesh
          ref={knotRef}
          onClick={(e) => {
            e.stopPropagation();
            if (world.hotspots[0]) onSelectHotspot(world.hotspots[0]);
          }}
        >
          <torusKnotGeometry args={[0.92, 0.26, 140, 24, 3, 5]} />
          <meshPhysicalMaterial
            color="#c084fc"
            metalness={0.92}
            roughness={0.12}
            clearcoat={1}
            clearcoatRoughness={0.08}
            iridescence={1}
            iridescenceIOR={1.4}
          />
        </mesh>

        {/* Gyroscopic Gimbal Frame */}
        <mesh
          ref={gimbal1Ref}
          rotation={[0.4, 0.2, 0]}
          onClick={(e) => {
            e.stopPropagation();
            if (world.hotspots[1]) onSelectHotspot(world.hotspots[1]);
          }}
        >
          <torusGeometry args={[2.05, 0.04, 12, 72]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={1.2}
            metalness={0.9}
            roughness={0.18}
          />
        </mesh>

        <mesh ref={gimbal2Ref} rotation={[1.2, -0.5, 0.4]}>
          <torusGeometry args={[2.45, 0.032, 12, 72]} />
          <meshStandardMaterial
            color="#e879f9"
            emissive="#c026d3"
            emissiveIntensity={1.1}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        <mesh ref={gimbal3Ref} rotation={[-0.8, 0.9, 0]}>
          <torusGeometry args={[2.85, 0.025, 10, 72]} />
          <meshStandardMaterial color="#818cf8" metalness={0.95} roughness={0.15} />
        </mesh>
      </group>

      {/* Orbiting Faceted Polyhedra */}
      <group ref={satellitesRef}>
        {satelliteCoords.map((pos, idx) => (
          <mesh
            key={idx}
            position={pos}
            onClick={(e) => {
              if (idx === 0 && world.hotspots[2]) {
                e.stopPropagation();
                onSelectHotspot(world.hotspots[2]);
              }
            }}
          >
            {idx % 2 === 0 ? (
              <icosahedronGeometry args={[0.38, 0]} />
            ) : (
              <octahedronGeometry args={[0.36, 0]} />
            )}
            <meshPhysicalMaterial
              color={idx % 2 === 0 ? '#38bdf8' : '#f472b6'}
              metalness={0.94}
              roughness={0.14}
              clearcoat={1}
            />
          </mesh>
        ))}
      </group>

      {/* Resonance Wave Matrix Plane */}
      <mesh
        ref={wavePlaneRef}
        geometry={waveGeo}
        position={[0, -1.5, 0]}
        onClick={(e) => {
          e.stopPropagation();
          if (world.hotspots[3]) onSelectHotspot(world.hotspots[3]);
        }}
      >
        <meshStandardMaterial
          color="#6366f1"
          emissive="#4338ca"
          emissiveIntensity={0.45}
          wireframe
          transparent
          opacity={0.42}
        />
      </mesh>

      <Sparkles
        count={Math.round(120 * particleScale)}
        scale={[14, 9, 14]}
        size={2.2}
        speed={isReducedMotion ? 0 : 0.35}
        color="#e879f9"
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
