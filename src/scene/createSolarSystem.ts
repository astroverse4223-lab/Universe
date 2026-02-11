/**
 * Solar system creation with realistic planets, moons, and rings
 * 
 * This uses a scaled simulation model:
 * - Planet radii are scaled up for visibility
 * - Orbit radii are scaled to fit in explorable space
 * - Maintains correct order and approximate relative ratios
 */

import * as THREE from 'three';
import { TextureManager, TEXTURE_PATHS, FALLBACK_COLORS } from './textures';
import { auToSimulation, kmToSimulation } from '../utils/units';
import {
  generateRockyTexture,
  generateGasGiantTexture,
  generateEarthTexture,
  generateSunTexture,
  generateRingsTexture,
} from './proceduralTextures';

/**
 * Generate appropriate procedural texture based on planet name
 */
function generateProceduralTextureForPlanet(name: string, fallbackColor: number): THREE.Texture {
  switch (name) {
    case 'Earth':
      return generateEarthTexture(512);
    case 'Jupiter':
      return generateGasGiantTexture(0xc88b5a, 0xe8b882, 512);
    case 'Saturn':
      return generateGasGiantTexture(0xfad5a5, 0xf0c080, 512);
    case 'Uranus':
      return generateGasGiantTexture(0x4fd0e0, 0x5fe8f8, 512);
    case 'Neptune':
      return generateGasGiantTexture(0x4166f5, 0x5080ff, 512);
    case 'Mercury':
    case 'Moon':
    case 'Mars':
    case 'Phobos':
    case 'Deimos':
    case 'Pluto':
      return generateRockyTexture(fallbackColor, 512);
    case 'Io':
      return generateRockyTexture(0xffcc33, 512);
    case 'Titan':
      return generateGasGiantTexture(0xffa500, 0xffb833, 512);
    case 'Venus':
      return generateRockyTexture(0xe89b3c, 512);
    default:
      return generateRockyTexture(fallbackColor, 512);
  }
}

export interface PlanetData {
  name: string;
  radius: number; // simulation units
  orbitRadius: number; // simulation units
  orbitPeriod: number; // Earth years
  rotationPeriod: number; // Earth days
  tilt: number; // degrees
  description: string;
  realRadius: number; // km (for display)
  color: number; // fallback color
  mesh?: THREE.Mesh;
  position?: THREE.Vector3;
  moons?: PlanetData[];
  rings?: THREE.Mesh;
  orbitLine?: THREE.Line;
  label?: THREE.Sprite;
}

export interface SolarSystemObjects {
  sun: THREE.Mesh;
  sunCorona: THREE.Sprite;
  planets: PlanetData[];
  orbitLines: THREE.Line[];
  labels: THREE.Sprite[];
}

export async function createSolarSystem(
  scene: THREE.Scene,
  textureManager: TextureManager
): Promise<SolarSystemObjects> {
  
  // Define planetary data (using scaled values for simulation)
  const planetsData: PlanetData[] = [
    {
      name: 'Mercury',
      radius: kmToSimulation(2439.7),
      orbitRadius: auToSimulation(0.39),
      orbitPeriod: 0.24,
      rotationPeriod: 58.6,
      tilt: 0.03,
      realRadius: 2439.7,
      description: 'The smallest planet and closest to the Sun. Mercury has no atmosphere and experiences extreme temperature variations.',
      color: FALLBACK_COLORS.mercury,
    },
    {
      name: 'Venus',
      radius: kmToSimulation(6051.8),
      orbitRadius: auToSimulation(0.72),
      orbitPeriod: 0.62,
      rotationPeriod: -243, // Retrograde rotation
      tilt: 177.4,
      realRadius: 6051.8,
      description: 'The hottest planet with a thick atmosphere of carbon dioxide. Surface temperature reaches 465°C due to runaway greenhouse effect.',
      color: FALLBACK_COLORS.venus,
    },
    {
      name: 'Earth',
      radius: kmToSimulation(6371),
      orbitRadius: auToSimulation(1.0),
      orbitPeriod: 1.0,
      rotationPeriod: 1.0,
      tilt: 23.5,
      realRadius: 6371,
      description: 'Our home planet. The only known world with liquid water on its surface and life. 71% of surface is covered by oceans.',
      color: FALLBACK_COLORS.earth,
      moons: [
        {
          name: 'Moon',
          radius: kmToSimulation(1737.4),
          orbitRadius: kmToSimulation(384400) * 0.3, // Scaled down for visibility
          orbitPeriod: 27.3 / 365.25,
          rotationPeriod: 27.3,
          tilt: 6.7,
          realRadius: 1737.4,
          description: 'Earth\'s only natural satellite. Its gravity stabilizes Earth\'s axial tilt and moderates our climate.',
          color: FALLBACK_COLORS.moon,
        }
      ]
    },
    {
      name: 'Mars',
      radius: kmToSimulation(3389.5),
      orbitRadius: auToSimulation(1.52),
      orbitPeriod: 1.88,
      rotationPeriod: 1.03,
      tilt: 25.2,
      realRadius: 3389.5,
      description: 'The Red Planet. Mars has the largest volcano in the solar system (Olympus Mons) and evidence of ancient rivers.',
      color: FALLBACK_COLORS.mars,
      moons: [
        {
          name: 'Phobos',
          radius: kmToSimulation(11.2),
          orbitRadius: kmToSimulation(9376) * 0.5, // Scaled for visibility
          orbitPeriod: 0.32 / 365.25,
          rotationPeriod: 0.32,
          tilt: 0,
          realRadius: 11.2,
          description: 'The larger and closer of Mars\' two moons. Phobos is slowly spiraling toward Mars.',
          color: 0x6b5d52,
        },
        {
          name: 'Deimos',
          radius: kmToSimulation(6.2),
          orbitRadius: kmToSimulation(23460) * 0.5, // Scaled for visibility
          orbitPeriod: 1.26 / 365.25,
          rotationPeriod: 1.26,
          tilt: 0,
          realRadius: 6.2,
          description: 'The smaller and more distant of Mars\' two moons. Named after the Greek god of terror.',
          color: 0x8b7a6a,
        },
      ],
    },
    {
      name: 'Jupiter',
      radius: kmToSimulation(69911),
      orbitRadius: auToSimulation(5.2),
      orbitPeriod: 11.86,
      rotationPeriod: 0.41,
      tilt: 3.1,
      realRadius: 69911,
      description: 'The largest planet in our solar system. Jupiter\'s Great Red Spot is a storm that has raged for at least 400 years.',
      color: FALLBACK_COLORS.jupiter,
      moons: [
        {
          name: 'Io',
          radius: kmToSimulation(1821.6),
          orbitRadius: kmToSimulation(421700) * 0.15, // Scaled for visibility
          orbitPeriod: 1.77 / 365.25,
          rotationPeriod: 1.77,
          tilt: 0,
          realRadius: 1821.6,
          description: 'The most volcanically active body in the solar system. Io\'s surface is covered with sulfur.',
          color: 0xffcc33,
        },
      ],
    },
    {
      name: 'Saturn',
      radius: kmToSimulation(58232),
      orbitRadius: auToSimulation(9.54),
      orbitPeriod: 29.46,
      rotationPeriod: 0.45,
      tilt: 26.7,
      realRadius: 58232,
      description: 'Known for its spectacular ring system made of ice and rock particles. Saturn could float in water due to its low density.',
      color: FALLBACK_COLORS.saturn,
      moons: [
        {
          name: 'Titan',
          radius: kmToSimulation(2574.7),
          orbitRadius: kmToSimulation(1221870) * 0.12, // Scaled for visibility
          orbitPeriod: 15.95 / 365.25,
          rotationPeriod: 15.95,
          tilt: 0,
          realRadius: 2574.7,
          description: 'Saturn\'s largest moon. Titan has a thick atmosphere and liquid methane lakes on its surface.',
          color: 0xffa500,
        },
      ],
    },
    {
      name: 'Uranus',
      radius: kmToSimulation(25362),
      orbitRadius: auToSimulation(19.19),
      orbitPeriod: 84.01,
      rotationPeriod: -0.72, // Retrograde
      tilt: 97.8, // Extreme tilt - rotates on its side
      realRadius: 25362,
      description: 'The coldest planet with an atmosphere reaching -224°C. Uranus rotates on its side, possibly due to a massive collision.',
      color: FALLBACK_COLORS.uranus,
    },
    {
      name: 'Neptune',
      radius: kmToSimulation(24622),
      orbitRadius: auToSimulation(30.07),
      orbitPeriod: 164.8,
      rotationPeriod: 0.67,
      tilt: 28.3,
      realRadius: 24622,
      description: 'The windiest planet with supersonic winds reaching 2,100 km/h. Neptune has a dynamic atmosphere with large storm systems.',
      color: FALLBACK_COLORS.neptune,
    },
    {
      name: 'Pluto',
      radius: kmToSimulation(1188),
      orbitRadius: auToSimulation(39.48),
      orbitPeriod: 248,
      rotationPeriod: -6.39, // Retrograde
      tilt: 122.5,
      realRadius: 1188,
      description: 'Once the ninth planet, now classified as a dwarf planet. Pluto has a heart-shaped glacier and five known moons.',
      color: 0xc9a580,
    },
  ];

  // Create the Sun
  const sun = await createSun(scene, textureManager);
  
  // Create sun corona (subtle glow)
  const sunCorona = createSunCorona(scene);

  // Create planets
  const orbitLines: THREE.Line[] = [];
  const labels: THREE.Sprite[] = [];

  for (const planetData of planetsData) {
    await createPlanet(scene, planetData, textureManager);
    
    // Create orbit line
    const orbitLine = createOrbitLine(scene, planetData.orbitRadius);
    orbitLines.push(orbitLine);
    planetData.orbitLine = orbitLine;

    // Create label
    const label = createLabel(planetData.name);
    scene.add(label);
    labels.push(label);
    planetData.label = label;

    // Create moons if any
    if (planetData.moons) {
      for (const moonData of planetData.moons) {
        await createPlanet(scene, moonData, textureManager);
        
        // Moon orbit line (relative to parent planet)
        const moonOrbitLine = createOrbitLine(scene, moonData.orbitRadius);
        orbitLines.push(moonOrbitLine);
        moonData.orbitLine = moonOrbitLine;
      }
    }

    // Create Saturn's rings
    if (planetData.name === 'Saturn') {
      const rings = await createSaturnRings(scene, planetData, textureManager);
      planetData.rings = rings;
    }
  }

  return {
    sun,
    sunCorona,
    planets: planetsData,
    orbitLines,
    labels,
  };
}

/**
 * Create the Sun with emissive material
 */
async function createSun(
  scene: THREE.Scene,
  textureManager: TextureManager
): Promise<THREE.Mesh> {
  const sunRadius = kmToSimulation(696000);
  const geometry = new THREE.SphereGeometry(sunRadius, 64, 64);

  let sunTexture: THREE.Texture;
  try {
    sunTexture = await textureManager.loadTexture(
      TEXTURE_PATHS.sun + '_albedo.jpg',
      true,
      FALLBACK_COLORS.sun
    );
  } catch {
    // Use procedural texture if loading fails
    sunTexture = generateSunTexture(1024);
  }

  const material = new THREE.MeshBasicMaterial({
    map: sunTexture,
    color: new THREE.Color(0xffaa00),
  });

  const sun = new THREE.Mesh(geometry, material);
  sun.position.set(0, 0, 0);
  scene.add(sun);

  return sun;
}

/**
 * Create subtle corona/halo around the Sun using a sprite
 */
function createSunCorona(scene: THREE.Scene): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Create radial gradient
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, 'rgba(255, 200, 100, 0.8)');
  gradient.addColorStop(0.3, 'rgba(255, 150, 50, 0.4)');
  gradient.addColorStop(0.6, 'rgba(255, 100, 0, 0.1)');
  gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const corona = new THREE.Sprite(material);
  const sunRadius = kmToSimulation(696000);
  corona.scale.set(sunRadius * 4, sunRadius * 4, 1);
  corona.position.set(0, 0, 0);
  scene.add(corona);

  return corona;
}

/**
 * Create a planet with PBR materials
 */
async function createPlanet(
  scene: THREE.Scene,
  planetData: PlanetData,
  textureManager: TextureManager
): Promise<void> {
  // LOD geometry
  const geometry = new THREE.SphereGeometry(planetData.radius, 64, 64);

  // Load textures
  const texturePath = TEXTURE_PATHS[planetData.name.toLowerCase() as keyof typeof TEXTURE_PATHS];
  let material: THREE.MeshStandardMaterial;

  if (texturePath && typeof texturePath === 'string') {
    let albedoTexture: THREE.Texture;
    try {
      albedoTexture = await textureManager.loadTexture(
        `${texturePath}_albedo.jpg`,
        true,
        planetData.color
      );
    } catch {
      // Use procedural texture as fallback
      albedoTexture = generateProceduralTextureForPlanet(planetData.name, planetData.color);
    }

    material = new THREE.MeshStandardMaterial({
      map: albedoTexture,
      roughness: 0.8,
      metalness: 0.0,
      emissive: new THREE.Color(0x000000),
      emissiveIntensity: 0.0,
    });

    // Try to load normal map
    try {
      const normalTexture = await textureManager.loadTexture(
        `${texturePath}_normal.jpg`,
        false
      );
      material.normalMap = normalTexture;
      material.normalScale = new THREE.Vector2(1, 1);
    } catch (e) {
      // Normal map not available
    }
  } else {
    // Use procedural texture
    const proceduralTexture = generateProceduralTextureForPlanet(planetData.name, planetData.color);
    material = new THREE.MeshStandardMaterial({
      map: proceduralTexture,
      roughness: 0.8,
      metalness: 0.0,
      emissive: new THREE.Color(0x000000),
      emissiveIntensity: 0.0,
    });
  }

  const planet = new THREE.Mesh(geometry, material);
  planet.userData.planetData = planetData;
  
  // Set initial position
  planetData.position = new THREE.Vector3(planetData.orbitRadius, 0, 0);
  planet.position.copy(planetData.position);
  
  // Apply axial tilt
  planet.rotation.z = (planetData.tilt * Math.PI) / 180;

  scene.add(planet);
  planetData.mesh = planet;

  // Add Earth's atmosphere effect (simple transparent sphere)
  if (planetData.name === 'Earth') {
    await addEarthAtmosphere(scene, planet, planetData.radius);
  }
}

/**
 * Add subtle atmosphere effect to Earth
 */
async function addEarthAtmosphere(
  _scene: THREE.Scene,
  earthMesh: THREE.Mesh,
  radius: number
): Promise<void> {
  const atmosphereGeometry = new THREE.SphereGeometry(radius * 1.05, 64, 64);
  
  // Simple Fresnel-like atmosphere using shader
  const atmosphereMaterial = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    uniforms: {
      atmosphereColor: { value: new THREE.Color(0x6699ff) },
    },
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 atmosphereColor;
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        gl_FragColor = vec4(atmosphereColor, 1.0) * intensity;
      }
    `,
  });

  const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  earthMesh.add(atmosphere);
}

/**
 * Create Saturn's rings
 */
async function createSaturnRings(
  _scene: THREE.Scene,
  saturnData: PlanetData,
  textureManager: TextureManager
): Promise<THREE.Mesh> {
  const innerRadius = saturnData.radius * 1.2;
  const outerRadius = saturnData.radius * 2.3;
  
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 128);
  
  // Fix UV mapping for rings
  const pos = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const dist = Math.sqrt(x * x + y * y);
    uv.setX(i, (dist - innerRadius) / (outerRadius - innerRadius));
  }

  let ringTexture: THREE.Texture;
  try {
    ringTexture = await textureManager.loadTexture(
      TEXTURE_PATHS.saturnRings,
      true,
      0xccaa88
    );
  } catch {
    // Use procedural rings texture
    ringTexture = generateRingsTexture(512);
  }

  const material = new THREE.MeshStandardMaterial({
    map: ringTexture,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.9,
    roughness: 0.8,
    metalness: 0.0,
  });

  const rings = new THREE.Mesh(geometry, material);
  
  // Rotate rings to correct orientation (Saturn's ring plane)
  rings.rotation.x = Math.PI / 2;
  
  if (saturnData.mesh) {
    saturnData.mesh.add(rings);
  }

  return rings;
}

/**
 * Create orbit line
 */
function createOrbitLine(scene: THREE.Scene, radius: number): THREE.Line {
  const segments = 128;
  const points: THREE.Vector3[] = [];

  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    ));
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: 0x444444,
    transparent: true,
    opacity: 0.3,
  });

  const orbitLine = new THREE.Line(geometry, material);
  scene.add(orbitLine);

  return orbitLine;
}

/**
 * Create text label for planet
 */
function createLabel(text: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  canvas.width = 256;
  canvas.height = 64;
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.font = 'bold 32px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });

  const label = new THREE.Sprite(material);
  label.scale.set(10, 2.5, 1);

  return label;
}

/**
 * Update solar system animation
 */
export function updateSolarSystem(
  solarSystem: SolarSystemObjects,
  time: number,
  camera: THREE.Camera
): void {
  // Rotate Sun
  if (solarSystem.sun) {
    solarSystem.sun.rotation.y = time * 0.05;
  }

  // Update planets
  for (const planetData of solarSystem.planets) {
    if (!planetData.mesh) continue;

    // Orbital motion
    const angle = (time / planetData.orbitPeriod) * 0.1;
    planetData.position = new THREE.Vector3(
      Math.cos(angle) * planetData.orbitRadius,
      0,
      Math.sin(angle) * planetData.orbitRadius
    );
    planetData.mesh.position.copy(planetData.position);

    // Rotation
    const rotationSpeed = planetData.rotationPeriod !== 0 
      ? (1 / planetData.rotationPeriod) * 0.01
      : 0;
    planetData.mesh.rotation.y += rotationSpeed;

    // Update label position
    if (planetData.label) {
      planetData.label.position.copy(planetData.position);
      planetData.label.position.y += planetData.radius * 2;
      
      // Billboard effect (face camera)
      planetData.label.quaternion.copy(camera.quaternion);
    }

    // Update moons
    if (planetData.moons) {
      for (const moonData of planetData.moons) {
        if (!moonData.mesh) continue;

        const moonAngle = (time / moonData.orbitPeriod) * 0.1;
        const moonLocalPos = new THREE.Vector3(
          Math.cos(moonAngle) * moonData.orbitRadius,
          0,
          Math.sin(moonAngle) * moonData.orbitRadius
        );

        moonData.position = new THREE.Vector3().addVectors(
          planetData.position,
          moonLocalPos
        );
        moonData.mesh.position.copy(moonData.position);
        
        moonData.mesh.rotation.y += (1 / moonData.rotationPeriod) * 0.01;

        // Update moon orbit line position
        if (moonData.orbitLine) {
          moonData.orbitLine.position.copy(planetData.position);
        }
      }
    }
  }
}
