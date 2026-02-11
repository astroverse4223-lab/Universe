/**
 * Mathematical utilities for 3D calculations
 */

import * as THREE from 'three';

/**
 * Smoothly interpolate (lerp) between two values
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Smooth damping for camera motion (exponential decay)
 */
export function damp(
  current: number,
  target: number,
  smoothTime: number,
  deltaTime: number
): number {
  return lerp(current, target, 1 - Math.exp(-deltaTime / smoothTime));
}

/**
 * Calculate orbital position at a given time
 */
export function getOrbitalPosition(
  semiMajorAxis: number,
  period: number,
  time: number,
  offset: number = 0
): THREE.Vector3 {
  const angle = ((time / period) * Math.PI * 2 + offset) % (Math.PI * 2);
  return new THREE.Vector3(
    Math.cos(angle) * semiMajorAxis,
    0,
    Math.sin(angle) * semiMajorAxis
  );
}

/**
 * Create evenly distributed points on a sphere (for stars)
 */
export function fibonacciSphere(samples: number, radius: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

  for (let i = 0; i < samples; i++) {
    const y = 1 - (i / (samples - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = phi * i;

    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    points.push(new THREE.Vector3(x * radius, y * radius, z * radius));
  }

  return points;
}
