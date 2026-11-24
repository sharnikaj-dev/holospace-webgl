import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface IntroLoaderProps {
  onComplete: () => void;
}

export const IntroLoader: React.FC<IntroLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 950;
    let frameId = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (elapsed < duration) {
        frameId = requestAnimationFrame(tick);
      } else {
        setTimeout(onComplete, 180);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05060a] px-6 text-center"
    >
      <div className="relative flex flex-col items-center">
        {/* Orbital Geometric Emblem */}
        <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-violet-500/40"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-2 rounded-full border border-sky-400/50 border-t-transparent"
          />
          <div className="h-4 w-4 rounded-full bg-gradient-to-tr from-violet-500 to-sky-400 shadow-[0_0_24px_rgba(56,189,248,0.8)]" />
        </div>

        <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          HoloSpace
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Explore Beyond the Screen
        </p>

        {/* Progress Bar */}
        <div className="mt-8 w-56 overflow-hidden rounded-full bg-white/10 h-1">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-sky-400 transition-[width] duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 font-mono tabular-nums">
          <span>{progress}%</span>
          <button
            type="button"
            onClick={onComplete}
            className="text-slate-400 hover:text-white underline underline-offset-4 cursor-pointer"
          >
            Enter Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

interface SceneLoaderProps {
  label?: string;
}

export const SceneLoader: React.FC<SceneLoaderProps> = ({
  label = 'Initializing 3D environment',
}) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#05060a] text-center p-6">
      <div className="relative mb-5 h-12 w-12">
        <div className="absolute inset-0 rounded-full border-2 border-violet-500/25" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-sky-400" />
      </div>
      <p className="font-display text-sm font-medium text-slate-200">{label}</p>
      <p className="mt-1 text-xs text-slate-500">Compiling spatial geometry & shaders</p>
    </div>
  );
};
