/**
 * Procedural texture generation for when real textures aren't available
 * Creates realistic-looking planet surfaces using canvas
 */

import * as THREE from 'three';

/**
 * Generate a procedural rocky texture (for Mercury, Moon, Mars)
 */
export function generateRockyTexture(
  baseColor: number,
  size: number = 512
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base color
  const r = (baseColor >> 16) & 255;
  const g = (baseColor >> 8) & 255;
  const b = baseColor & 255;

  // Fill with base color
  ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
  ctx.fillRect(0, 0, size, size);

  // Add noise/craters
  for (let i = 0; i < size * 2; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = Math.random() * 20 + 2;
    const darkness = Math.random() * 0.3;

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(0, 0, 0, ${darkness})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Generate a procedural gas giant texture (for Jupiter, Saturn, Uranus, Neptune)
 */
export function generateGasGiantTexture(
  color1: number,
  color2: number,
  size: number = 512
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const r1 = (color1 >> 16) & 255;
  const g1 = (color1 >> 8) & 255;
  const b1 = color1 & 255;

  const r2 = (color2 >> 16) & 255;
  const g2 = (color2 >> 8) & 255;
  const b2 = color2 & 255;

  // Create horizontal bands
  for (let y = 0; y < size; y++) {
    const t = Math.sin((y / size) * Math.PI * 8 + Math.random() * 0.2);
    const r = Math.floor(r1 + (r2 - r1) * t);
    const g = Math.floor(g1 + (g2 - g1) * t);
    const b = Math.floor(b1 + (b2 - b1) * t);

    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(0, y, size, 1);
  }

  // Add turbulence
  const imageData = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 30;
    imageData.data[i] = Math.max(0, Math.min(255, imageData.data[i] + noise));
    imageData.data[i + 1] = Math.max(0, Math.min(255, imageData.data[i + 1] + noise));
    imageData.data[i + 2] = Math.max(0, Math.min(255, imageData.data[i + 2] + noise));
  }
  ctx.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Generate Earth-like texture with continents and oceans
 */
export function generateEarthTexture(size: number = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Ocean base
  ctx.fillStyle = '#1a3a6e';
  ctx.fillRect(0, 0, size, size);

  // Add continents (simplified)
  ctx.fillStyle = '#3a8a4a';
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    const x = Math.random() * size;
    const y = Math.random() * size;
    const w = Math.random() * 100 + 50;
    const h = Math.random() * 80 + 40;
    ctx.ellipse(x, y, w, h, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  // Add clouds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  for (let i = 0; i < 30; i++) {
    ctx.beginPath();
    const x = Math.random() * size;
    const y = Math.random() * size;
    const w = Math.random() * 60 + 20;
    const h = Math.random() * 40 + 15;
    ctx.ellipse(x, y, w, h, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Generate Sun texture with surface detail
 */
export function generateSunTexture(size: number = 1024): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base gradient
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, '#ffdd44');
  gradient.addColorStop(0.8, '#ffaa22');
  gradient.addColorStop(1, '#ff6600');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Add solar granulation
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = Math.random() * 5 + 2;
    const brightness = Math.random() * 0.3;

    const spotGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    spotGradient.addColorStop(0, `rgba(255, 255, 100, ${brightness})`);
    spotGradient.addColorStop(1, 'rgba(255, 200, 50, 0)');

    ctx.fillStyle = spotGradient;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Generate Saturn rings texture with bands
 */
export function generateRingsTexture(size: number = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size / 4;
  const ctx = canvas.getContext('2d')!;

  // Create rings with varying opacity
  for (let x = 0; x < canvas.width; x++) {
    const t = x / canvas.width;
    const band = Math.sin(t * Math.PI * 20);
    const alpha = 0.6 + band * 0.4;
    
    // Color variations (ice particles)
    const brightness = 200 + Math.random() * 55;
    ctx.fillStyle = `rgba(${brightness}, ${brightness - 20}, ${brightness - 40}, ${alpha})`;
    ctx.fillRect(x, 0, 1, canvas.height);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}
