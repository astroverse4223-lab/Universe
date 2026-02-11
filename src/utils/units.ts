/**
 * Unit conversion utilities for the simulation
 * This helps maintain consistent units across the codebase
 */

// Distance units (we use a scaled model for playability)
export const DISTANCE_UNITS = {
  AU_TO_SIMULATION: 50, // 1 AU = 50 simulation units
  KM_TO_SIMULATION: 0.00001, // Scale factor for km to simulation units
};

// Time units
export const TIME_UNITS = {
  EARTH_YEAR_SECONDS: 365.25 * 24 * 3600,
  EARTH_DAY_SECONDS: 24 * 3600,
};

// Scale factors for planetary radii and orbits
export const PLANET_RADIUS_SCALE = 2.5; // Planets scaled up for better visibility
export const ORBIT_RADIUS_SCALE = 0.85; // Orbits scaled closer for easier exploration

/**
 * Convert astronomical units to simulation units
 */
export function auToSimulation(au: number): number {
  return au * DISTANCE_UNITS.AU_TO_SIMULATION * ORBIT_RADIUS_SCALE;
}

/**
 * Convert kilometers to simulation units
 */
export function kmToSimulation(km: number): number {
  return km * DISTANCE_UNITS.KM_TO_SIMULATION * PLANET_RADIUS_SCALE;
}

/**
 * Format distance for display
 */
export function formatDistance(simulationUnits: number): string {
  const au = simulationUnits / (DISTANCE_UNITS.AU_TO_SIMULATION * ORBIT_RADIUS_SCALE);
  
  if (au < 0.01) {
    const km = simulationUnits / (DISTANCE_UNITS.KM_TO_SIMULATION * PLANET_RADIUS_SCALE);
    return `${km.toFixed(0)} km`;
  } else if (au < 1) {
    return `${(au * 149597870.7).toFixed(0)} km`;
  } else {
    return `${au.toFixed(2)} AU`;
  }
}

/**
 * Format speed for display
 */
export function formatSpeed(simulationUnitsPerSecond: number): string {
  const kmPerSecond = simulationUnitsPerSecond / DISTANCE_UNITS.KM_TO_SIMULATION;
  
  if (kmPerSecond < 1) {
    return `${(kmPerSecond * 1000).toFixed(0)} m/s`;
  } else {
    return `${kmPerSecond.toFixed(1)} km/s`;
  }
}
