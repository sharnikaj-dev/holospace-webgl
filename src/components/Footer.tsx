import React from 'react';
import type { PageRoute } from '../types';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-white/10 bg-[#05060a]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="space-y-1">
          <p className="font-display text-base font-semibold tracking-tight text-white">
            HoloSpace
          </p>
          <p className="text-xs text-slate-400">
            Explore Beyond the Screen · Interactive WebGL Spatial Worlds
          </p>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-6">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => onNavigate('explore')}
            className="text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            Explore Worlds
          </button>
          <button
            type="button"
            onClick={() => onNavigate('gallery')}
            className="text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            3D Gallery
          </button>
          <button
            type="button"
            onClick={() => onNavigate('about')}
            className="text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            About
          </button>
        </nav>

        <p className="text-xs text-slate-500 whitespace-nowrap">
          © {new Date().getFullYear()} HoloSpace Studio
        </p>
      </div>
    </footer>
  );
};
