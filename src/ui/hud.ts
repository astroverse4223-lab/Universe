/**
 * HUD (Heads-Up Display) system
 * NASA-style clean interface
 */

import { PlanetData } from '../scene/createSolarSystem';
import { formatSpeed, formatDistance } from '../utils/units';

export class HUD {
  private speedDisplay: HTMLElement;
  private modeDisplay: HTMLElement;
  private targetDisplay: HTMLElement;
  private distanceDisplay: HTMLElement;
  
  private planetInfoPanel: HTMLElement;
  private planetName: HTMLElement;
  private planetRadius: HTMLElement;
  private planetPeriod: HTMLElement;
  private planetDescription: HTMLElement;

  constructor() {
    this.speedDisplay = document.getElementById('speed-display')!;
    this.modeDisplay = document.getElementById('mode-display')!;
    this.targetDisplay = document.getElementById('target-display')!;
    this.distanceDisplay = document.getElementById('distance-display')!;
    
    this.planetInfoPanel = document.getElementById('hud-bottom-left')!;
    this.planetName = document.getElementById('planet-name')!;
    this.planetRadius = document.getElementById('planet-radius')!;
    this.planetPeriod = document.getElementById('planet-period')!;
    this.planetDescription = document.getElementById('planet-description')!;
  }

  /**
   * Update flight data
   */
  updateFlightData(speed: number, mode: 'Free Flight' | 'Focus'): void {
    this.speedDisplay.textContent = formatSpeed(speed);
    this.modeDisplay.textContent = mode;
  }

  /**
   * Update navigation data
   */
  updateNavigation(targetPlanet: PlanetData | null, distance: number): void {
    if (targetPlanet) {
      this.targetDisplay.textContent = targetPlanet.name;
      this.distanceDisplay.textContent = formatDistance(distance);
    } else {
      this.targetDisplay.textContent = 'None';
      this.distanceDisplay.textContent = '—';
    }
  }

  /**
   * Show planet information panel
   */
  showPlanetInfo(planet: PlanetData): void {
    this.planetName.textContent = planet.name;
    this.planetRadius.textContent = `${planet.realRadius.toLocaleString()} km (scaled in sim)`;
    this.planetPeriod.textContent = `${planet.orbitPeriod.toFixed(2)} Earth years`;
    this.planetDescription.textContent = planet.description;
    this.planetInfoPanel.classList.add('visible');
  }

  /**
   * Hide planet information panel
   */
  hidePlanetInfo(): void {
    this.planetInfoPanel.classList.remove('visible');
  }

  /**
   * Update HUD (call every frame)
   */
  update(
    speed: number,
    isFocused: boolean,
    targetPlanet: PlanetData | null,
    distance: number
  ): void {
    this.updateFlightData(speed, isFocused ? 'Focus' : 'Free Flight');
    this.updateNavigation(targetPlanet, distance);

    if (isFocused && targetPlanet) {
      this.showPlanetInfo(targetPlanet);
    } else {
      this.hidePlanetInfo();
    }
  }
}

/**
 * Help overlay controller
 */
export class HelpOverlay {
  private overlay: HTMLElement;
  private isVisible: boolean = false;

  constructor() {
    this.overlay = document.getElementById('help-overlay')!;
    this.setupListeners();
  }

  private setupListeners(): void {
    // Toggle with H key
    document.addEventListener('keydown', (event) => {
      if (event.code === 'KeyH') {
        this.toggle();
      }
    });

    // Close with ESC when visible
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Escape' && this.isVisible) {
        this.hide();
      }
    });

    // Close on click
    this.overlay.addEventListener('click', (event) => {
      if (event.target === this.overlay) {
        this.hide();
      }
    });
  }

  toggle(): void {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  show(): void {
    this.overlay.classList.add('visible');
    this.isVisible = true;
    document.exitPointerLock();
  }

  hide(): void {
    this.overlay.classList.remove('visible');
    this.isVisible = false;
  }

  getIsVisible(): boolean {
    return this.isVisible;
  }
}
