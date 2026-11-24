import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { PageRoute, WorldConfig, WorldId } from './types';
import { WORLDS_DATA } from './utils/worldsData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { IntroLoader } from './components/Loader';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { Gallery } from './pages/Gallery';
import { About } from './pages/About';

function parseHashRoute(): { route: PageRoute; worldId: WorldId | null } {
  if (typeof window === 'undefined') return { route: 'home', worldId: null };
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (!hash || hash === 'home') return { route: 'home', worldId: null };
  if (hash === 'gallery') return { route: 'gallery', worldId: null };
  if (hash === 'about') return { route: 'about', worldId: null };
  if (hash.startsWith('explore')) {
    const parts = hash.split('/');
    const maybeWorld = parts[1] as WorldId | undefined;
    const isValidWorld = WORLDS_DATA.some((w) => w.id === maybeWorld);
    return {
      route: 'explore',
      worldId: isValidWorld && maybeWorld ? maybeWorld : null,
    };
  }
  return { route: 'home', worldId: null };
}

export default function App() {
  const initial = parseHashRoute();
  const [introDone, setIntroDone] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(initial.route);
  const [activeWorldId, setActiveWorldId] = useState<WorldId | null>(initial.worldId);

  const syncHash = useCallback((route: PageRoute, worldId: WorldId | null) => {
    let targetHash = '#/';
    if (route === 'explore') {
      targetHash = worldId ? `#/explore/${worldId}` : '#/explore';
    } else if (route !== 'home') {
      targetHash = `#/${route}`;
    }
    if (window.location.hash !== targetHash) {
      window.history.pushState(null, '', targetHash);
    }
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      const parsed = parseHashRoute();
      setCurrentRoute(parsed.route);
      setActiveWorldId(parsed.worldId);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleNavigate = useCallback(
    (route: PageRoute) => {
      setCurrentRoute(route);
      if (route !== 'explore') {
        setActiveWorldId(null);
        syncHash(route, null);
      } else {
        setActiveWorldId(null);
        syncHash('explore', null);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [syncHash]
  );

  const handleSelectWorld = useCallback(
    (worldId: WorldId | null) => {
      setCurrentRoute('explore');
      setActiveWorldId(worldId);
      syncHash('explore', worldId);
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    },
    [syncHash]
  );

  const handleLaunchWorld = useCallback(
    (world: WorldConfig) => {
      handleSelectWorld(world.id);
    },
    [handleSelectWorld]
  );

  const isInWorldExplorer = currentRoute === 'explore' && activeWorldId !== null;

  return (
    <div className="min-h-screen bg-[#05060a] text-slate-100 flex flex-col">
      <AnimatePresence>
        {!introDone && <IntroLoader onComplete={() => setIntroDone(true)} />}
      </AnimatePresence>

      <Navbar
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        onGetStarted={() => handleNavigate('explore')}
      />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentRoute}-${activeWorldId ?? 'root'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            {currentRoute === 'home' && (
              <Home
                onNavigate={handleNavigate}
                onLaunchWorld={handleLaunchWorld}
              />
            )}
            {currentRoute === 'explore' && (
              <Explore
                activeWorldId={activeWorldId}
                onSelectWorld={handleSelectWorld}
              />
            )}
            {currentRoute === 'gallery' && <Gallery />}
            {currentRoute === 'about' && <About />}
          </motion.div>
        </AnimatePresence>
      </main>

      {!isInWorldExplorer && <Footer onNavigate={handleNavigate} />}
    </div>
  );
}
