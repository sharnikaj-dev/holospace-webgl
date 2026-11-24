import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { HotspotData } from '../types';

interface HotspotMarkerProps {
  hotspot: HotspotData;
  isSelected: boolean;
  onSelect: (hotspot: HotspotData) => void;
}

export const HotspotMarker: React.FC<HotspotMarkerProps> = ({
  hotspot,
  isSelected,
  onSelect,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 1.1;
      meshRef.current.position.y = Math.sin(t * 2 + hotspot.position[0]) * 0.08;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = -t * 0.8;
      const scale = isSelected || hovered ? 1.25 : 1;
      ringRef.current.scale.setScalar(
        THREE.MathUtils.lerp(ringRef.current.scale.x, scale, 0.12)
      );
    }
  });

  return (
    <group position={hotspot.position}>
      {/* Interactive 3D Octahedral Node */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(hotspot);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <octahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial
          color={hotspot.accentColor}
          emissive={hotspot.accentColor}
          emissiveIntensity={isSelected || hovered ? 2.2 : 1.2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Halo Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.018, 8, 32]} />
        <meshBasicMaterial
          color={hotspot.accentColor}
          transparent
          opacity={isSelected || hovered ? 0.95 : 0.55}
        />
      </mesh>

      {/* Accessible DOM Pin */}
      <Html
        position={[0, 0.42, 0]}
        center
        distanceFactor={12}
        zIndexRange={[10, 0]}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(hotspot);
          }}
          className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-display font-medium whitespace-nowrap transition-all duration-150 cursor-pointer shadow-lg ${
            isSelected
              ? 'border-sky-400 bg-[#0b0f1a] text-white'
              : 'border-white/20 bg-[#070912]/90 text-slate-200 hover:border-sky-400/70 hover:text-white'
          }`}
        >
          <span
            className="h-1.5 w-1.5 rounded-full shrink-0"
            style={{ backgroundColor: hotspot.accentColor }}
          />
          <span>{hotspot.title}</span>
        </button>
      </Html>
    </group>
  );
};
