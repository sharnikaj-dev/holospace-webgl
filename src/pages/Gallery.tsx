import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { motion } from 'motion/react';
import type { GalleryCategory, GalleryFinish } from '../types';
import { GALLERY_MODELS } from '../utils/worldsData';
import { SceneLoader } from '../components/Loader';
import type { CameraGoal } from '../components/SceneCameraRig';

const GalleryModelScene = lazy(() =>
  import('../scenes/GalleryModelScene').then((m) => ({ default: m.GalleryModelScene }))
);

const CATEGORIES: GalleryCategory[] = [
  'All',
  'Space',
  'Sculpture',
  'Geometry',
  'Architecture',
];

const FINISHES: { id: GalleryFinish; label: string; swatch: string }[] = [
  { id: 'chrome', label: 'Titanium Chrome', swatch: '#cbd5e1' },
  { id: 'violet', label: 'Electric Violet', swatch: '#a855f7' },
  { id: 'cyan', label: 'Cryo Cyan', swatch: '#22d3ee' },
];

export const Gallery: React.FC = () => {
  const [category, setCategory] = useState<GalleryCategory>('All');
  const filteredModels =
    category === 'All'
      ? GALLERY_MODELS
      : GALLERY_MODELS.filter((m) => m.category === category);

  const [selectedId, setSelectedId] = useState<string>(GALLERY_MODELS[0].id);
  const currentIndex = Math.max(
    0,
    filteredModels.findIndex((m) => m.id === selectedId)
  );
  const activeModel = filteredModels[currentIndex] || filteredModels[0];

  const [finish, setFinish] = useState<GalleryFinish>(activeModel.defaultFinish);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomStepSignal, setZoomStepSignal] = useState<{
    direction: 'in' | 'out';
    nonce: number;
  } | null>(null);
  const [cameraGoal, setCameraGoal] = useState<CameraGoal>({
    position: [0, 1.4, 5.8],
    target: [0, 0, 0],
    nonce: 1,
  });

  const viewportContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFinish(activeModel.defaultFinish);
    setCameraGoal({
      position: [0, 1.4, 5.8],
      target: [0, 0, 0],
      nonce: Date.now(),
    });
  }, [activeModel.id, activeModel.defaultFinish]);

  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const handleToggleFullscreen = async () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      try {
        if (viewportContainerRef.current?.requestFullscreen) {
          await viewportContainerRef.current.requestFullscreen();
        }
      } catch {
        // Graceful CSS fixed-fullscreen fallback if iframe restricts native Fullscreen API
      }
    } else {
      setIsFullscreen(false);
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
      } catch {
        // Handled by state fallback
      }
    }
  };

  const handlePrev = () => {
    const prevIdx =
      (currentIndex - 1 + filteredModels.length) % filteredModels.length;
    setSelectedId(filteredModels[prevIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % filteredModels.length;
    setSelectedId(filteredModels[nextIdx].id);
  };

  return (
    <div className="min-h-screen bg-[#05060a] pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header & Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="text-xs font-medium tracking-widest text-sky-400 uppercase">
              Interactive 3D Archive
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              3D Sculpture Gallery
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-400">
              Drag to rotate, scroll or use controls to zoom, switch surface finishes, and inspect procedural 3D artifacts in studio lighting.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Gallery object categories"
            className="flex flex-wrap items-center gap-1.5 rounded-lg border border-white/10 bg-[#0b0f1a] p-1"
          >
            {CATEGORIES.map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setCategory(cat);
                    const nextList =
                      cat === 'All'
                        ? GALLERY_MODELS
                        : GALLERY_MODELS.filter((m) => m.category === cat);
                    if (nextList.length > 0 && !nextList.some((m) => m.id === selectedId)) {
                      setSelectedId(nextList[0].id);
                    }
                  }}
                  className={`min-h-[36px] rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    active
                      ? 'bg-violet-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Main Studio Showcase */}
        <div className="mt-8 grid gap-8 lg:grid-cols-12 items-stretch">
          {/* Interactive 3D Stage */}
          <div
            ref={viewportContainerRef}
            className={
              isFullscreen
                ? 'fixed inset-0 z-50 bg-[#070913]'
                : 'relative lg:col-span-8 min-h-[420px] sm:min-h-[520px] overflow-hidden rounded-xl border border-white/10 bg-[#070913]'
            }
          >
            <Suspense fallback={<SceneLoader label={`Loading ${activeModel.title}`} />}>
              <GalleryModelScene
                modelId={activeModel.id}
                finish={finish}
                autoRotate={autoRotate}
                cameraGoal={cameraGoal}
                zoomStepSignal={zoomStepSignal}
              />
            </Suspense>

            {/* Top-Right Fullscreen Button */}
            <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleFullscreen}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/15 bg-[#0b0f1a]/90 px-3 text-xs font-medium text-slate-200 hover:border-sky-400/60 hover:text-white cursor-pointer"
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="h-3.5 w-3.5" />
                    <span>Exit Fullscreen</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span>Fullscreen</span>
                  </>
                )}
              </button>
            </div>

            {/* Compact Studio Bottom Controls */}
            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-xl border border-white/15 bg-[#0b0f1a]/92 px-3 py-2 shadow-xl max-w-[94%]">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous 3D model"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-200 hover:border-sky-400/50 hover:text-white cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-2 font-mono text-xs tabular-nums text-slate-300 whitespace-nowrap">
                {currentIndex + 1} / {filteredModels.length}
              </span>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next 3D model"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-200 hover:border-sky-400/50 hover:text-white cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <div className="h-5 w-px bg-white/10 mx-1" aria-hidden="true" />

              <button
                type="button"
                onClick={() => setAutoRotate((p) => !p)}
                aria-label={autoRotate ? 'Pause rotation' : 'Auto-rotate'}
                className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium cursor-pointer whitespace-nowrap ${
                  autoRotate
                    ? 'border-sky-400/50 bg-sky-500/15 text-sky-300'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:text-white'
                }`}
              >
                {autoRotate ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                <span>Rotate</span>
              </button>

              <button
                type="button"
                onClick={() => setZoomStepSignal({ direction: 'in', nonce: Date.now() })}
                aria-label="Zoom in"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:border-sky-400/50 hover:text-white cursor-pointer"
              >
                <ZoomIn className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setZoomStepSignal({ direction: 'out', nonce: Date.now() })}
                aria-label="Zoom out"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:border-sky-400/50 hover:text-white cursor-pointer"
              >
                <ZoomOut className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() =>
                  setCameraGoal({
                    position: [0, 1.4, 5.8],
                    target: [0, 0, 0],
                    nonce: Date.now(),
                  })
                }
                aria-label="Reset view"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:border-sky-400/50 hover:text-white cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Model Specification Sidebar */}
          <div className="lg:col-span-4 flex flex-col justify-between rounded-xl border border-white/10 bg-[#0b0f1a]/90 p-6">
            <div>
              <p className="text-xs font-medium text-sky-400">
                {activeModel.category} · {activeModel.polyComplexity}
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-white">
                {activeModel.title}
              </h2>
              <p className="mt-1 text-xs font-medium text-slate-400">
                {activeModel.subtitle}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                {activeModel.description}
              </p>

              {/* Material Finish Switcher */}
              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-xs font-medium text-slate-400">Surface Finish</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {FINISHES.map((f) => {
                    const active = finish === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFinish(f.id)}
                        className={`inline-flex min-h-[38px] items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                          active
                            ? 'border-sky-400 bg-sky-500/15 text-white'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/25'
                        }`}
                      >
                        <span
                          className="h-2.5 w-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: f.swatch }}
                        />
                        <span>{f.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <dl className="mt-6 space-y-3 border-t border-white/10 pt-5 text-xs">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-slate-400">Bounding Volume</dt>
                  <dd className="font-mono tabular-nums text-slate-200">
                    {activeModel.dimensions}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-slate-400">Architecture</dt>
                  <dd className="text-right text-slate-200">
                    {activeModel.composition}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={handlePrev}
                className="flex-1 min-h-[42px] inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-4 text-xs font-medium text-slate-200 hover:border-sky-400/50 hover:text-white cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Previous</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 min-h-[42px] inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-4 text-xs font-medium text-slate-200 hover:border-sky-400/50 hover:text-white cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Clickable Artifact Roster */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredModels.map((model, idx) => {
            const isSelected = model.id === activeModel.id;
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => setSelectedId(model.id)}
                className={`flex flex-col items-start rounded-xl border p-5 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-sky-400/60 bg-sky-500/10'
                    : 'border-white/10 bg-[#0b0f1a]/70 hover:border-white/25'
                }`}
              >
                <span className="text-xs font-medium text-slate-400">
                  0{idx + 1}. {model.category}
                </span>
                <span className="mt-1.5 font-display text-base font-semibold text-white">
                  {model.title}
                </span>
                <span className="mt-1 text-xs text-slate-400">
                  {model.subtitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
