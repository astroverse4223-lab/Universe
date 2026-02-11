/**
 * Focus/Autopilot system for smooth transitions to planets
 */

import * as THREE from 'three';
import { PlanetData } from '../scene/createSolarSystem';

export class FocusControls {
  private camera: THREE.Camera;
  private targetPlanet: PlanetData | null = null;
  private isFocused = false;
  
  // Focus camera parameters
  private focusDistance = 0;
  private focusOffset = new THREE.Vector3();
  private currentOffset = new THREE.Vector3();
  
  // Smooth transition
  private transitionProgress = 0;
  private transitionSpeed = 2;

  // Orbit parameters
  private orbitAngle = 0;
  private orbitSpeed = 0.3;
  private orbitRadius = 0;

  // Original camera state (for returning to free flight)
  private originalPosition = new THREE.Vector3();
  private originalQuaternion = new THREE.Quaternion();

  constructor(camera: THREE.Camera) {
    this.camera = camera;
  }

  /**
   * Focus on a planet
   */
  focusOnPlanet(planet: PlanetData): void {
    if (!planet.mesh || !planet.position) return;

    // Save current camera state
    this.originalPosition.copy(this.camera.position);
    this.originalQuaternion.copy(this.camera.quaternion);

    this.targetPlanet = planet;
    this.isFocused = true;
    this.transitionProgress = 0;

    // Calculate focus parameters
    this.orbitRadius = planet.radius * 3;
    this.focusDistance = this.orbitRadius;
    
    // Calculate initial offset
    const directionToPlanet = new THREE.Vector3()
      .subVectors(planet.position, this.camera.position)
      .normalize();
    
    this.focusOffset.copy(directionToPlanet).multiplyScalar(-this.focusDistance);
    this.currentOffset.copy(this.focusOffset);
    
    // Set initial orbit angle
    this.orbitAngle = Math.atan2(directionToPlanet.x, directionToPlanet.z);
  }

  /**
   * Focus on nearest planet
   */
  focusOnNearest(planets: PlanetData[]): PlanetData | null {
    let nearest: PlanetData | null = null;
    let nearestDistance = Infinity;

    for (const planet of planets) {
      if (!planet.position) continue;

      const distance = this.camera.position.distanceTo(planet.position);
      
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = planet;
      }

      // Check moons too
      if (planet.moons) {
        for (const moon of planet.moons) {
          if (!moon.position) continue;
          const moonDistance = this.camera.position.distanceTo(moon.position);
          if (moonDistance < nearestDistance) {
            nearestDistance = moonDistance;
            nearest = moon;
          }
        }
      }
    }

    if (nearest) {
      this.focusOnPlanet(nearest);
    }

    return nearest;
  }

  /**
   * Return to free flight mode
   */
  returnToFreeFlight(): void {
    if (!this.isFocused) return;
    
    this.isFocused = false;
    this.targetPlanet = null;
  }

  /**
   * Update focus controls (call every frame)
   */
  update(deltaTime: number): void {
    if (!this.isFocused || !this.targetPlanet || !this.targetPlanet.position) {
      return;
    }

    // Smooth transition
    this.transitionProgress = Math.min(
      this.transitionProgress + deltaTime * this.transitionSpeed,
      1
    );

    // Update orbit angle
    this.orbitAngle += this.orbitSpeed * deltaTime;

    // Calculate orbit position
    const targetPosition = this.targetPlanet.position.clone();
    const orbitOffset = new THREE.Vector3(
      Math.sin(this.orbitAngle) * this.orbitRadius,
      this.orbitRadius * 0.3,
      Math.cos(this.orbitAngle) * this.orbitRadius
    );

    // Interpolate camera position
    const idealPosition = targetPosition.clone().add(orbitOffset);
    
    if (this.transitionProgress < 1) {
      // Smooth transition from current position to orbit
      this.camera.position.lerpVectors(
        this.originalPosition,
        idealPosition,
        this.easeInOutCubic(this.transitionProgress)
      );
    } else {
      // Maintain orbit
      this.camera.position.lerp(idealPosition, 1 - Math.exp(-5 * deltaTime));
    }

    // Look at planet with smooth damping
    const lookAtTarget = targetPosition.clone();

    // Create target quaternion
    const targetQuaternion = new THREE.Quaternion();
    const matrix = new THREE.Matrix4();
    matrix.lookAt(this.camera.position, lookAtTarget, new THREE.Vector3(0, 1, 0));
    targetQuaternion.setFromRotationMatrix(matrix);

    // Smooth rotation
    this.camera.quaternion.slerp(targetQuaternion, 1 - Math.exp(-8 * deltaTime));
  }

  /**
   * Easing function for smooth transitions
   */
  private easeInOutCubic(t: number): number {
    return t < 0.5 
      ? 4 * t * t * t 
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /**
   * Check if currently focused
   */
  getIsFocused(): boolean {
    return this.isFocused;
  }

  /**
   * Get current target planet
   */
  getTargetPlanet(): PlanetData | null {
    return this.targetPlanet;
  }

  /**
   * Get distance to target
   */
  getDistanceToTarget(): number {
    if (!this.targetPlanet || !this.targetPlanet.position) return 0;
    return this.camera.position.distanceTo(this.targetPlanet.position);
  }
}
