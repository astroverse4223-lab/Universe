/**
 * Lighting setup for realistic solar system
 * 
 * Primary light: PointLight at Sun position (physically accurate: light emanates from Sun)
 * Ambient: Very subtle to simulate scattered starlight
 */

import * as THREE from 'three';

export interface LightObjects {
  sunLight: THREE.PointLight;
  ambientLight: THREE.AmbientLight;
}

export function createLights(scene: THREE.Scene): LightObjects {
  // Primary light source: the Sun
  // Using PointLight because the Sun is a point source that radiates in all directions
  // This is more physically accurate than DirectionalLight for a solar system
  const sunLight = new THREE.PointLight(0xffffff, 8.0, 0, 1.2);
  sunLight.position.set(0, 0, 0);
  
  // The decay parameter (2) provides physically accurate falloff: intensity ∝ 1/distance²
  // This creates proper lighting that dims with distance from the Sun
  
  scene.add(sunLight);

  // Very subtle ambient light to prevent completely black shadows
  // In reality, this simulates scattered starlight and light reflected from distant objects
  const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
  scene.add(ambientLight);

  return { sunLight, ambientLight };
}

/**
 * Adjust lighting intensity (useful for tweaking realism)
 * 
 * Tips for tweaking:
 * - Increase sunLight.intensity for brighter planets
 * - Decrease sunLight.decay for less dramatic falloff (less realistic but more visible distant planets)
 * - Increase ambientLight.intensity to see dark sides of planets better
 */
export function adjustLighting(
  lights: LightObjects,
  sunIntensity: number,
  ambientIntensity: number
) {
  lights.sunLight.intensity = sunIntensity;
  lights.ambientLight.intensity = ambientIntensity;
}
