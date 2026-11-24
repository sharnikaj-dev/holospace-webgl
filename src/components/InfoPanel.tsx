import React from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { HotspotData } from '../types';

interface InfoPanelProps {
  hotspot: HotspotData | null;
  totalHotspots: number;
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({
  hotspot,
  totalHotspots,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}) => {
  return (
    <AnimatePresence>
      {hotspot && (
        <motion.aside
          key={hotspot.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Object inspection panel"
          className="fixed right-4 top-20 z-30 w-[calc(100vw-2rem)] max-w-sm rounded-xl border border-white/15 bg-[#0b0f1a]/92 p-5 shadow-2xl"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-sky-400">
                {hotspot.category} · {hotspot.coordinates}
              </p>
              <h3 className="mt-1 font-display text-lg font-semibold text-white">
                {hotspot.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close object details"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            {hotspot.description}
          </p>

          <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
            {hotspot.metrics.map((m) => (
              <div key={m.label}>
                <dt className="text-[11px] text-slate-400">{m.label}</dt>
                <dd className="mt-0.5 font-mono text-xs font-medium tabular-nums text-white">
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3">
            <span className="font-mono text-xs tabular-nums text-slate-400">
              Node {currentIndex + 1} / {totalHotspots}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onPrev}
                aria-label="Previous hotspot"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-200 hover:border-sky-400/50 hover:text-white cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onNext}
                aria-label="Next hotspot"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-200 hover:border-sky-400/50 hover:text-white cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
