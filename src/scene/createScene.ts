/**
 * Scene creation and camera setup
 */

import * as THREE from 'three';

export interface SceneObjects {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
}

export function createScene(container: HTMLElement): SceneObjects {
  const scene = new THREE.Scene();
  scene.fog = null; // No fog in space
  // Background set to null - will use Milky Way skybox instead
  scene.background = null;

  // Create camera
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    50000
  );
  
  // Start position: above solar system looking down
  camera.position.set(0, 50, 150);
  camera.lookAt(0, 0, 0);

  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
  });

  return { scene, camera };
}
