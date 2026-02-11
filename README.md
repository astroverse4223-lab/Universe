# COSMOS DRIFT - NASA Edition

A production-quality, realistic 3D Universe Explorer built with Three.js and TypeScript. Experience an immersive browser-based journey through our solar system with NASA-quality visuals, physically-based rendering, and smooth first-person flight controls.

![COSMOS DRIFT](https://img.shields.io/badge/Status-Production%20Ready-brightgreen) ![Three.js](https://img.shields.io/badge/Three.js-0.160-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

## 🌟 Features

### Realistic Solar System
- **Sun** with subtle corona glow
- **8 Planets** (Mercury through Neptune) with:
  - PBR materials (albedo, normal, roughness maps)
  - Physically accurate lighting
  - Realistic textures (when provided)
  - Correct orbital mechanics (scaled)
- **Saturn's Rings** with transparency and proper tilt
- **Earth's Moon** with realistic orbit
- **Earth's Atmosphere** with Fresnel-based shader effect

### Immersive Controls
- **First-Person Flight** with pointer lock
  - Mouse look
  - WASD movement
  - Q/E for vertical movement
  - Shift for boost/warp
  - Smooth inertia and acceleration
- **Focus Mode** (Autopilot)
  - Press F to focus nearest planet
  - Smooth cinematic camera transitions
  - Stable orbital view
  - Press G to return to free flight

### NASA-Style UI
- Clean, minimal HUD showing:
  - Flight speed
  - Current mode
  - Target body and distance
- **Planet Information Panel** with:
  - Real radius data
  - Orbital period
  - Scientific description
- **Help Overlay** (Press H)
- **Settings Panel** (Press P) with:
  - Graphics quality (Low/Medium/High)
  - Toggle orbit lines
  - Toggle planet labels

### Physically-Based Rendering
- `ACESFilmicToneMapping` for cinematic look
- `SRGBColorSpace` output
- Point light from Sun with inverse-square falloff
- Subtle ambient lighting
- High-quality starfield (not glittery)

### Performance
- LOD system ready
- Efficient texture loading with fallbacks
- Anisotropic filtering
- Optimized draw calls
- Smooth 60 FPS on modern hardware

---

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will open at `http://localhost:3000`

### First Run

The app will work immediately with fallback colored materials. For realistic NASA-quality visuals, add planet textures (see below).

---

## 🎨 Adding Realistic Textures

### Why Textures Are Not Included

To respect copyright and keep the repository lightweight, textures are **not bundled**. The app gracefully falls back to colored materials if textures are missing.

### Recommended Sources

Use **free, high-quality textures** from these NASA/public domain sources:

1. **Solar System Scope** (Free for non-commercial use)
   - https://www.solarsystemscope.com/textures/
   - Download 2K or 4K versions

2. **NASA JPL** (Public domain)
   - https://www.jpl.nasa.gov/images
   - Search for planet names

3. **Planet Pixel Emporium** (Free for non-commercial)
   - http://planetpixelemporium.com/planets.html

### Required Texture Files

Create a `public/textures/` folder and add the following files:

```
public/
└── textures/
    ├── sun_albedo.jpg
    ├── mercury_albedo.jpg
    ├── mercury_normal.jpg (optional)
    ├── venus_albedo.jpg
    ├── venus_normal.jpg (optional)
    ├── earth_albedo.jpg
    ├── earth_normal.jpg (optional)
    ├── earth_clouds.png (optional, with alpha)
    ├── moon_albedo.jpg
    ├── moon_normal.jpg (optional)
    ├── mars_albedo.jpg
    ├── mars_normal.jpg (optional)
    ├── jupiter_albedo.jpg
    ├── saturn_albedo.jpg
    ├── saturn_rings.png (with alpha channel)
    ├── uranus_albedo.jpg
    └── neptune_albedo.jpg
```

### Texture Naming Convention

- `{planet}_albedo.jpg` - Base color/diffuse map (required)
- `{planet}_normal.jpg` - Normal/bump map (optional but recommended)
- `{planet}_roughness.jpg` - Roughness map (optional)

### Recommended Resolutions

- **Planets**: 2K (2048×1024) for good quality
- **Sun**: 2K or 4K for close-up detail
- **Saturn Rings**: 2K with transparency
- **High quality setting**: Use 4K textures
- **Medium/Low**: The app will handle downscaling

### Example: Downloading from Solar System Scope

1. Visit https://www.solarsystemscope.com/textures/
2. Download "2K" texture packs for each planet
3. Rename files to match the naming convention above
4. Place in `public/textures/`
5. Reload the app

---

## 🎯 Scale Model Explained

Real solar system distances are impossibly large for interactive exploration. We use a **scaled simulation** that maintains correct relative proportions while fitting in explorable space.

### Scale Constants

Located in `src/utils/units.ts`:

```typescript
export const PLANET_RADIUS_SCALE = 0.05;  // Planets scaled up
export const ORBIT_RADIUS_SCALE = 1.0;    // Orbits scaled down
export const DISTANCE_UNITS = {
  AU_TO_SIMULATION: 50,  // 1 AU = 50 simulation units
};
```

### How It Works

- **Planet Radii**: Real radii (in km) × `PLANET_RADIUS_SCALE`
  - Makes planets visible and explorable
  - Maintains correct relative sizes (Jupiter is still biggest)

- **Orbit Radii**: Real orbits (in AU) × `ORBIT_RADIUS_SCALE` × 50
  - Compresses vast distances into navigable space
  - Keeps correct orbital order

- **Earth's Moon**: Special case - orbit scaled down 70% for visibility

### Tweaking Realism vs Usability

**More Realistic** (larger orbits, tiny planets):
```typescript
PLANET_RADIUS_SCALE = 0.01
ORBIT_RADIUS_SCALE = 2.0
```

**More Explorable** (larger planets, closer orbits):
```typescript
PLANET_RADIUS_SCALE = 0.1
ORBIT_RADIUS_SCALE = 0.5
```

---

## 💡 Tweaking Lighting & Tone Mapping

### Lighting Settings

In `src/scene/createLights.ts`:

```typescript
// Sun light (PointLight)
sunLight.intensity = 2.5;  // Increase for brighter planets
sunLight.decay = 2;         // Physically accurate falloff

// Ambient light (subtle)
ambientLight.intensity = 0.03;  // Increase to see dark sides
```

**To adjust**:
- **Brighter planets far from Sun**: Decrease `sunLight.decay` to 1.5
- **See dark sides better**: Increase `ambientLight.intensity` to 0.1
- **Darker space**: Decrease `ambientLight.intensity` to 0.01

### Tone Mapping

In `src/scene/createRenderer.ts`:

```typescript
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
```

**Adjustment guide**:
- **Too dark**: Increase `toneMappingExposure` to 1.2-1.5
- **Too bright/washed out**: Decrease to 0.8
- **Different look**: Try `THREE.CineonToneMapping` or `THREE.ReinhardToneMapping`

### Why PointLight Instead of DirectionalLight?

- **PointLight**: Physically accurate - light emanates from a point (the Sun) and dims with distance (inverse-square law)
- **DirectionalLight**: Better for distant sources like the Sun from Earth's perspective, but less accurate for a whole solar system
- Our choice: **PointLight** for realism across multiple planets at varying distances

---

## ⚙️ Performance Tips

### Graphics Quality Settings

Use the Settings panel (Press P) to adjust:

- **Low**: 1× pixel ratio, 4K stars, lower anisotropy
- **Medium**: 1.5× pixel ratio, 8K stars, medium anisotropy
- **High**: 2× pixel ratio, 15K stars, max anisotropy

### Manual Optimizations

In `src/scene/createStarfield.ts`:
```typescript
const starCount = 5000;  // Reduce for better performance
```

In `src/scene/createSolarSystem.ts`:
```typescript
// Lower sphere segments for distant planets
const geometry = new THREE.SphereGeometry(radius, 32, 32);  // Was 64
```

### Texture Optimizations

- Use 1K textures on older hardware
- Enable mipmaps (already done)
- Compress textures to JPG (not PNG) except for alpha channels

---

## 🎮 Controls Reference

### Flight Mode
- **Mouse**: Look around (pointer locked)
- **W/S**: Forward/Backward
- **A/D**: Strafe left/right
- **Q/E**: Down/Up
- **Shift**: Boost (5× speed)

### Navigation
- **F**: Focus on nearest planet
- **G**: Return to free flight

### Interface
- **H**: Toggle help overlay
- **P**: Open settings
- **ESC**: Release pointer/Close panels
- **Click**: Lock pointer (start flying)

---

## 📁 Project Structure

```
cosmos-drift-nasa/
├── src/
│   ├── main.ts                    # Application entry point
│   ├── scene/
│   │   ├── createRenderer.ts      # Renderer setup with PBR
│   │   ├── createScene.ts         # Scene and camera
│   │   ├── createLights.ts        # Lighting configuration
│   │   ├── createStarfield.ts     # Realistic star background
│   │   ├── createSolarSystem.ts   # Planets, moons, rings
│   │   └── textures.ts            # Texture loading system
│   ├── controls/
│   │   ├── flightControls.ts      # First-person flight
│   │   └── focusControls.ts       # Autopilot/focus system
│   ├── ui/
│   │   ├── hud.ts                 # HUD and help overlay
│   │   └── settings.ts            # Settings panel
│   └── utils/
│       ├── math.ts                # Math utilities
│       └── units.ts               # Scale and unit conversions
├── public/
│   └── textures/                  # Place texture files here
├── index.html                     # Main HTML with inline styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🔧 Technical Details

### Rendering Pipeline

1. **Scene Setup**
   - SRGBColorSpace output
   - ACESFilmic tone mapping
   - Physically correct lights enabled

2. **Materials**
   - MeshStandardMaterial (PBR)
   - MeshBasicMaterial for Sun (emissive)
   - ShaderMaterial for Earth's atmosphere

3. **Lighting**
   - PointLight at Sun (inverse-square falloff)
   - Minimal AmbientLight (starlight simulation)

4. **Post-Processing**
   - Tone mapping (no heavy bloom)
   - Subtle, realistic effects only

### Data Sources

Planetary data sourced from:
- NASA Jet Propulsion Laboratory
- International Astronomical Union
- Wikipedia (verified against NASA)

### Browser Support

- **Minimum**: Modern browsers with WebGL 2.0
- **Recommended**: Chrome 90+, Firefox 88+, Safari 15+
- **Not supported**: IE11, old mobile browsers

---

## 🐛 Troubleshooting

### Black Screen

1. Check console for errors
2. Verify WebGL is enabled: Visit https://get.webgl.org/
3. Update graphics drivers

### Textures Not Loading

1. Ensure textures are in `public/textures/`
2. Check browser console for 404 errors
3. Verify filenames match exactly (case-sensitive)
4. App should show colored fallbacks if textures missing

### Performance Issues

1. Lower graphics quality in Settings
2. Use 1K textures instead of 4K
3. Reduce `starCount` in `createStarfield.ts`
4. Close other browser tabs

### Controls Not Working

1. Click canvas to activate pointer lock
2. Check browser allows pointer lock (not in iframe)
3. Press ESC to release, then click again

---

## 📝 Customization Guide

### Add a New Planet

1. Edit `src/scene/createSolarSystem.ts`
2. Add planet data to `planetsData` array:
```typescript
{
  name: 'Pluto',
  radius: kmToSimulation(1188),
  orbitRadius: auToSimulation(39.48),
  orbitPeriod: 248,
  // ... other properties
}
```
3. Add texture path to `TEXTURE_PATHS` in `textures.ts`
4. Add fallback color to `FALLBACK_COLORS`

### Change Background Stars

Edit `src/scene/createStarfield.ts`:
```typescript
// More stars
const starCount = 20000;

// Different colors (e.g., more blue stars)
if (temp < 0.3) {  // Was 0.1
  // Blue-white stars
}
```

### Adjust Camera FOV

Edit `src/scene/createScene.ts`:
```typescript
const camera = new THREE.PerspectiveCamera(
  60,  // Change from 75 for narrower FOV
  // ...
);
```

---

## 🤝 Contributing

This is a complete, production-ready project. Feel free to:
- Fork and customize
- Use as a learning resource
- Build upon for your own space projects

### Code Style

- TypeScript strict mode
- Modular architecture
- Comments explaining "why", not "what"
- Physically accurate terminology

---

## 📄 License

This code is provided as-is for educational and non-commercial use.

**Textures**: You must obtain your own textures and comply with their respective licenses.

**Credits**:
- Three.js: https://threejs.org/
- Planetary data: NASA/JPL
- Inspiration: NASA's Eyes on the Solar System

---

## 🌌 Tips for Best Experience

1. **Use headphones** for immersive silence of space
2. **Full screen** the browser (F11)
3. **Dark room** enhances the space atmosphere
4. **Start near Earth**, then explore outward
5. **Use Focus mode** to learn about each planet
6. **Boost through** empty space between planets
7. **Look back at the Sun** from Neptune - it's tiny!

---

## 🚀 What's Next?

Ideas for extending COSMOS DRIFT:

- **More moons**: Add Io, Europa, Titan, etc.
- **Asteroid belt**: Procedural asteroids between Mars/Jupiter
- **Comet tails**: Particle system with solar wind
- **Planetary rings**: Add rings to Uranus/Neptune
- **Spacecraft**: Add Voyager, Cassini models at scale
- **Time controls**: Speed up/slow down orbital motion
- **VR support**: WebXR for even more immersion
- **Sound effects**: Ambient space sounds, thruster hum
- **Photo mode**: Capture and save screenshots

---

**Enjoy exploring the cosmos! 🌠**

*For questions, issues, or showcasing your customizations, feel free to reach out.*
