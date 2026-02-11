/**
 * Realistic starfield generation
 * Creates a NASA-like star background using points
 */

import * as THREE from 'three';
import { fibonacciSphere } from '../utils/math';

export function createStarfield(
  scene: THREE.Scene,
  quality: 'low' | 'medium' | 'high'
): THREE.Points {
  // Create minimal starfield with very subtle, distant stars
  const starCount = quality === 'high' ? 3000 : quality === 'medium' ? 1500 : 800;
  const radius = 10000;

  // Generate star positions using Fibonacci sphere for even distribution
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const sizes = new Float32Array(starCount);

  const starPositions = fibonacciSphere(starCount, radius);

  for (let i = 0; i < starCount; i++) {
    const pos = starPositions[i];
    positions[i * 3] = pos.x;
    positions[i * 3 + 1] = pos.y;
    positions[i * 3 + 2] = pos.z;

    // Star color variation (realistic stellar colors)
    const temp = Math.random();
    if (temp < 0.1) {
      // Blue-white stars (hot)
      colors[i * 3] = 0.7 + Math.random() * 0.3;
      colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
      colors[i * 3 + 2] = 1.0;
    } else if (temp < 0.3) {
      // Red-orange stars (cool)
      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 0.4 + Math.random() * 0.3;
      colors[i * 3 + 2] = 0.2 + Math.random() * 0.2;
    } else {
      // White-yellow stars (most common) - very subtle
      colors[i * 3] = 0.6 + Math.random() * 0.2;
      colors[i * 3 + 1] = 0.6 + Math.random() * 0.2;
      colors[i * 3 + 2] = 0.6 + Math.random() * 0.2;
    }

    // Size variation (much smaller, more distant looking)
    const brightness = Math.random();
    sizes[i] = brightness < 0.9 ? 0.5 : brightness < 0.98 ? 1.0 : 1.5;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  // Shader material for realistic star rendering
  const material = new THREE.PointsMaterial({
    size: 0.8,
    vertexColors: true,
    transparent: true,
    opacity: 0.4,
    sizeAttenuation: false,
    blending: THREE.NormalBlending,
    depthWrite: false,
  });

  const starfield = new THREE.Points(geometry, material);
  scene.add(starfield);

  return starfield;
}

/**
 * Update starfield quality
 */
export function updateStarfieldQuality(
  scene: THREE.Scene,
  currentStarfield: THREE.Points,
  quality: 'low' | 'medium' | 'high'
): THREE.Points {
  scene.remove(currentStarfield);
  currentStarfield.geometry.dispose();
  (currentStarfield.material as THREE.Material).dispose();
  
  return createStarfield(scene, quality);
}
