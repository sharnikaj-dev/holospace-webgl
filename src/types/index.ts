export type PageRoute = 'home' | 'explore' | 'gallery' | 'about';

export type WorldId =
  | 'galaxy-zero'
  | 'aqua-realm'
  | 'neon-city'
  | 'fantasy-forest'
  | 'abstract-dimension';

export interface HotspotData {
  id: string;
  title: string;
  category: string;
  description: string;
  coordinates: string;
  metrics: {
    label: string;
    value: string;
  }[];
  position: [number, number, number];
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  accentColor: string;
}

export interface CameraPreset {
  id: string;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
}

export interface WorldConfig {
  id: WorldId;
  title: string;
  subtitle: string;
  biome: string;
  shortDescription: string;
  fullDescription: string;
  previewImage: string;
  accentHex: string;
  secondaryHex: string;
  atmosphereColor: string;
  defaultCamera: {
    position: [number, number, number];
    target: [number, number, number];
  };
  presets: CameraPreset[];
  hotspots: HotspotData[];
}

export type GalleryCategory = 'All' | 'Space' | 'Sculpture' | 'Geometry' | 'Architecture';

export type GalleryFinish = 'chrome' | 'violet' | 'cyan';

export interface GalleryModelConfig {
  id: string;
  title: string;
  category: Exclude<GalleryCategory, 'All'>;
  subtitle: string;
  description: string;
  dimensions: string;
  composition: string;
  polyComplexity: string;
  defaultFinish: GalleryFinish;
}
