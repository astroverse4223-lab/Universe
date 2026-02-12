/**
 * Realistic starfield using Milky Way texture
 * Creates a NASA-like star background using real space photography
 */

import * as THREE from 'three';

export function createStarfield(
  scene: THREE.Scene,
  quality: 'low' | 'medium' | 'high'
): THREE.Mesh {
  const radius = 10000;

  // Create sphere geometry for skybox
  const geometry = new THREE.SphereGeometry(radius, 64, 64);

  // Load Milky Way texture
  const textureLoader = new THREE.TextureLoader();
  const milkyWayTexture = textureLoader.load('/textures/milky_way.jpg');
  
  milkyWayTexture.colorSpace = THREE.SRGBColorSpace;
  milkyWayTexture.mapping = THREE.EquirectangularReflectionMapping;

  // Create material with space texture
  const material = new THREE.MeshBasicMaterial({
    map: milkyWayTexture,
    side: THREE.BackSide, // Render on inside of sphere
    transparent: false,
    fog: false,
  });

  const starfield = new THREE.Mesh(geometry, material);
  scene.add(starfield);

  return starfield;
}

/**
 * Update starfield quality
 */
export function updateStarfieldQuality(
  scene: THREE.Scene,
  currentStarfield: THREE.Mesh,
  quality: 'low' | 'medium' | 'high'
): THREE.Mesh {
  scene.remove(currentStarfield);
  currentStarfield.geometry.dispose();
  (currentStarfield.material as THREE.Material).dispose();
  
  return createStarfield(scene, quality);
}
