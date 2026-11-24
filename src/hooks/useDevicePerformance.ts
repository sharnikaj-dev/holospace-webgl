import { useEffect, useState } from 'react';
import { detectSoftwareWebGL } from '../utils/webgl';

export interface DevicePerformanceProfile {
  isMobile: boolean;
  isReducedMotion: boolean;
  isSoftwareGl: boolean;
  dpr: number;
  particleScale: number;
  enableShadows: boolean;
}

export function useDevicePerformance(): DevicePerformanceProfile {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    window.addEventListener('resize', handleResize);
    mediaQuery.addEventListener('change', handleMotionChange);
    return () => {
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  const isSoftwareGl = detectSoftwareWebGL();
  const rawDpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  const dpr = isSoftwareGl ? 1 : isMobile ? Math.min(rawDpr, 1.5) : Math.min(rawDpr, 2);
  const particleScale = isMobile ? 0.5 : 1;
  const enableShadows = !isSoftwareGl && !isMobile;

  return {
    isMobile,
    isReducedMotion,
    isSoftwareGl,
    dpr,
    particleScale,
    enableShadows,
  };
}
