/**
 * Settings panel for graphics and display options
 */

import * as THREE from 'three';
import { updateRendererQuality } from '../scene/createRenderer';
import { updateStarfieldQuality } from '../scene/createStarfield';

export type QualityLevel = 'low' | 'medium' | 'high';

export interface SettingsCallbacks {
  onQualityChange?: (quality: QualityLevel) => void;
  onOrbitsToggle?: (enabled: boolean) => void;
  onLabelsToggle?: (enabled: boolean) => void;
}

export class Settings {
  private panel: HTMLElement;
  private isVisible: boolean = false;
  
  private qualityButtons: NodeListOf<HTMLButtonElement>;
  private orbitsCheckbox: HTMLInputElement;
  private labelsCheckbox: HTMLInputElement;
  private closeButton: HTMLButtonElement;

  private currentQuality: QualityLevel = 'high';
  private orbitsEnabled: boolean = true;
  private labelsEnabled: boolean = true;

  private callbacks: SettingsCallbacks = {};

  constructor() {
    this.panel = document.getElementById('settings-panel')!;
    this.qualityButtons = document.querySelectorAll('[data-quality]');
    this.orbitsCheckbox = document.getElementById('toggle-orbits') as HTMLInputElement;
    this.labelsCheckbox = document.getElementById('toggle-labels') as HTMLInputElement;
    this.closeButton = document.getElementById('close-settings-btn') as HTMLButtonElement;

    this.setupListeners();
  }

  private setupListeners(): void {
    // Quality buttons
    this.qualityButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const quality = button.dataset.quality as QualityLevel;
        this.setQuality(quality);
      });
    });

    // Checkboxes
    this.orbitsCheckbox.addEventListener('change', () => {
      this.orbitsEnabled = this.orbitsCheckbox.checked;
      if (this.callbacks.onOrbitsToggle) {
        this.callbacks.onOrbitsToggle(this.orbitsEnabled);
      }
    });

    this.labelsCheckbox.addEventListener('change', () => {
      this.labelsEnabled = this.labelsCheckbox.checked;
      if (this.callbacks.onLabelsToggle) {
        this.callbacks.onLabelsToggle(this.labelsEnabled);
      }
    });

    // Close button
    this.closeButton.addEventListener('click', () => {
      this.hide();
    });

    // Toggle with P key
    document.addEventListener('keydown', (event) => {
      if (event.code === 'KeyP') {
        this.toggle();
      }
    });

    // Close with ESC
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Escape' && this.isVisible) {
        this.hide();
      }
    });
  }

  private setQuality(quality: QualityLevel): void {
    this.currentQuality = quality;

    // Update button states
    this.qualityButtons.forEach((button) => {
      if (button.dataset.quality === quality) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });

    // Trigger callback
    if (this.callbacks.onQualityChange) {
      this.callbacks.onQualityChange(quality);
    }
  }

  toggle(): void {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  show(): void {
    this.panel.classList.add('visible');
    this.isVisible = true;
    document.exitPointerLock();
  }

  hide(): void {
    this.panel.classList.remove('visible');
    this.isVisible = false;
  }

  getIsVisible(): boolean {
    return this.isVisible;
  }

  getCurrentQuality(): QualityLevel {
    return this.currentQuality;
  }

  getOrbitsEnabled(): boolean {
    return this.orbitsEnabled;
  }

  getLabelsEnabled(): boolean {
    return this.labelsEnabled;
  }

  /**
   * Set callbacks for settings changes
   */
  setCallbacks(callbacks: SettingsCallbacks): void {
    this.callbacks = callbacks;
  }
}

/**
 * Apply settings to scene objects
 */
export function applySettings(
  settings: Settings,
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  orbitLines: THREE.Line[],
  labels: THREE.Sprite[],
  starfield: THREE.Mesh
): { starfield: THREE.Mesh } {
  // Update renderer quality
  updateRendererQuality(renderer, settings.getCurrentQuality());

  // Update starfield quality if needed
  let newStarfield = starfield;
  const onQualityChange = (quality: QualityLevel) => {
    updateRendererQuality(renderer, quality);
    newStarfield = updateStarfieldQuality(scene, newStarfield, quality);
  };

  // Toggle orbit lines
  const onOrbitsToggle = (enabled: boolean) => {
    orbitLines.forEach((line) => {
      line.visible = enabled;
    });
  };

  // Toggle labels
  const onLabelsToggle = (enabled: boolean) => {
    labels.forEach((label) => {
      label.visible = enabled;
    });
  };

  // Set callbacks
  settings.setCallbacks({
    onQualityChange,
    onOrbitsToggle,
    onLabelsToggle,
  });

  // Apply initial settings
  onOrbitsToggle(settings.getOrbitsEnabled());
  onLabelsToggle(settings.getLabelsEnabled());

  return { starfield: newStarfield };
}
