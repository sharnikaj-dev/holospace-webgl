import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import type { HotspotData, WorldConfig, WorldId } from '../types';
import { WORLDS_DATA } from '../utils/worldsData';
import { WorldCard } from '../components/WorldCard';
import { CanvasViewport } from '../components/CanvasViewport';
import { SceneHUD } from '../components/SceneHUD';
import { InfoPanel } from '../components/InfoPanel';
import { SceneLoader } from '../components/Loader';
import type { CameraGoal } from '../components/SceneCameraRig';

const GalaxyScene = lazy(() =>
  import('../scenes/GalaxyScene').then((m) => ({ default: m.GalaxyScene }))
);
const AquaScene = lazy(() =>
  import('../scenes/AquaScene').then((m) => ({ default: m.AquaScene }))
);
const NeonCityScene = lazy(() =>
  import('../scenes/NeonCityScene').then((m) => ({ default: m.NeonCityScene }))
);
const ForestScene = lazy(() =>
  import('../scenes/ForestScene').then((m) => ({ default: m.ForestScene }))
);
const AbstractScene = lazy(() =>
  import('../scenes/AbstractScene').then((m) => ({ default: m.AbstractScene }))
);

interface ExploreProps {
  activeWorldId: WorldId | null;
  onSelectWorld: (worldId: WorldId | null) => void;
}

export const Explore: React.FC<ExploreProps> = ({
  activeWorldId,
  onSelectWorld,
}) => {
  const activeWorld: WorldConfig | undefined = WORLDS_DATA.find(
    (w) => w.id === activeWorldId
  );

  const [selectedHotspot, setSelectedHotspot] = useState<HotspotData | null>(null);
  const [activePresetId, setActivePresetId] = useState<string>('overview');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [zoomStepSignal, setZoomStepSignal] = useState<{
    direction: 'in' | 'out';
    nonce: number;
  } | null>(null);
  const [cameraGoal, setCameraGoal] = useState<CameraGoal>(() => ({
    position: activeWorld?.defaultCamera.position ?? [0, 4, 12],
    target: activeWorld?.defaultCamera.target ?? [0, 0, 0],
    nonce: 1,
  }));

  useEffect(() => {
    if (!activeWorld) return;
    setSelectedHotspot(null);
    setActivePresetId('overview');
    setAutoRotate(true);
    setCameraGoal({
      position: activeWorld.defaultCamera.position,
      target: activeWorld.defaultCamera.target,
      nonce: Date.now(),
    });
  }, [activeWorld?.id]);

  const handleSelectHotspot = useCallback((hotspot: HotspotData) => {
    setSelectedHotspot(hotspot);
    setAutoRotate(false);
    setCameraGoal({
      position: hotspot.cameraPosition,
      target: hotspot.cameraTarget,
      nonce: Date.now(),
    });
  }, []);

  const handleSelectPreset = useCallback(
    (presetId: string) => {
      if (!activeWorld) return;
      const preset = activeWorld.presets.find((p) => p.id === presetId);
      if (!preset) return;
      setActivePresetId(presetId);
      setSelectedHotspot(null);
      setCameraGoal({
        position: preset.position,
        target: preset.target,
        nonce: Date.now(),
      });
    },
    [activeWorld]
  );

  const handleResetCamera = useCallback(() => {
    if (!activeWorld) return;
    setSelectedHotspot(null);
    setActivePresetId('overview');
    setCameraGoal({
      position: activeWorld.defaultCamera.position,
      target: activeWorld.defaultCamera.target,
      nonce: Date.now(),
    });
  }, [activeWorld]);

  const handleNextHotspot = useCallback(() => {
    if (!activeWorld || !selectedHotspot) return;
    const idx = activeWorld.hotspots.findIndex((h) => h.id === selectedHotspot.id);
    const next = activeWorld.hotspots[(idx + 1) % activeWorld.hotspots.length];
    handleSelectHotspot(next);
  }, [activeWorld, selectedHotspot, handleSelectHotspot]);

  const handlePrevHotspot = useCallback(() => {
    if (!activeWorld || !selectedHotspot) return;
    const idx = activeWorld.hotspots.findIndex((h) => h.id === selectedHotspot.id);
    const prev =
      activeWorld.hotspots[
        (idx - 1 + activeWorld.hotspots.length) % activeWorld.hotspots.length
      ];
    handleSelectHotspot(prev);
  }, [activeWorld, selectedHotspot, handleSelectHotspot]);

  // Interactive 3D World Mode
  if (activeWorld) {
    const currentHotspotIndex = selectedHotspot
      ? activeWorld.hotspots.findIndex((h) => h.id === selectedHotspot.id)
      : 0;

    return (
      <div className="relative h-screen w-full overflow-hidden bg-[#05060a]">
        <Suspense fallback={<SceneLoader label={`Entering ${activeWorld.title}`} />}>
          <CanvasViewport
            key={activeWorld.id}
            cameraPosition={activeWorld.defaultCamera.position}
            fov={48}
            backgroundColor={activeWorld.atmosphereColor}
            fogColor={activeWorld.atmosphereColor}
            fogDensity={
              activeWorld.id === 'galaxy-zero'
                ? 0.012
                : activeWorld.id === 'aqua-realm'
                  ? 0.036
                  : 0.026
            }
            fallbackTitle={activeWorld.title}
          >
            {activeWorld.id === 'galaxy-zero' && (
              <GalaxyScene
                world={activeWorld}
                selectedHotspot={selectedHotspot}
                onSelectHotspot={handleSelectHotspot}
                cameraGoal={cameraGoal}
                autoRotate={autoRotate}
                zoomStepSignal={zoomStepSignal}
              />
            )}
            {activeWorld.id === 'aqua-realm' && (
              <AquaScene
                world={activeWorld}
                selectedHotspot={selectedHotspot}
                onSelectHotspot={handleSelectHotspot}
                cameraGoal={cameraGoal}
                autoRotate={autoRotate}
                zoomStepSignal={zoomStepSignal}
              />
            )}
            {activeWorld.id === 'neon-city' && (
              <NeonCityScene
                world={activeWorld}
                selectedHotspot={selectedHotspot}
                onSelectHotspot={handleSelectHotspot}
                cameraGoal={cameraGoal}
                autoRotate={autoRotate}
                zoomStepSignal={zoomStepSignal}
              />
            )}
            {activeWorld.id === 'fantasy-forest' && (
              <ForestScene
                world={activeWorld}
                selectedHotspot={selectedHotspot}
                onSelectHotspot={handleSelectHotspot}
                cameraGoal={cameraGoal}
                autoRotate={autoRotate}
                zoomStepSignal={zoomStepSignal}
              />
            )}
            {activeWorld.id === 'abstract-dimension' && (
              <AbstractScene
                world={activeWorld}
                selectedHotspot={selectedHotspot}
                onSelectHotspot={handleSelectHotspot}
                cameraGoal={cameraGoal}
                autoRotate={autoRotate}
                zoomStepSignal={zoomStepSignal}
              />
            )}
          </CanvasViewport>
        </Suspense>

        <InfoPanel
          hotspot={selectedHotspot}
          totalHotspots={activeWorld.hotspots.length}
          currentIndex={currentHotspotIndex}
          onClose={() => setSelectedHotspot(null)}
          onNext={handleNextHotspot}
          onPrev={handlePrevHotspot}
        />

        <SceneHUD
          world={activeWorld}
          allWorlds={WORLDS_DATA}
          activePresetId={activePresetId}
          autoRotate={autoRotate}
          onBackToWorlds={() => onSelectWorld(null)}
          onSwitchWorld={(id) => onSelectWorld(id)}
          onSelectPreset={handleSelectPreset}
          onToggleAutoRotate={() => setAutoRotate((p) => !p)}
          onZoomIn={() => setZoomStepSignal({ direction: 'in', nonce: Date.now() })}
          onZoomOut={() => setZoomStepSignal({ direction: 'out', nonce: Date.now() })}
          onResetCamera={handleResetCamera}
        />
      </div>
    );
  }

  // World Selection Grid Mode
  return (
    <div className="min-h-screen bg-[#05060a] pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <p className="text-xs font-medium tracking-widest text-sky-400 uppercase">
            World Selection
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl [text-wrap:balance]">
            Explore Five Distinct Realms
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            Each environment features bespoke procedural geometry, atmospheric lighting, and interactive hotspots. Click Explore on any world to enter its live 3D space.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {WORLDS_DATA.map((world, idx) => (
            <WorldCard
              key={world.id}
              world={world}
              index={idx}
              onExplore={(w) => onSelectWorld(w.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
