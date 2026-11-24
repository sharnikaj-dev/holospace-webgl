import type { GalleryModelConfig, WorldConfig } from '../types';

export const WORLDS_DATA: WorldConfig[] = [
  {
    id: 'galaxy-zero',
    title: 'GALAXY ZERO',
    subtitle: 'Deep Space Orbital Sector',
    biome: 'Deep Space · 4 Interactive Nodes',
    shortDescription:
      'Orbit a ringed gas giant amidst swirling nebula clouds, an active asteroid belt, and a deep-space relay station.',
    fullDescription:
      'Chart an uncharted binary system where crystalline asteroid belts drift around Aetheris Prime, illuminated by the nearby Vela pulsar core and monitored by an autonomous orbital relay.',
    previewImage: '/src/assets/images/world_galaxy_zero_1795511775153.jpg',
    accentHex: '#8b5cf6',
    secondaryHex: '#38bdf8',
    atmosphereColor: '#04050c',
    defaultCamera: {
      position: [0, 4.2, 12.5],
      target: [0, 0, 0],
    },
    presets: [
      { id: 'overview', label: 'System Overview', position: [0, 4.2, 12.5], target: [0, 0, 0] },
      { id: 'planet', label: 'Aetheris Ring', position: [-3.5, 2.2, 6.2], target: [0, 0, 0] },
      { id: 'station', label: 'Relay Dock', position: [6.8, 2.6, 4.2], target: [4.2, 1.2, -1.5] },
    ],
    hotspots: [
      {
        id: 'aetheris-prime',
        title: 'Aetheris Prime',
        category: 'Exoplanet Core',
        description:
          'A hyper-dense indigo gas giant encircled by silicate ice rings and sustained by upper-atmosphere ionized storms.',
        coordinates: 'RA 04h 18m · DEC -12°',
        metrics: [
          { label: 'Equatorial Radius', value: '68,400 km' },
          { label: 'Orbital Velocity', value: '18.4 km/s' },
          { label: 'Ring Tilt', value: '22.5 deg' },
        ],
        position: [0, 2.55, 0],
        cameraPosition: [2.2, 2.8, 6.4],
        cameraTarget: [0, 0, 0],
        accentColor: '#38bdf8',
      },
      {
        id: 'orbital-relay',
        title: 'Helios Orbital Relay',
        category: 'Deep Space Structure',
        description:
          'Multi-array telemetry station anchored in Lagrangian orbit, harvesting solar radiation with twin photovoltaic wings.',
        coordinates: 'SEC-04 · L2 POINT',
        metrics: [
          { label: 'Array Span', value: '142 m' },
          { label: 'Core Output', value: '4.8 GW' },
          { label: 'Signal Delay', value: '0.42 s' },
        ],
        position: [4.2, 1.85, -1.5],
        cameraPosition: [6.4, 2.4, 1.8],
        cameraTarget: [4.2, 1.1, -1.5],
        accentColor: '#a78bfa',
      },
      {
        id: 'cryo-belt',
        title: 'Cryo-Silicate Belt',
        category: 'Asteroid Field',
        description:
          'Over one hundred tumbling metallic and icy planetoids locked in gravitational resonance around the central gravity well.',
        coordinates: 'BELT-A · 142 BODIES',
        metrics: [
          { label: 'Mean Density', value: '3.1 g/cm3' },
          { label: 'Belt Width', value: '14,200 km' },
          { label: 'Albedo Index', value: '0.64' },
        ],
        position: [-5.2, 0.4, 2.6],
        cameraPosition: [-8.2, 3.0, 6.4],
        cameraTarget: [-3.5, 0, 1.8],
        accentColor: '#60a5fa',
      },
      {
        id: 'vela-pulsar',
        title: 'Vela Pulsar Beacon',
        category: 'Stellar Remnant',
        description:
          'A rapidly rotating magnetized companion star emitting dual violet plasma jets across the outer nebula boundary.',
        coordinates: 'PSR J0835-4510',
        metrics: [
          { label: 'Spin Period', value: '89 ms' },
          { label: 'Surface Temp', value: '62,000 K' },
          { label: 'Flux Peak', value: '9.4 TeV' },
        ],
        position: [-5.8, 3.2, -5.2],
        cameraPosition: [-3.2, 3.8, -1.6],
        cameraTarget: [-5.8, 2.5, -5.2],
        accentColor: '#c084fc',
      },
    ],
  },
  {
    id: 'aqua-realm',
    title: 'AQUA REALM',
    subtitle: 'Bioluminescent Abyssal Sanctuary',
    biome: 'Deep Ocean · 4 Interactive Nodes',
    shortDescription:
      'Descend beneath volumetric sunbeams into a twilight reef of glowing coral spires, drifting jellyfish, and rising bubble streams.',
    fullDescription:
      'Explore an oceanic trench lit solely by refracted surface shafts and living bioluminescence. Inspect pelagic organisms, hydrothermal vents, and a submerged acoustic beacon.',
    previewImage: '/src/assets/images/world_aqua_realm_1795511775753.jpg',
    accentHex: '#06b6d4',
    secondaryHex: '#3b82f6',
    atmosphereColor: '#021020',
    defaultCamera: {
      position: [0, 3.2, 11.2],
      target: [0, 1.2, 0],
    },
    presets: [
      { id: 'overview', label: 'Reef Vista', position: [0, 3.2, 11.2], target: [0, 1.2, 0] },
      { id: 'coral', label: 'Coral Spire', position: [-2.8, 2.4, 5.4], target: [0, 1.8, 0] },
      { id: 'beacon', label: 'Abyssal Pod', position: [5.5, 1.8, 5.5], target: [3.4, 0.8, -1.2] },
    ],
    hotspots: [
      {
        id: 'coral-spire',
        title: 'Luminous Coral Spire',
        category: 'Bioluminescent Reef',
        description:
          'A towering mineral reef structure colonized by cyan photobacteria that pulse gently with shifting ocean currents.',
        coordinates: 'DEPTH 410m · REEF CORE',
        metrics: [
          { label: 'Spire Height', value: '18.6 m' },
          { label: 'Luminance', value: '485 nm' },
          { label: 'Water Temp', value: '6.4 °C' },
        ],
        position: [0, 3.5, 0],
        cameraPosition: [2.8, 3.4, 5.2],
        cameraTarget: [0, 2.0, 0],
        accentColor: '#22d3ee',
      },
      {
        id: 'pelagic-jelly',
        title: 'Pelagic Moon Jelly',
        category: 'Marine Organism',
        description:
          'Translucent deep-water medusa propelled by rhythmic bell contractions and trailing bioluminescent filaments.',
        coordinates: 'DRIFT ZONE · 380m',
        metrics: [
          { label: 'Bell Diameter', value: '2.4 m' },
          { label: 'Pulse Cycle', value: '0.45 Hz' },
          { label: 'Transparency', value: '88%' },
        ],
        position: [-3.2, 3.8, 1.4],
        cameraPosition: [-1.2, 4.2, 5.0],
        cameraTarget: [-3.2, 3.1, 1.4],
        accentColor: '#38bdf8',
      },
      {
        id: 'abyssal-beacon',
        title: 'Bathysphere Node',
        category: 'Research Vessel',
        description:
          'Autonomous deep-sea acoustic observatory anchored to the basalt floor, mapping current vectors and sonar echoes.',
        coordinates: 'STATION AQ-07',
        metrics: [
          { label: 'Hull Rating', value: '120 MPa' },
          { label: 'Sonar Range', value: '12.5 km' },
          { label: 'Current Flow', value: '1.2 m/s' },
        ],
        position: [3.4, 1.8, -1.2],
        cameraPosition: [5.8, 2.3, 2.4],
        cameraTarget: [3.4, 1.0, -1.2],
        accentColor: '#818cf8',
      },
      {
        id: 'thermal-vent',
        title: 'Hydrothermal Fissure',
        category: 'Geological Vent',
        description:
          'Mineral-rich seafloor chimney releasing superheated plumes and dense trails of rising micro-bubbles.',
        coordinates: 'TRENCH FLOOR · 442m',
        metrics: [
          { label: 'Plume Velocity', value: '3.8 m/s' },
          { label: 'Vent Temp', value: '290 °C' },
          { label: 'Salinity', value: '36.2 PSU' },
        ],
        position: [-3.6, 1.2, -2.6],
        cameraPosition: [-1.6, 2.2, 2.0],
        cameraTarget: [-3.6, 0.7, -2.6],
        accentColor: '#2dd4bf',
      },
    ],
  },
  {
    id: 'neon-city',
    title: 'NEON CITY',
    subtitle: 'Cybernetic Vertical Metropolis',
    biome: 'Cyberpunk Skyline · 4 Interactive Nodes',
    shortDescription:
      'Navigate towering obsidian skyscrapers, elevated skybridges, autonomous hovercraft, and luminous atmospheric fog.',
    fullDescription:
      'A nocturnal megacity engineered around high-voltage light corridors and vertical transit spires. Inspect architectural monoliths, aerial drones, and quantum data obelisks.',
    previewImage: '/src/assets/images/world_neon_city_1795511776503.jpg',
    accentHex: '#a855f7',
    secondaryHex: '#06b6d4',
    atmosphereColor: '#070714',
    defaultCamera: {
      position: [8.5, 6.2, 13.5],
      target: [0, 2.5, 0],
    },
    presets: [
      { id: 'overview', label: 'Skyline Grid', position: [8.5, 6.2, 13.5], target: [0, 2.5, 0] },
      { id: 'nexus', label: 'Nexus Spire', position: [3.8, 4.8, 6.2], target: [0, 3.8, 0] },
      { id: 'street', label: 'Canyon Level', position: [0.5, 1.8, 9.2], target: [0, 2.2, 0] },
    ],
    hotspots: [
      {
        id: 'nexus-spire',
        title: 'Nexus Central Spire',
        category: 'Megastructure',
        description:
          'The city’s primary atmospheric relay tower crowned by rotating holographic containment rings and violet light fins.',
        coordinates: 'SECTOR 01 · CENTRAL AXIS',
        metrics: [
          { label: 'Tower Altitude', value: '840 m' },
          { label: 'Power Draw', value: '310 MW' },
          { label: 'Wind Shear', value: '42 km/h' },
        ],
        position: [0, 6.8, 0],
        cameraPosition: [4.2, 6.4, 6.2],
        cameraTarget: [0, 4.8, 0],
        accentColor: '#c084fc',
      },
      {
        id: 'skybridge',
        title: 'Hyper-Transit Skybridge',
        category: 'Elevated Corridor',
        description:
          'Suspended mag-lev conduit linking twin commercial citadels high above the fog-shrouded lower grid.',
        coordinates: 'LEVEL 42 · EAST SPAN',
        metrics: [
          { label: 'Bridge Span', value: '210 m' },
          { label: 'Transit Speed', value: '420 km/h' },
          { label: 'Deck Elevation', value: '185 m' },
        ],
        position: [2.4, 3.2, 1.5],
        cameraPosition: [5.4, 3.8, 5.8],
        cameraTarget: [2.2, 2.6, 1.2],
        accentColor: '#22d3ee',
      },
      {
        id: 'aerial-drone',
        title: 'Autonomous Patrol Craft',
        category: 'Aerial Vehicle',
        description:
          'Twin-thruster reconnaissance spinner cruising between skyscraper canyons along encrypted airspace lanes.',
        coordinates: 'FLIGHT LANE B-09',
        metrics: [
          { label: 'Cruise Velocity', value: '165 km/h' },
          { label: 'Thruster Temp', value: '910 K' },
          { label: 'Altitude', value: '140 m' },
        ],
        position: [-3.2, 3.8, 2.8],
        cameraPosition: [-0.8, 4.4, 6.6],
        cameraTarget: [-3.0, 3.2, 2.4],
        accentColor: '#38bdf8',
      },
      {
        id: 'data-obelisk',
        title: 'Quantum Data Obelisk',
        category: 'Information Monolith',
        description:
          'High-density optical server tower lined with vertical cyan waveguides pulsing with municipal routing traffic.',
        coordinates: 'DISTRICT 07 · WEST',
        metrics: [
          { label: 'Throughput', value: '880 Tbps' },
          { label: 'Core Nodes', value: '16,384' },
          { label: 'Cooling Loop', value: 'Cryo-N2' },
        ],
        position: [-4.2, 4.2, -2.4],
        cameraPosition: [-1.4, 4.6, 2.4],
        cameraTarget: [-4.2, 2.8, -2.4],
        accentColor: '#a855f7',
      },
    ],
  },
  {
    id: 'fantasy-forest',
    title: 'FANTASY FOREST',
    subtitle: 'Nocturnal Bioluminescent Grove',
    biome: 'Mystical Woods · 4 Interactive Nodes',
    shortDescription:
      'Step inside a twilight sanctuary of ancient glowing trees, resonant crystal monoliths, and drifting spirit wisps.',
    fullDescription:
      'A serene nocturnal clearing surrounded by towering elder flora, luminous mushroom colonies, and faceted arcane crystals radiating violet and cyan mist.',
    previewImage: '/src/assets/images/world_fantasy_forest_1795511777475.jpg',
    accentHex: '#2dd4bf',
    secondaryHex: '#a855f7',
    atmosphereColor: '#050b14',
    defaultCamera: {
      position: [0, 3.6, 11.8],
      target: [0, 1.5, 0],
    },
    presets: [
      { id: 'overview', label: 'Grove Clearing', position: [0, 3.6, 11.8], target: [0, 1.5, 0] },
      { id: 'crystals', label: 'Crystal Altar', position: [2.8, 2.2, 4.8], target: [0, 1.4, 0] },
      { id: 'canopy', label: 'Elder Canopy', position: [-4.2, 4.8, 6.0], target: [-2.8, 2.8, -1.4] },
    ],
    hotspots: [
      {
        id: 'sanctuary-runestone',
        title: 'Sanctuary Crystal Altar',
        category: 'Resonant Formation',
        description:
          'A cluster of faceted cyan and amethyst quartz pillars rising from an engraved stone ring at the heart of the glade.',
        coordinates: 'GLADE CENTER · 00m',
        metrics: [
          { label: 'Crystal Peak', value: '4.6 m' },
          { label: 'Harmonic Freq', value: '432 Hz' },
          { label: 'Aura Radius', value: '18 m' },
        ],
        position: [0, 2.8, 0],
        cameraPosition: [2.6, 2.6, 4.8],
        cameraTarget: [0, 1.5, 0],
        accentColor: '#2dd4bf',
      },
      {
        id: 'elder-tree',
        title: 'Elder Luminous Willow',
        category: 'Ancient Flora',
        description:
          'Centuries-old botanical giant whose twisted bark cradles glowing cyan foliage canopies above the mist.',
        coordinates: 'NORTH GROVE · +12m',
        metrics: [
          { label: 'Canopy Height', value: '24 m' },
          { label: 'Trunk Girth', value: '3.2 m' },
          { label: 'Pollen Drift', value: 'Active' },
        ],
        position: [-3.4, 4.2, -1.6],
        cameraPosition: [-0.8, 4.2, 3.8],
        cameraTarget: [-3.4, 2.8, -1.6],
        accentColor: '#38bdf8',
      },
      {
        id: 'spirit-wisp',
        title: 'Astral Spirit Wisp',
        category: 'Luminous Entity',
        description:
          'Orbiting concentration of ethereal light particles weaving silently around the outer fern and crystal clusters.',
        coordinates: 'EAST CLEARING · +6m',
        metrics: [
          { label: 'Orbit Speed', value: '1.4 rad/s' },
          { label: 'Trail Particles', value: '240' },
          { label: 'Spectrum', value: 'Cyan-Violet' },
        ],
        position: [3.2, 2.4, 1.4],
        cameraPosition: [5.4, 2.8, 4.8],
        cameraTarget: [3.2, 1.8, 1.4],
        accentColor: '#c084fc',
      },
      {
        id: 'mushroom-ring',
        title: 'Mycelial Lantern Ring',
        category: 'Fungal Colony',
        description:
          'Translucent bioluminescent caps thriving in the damp moss along the sanctuary perimeter.',
        coordinates: 'SOUTH MOSS · -4m',
        metrics: [
          { label: 'Cap Span', value: '0.85 m' },
          { label: 'Glow Peak', value: '505 nm' },
          { label: 'Humidity', value: '94%' },
        ],
        position: [3.5, 1.2, -2.5],
        cameraPosition: [5.2, 2.0, 1.4],
        cameraTarget: [3.5, 0.7, -2.5],
        accentColor: '#a78bfa',
      },
    ],
  },
  {
    id: 'abstract-dimension',
    title: 'ABSTRACT DIMENSION',
    subtitle: 'Kinetic Non-Euclidean Construct',
    biome: 'Experimental Space · 4 Interactive Nodes',
    shortDescription:
      'Witness iridescent chrome polyhedra, glass torus cores, and oscillating geometric wave fields in zero gravity.',
    fullDescription:
      'An experimental spatial laboratory of pure procedural form—interlocking gimbals, hyperbolic knots, and harmonic wave planes responding in continuous fluid symmetry.',
    previewImage: '/src/assets/images/world_abstract_dimension_1795511777299.jpg',
    accentHex: '#ec4899',
    secondaryHex: '#6366f1',
    atmosphereColor: '#06050f',
    defaultCamera: {
      position: [0, 3.4, 10.6],
      target: [0, 1.0, 0],
    },
    presets: [
      { id: 'overview', label: 'Kinetic Core', position: [0, 3.4, 10.6], target: [0, 1.0, 0] },
      { id: 'top', label: 'Zenith Symmetry', position: [0, 9.8, 3.2], target: [0, 1.0, 0] },
      { id: 'close', label: 'Refractive Knot', position: [3.4, 2.0, 4.6], target: [0, 1.4, 0] },
    ],
    hotspots: [
      {
        id: 'torus-core',
        title: 'Harmonic Torus Knot',
        category: 'Central Sculpture',
        description:
          'A continuous (3,5) mathematical knot rendered in high-gloss iridescent metal, warping light across every curve.',
        coordinates: 'ORIGIN (0, 1.5, 0)',
        metrics: [
          { label: 'Topology', value: 'p=3, q=5' },
          { label: 'Clearcoat', value: '1.0 IOR' },
          { label: 'Angular Vel', value: '0.35 rad/s' },
        ],
        position: [0, 3.0, 0],
        cameraPosition: [3.2, 2.4, 4.8],
        cameraTarget: [0, 1.5, 0],
        accentColor: '#e879f9',
      },
      {
        id: 'gimbal-array',
        title: 'Gyroscopic Gimbal Rings',
        category: 'Kinetic Frame',
        description:
          'Three counter-rotating anodized rings stabilizing the central core along orthogonal phase axes.',
        coordinates: 'PHASE AXIS XYZ',
        metrics: [
          { label: 'Outer Radius', value: '3.1 m' },
          { label: 'Precession', value: '12.4 deg/s' },
          { label: 'Mass Ratio', value: '1 : 1.618' },
        ],
        position: [-2.8, 2.2, 0.8],
        cameraPosition: [-5.4, 3.0, 4.6],
        cameraTarget: [0, 1.5, 0],
        accentColor: '#818cf8',
      },
      {
        id: 'poly-satellite',
        title: 'Faceted Icosa-Monolith',
        category: 'Orbital Polyhedron',
        description:
          'Sharp-edged metallic polyhedra orbiting in harmonic phase while emitting subtle violet rim highlights.',
        coordinates: 'ORBIT SHELL B',
        metrics: [
          { label: 'Facets', value: '20 Tris' },
          { label: 'Metalness', value: '0.94' },
          { label: 'Phase Offset', value: 'π / 3' },
        ],
        position: [3.4, 2.4, -1.6],
        cameraPosition: [5.6, 2.8, 2.2],
        cameraTarget: [3.2, 1.8, -1.4],
        accentColor: '#38bdf8',
      },
      {
        id: 'wave-plane',
        title: 'Resonance Field Matrix',
        category: 'Procedural Surface',
        description:
          'An undulating spatial grid driven by layered sine-wave interference beneath the levitating sculpture.',
        coordinates: 'BASE PLANE Y=-1.6',
        metrics: [
          { label: 'Grid Nodes', value: '2,500' },
          { label: 'Wave Amp', value: '0.38 m' },
          { label: 'Damping', value: '0.96' },
        ],
        position: [0, -0.6, 3.2],
        cameraPosition: [0, 2.0, 7.6],
        cameraTarget: [0, -0.8, 1.2],
        accentColor: '#a78bfa',
      },
    ],
  },
];

export const GALLERY_MODELS: GalleryModelConfig[] = [
  {
    id: 'chronos-astrolabe',
    title: 'Chronos Astrolabe',
    category: 'Space',
    subtitle: 'Tri-Axial Celestial Gyroscope',
    description:
      'A precision orbital instrument composed of three concentric counter-rotating gimbal rings enclosing a faceted sapphire energy core and floating alignment markers.',
    dimensions: '3.6m × 3.6m × 3.6m',
    composition: '9 Procedural Parts · Anisotropic Metal & Crystal',
    polyComplexity: '14,820 Tris',
    defaultFinish: 'chrome',
  },
  {
    id: 'hyperbolic-mobius',
    title: 'Hyperbolic Torus Knot',
    category: 'Sculpture',
    subtitle: 'Continuous (3,7) Topological Form',
    description:
      'An unbroken mathematical knot braided around an inner luminous filament, flanked by orbiting micro-spheres locked in harmonic phase.',
    dimensions: '3.2m × 3.2m × 2.4m',
    composition: '7 Procedural Parts · Clearcoat Iridescent Alloy',
    polyComplexity: '18,400 Tris',
    defaultFinish: 'violet',
  },
  {
    id: 'obsidian-megalith',
    title: 'Obsidian Spire Mk.IV',
    category: 'Architecture',
    subtitle: 'Monolithic Vertical Citadel',
    description:
      'A stepped futuristic tower combining chamfered obsidian buttresses, recessed cyan light conduits, and a suspended halo ring at its crown.',
    dimensions: '2.8m × 5.2m × 2.8m',
    composition: '11 Procedural Parts · Extruded Architectural Tiering',
    polyComplexity: '9,640 Tris',
    defaultFinish: 'cyan',
  },
  {
    id: 'geodesic-vortex',
    title: 'Geodesic Vortex Core',
    category: 'Geometry',
    subtitle: 'Dual-Shell Polyhedral Lattice',
    description:
      'An inner glowing icosahedral nucleus caged inside a precision wireframe polyhedral lattice and equatorial stabilizing arcs.',
    dimensions: '3.4m × 3.4m × 3.4m',
    composition: '8 Procedural Parts · Dual Wireframe & Solid Mesh',
    polyComplexity: '11,200 Tris',
    defaultFinish: 'cyan',
  },
  {
    id: 'pelagic-nautilus',
    title: 'Pelagic Nautilus Array',
    category: 'Sculpture',
    subtitle: 'Logarithmic Golden-Ratio Spiral',
    description:
      'Eighteen progressively scaled chambers arranged along a logarithmic spiral curve, celebrating natural marine geometry in brushed titanium.',
    dimensions: '3.8m × 3.0m × 2.2m',
    composition: '18 Instanced Chambers · Lathe & Tube Framing',
    polyComplexity: '16,100 Tris',
    defaultFinish: 'chrome',
  },
  {
    id: 'quantum-singularity',
    title: 'Quantum Singularity',
    category: 'Space',
    subtitle: 'Relativistic Accretion Model',
    description:
      'A pitch-black event horizon orb surrounded by dual tilted accretion rings, polar plasma cones, and orbiting photon particles.',
    dimensions: '4.4m × 3.6m × 4.4m',
    composition: '10 Procedural Parts · Additive Rim & Matte Core',
    polyComplexity: '15,360 Tris',
    defaultFinish: 'violet',
  },
];
