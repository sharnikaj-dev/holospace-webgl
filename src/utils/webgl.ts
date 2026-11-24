import * as THREE from 'three';

let cachedSoftwareGl: boolean | null = null;

/**
 * Probes WebGL renderer string to detect software rasterizers (SwiftShader, llvmpipe, WARP)
 * so we can adapt pixel ratio, antialiasing, and shadows without changing scene content.
 */
export function detectSoftwareWebGL(): boolean {
  if (cachedSoftwareGl !== null) return cachedSoftwareGl;
  if (typeof document === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) {
      cachedSoftwareGl = true;
      return true;
    }
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    cachedSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    return cachedSoftwareGl;
  } catch {
    cachedSoftwareGl = false;
    return false;
  }
}

/**
 * Generates a banded procedural planetary albedo CanvasTexture in sRGB color space.
 */
export function createPlanetTexture(
  primaryHex: string,
  secondaryHex: string,
  highlightHex: string,
  bands = 14
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  for (let i = 0; i <= bands; i++) {
    const t = i / bands;
    if (i % 3 === 0) grad.addColorStop(t, primaryHex);
    else if (i % 3 === 1) grad.addColorStop(t, secondaryHex);
    else grad.addColorStop(t, highlightHex);
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add subtle atmospheric swirl bands
  for (let i = 0; i < 65; i++) {
    const y = Math.random() * canvas.height;
    const h = 2 + Math.random() * 10;
    ctx.fillStyle =
      i % 2 === 0 ? 'rgba(255, 255, 255, 0.08)' : 'rgba(5, 8, 22, 0.14)';
    ctx.fillRect(0, y, canvas.width, h);
  }

  // Subtle surface craters / storm ovals
  for (let i = 0; i < 18; i++) {
    const x = Math.random() * canvas.width;
    const y = 30 + Math.random() * (canvas.height - 60);
    const rx = 10 + Math.random() * 28;
    const ry = 4 + Math.random() * 10;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(180, 210, 255, 0.08)';
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Generates a concentric planetary ring radial gradient texture with fine gaps.
 */
export function createRingTexture(innerHex: string, outerHex: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
  grad.addColorStop(0.0, 'rgba(0,0,0,0)');
  grad.addColorStop(0.15, innerHex);
  grad.addColorStop(0.38, 'rgba(255,255,255,0.65)');
  grad.addColorStop(0.45, 'rgba(0,0,0,0.08)');
  grad.addColorStop(0.55, outerHex);
  grad.addColorStop(0.82, innerHex);
  grad.addColorStop(1.0, 'rgba(0,0,0,0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Fine concentric Cassini-style divisions
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  for (let x = 80; x < 440; x += 22) {
    ctx.fillRect(x, 0, 2 + (x % 3), canvas.height);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Generates a crisp futuristic cyber-grid floor texture for Neon City & Abstract Dimension.
 */
export function createCyberGridTexture(
  bgHex = '#050712',
  lineHex = '#38bdf8',
  accentHex = '#9333ea'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = bgHex;
  ctx.fillRect(0, 0, 512, 512);

  // Minor grid
  ctx.strokeStyle = lineHex;
  ctx.globalAlpha = 0.16;
  ctx.lineWidth = 1;
  const step = 32;
  for (let i = 0; i <= 512; i += step) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }

  // Major glowing grid
  ctx.strokeStyle = accentHex;
  ctx.globalAlpha = 0.42;
  ctx.lineWidth = 2;
  for (let i = 0; i <= 512; i += 128) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(18, 18);
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Generates a soft radial contact shadow texture so grounded 3D structures never appear unanchored.
 */
export function createContactShadowTexture(color = 'rgba(0, 0, 0, 0.72)'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 124);
  grad.addColorStop(0, color);
  grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.25)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
