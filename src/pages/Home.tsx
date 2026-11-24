import React, { Suspense, lazy, useEffect, useRef } from 'react';
import { ArrowRight, Compass, Layers, Orbit } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';
import type { PageRoute, WorldConfig } from '../types';
import { WORLDS_DATA } from '../utils/worldsData';
import { Button } from '../components/Button';
import { SceneLoader } from '../components/Loader';
import { WorldCard } from '../components/WorldCard';
import { useDevicePerformance } from '../hooks/useDevicePerformance';

gsap.registerPlugin(ScrollTrigger);

const HeroScene = lazy(() =>
  import('../scenes/HeroScene').then((m) => ({ default: m.HeroScene }))
);

interface HomeProps {
  onNavigate: (route: PageRoute) => void;
  onLaunchWorld: (world: WorldConfig) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, onLaunchWorld }) => {
  const sectionsRef = useRef<HTMLDivElement>(null);
  const { isReducedMotion } = useDevicePerformance();

  useEffect(() => {
    if (isReducedMotion || !sectionsRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.reveal-block', {
        y: 28,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.reveal-block',
          start: 'top 86%',
          once: true,
        },
      });
    }, sectionsRef);

    return () => ctx.revert();
  }, [isReducedMotion]);

  return (
    <div ref={sectionsRef} className="relative bg-[#05060a]">
      {/* Full-Screen Hero Section */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
        {/* Interactive 3D Background Canvas */}
        <div className="absolute inset-0 z-0">
          <Suspense fallback={<SceneLoader label="Loading cosmic core" />}>
            <HeroScene />
          </Suspense>
          {/* Contrast Scrim for Left Typography */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#05060a] via-[#05060a]/75 to-transparent lg:w-3/4"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#05060a] to-transparent"
          />
        </div>

        {/* Hero Foreground Content */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <p className="text-xs font-medium tracking-widest text-sky-400 uppercase">
              Interactive WebGL Universe
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.06] [text-wrap:balance]">
              EXPLORE BEYOND THE SCREEN.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Enter a universe where imagination meets interactive reality.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                variant="primary"
                onClick={() => onLaunchWorld(WORLDS_DATA[0])}
              >
                <span>START EXPLORING</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => onNavigate('explore')}
              >
                <span>DISCOVER WORLDS</span>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400">
              <span>5 Distinct 3D Environments</span>
              <span aria-hidden="true">·</span>
              <span>Interactive Spatial Hotspots</span>
              <span aria-hidden="true">·</span>
              <span>No VR Hardware Required</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Capabilities Strip */}
      <section className="border-t border-white/10 bg-[#070912] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Engineered for real-time spatial discovery
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
              Every environment in HoloSpace runs natively in your browser with adaptive geometry, dynamic lighting, and tactile camera choreography.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="reveal-block rounded-xl border border-white/10 bg-[#0b0f1a]/80 p-6">
              <Orbit className="h-6 w-6 text-sky-400" />
              <h3 className="mt-4 font-display text-lg font-semibold text-white">
                01. Free-Orbit Exploration
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Rotate, pan, and zoom seamlessly across each 3D environment using mouse, trackpad, or touch gestures with smooth inertial damping.
              </p>
            </div>

            <div className="reveal-block rounded-xl border border-white/10 bg-[#0b0f1a]/80 p-6">
              <Compass className="h-6 w-6 text-violet-400" />
              <h3 className="mt-4 font-display text-lg font-semibold text-white">
                02. Interactive Hotspots
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Select luminous nodes or click 3D structures directly to glide the camera into focused inspection angles and read spatial telemetry.
              </p>
            </div>

            <div className="reveal-block rounded-xl border border-white/10 bg-[#0b0f1a]/80 p-6">
              <Layers className="h-6 w-6 text-sky-400" />
              <h3 className="mt-4 font-display text-lg font-semibold text-white">
                03. Procedural 3D Gallery
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Inspect curated mathematical sculptures, orbital instruments, and futuristic monoliths with switchable metallic finishes and fullscreen view.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Worlds Preview */}
      <section className="border-t border-white/10 bg-[#05060a] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Five Worlds Ready to Enter
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Select any destination below to launch directly into its live 3D environment.
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => onNavigate('explore')}>
              <span>View All Worlds</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {WORLDS_DATA.slice(0, 3).map((world, idx) => (
              <WorldCard
                key={world.id}
                world={world}
                index={idx}
                onExplore={onLaunchWorld}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
