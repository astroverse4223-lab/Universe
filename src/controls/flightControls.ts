/**
 * First-person flight controls with pointer lock
 * Smooth, immersive camera movement with inertia
 */

import * as THREE from 'three';
import { damp, clamp } from '../utils/math';

export class FlightControls {
  private camera: THREE.Camera;
  private domElement: HTMLElement;
  
  // Movement state
  private moveForward = false;
  private moveBackward = false;
  private moveLeft = false;
  private moveRight = false;
  private moveUp = false;
  private moveDown = false;
  private boost = false;

  // Velocity and acceleration
  private velocity = new THREE.Vector3();
  private direction = new THREE.Vector3();
  
  // Speed settings
  private baseSpeed = 30;
  private boostMultiplier = 8;
  private acceleration = 30;
  private damping = 5;

  // Mouse look
  private euler = new THREE.Euler(0, 0, 0, 'YXZ');
  private mouseSensitivity = 0.002;

  // Pointer lock
  private isLocked = false;

  // Callbacks
  private onLockCallback?: () => void;
  private onUnlockCallback?: () => void;

  constructor(camera: THREE.Camera, domElement: HTMLElement) {
    this.camera = camera;
    this.domElement = domElement;

    this.euler.setFromQuaternion(camera.quaternion);

    this.setupPointerLock();
    this.setupKeyboardControls();
  }

  private setupPointerLock(): void {
    const onMouseMove = (event: MouseEvent) => {
      if (!this.isLocked) return;

      const movementX = event.movementX || 0;
      const movementY = event.movementY || 0;

      this.euler.y -= movementX * this.mouseSensitivity;
      this.euler.x -= movementY * this.mouseSensitivity;

      // Clamp vertical rotation
      this.euler.x = clamp(this.euler.x, -Math.PI / 2, Math.PI / 2);
    };

    const onPointerlockChange = () => {
      this.isLocked = document.pointerLockElement === this.domElement;
      
      if (this.isLocked) {
        document.body.classList.add('pointer-locked');
        if (this.onLockCallback) this.onLockCallback();
      } else {
        document.body.classList.remove('pointer-locked');
        if (this.onUnlockCallback) this.onUnlockCallback();
      }
    };

    const onPointerlockError = () => {
      console.error('Pointer lock failed');
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('pointerlockchange', onPointerlockChange);
    document.addEventListener('pointerlockerror', onPointerlockError);
  }

  private setupKeyboardControls(): void {
    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
          this.moveForward = true;
          break;
        case 'KeyS':
          this.moveBackward = true;
          break;
        case 'KeyA':
          this.moveLeft = true;
          break;
        case 'KeyD':
          this.moveRight = true;
          break;
        case 'KeyQ':
          this.moveDown = true;
          break;
        case 'KeyE':
          this.moveUp = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          this.boost = true;
          break;
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
          this.moveForward = false;
          break;
        case 'KeyS':
          this.moveBackward = false;
          break;
        case 'KeyA':
          this.moveLeft = false;
          break;
        case 'KeyD':
          this.moveRight = false;
          break;
        case 'KeyQ':
          this.moveDown = false;
          break;
        case 'KeyE':
          this.moveUp = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          this.boost = false;
          break;
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
  }

  /**
   * Request pointer lock
   */
  lock(): void {
    this.domElement.requestPointerLock();
  }

  /**
   * Exit pointer lock
   */
  unlock(): void {
    document.exitPointerLock();
  }

  /**
   * Update controls (call every frame)
   */
  update(deltaTime: number): void {
    if (!this.isLocked) return;

    // Update camera orientation from euler angles
    this.camera.quaternion.setFromEuler(this.euler);

    // Calculate movement direction
    this.direction.set(0, 0, 0);

    if (this.moveForward) this.direction.z -= 1;
    if (this.moveBackward) this.direction.z += 1;
    if (this.moveLeft) this.direction.x -= 1;
    if (this.moveRight) this.direction.x += 1;
    if (this.moveUp) this.direction.y += 1;
    if (this.moveDown) this.direction.y -= 1;

    // Normalize direction
    if (this.direction.length() > 0) {
      this.direction.normalize();
    }

    // Transform direction to camera space
    this.direction.applyQuaternion(this.camera.quaternion);

    // Calculate target velocity
    const speedMultiplier = this.boost ? this.boostMultiplier : 1;
    const targetSpeed = this.baseSpeed * speedMultiplier;
    const targetVelocity = this.direction.multiplyScalar(targetSpeed);

    // Apply acceleration/damping
    const dampingFactor = this.direction.length() > 0 
      ? this.acceleration 
      : this.damping;

    this.velocity.x = damp(this.velocity.x, targetVelocity.x, dampingFactor, deltaTime);
    this.velocity.y = damp(this.velocity.y, targetVelocity.y, dampingFactor, deltaTime);
    this.velocity.z = damp(this.velocity.z, targetVelocity.z, dampingFactor, deltaTime);

    // Apply velocity to camera position
    this.camera.position.add(
      this.velocity.clone().multiplyScalar(deltaTime)
    );
  }

  /**
   * Get current speed magnitude
   */
  getSpeed(): number {
    return this.velocity.length();
  }

  /**
   * Check if controls are locked
   */
  getIsLocked(): boolean {
    return this.isLocked;
  }

  /**
   * Set callbacks
   */
  onLock(callback: () => void): void {
    this.onLockCallback = callback;
  }

  onUnlock(callback: () => void): void {
    this.onUnlockCallback = callback;
  }

  /**
   * Disable controls (for focus mode)
   */
  disable(): void {
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.moveUp = false;
    this.moveDown = false;
    this.boost = false;
    this.velocity.set(0, 0, 0);
  }
}
