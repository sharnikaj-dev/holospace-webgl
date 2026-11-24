import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import type { GalleryFinish } from '../types';
import { CanvasViewport } from '../components/CanvasViewport';
import { SceneCameraRig, type CameraGoal } from '../components/SceneCameraRig';
import { useDevicePerformance } from '../hooks/useDevicePerformance';
import { createContactShadowTexture } from '../utils/webgl';

interface GalleryModelSceneProps {
  modelId: string;
  finish: GalleryFinish;
  autoRotate: boolean;
  cameraGoal: CameraGoal;
  zoomStepSignal: { direction: 'in' | 'out'; nonce: number } | null;
}

const FINISH_PALETTE: Record<
  GalleryFinish,
  { primary: string; secondary: string; emissive: string }
> = {
  chrome: {
    primary: '#e2e8f0',
    secondary: '#64748b',
    emissive: '#38bdf8',
  },
  violet: {
    primary: '#a855f7',
    secondary: '#312e81',
    emissive: '#c084fc',
  },
  cyan: {
    primary: '#22d3ee',
    secondary: '#0f172a',
    emissive: '#38bdf8',
  },
};

const GallerySculpture: React.FC<{
  modelId: string;
  finish: GalleryFinish;
}> = ({ modelId, finish }) => {
  const rootRef = useRef<THREE.Group>(null);
  const sub1Ref = useRef<THREE.Mesh>(null);
  const sub2Ref = useRef<THREE.Mesh>(null);
  const { isReducedMotion } = useDevicePerformance();

  const palette = FINISH_PALETTE[finish];

  const shadowTex = useMemo(
    () => createContactShadowTexture('rgba(0, 0, 0, 0.78)'),
    []
  );

  // Logarithmic nautilus spiral positions
  const nautilusChambers = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => {
      const theta = i * 0.42;
      const r = 0.25 * Math.exp(0.14 * theta);
      const x = Math.cos(theta) * r;
      const y = Math.sin(theta) * r;
      const scale = 0.09 * Math.exp(0.12 * theta);
      return { x, y, scale, rot: theta };
    });
  }, []);

  useEffect(() => {
    return () => {
      shadowTex.dispose();
    };
  }, [shadowTex]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const dt = Math.min(delta, 0.05);
    if (isReducedMotion) return;

    if (rootRef.current) {
      rootRef.current.position.y = Math.sin(t * 0.9) * 0.08;
    }
    if (sub1Ref.current) {
      sub1Ref.current.rotation.z += dt * 0.5;
      sub1Ref.current.rotation.x += dt * 0.22;
    }
    if (sub2Ref.current) {
      sub2Ref.current.rotation.y -= dt * 0.45;
    }
  });

  return (
    <>
      {/* Studio Ground Contact Shadow & Subtle Pedestal Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.02, 0]}>
        <planeGeometry args={[5.5, 5.5]} />
        <meshBasicMaterial map={shadowTex} transparent opacity={0.75} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.0, 0]}>
        <ringGeometry args={[1.65, 1.72, 64]} />
        <meshBasicMaterial color={palette.emissive} transparent opacity={0.35} />
      </mesh>

      <group ref={rootRef} position={[0, 0.15, 0]}>
        {modelId === 'chronos-astrolabe' && (
          <>
            <mesh>
              <octahedronGeometry args={[0.58, 0]} />
              <meshPhysicalMaterial
                color={palette.emissive}
                emissive={palette.emissive}
                emissiveIntensity={0.9}
                metalness={0.35}
                roughness={0.1}
                clearcoat={1}
              />
            </mesh>
            <mesh ref={sub1Ref} rotation={[0.4, 0.2, 0]}>
              <torusGeometry args={[1.15, 0.045, 14, 72]} />
              <meshStandardMaterial color={palette.primary} metalness={0.94} roughness={0.16} />
            </mesh>
            <mesh ref={sub2Ref} rotation={[1.2, 0.8, 0]}>
              <torusGeometry args={[1.52, 0.038, 14, 72]} />
              <meshStandardMaterial color={palette.secondary} metalness={0.9} roughness={0.22} />
            </mesh>
            <mesh rotation={[-0.6, 0.4, 0]}>
              <torusGeometry args={[1.85, 0.025, 12, 72]} />
              <meshStandardMaterial
                color={palette.emissive}
                emissive={palette.emissive}
                emissiveIntensity={0.8}
                metalness={0.85}
                roughness={0.18}
              />
            </mesh>
            {[0, 1, 2, 3].map((idx) => {
              const angle = (idx / 4) * Math.PI * 2;
              return (
                <mesh
                  key={idx}
                  position={[Math.cos(angle) * 1.85, Math.sin(angle) * 1.05, 0]}
                >
                  <sphereGeometry args={[0.09, 16, 16]} />
                  <meshStandardMaterial
                    color={palette.emissive}
                    emissive={palette.emissive}
                    emissiveIntensity={1.6}
                  />
                </mesh>
              );
            })}
          </>
        )}

        {modelId === 'hyperbolic-mobius' && (
          <>
            <mesh ref={sub2Ref}>
              <torusKnotGeometry args={[0.98, 0.26, 160, 26, 3, 7]} />
              <meshPhysicalMaterial
                color={palette.primary}
                metalness={0.92}
                roughness={0.12}
                clearcoat={1}
                iridescence={0.85}
              />
            </mesh>
            <mesh ref={sub1Ref} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[1.68, 0.022, 10, 72]} />
              <meshStandardMaterial
                color={palette.emissive}
                emissive={palette.emissive}
                emissiveIntensity={1.5}
              />
            </mesh>
          </>
        )}

        {modelId === 'obsidian-megalith' && (
          <group position={[0, -0.4, 0]}>
            <mesh position={[0, -0.95, 0]}>
              <cylinderGeometry args={[1.05, 1.35, 0.5, 6]} />
              <meshStandardMaterial color={palette.secondary} metalness={0.85} roughness={0.28} />
            </mesh>
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[0.52, 0.92, 2.2, 6]} />
              <meshStandardMaterial color={palette.primary} metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 1.65, 0]}>
              <coneGeometry args={[0.42, 1.1, 6]} />
              <meshStandardMaterial color={palette.secondary} metalness={0.92} roughness={0.18} />
            </mesh>
            {[0, 1, 2].map((i) => {
              const a = (i / 3) * Math.PI * 2;
              return (
                <mesh
                  key={i}
                  position={[Math.cos(a) * 0.65, 0.2, Math.sin(a) * 0.65]}
                  rotation={[0, -a, 0]}
                >
                  <boxGeometry args={[0.08, 2.3, 0.12]} />
                  <meshStandardMaterial
                    color={palette.emissive}
                    emissive={palette.emissive}
                    emissiveIntensity={1.6}
                  />
                </mesh>
              );
            })}
            <mesh ref={sub1Ref} position={[0, 2.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.72, 0.03, 12, 48]} />
              <meshStandardMaterial
                color={palette.emissive}
                emissive={palette.emissive}
                emissiveIntensity={1.8}
              />
            </mesh>
          </group>
        )}

        {modelId === 'geodesic-vortex' && (
          <>
            <mesh ref={sub2Ref}>
              <icosahedronGeometry args={[1.45, 1]} />
              <meshStandardMaterial
                color={palette.primary}
                wireframe
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            <mesh ref={sub1Ref}>
              <icosahedronGeometry args={[0.88, 0]} />
              <meshPhysicalMaterial
                color={palette.emissive}
                emissive={palette.emissive}
                emissiveIntensity={0.8}
                metalness={0.75}
                roughness={0.15}
                clearcoat={1}
              />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[1.75, 0.03, 12, 64]} />
              <meshStandardMaterial color={palette.secondary} metalness={0.9} roughness={0.2} />
            </mesh>
          </>
        )}

        {modelId === 'pelagic-nautilus' && (
          <group ref={sub2Ref} position={[-0.2, -0.1, 0]}>
            {nautilusChambers.map((c, idx) => (
              <mesh
                key={idx}
                position={[c.x, c.y, 0]}
                rotation={[0, 0, c.rot]}
                scale={c.scale * 2.2}
              >
                <torusGeometry args={[0.65, 0.34, 16, 28]} />
                <meshPhysicalMaterial
                  color={idx % 3 === 0 ? palette.emissive : palette.primary}
                  metalness={0.88}
                  roughness={0.16}
                  clearcoat={1}
                />
              </mesh>
            ))}
          </group>
        )}

        {modelId === 'quantum-singularity' && (
          <>
            {/* Pitch-black Event Horizon */}
            <mesh>
              <sphereGeometry args={[0.72, 36, 36]} />
              <meshBasicMaterial color="#020308" />
            </mesh>
            {/* Photon Rim */}
            <mesh scale={1.04}>
              <sphereGeometry args={[0.72, 32, 32]} />
              <meshBasicMaterial
                color={palette.emissive}
                transparent
                opacity={0.45}
                side={THREE.BackSide}
              />
            </mesh>
            {/* Accretion Disks */}
            <mesh ref={sub1Ref} rotation={[Math.PI * 0.42, 0.15, 0]}>
              <torusGeometry args={[1.45, 0.18, 12, 72]} />
              <meshStandardMaterial
                color={palette.primary}
                emissive={palette.emissive}
                emissiveIntensity={1.2}
                metalness={0.7}
                roughness={0.25}
              />
            </mesh>
            <mesh ref={sub2Ref} rotation={[Math.PI * 0.42, 0.15, 0]}>
              <ringGeometry args={[1.75, 2.25, 72]} />
              <meshBasicMaterial
                color={palette.emissive}
                transparent
                opacity={0.35}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Polar Relativistic Jets */}
            <mesh position={[0, 1.35, 0]}>
              <coneGeometry args={[0.24, 1.6, 20, 1, true]} />
              <meshBasicMaterial
                color={palette.emissive}
                transparent
                opacity={0.28}
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh position={[0, -1.35, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.24, 1.6, 20, 1, true]} />
              <meshBasicMaterial
                color={palette.emissive}
                transparent
                opacity={0.28}
                side={THREE.DoubleSide}
              />
            </mesh>
          </>
        )}
      </group>
    </>
  );
};

export const GalleryModelScene: React.FC<GalleryModelSceneProps> = ({
  modelId,
  finish,
  autoRotate,
  cameraGoal,
  zoomStepSignal,
}) => {
  const { particleScale, isReducedMotion } = useDevicePerformance();

  return (
    <CanvasViewport
      cameraPosition={cameraGoal.position}
      fov={44}
      backgroundColor="#070913"
      fogColor="#070913"
      fogDensity={0.03}
      fallbackTitle="3D Studio Gallery"
    >
      <SceneCameraRig
        cameraGoal={cameraGoal}
        autoRotate={autoRotate}
        zoomStepSignal={zoomStepSignal}
        minDistance={2.8}
        maxDistance={12}
        maxPolarAngle={Math.PI * 0.72}
      />

      <ambientLight intensity={0.3} />
      <hemisphereLight args={['#e0f2fe', '#1e1b4b', 0.7]} />
      <directionalLight position={[5, 7, 5]} intensity={2.4} color="#ffffff" />
      <pointLight position={[-5, 2, -4]} intensity={2.2} color="#8b5cf6" distance={15} />
      <pointLight position={[4, -1, -3]} intensity={1.8} color="#38bdf8" distance={14} />

      <Sparkles
        count={Math.round(55 * particleScale)}
        scale={[8, 6, 8]}
        size={1.6}
        speed={isReducedMotion ? 0 : 0.2}
        color="#a78bfa"
        opacity={0.45}
      />

      <GallerySculpture modelId={modelId} finish={finish} />
    </CanvasViewport>
  );
};
