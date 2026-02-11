/**
 * Texture loading and management with fallbacks
 * 
 * This system loads textures from /public/textures/ with proper fallbacks
 * if textures are missing (see README for texture sources)
 */

import * as THREE from 'three';

export interface TextureSet {
  albedo?: THREE.Texture;
  normal?: THREE.Texture;
  roughness?: THREE.Texture;
  clouds?: THREE.Texture;
  specular?: THREE.Texture;
  emissive?: THREE.Texture;
  alpha?: THREE.Texture;
}

export class TextureManager {
  private loader: THREE.TextureLoader;
  private anisotropy: number;

  constructor(loadingManager: THREE.LoadingManager, renderer: THREE.WebGLRenderer) {
    this.loader = new THREE.TextureLoader(loadingManager);
    this.anisotropy = renderer.capabilities.getMaxAnisotropy();
  }

  /**
   * Load a single texture with fallback
   */
  async loadTexture(
    path: string,
    srgb: boolean = true,
    fallbackColor: number = 0x808080
  ): Promise<THREE.Texture> {
    return new Promise((resolve) => {
      this.loader.load(
        path,
        (texture) => {
          texture.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.LinearSRGBColorSpace;
          texture.anisotropy = this.anisotropy;
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          resolve(texture);
        },
        undefined,
        () => {
          console.warn(`Failed to load texture: ${path}, using fallback`);
          const fallback = this.createFallbackTexture(fallbackColor, srgb);
          resolve(fallback);
        }
      );
    });
  }

  /**
   * Create a simple colored fallback texture
   */
  private createFallbackTexture(color: number, srgb: boolean): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 2;
    const ctx = canvas.getContext('2d')!;
    
    const r = (color >> 16) & 255;
    const g = (color >> 8) & 255;
    const b = color & 255;
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(0, 0, 2, 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.LinearSRGBColorSpace;
    return texture;
  }

  /**
   * Load a complete texture set for a planet
   */
  async loadPlanetTextures(basePath: string, hasNormal: boolean = true, hasRoughness: boolean = false): Promise<TextureSet> {
    const textures: TextureSet = {};

    // Load albedo (required)
    textures.albedo = await this.loadTexture(`${basePath}_albedo.jpg`, true);

    // Load optional maps
    if (hasNormal) {
      textures.normal = await this.loadTexture(`${basePath}_normal.jpg`, false);
    }

    if (hasRoughness) {
      textures.roughness = await this.loadTexture(`${basePath}_roughness.jpg`, false);
    }

    return textures;
  }

  /**
   * Update anisotropy based on quality settings
   */
  setAnisotropy(level: number) {
    this.anisotropy = level;
  }
}

/**
 * Planet texture manifest
 * Update these paths when you add real textures (see README)
 */
export const TEXTURE_PATHS = {
  sun: '/textures/sun',
  mercury: '/textures/mercury',
  venus: '/textures/venus',
  earth: '/textures/earth',
  earthClouds: '/textures/earth_clouds.png',
  moon: '/textures/moon',
  mars: '/textures/mars',
  phobos: '/textures/phobos',
  deimos: '/textures/deimos',
  jupiter: '/textures/jupiter',
  io: '/textures/io',
  saturn: '/textures/saturn',
  saturnRings: '/textures/saturn_rings.png',
  titan: '/textures/titan',
  uranus: '/textures/uranus',
  neptune: '/textures/neptune',
  pluto: '/textures/pluto',
};

/**
 * Fallback colors for planets (used when textures are missing)
 */
export const FALLBACK_COLORS = {
  sun: 0xffaa00,
  mercury: 0x8c7853,
  venus: 0xe89b3c,
  earth: 0x2233ff,
  moon: 0x888888,
  mars: 0xcd5c5c,
  phobos: 0x6b5d52,
  deimos: 0x8b7a6a,
  jupiter: 0xc88b5a,
  io: 0xffcc33,
  saturn: 0xfad5a5,
  titan: 0xffa500,
  uranus: 0x4fd0e0,
  neptune: 0x4166f5,
  pluto: 0xc9a580,
};
