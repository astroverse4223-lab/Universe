/**
 * Renderer configuration with physically-based settings
 */

import * as THREE from 'three';

export interface RendererConfig {
  antialias: boolean;
  anisotropy: number;
}

export function createRenderer(
  container: HTMLElement,
  config: RendererConfig
): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({
    antialias: config.antialias,
    powerPreference: 'high-performance',
  });

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Physical rendering settings
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.8;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // Enable shadows if needed (disabled for performance in space)
  renderer.shadowMap.enabled = false;

  container.appendChild(renderer.domElement);

  // Handle window resize
  window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
  });

  return renderer;
}

/**
 * Update renderer settings based on quality level
 */
export function updateRendererQuality(
  renderer: THREE.WebGLRenderer,
  quality: 'low' | 'medium' | 'high'
) {
  switch (quality) {
    case 'low':
      renderer.setPixelRatio(1);
      renderer.toneMappingExposure = 0.9;
      break;
    case 'medium':
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.toneMappingExposure = 1.0;
      break;
    case 'high':
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMappingExposure = 1.0;
      break;
  }
}
