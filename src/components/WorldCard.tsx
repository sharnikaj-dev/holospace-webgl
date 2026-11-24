import React, { useState } from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import type { WorldConfig } from '../types';
import { Button } from './Button';

interface WorldCardProps {
  world: WorldConfig;
  index: number;
  onExplore: (world: WorldConfig) => void;
}

export const WorldCard: React.FC<WorldCardProps> = ({ world, index, onExplore }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0b0f1a]/90 transition-all duration-300 hover:border-sky-400/40 hover:shadow-[0_12px_40px_rgba(56,189,248,0.12)]">
      {/* Preview Media Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#070a14]">
        {!imgError ? (
          <img
            src={world.previewImage}
            alt={`${world.title} 3D environment preview`}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center p-6 text-center"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${world.accentHex}33, #070a14 75%)`,
            }}
          >
            <Compass className="h-8 w-8 text-sky-400/80 mb-2" />
            <span className="font-display text-sm font-medium text-slate-300">
              {world.title}
            </span>
          </div>
        )}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-transparent to-black/20"
        />
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <p className="text-xs font-medium text-slate-400">
            0{index + 1}. {world.biome}
          </p>
          <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-white">
            {world.title}
          </h3>
          <p className="mt-1 text-xs font-medium text-sky-400">
            {world.subtitle}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            {world.shortDescription}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-4">
          <span className="text-xs font-mono tabular-nums text-slate-400">
            {world.hotspots.length} Hotspots
          </span>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onExplore(world)}
            className="group-hover:border-sky-400/60 group-hover:text-white"
          >
            <span>Explore</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </article>
  );
};
