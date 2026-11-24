import React, { useState } from 'react';
import { CheckCircle2, Code2, ExternalLink, Mail, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../components/Button';

const TECH_STACK = [
  { name: 'React 19 & TypeScript', role: 'Component Architecture & Type Safety' },
  { name: 'Three.js & React Three Fiber', role: 'Declarative WebGL Scene Graph' },
  { name: 'Drei & Procedural Geometry', role: 'Orbit Controls, Particles & Meshes' },
  { name: 'GSAP & Motion', role: 'Scroll Choreography & UI Transitions' },
  { name: 'Tailwind CSS v4', role: 'Responsive Cosmic Design System' },
  { name: 'Vite Build Pipeline', role: 'Lazy Chunk Splitting & Fast HMR' },
];

const CORE_FEATURES = [
  {
    title: '01. Five Distinct 3D Biomes',
    description:
      'From deep-space planetary orbits and bioluminescent ocean trenches to cybernetic skylines, enchanted groves, and kinetic non-Euclidean sculptures.',
  },
  {
    title: '02. Smooth Camera Choreography',
    description:
      'Frame-rate independent exponential damping glides between viewpoints and hotspots while yielding immediately to manual mouse or touch orbit.',
  },
  {
    title: '03. Procedural Material & Texture Synthesis',
    description:
      'Zero fragile external asset dependencies—planetary bands, planetary rings, cyber grids, and studio reflections are generated mathematically in code.',
  },
  {
    title: '04. Adaptive Device Performance',
    description:
      'Automatic detection of viewport size, reduced-motion preferences, and software WebGL fallback ensures responsive rendering across desktops, tablets, and phones.',
  },
];

export const About: React.FC = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderEmail.trim() || !message.trim()) return;
    setSubmitted(true);
  };

  const handleResetModal = () => {
    setContactOpen(false);
    setTimeout(() => {
      setSubmitted(false);
      setSenderName('');
      setSenderEmail('');
      setMessage('');
    }, 200);
  };

  return (
    <div className="min-h-screen bg-[#05060a] pt-24 pb-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Vision Header */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="border-b border-white/10 pb-14"
        >
          <p className="text-xs font-medium tracking-widest text-sky-400 uppercase">
            Project Vision
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl [text-wrap:balance]">
            Designing spatial universes directly inside the open web.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
            HoloSpace is an experimental interactive web experience that explores the possibilities of 3D graphics and immersive browser-based environments. Rather than requiring specialized VR headsets or native downloads, every world and sculpture renders live through hardware-accelerated WebGL.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="https://github.com/holospace-3d/holospace"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-white/15 bg-[#0b0f1a] px-5 py-2.5 text-sm font-display font-medium text-white hover:border-sky-400/60 transition-colors whitespace-nowrap"
            >
              <Code2 className="h-4 w-4 text-sky-400" />
              <span>GitHub Repository</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
            </a>

            <Button variant="primary" size="md" onClick={() => setContactOpen(true)}>
              <Mail className="h-4 w-4" />
              <span>Contact Studio</span>
            </Button>
          </div>
        </motion.section>

        {/* Core Features */}
        <section className="border-b border-white/10 py-14">
          <h2 className="font-display text-2xl font-semibold text-white">
            Core Spatial Features
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {CORE_FEATURES.map((feat) => (
              <div
                key={feat.title}
                className="rounded-xl border border-white/10 bg-[#0b0f1a]/80 p-6"
              >
                <h3 className="font-display text-base font-semibold text-white">
                  {feat.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Stack */}
        <section className="border-b border-white/10 py-14">
          <h2 className="font-display text-2xl font-semibold text-white">
            Technology Stack
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Built with modern TypeScript modularity, lazy-loaded 3D chunks, and disciplined WebGL resource cleanup.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TECH_STACK.map((tech) => (
              <div
                key={tech.name}
                className="rounded-xl border border-white/10 bg-[#0b0f1a]/60 p-5"
              >
                <p className="font-display text-sm font-semibold text-white">
                  {tech.name}
                </p>
                <p className="mt-1 text-xs text-slate-400">{tech.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Developer Information */}
        <section className="pt-14">
          <div className="rounded-xl border border-white/10 bg-[#0b0f1a]/90 p-6 sm:p-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium text-sky-400">
                Developer & Creative Engineering
              </p>
              <h2 className="mt-1.5 font-display text-xl font-semibold text-white">
                HoloSpace Creative Lab
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">
                Crafted as a showcase of real-time Three.js geometry, interactive spatial UX, and accessible responsive web architecture ready for modern browser deployment.
              </p>
            </div>
            <div className="shrink-0">
              <Button variant="secondary" onClick={() => setContactOpen(true)}>
                <span>Send Inquiry</span>
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Interactive Contact Modal */}
      <AnimatePresence>
        {contactOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4"
            onClick={handleResetModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-xl border border-white/15 bg-[#0b0f1a] p-6 shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-modal-title"
            >
              <div className="flex items-center justify-between">
                <h3
                  id="contact-modal-title"
                  className="font-display text-lg font-semibold text-white"
                >
                  Contact HoloSpace Studio
                </h3>
                <button
                  type="button"
                  onClick={handleResetModal}
                  aria-label="Close contact dialog"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {submitted ? (
                <div className="py-8 text-center">
                  <CheckCircle2 className="mx-auto h-10 w-10 text-sky-400" />
                  <p className="mt-4 font-display text-base font-semibold text-white">
                    Message Received
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    Thank you, {senderName}. Your inquiry has been logged for the HoloSpace creative team.
                  </p>
                  <Button
                    className="mt-6"
                    variant="primary"
                    size="sm"
                    onClick={handleResetModal}
                  >
                    Done
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-medium text-slate-300"
                    >
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Alex Rivera"
                      className="mt-1.5 w-full rounded-lg border border-white/15 bg-[#05060a] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-medium text-slate-300"
                    >
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="alex@studio.io"
                      className="mt-1.5 w-full rounded-lg border border-white/15 bg-[#05060a] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-medium text-slate-300"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share feedback, collaboration ideas, or spatial inquiries..."
                      className="mt-1.5 w-full rounded-lg border border-white/15 bg-[#05060a] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleResetModal}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" size="sm">
                      <Send className="h-3.5 w-3.5" />
                      <span>Send Message</span>
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
