/**
 * COSMOS DRIFT - NASA Edition
 * Main application entry point
 */

import * as THREE from 'three' assert { type: 'module' };
import { createRenderer } from './scene/createRenderer';
import { createScene } from './scene/createScene';
import { createLights } from './scene/createLights';
import { createStarfield } from './scene/createStarfield';
import { createSolarSystem, updateSolarSystem } from './scene/createSolarSystem';
import { TextureManager } from './scene/textures';
import { FlightControls } from './controls/flightControls';
import { FocusControls } from './controls/focusControls';
import { HUD, HelpOverlay } from './ui/hud';
import { Settings, applySettings } from './ui/settings';

/**
 * Main application class
 */
class CosmosApp {
  private container: HTMLElement;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  
  private flightControls!: FlightControls;
  private focusControls!: FocusControls;
  
  private hud!: HUD;
  private helpOverlay!: HelpOverlay;
  private settings!: Settings;

  private solarSystem!: Awaited<ReturnType<typeof createSolarSystem>>;
  private starfield!: THREE.Mesh;

  private clock = new THREE.Clock();
  private time = 0;

  private isRunning = false;

  constructor() {
    this.container = document.getElementById('canvas-container')!;
  }

  /**
   * Initialize the application
   */
  async init(): Promise<void> {
    // Show loading screen
    this.showLoadingStatus('Creating universe...');

    // Create renderer
    this.renderer = createRenderer(this.container, {
      antialias: true,
      anisotropy: 16,
    });

    // Create scene and camera
    const sceneObjects = createScene(this.container);
    this.scene = sceneObjects.scene;
    this.camera = sceneObjects.camera;

    // Create lights
    createLights(this.scene);

    // Create starfield (Milky Way background)
    this.showLoadingStatus('Loading Milky Way background...');
    this.starfield = createStarfield(this.scene, 'high');

    // Setup texture loading
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onProgress = (_url, loaded, total) => {
      const progress = (loaded / total) * 100;
      this.updateLoadingProgress(progress);
      this.showLoadingStatus(`Loading textures... ${Math.round(progress)}%`);
    };

    const textureManager = new TextureManager(loadingManager, this.renderer);

    // Create solar system
    this.showLoadingStatus('Building solar system...');
    this.solarSystem = await createSolarSystem(this.scene, textureManager);

    // Setup controls
    this.showLoadingStatus('Initializing controls...');
    this.flightControls = new FlightControls(this.camera, this.renderer.domElement);
    this.focusControls = new FocusControls(this.camera);

    // Setup UI
    this.hud = new HUD();
    this.helpOverlay = new HelpOverlay();
    this.settings = new Settings();

    // Apply settings
    const result = applySettings(
      this.settings,
      this.renderer,
      this.scene,
      this.solarSystem.orbitLines,
      this.solarSystem.labels,
      this.starfield
    );
    this.starfield = result.starfield;

    // Setup input handlers
    this.setupInputHandlers();

    // Hide loading screen
    this.hideLoadingScreen();

    // Start render loop
    this.isRunning = true;
    this.animate();
  }

  /**
   * Setup keyboard input handlers
   */
  private setupInputHandlers(): void {
    // Click to lock pointer
    this.renderer.domElement.addEventListener('click', () => {
      if (!this.flightControls.getIsLocked() && 
          !this.helpOverlay.getIsVisible() && 
          !this.settings.getIsVisible()) {
        this.flightControls.lock();
      }
    });

    // ESC to unlock
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Escape') {
        this.flightControls.unlock();
      }
    });

    // F to focus nearest planet
    document.addEventListener('keydown', (event) => {
      if (event.code === 'KeyF' && !this.helpOverlay.getIsVisible() && !this.settings.getIsVisible()) {
        if (!this.focusControls.getIsFocused()) {
          this.focusControls.focusOnNearest(this.solarSystem.planets);
          this.flightControls.disable();
        }
      }
    });

    // G to return to free flight
    document.addEventListener('keydown', (event) => {
      if (event.code === 'KeyG' && !this.helpOverlay.getIsVisible() && !this.settings.getIsVisible()) {
        this.focusControls.returnToFreeFlight();
      }
    });
  }

  /**
   * Main animation loop
   */
  private animate = (): void => {
    if (!this.isRunning) return;

    requestAnimationFrame(this.animate);

    const deltaTime = this.clock.getDelta();
    this.time += deltaTime;

    // Update controls
    if (this.focusControls.getIsFocused()) {
      this.focusControls.update(deltaTime);
    } else {
      this.flightControls.update(deltaTime);
    }

    // Update solar system
    updateSolarSystem(this.solarSystem, this.time, this.camera);

    // Update HUD
    const speed = this.focusControls.getIsFocused() ? 0 : this.flightControls.getSpeed();
    const targetPlanet = this.focusControls.getTargetPlanet();
    const distance = this.focusControls.getIsFocused() 
      ? this.focusControls.getDistanceToTarget() 
      : 0;

    this.hud.update(
      speed,
      this.focusControls.getIsFocused(),
      targetPlanet,
      distance
    );

    // Render scene
    this.renderer.render(this.scene, this.camera);
  };

  /**
   * Loading screen helpers
   */
  private showLoadingStatus(message: string): void {
    const statusElement = document.getElementById('loading-status');
    if (statusElement) {
      statusElement.textContent = message;
    }
  }

  private updateLoadingProgress(progress: number): void {
    const barElement = document.getElementById('loading-bar');
    if (barElement) {
      barElement.style.width = `${progress}%`;
    }
  }

  private hideLoadingScreen(): void {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }
  }

  /**
   * Cleanup
   */
  dispose(): void {
    this.isRunning = false;
    this.renderer.dispose();
  }
}

/**
 * Application entry point
 */
async function main() {
  const app = new CosmosApp();
  
  try {
    await app.init();
    console.log('🚀 COSMOS DRIFT initialized successfully');
    console.log('Controls: WASD to move, Mouse to look, Shift to boost');
    console.log('Press H for help, F to focus planet, P for settings');
  } catch (error) {
    console.error('Failed to initialize COSMOS DRIFT:', error);
    
    // Show error to user
    const loadingStatus = document.getElementById('loading-status');
    if (loadingStatus) {
      loadingStatus.textContent = 'Failed to initialize. Check console for details.';
      loadingStatus.style.color = '#ff4444';
    }
  }
}

// Start the application
main();
