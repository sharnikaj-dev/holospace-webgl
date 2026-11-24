import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { PageRoute } from '../types';
import { Button } from './Button';

interface NavbarProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  onGetStarted: () => void;
}

const NAV_ITEMS: { route: PageRoute; label: string }[] = [
  { route: 'home', label: 'Home' },
  { route: 'explore', label: 'Explore Worlds' },
  { route: 'gallery', label: '3D Gallery' },
  { route: 'about', label: 'About' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  onGetStarted,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (route: PageRoute) => {
    setMobileMenuOpen(false);
    onNavigate(route);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-white/10 bg-[#05060a]/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single-line Brand Mark */}
        <button
          type="button"
          onClick={() => handleLinkClick('home')}
          className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400 rounded-md"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            aria-hidden="true"
            className="shrink-0"
          >
            <circle
              cx="14"
              cy="14"
              r="11.5"
              stroke="url(#holoLogoGrad)"
              strokeWidth="1.5"
            />
            <ellipse
              cx="14"
              cy="14"
              rx="12.5"
              ry="4.8"
              transform="rotate(-24 14 14)"
              stroke="#38BDF8"
              strokeWidth="1.4"
            />
            <circle cx="14" cy="14" r="3.4" fill="url(#holoLogoGrad)" />
            <defs>
              <linearGradient
                id="holoLogoGrad"
                x1="2"
                y1="2"
                x2="26"
                y2="26"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#8B5CF6" />
                <stop offset="1" stopColor="#38BDF8" />
              </linearGradient>
            </defs>
          </svg>
          <span className="font-display text-lg font-semibold tracking-tight text-white">
            HoloSpace
          </span>
        </button>

        {/* Zone 2: 4 single-line Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => handleLinkClick(item.route)}
                className={`relative py-1.5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400 rounded-sm ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-violet-500 to-sky-400 transition-transform duration-200 origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary CTA + Mobile Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:block">
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                setMobileMenuOpen(false);
                onGetStarted();
              }}
            >
              Get Started
            </Button>
          </div>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex md:hidden h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-[#0b0f1a] text-slate-200 hover:text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-400"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#070912] px-4 py-4">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  type="button"
                  onClick={() => handleLinkClick(item.route)}
                  className={`flex min-h-[44px] items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-violet-500/15 text-white border border-violet-500/30'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="mt-3 pt-3 border-t border-white/10">
              <Button
                className="w-full"
                variant="primary"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onGetStarted();
                }}
              >
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
