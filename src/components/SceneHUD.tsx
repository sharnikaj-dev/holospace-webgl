import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Pause,
  Play,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import type { WorldConfig, WorldId } from '../types';

interface SceneHUDProps {
  world: WorldConfig;
  allWorlds: WorldConfig[];
  activePresetId: string;
  autoRotate: boolean;
  onBackToWorlds: () => void;
  onSwitchWorld: (worldId: WorldId) => void;
  onSelectPreset: (presetId: string) => void;
  onToggleAutoRotate: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetCamera: () => void;
}

export const SceneHUD: React.FC<SceneHUDProps> = ({
  world,
  allWorlds,
  activePresetId,
  autoRotate,
  onBackToWorlds,
  onSwitchWorld,
  onSelectPreset,
  onToggleAutoRotate,
  onZoomIn,
  onZoomOut,
  onResetCamera,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'h' && document.activeElement?.tagName !== 'INPUT') {
        setCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <>
      {/* Minimal Top-Left Title & Back Button */}
      <div className="fixed left-4 top-20 z-20 flex items-center gap-3">
        <button
          type="button"
          onClick={onBackToWorlds}
          className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-white/15 bg-[#0b0f1a]/90 px-3.5 py-2 text-xs font-medium text-slate-200 hover:border-sky-400/60 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Worlds</span>
        </button>

        <div className="hidden sm:block rounded-lg border border-white/10 bg-[#0b0f1a]/88 px-3.5 py-2">
          <p className="font-display text-xs font-semibold tracking-wide text-white whitespace-nowrap">
            {world.title}
          </p>
        </div>
      </div>

      {/* Collapsible Unified Bottom Control Dock */}
      <div className="fixed bottom-5 left-1/2 z-20 w-[min(940px,94vw)] -translate-x-1/2 flex flex-col items-center pointer-events-none">
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-expanded={!collapsed}
          className="pointer-events-auto mb-2 inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-[#0b0f1a]/92 px-3 py-1 text-[11px] font-medium text-slate-300 hover:text-white hover:border-sky-400/50 transition-colors cursor-pointer"
        >
          {collapsed ? (
            <>
              <ChevronUp className="h-3.5 w-3.5" />
              <span>Show Controls</span>
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5" />
              <span>Hide Controls</span>
            </>
          )}
        </button>

        {!collapsed && (
          <div className="pointer-events-auto w-full rounded-xl border border-white/15 bg-[#0b0f1a]/92 px-3 py-2.5 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* World Switcher */}
              <div className="flex items-center gap-2">
                <label htmlFor="world-select" className="text-[11px] font-medium text-slate-400 whitespace-nowrap">
                  Environment
                </label>
                <select
                  id="world-select"
                  value={world.id}
                  onChange={(e) => onSwitchWorld(e.target.value as WorldId)}
                  className="min-h-[38px] rounded-lg border border-white/15 bg-[#05060a] px-2.5 py-1.5 text-xs font-medium text-white focus-visible:outline-2 focus-visible:outline-sky-400 cursor-pointer"
                >
                  {allWorlds.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Camera Presets */}
              <div className="flex items-center gap-1 rounded-lg bg-white/5 p-1">
                {world.presets.map((preset) => {
                  const active = activePresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => onSelectPreset(preset.id)}
                      className={`min-h-[32px] rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        active
                          ? 'bg-violet-600 text-white shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              {/* Camera Utilities */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onToggleAutoRotate}
                  title={autoRotate ? 'Pause rotation' : 'Auto-rotate'}
                  aria-label={autoRotate ? 'Pause auto-rotation' : 'Enable auto-rotation'}
                  className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    autoRotate
                      ? 'border-sky-400/50 bg-sky-500/15 text-sky-300'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:text-white'
                  }`}
                >
                  {autoRotate ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  <span className="hidden md:inline">Orbit</span>
                </button>

                <button
                  type="button"
                  onClick={onZoomIn}
                  aria-label="Zoom in"
                  title="Zoom in"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:border-sky-400/50 hover:text-white cursor-pointer"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={onZoomOut}
                  aria-label="Zoom out"
                  title="Zoom out"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:border-sky-400/50 hover:text-white cursor-pointer"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={onResetCamera}
                  aria-label="Reset camera view"
                  title="Reset camera"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:border-sky-400/50 hover:text-white cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
