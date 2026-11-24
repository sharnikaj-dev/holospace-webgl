import React, { Component, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { useDevicePerformance } from '../hooks/useDevicePerformance';

interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * Generates a procedural studio IBL environment map via RoomEnvironment
 * so metallic and refractive materials always have crisp reflections.
 */
const StudioEnvironment: React.FC = () => {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const envTexture = pmremGenerator.fromScene(room, 0.04).texture;
    scene.environment = envTexture;
    room.dispose();
    pmremGenerator.dispose();

    return () => {
      if (scene.environment === envTexture) {
        scene.environment = null;
      }
      envTexture.dispose();
    };
  }, [gl, scene]);

  return null;
};

interface CanvasViewportProps {
  cameraPosition?: [number, number, number];
  fov?: number;
  backgroundColor?: string;
  fogColor?: string;
  fogDensity?: number;
  fallbackTitle?: string;
  children: React.ReactNode;
}

export const CanvasViewport: React.FC<CanvasViewportProps> = ({
  cameraPosition = [0, 3, 10],
  fov = 48,
  backgroundColor = '#05060a',
  fogColor,
  fogDensity = 0.025,
  fallbackTitle = '3D Spatial Viewport',
  children,
}) => {
  const { dpr, isSoftwareGl, enableShadows } = useDevicePerformance();
  const [contextLost, setContextLost] = useState(false);

  const fallbackUI = (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#080b18] to-[#05060a] p-6 text-center">
      <div className="h-12 w-12 rounded-full border border-violet-500/40 bg-violet-500/10 mb-4" />
      <p className="font-display text-base font-semibold text-white">
        {fallbackTitle}
      </p>
      <p className="mt-1 max-w-sm text-xs text-slate-400">
        WebGL rendering is temporarily paused. Reload or restore graphics context to resume 3D exploration.
      </p>
    </div>
  );

  if (contextLost) {
    return fallbackUI;
  }

  return (
    <WebGLErrorBoundary fallback={fallbackUI}>
      <div className="relative h-full w-full select-none">
        <Canvas
          dpr={dpr}
          shadows={enableShadows}
          camera={{ position: cameraPosition, fov, near: 0.1, far: 180 }}
          gl={{
            antialias: !isSoftwareGl,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.1,
          }}
          onCreated={({ gl }) => {
            gl.outputColorSpace = THREE.SRGBColorSpace;
            const dom = gl.domElement;
            const handleLost = (e: Event) => {
              e.preventDefault();
              setContextLost(true);
            };
            const handleRestored = () => {
              setContextLost(false);
            };
            dom.addEventListener('webglcontextlost', handleLost, false);
            dom.addEventListener('webglcontextrestored', handleRestored, false);
          }}
        >
          <color attach="background" args={[backgroundColor]} />
          {fogColor && <fogExp2 attach="fog" args={[fogColor, fogDensity]} />}
          <StudioEnvironment />
          {children}
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
};
