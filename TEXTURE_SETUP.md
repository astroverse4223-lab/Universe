# Texture Setup Guide

This file contains detailed instructions for obtaining and setting up realistic planet textures for COSMOS DRIFT.

## Quick Setup (5 minutes)

### Step 1: Create Textures Folder
```bash
mkdir -p public/textures
```

### Step 2: Download from Solar System Scope

1. Visit: https://www.solarsystemscope.com/textures/
2. Select "2K" textures (best balance of quality/performance)
3. Download the following textures:

#### Required Downloads:
- ☀️ Sun: `2k_sun.jpg`
- ☿ Mercury: `2k_mercury.jpg`
- ♀ Venus: `2k_venus_surface.jpg`
- 🌍 Earth: `2k_earth_daymap.jpg`
- 🌙 Moon: `2k_moon.jpg`
- ♂ Mars: `2k_mars.jpg`
- ♃ Jupiter: `2k_jupiter.jpg`
- ♄ Saturn: `2k_saturn.jpg`
- ⛢ Uranus: `2k_uranus.jpg`
- ♆ Neptune: `2k_neptune.jpg`

#### Optional (Enhanced Quality):
- Saturn Rings: `2k_saturn_ring_alpha.png`
- Earth Clouds: `2k_earth_clouds.jpg`
- Normal Maps: Look for files ending in `_normal.jpg`

### Step 3: Rename Files

Solar System Scope files need to be renamed to match our naming convention.

**Rename pattern**: `2k_[planet].jpg` → `[planet]_albedo.jpg`

#### Renaming Commands (Windows PowerShell):

```powershell
cd public/textures

# Rename all textures
Rename-Item "2k_sun.jpg" "sun_albedo.jpg"
Rename-Item "2k_mercury.jpg" "mercury_albedo.jpg"
Rename-Item "2k_venus_surface.jpg" "venus_albedo.jpg"
Rename-Item "2k_earth_daymap.jpg" "earth_albedo.jpg"
Rename-Item "2k_moon.jpg" "moon_albedo.jpg"
Rename-Item "2k_mars.jpg" "mars_albedo.jpg"
Rename-Item "2k_jupiter.jpg" "jupiter_albedo.jpg"
Rename-Item "2k_saturn.jpg" "saturn_albedo.jpg"
Rename-Item "2k_uranus.jpg" "uranus_albedo.jpg"
Rename-Item "2k_neptune.jpg" "neptune_albedo.jpg"

# Saturn rings (if downloaded)
Rename-Item "2k_saturn_ring_alpha.png" "saturn_rings.png"
```

#### Renaming Commands (Mac/Linux):

```bash
cd public/textures

# Rename all textures
mv 2k_sun.jpg sun_albedo.jpg
mv 2k_mercury.jpg mercury_albedo.jpg
mv 2k_venus_surface.jpg venus_albedo.jpg
mv 2k_earth_daymap.jpg earth_albedo.jpg
mv 2k_moon.jpg moon_albedo.jpg
mv 2k_mars.jpg mars_albedo.jpg
mv 2k_jupiter.jpg jupiter_albedo.jpg
mv 2k_saturn.jpg saturn_albedo.jpg
mv 2k_uranus.jpg uranus_albedo.jpg
mv 2k_neptune.jpg neptune_albedo.jpg

# Saturn rings (if downloaded)
mv 2k_saturn_ring_alpha.png saturn_rings.png
```

### Step 4: Verify Installation

Check that your `public/textures/` folder contains:

```
public/textures/
├── sun_albedo.jpg
├── mercury_albedo.jpg
├── venus_albedo.jpg
├── earth_albedo.jpg
├── moon_albedo.jpg
├── mars_albedo.jpg
├── jupiter_albedo.jpg
├── saturn_albedo.jpg
├── saturn_rings.png (optional)
├── uranus_albedo.jpg
└── neptune_albedo.jpg
```

### Step 5: Run the App

```bash
npm run dev
```

Your planets should now have beautiful, realistic textures!

---

## Alternative Sources

### NASA JPL (Public Domain)

**Advantages**: 100% free, authentic NASA imagery
**Disadvantages**: Requires more processing, not game-ready

1. Visit: https://www.jpl.nasa.gov/images
2. Search for each planet name
3. Download high-resolution images
4. May need to process to equirectangular projection

### Planet Pixel Emporium

**Website**: http://planetpixelemporium.com/planets.html

**Advantages**: High quality, includes bump/specular maps
**Disadvantages**: Free only for non-commercial use

Available formats:
- Color maps (albedo)
- Bump maps (normal)
- Specular maps

### Creating Your Own

If you're artistically inclined:

1. Use NASA photos as reference
2. Create equirectangular projection (2:1 aspect ratio)
3. Blend multiple photos for seamless texture
4. Export as JPG (2048×1024 or 4096×2048)

---

## Advanced: Normal Maps

Normal maps add surface detail without geometry.

### From Solar System Scope:
If available, download files ending in `_normal.jpg` and rename:
```
2k_earth_normal_map.jpg → earth_normal.jpg
```

### Generate Your Own:
Use online tools or Photoshop:
1. Open albedo texture
2. Convert to grayscale
3. Filter → 3D → Generate Normal Map
4. Save as `[planet]_normal.jpg`

---

## Texture Resolution Guide

| Resolution | Use Case | File Size (approx) |
|------------|----------|-------------------|
| 1K (1024×512) | Low-end devices, mobile | 200-500 KB |
| 2K (2048×1024) | **Recommended** balanced | 800 KB - 2 MB |
| 4K (4096×2048) | High-end PCs, close-ups | 3-8 MB |
| 8K (8192×4096) | Overkill for web | 12-30 MB |

**Tip**: Start with 2K. Upgrade to 4K only if you have the bandwidth and users have fast connections.

---

## Troubleshooting

### Textures Not Appearing
1. **Check browser console** for 404 errors
2. **Verify paths**: Textures must be in `public/textures/`
3. **Check spelling**: Filenames are case-sensitive
4. **Clear cache**: Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

### Slow Loading
1. **Compress JPGs**: Use tools like TinyJPG
2. **Reduce resolution**: Use 1K instead of 2K
3. **Check file sizes**: Each texture should be < 2 MB

### Wrong Colors
1. **Check color space**: Textures should be sRGB
2. **Avoid HDR**: Use standard JPG, not EXR/HDR
3. **Verify source**: Some textures need color correction

---

## Legal & Licensing

### Solar System Scope
- **License**: Free for personal, educational, and non-commercial use
- **Attribution**: Not required but appreciated
- **Commercial**: Requires paid license

### NASA Images
- **License**: Public domain (U.S. Government work)
- **Attribution**: Not required but courteous
- **Commercial**: Freely allowed

### Planet Pixel Emporium
- **License**: Free for non-commercial use
- **Attribution**: Required
- **Commercial**: Permission needed

**Important**: Always verify the license of textures you download and comply with usage terms.

---

## Optimization Tips

### Compress Textures
Use these tools to reduce file size without quality loss:
- **TinyJPG**: https://tinyjpg.com/
- **Squoosh**: https://squoosh.app/
- **ImageOptim** (Mac): https://imageoptim.com/

### Photoshop Users
When exporting:
1. File → Export → Save for Web
2. Format: JPEG
3. Quality: 80-85%
4. Optimized: ✓
5. Progressive: ✓

### Batch Processing
For multiple textures, use ImageMagick:
```bash
# Resize all to 2K
mogrify -resize 2048x1024 -quality 85 *.jpg

# Convert PNG to JPG (except rings)
mogrify -format jpg -quality 85 *.png
```

---

## Recommended Workflow

1. **Download all 2K textures** from Solar System Scope
2. **Rename** according to our convention
3. **Test in app** - verify all load correctly
4. **Compress** if loading is slow
5. **Add normal maps** for enhanced detail (optional)
6. **Upgrade to 4K** for specific planets if desired (Earth, Jupiter, Saturn)

**Total time**: 5-10 minutes for basic setup

---

## Need Help?

- Check the browser console for specific errors
- Verify file paths and names match exactly
- Test with one texture first before adding all
- The app will work with fallback colors if textures are missing

**Happy exploring! 🌌**
