// Geographic utility functions for distance and direction calculations

export type Direction = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

/**
 * Calculate distance between two points using Haversine formula
 * @param lat1 Latitude of first point
 * @param lng1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lng2 Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance);
}

/**
 * Calculate bearing from one point to another
 * @param lat1 Latitude of first point
 * @param lng1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lng2 Longitude of second point
 * @returns Direction as one of 8 cardinal directions
 */
export function calculateBearing(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): Direction {
  const dLng = toRadians(lng2 - lng1);
  const y = Math.sin(dLng) * Math.cos(toRadians(lat2));
  const x =
    Math.cos(toRadians(lat1)) * Math.sin(toRadians(lat2)) -
    Math.sin(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.cos(dLng);
  
  let bearing = toDegrees(Math.atan2(y, x));
  bearing = (bearing + 360) % 360;
  
  // Convert bearing to 8-direction compass
  const directions: Direction[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
}

/**
 * Calculate proximity percentage (0-100%)
 * Based on distance, where 20,000km = 0% and 0km = 100%
 * @param distance Distance in kilometers
 * @returns Proximity percentage (0-100)
 */
export function calculateProximity(distance: number): number {
  const maxDistance = 20000; // Maximum Earth distance
  const proximity = Math.max(0, 100 - (distance / maxDistance) * 100);
  return Math.round(proximity);
}

/**
 * Get arrow emoji for direction
 * @param direction Cardinal direction
 * @returns Arrow emoji
 */
export function getDirectionArrow(direction: Direction): string {
  const arrows: Record<Direction, string> = {
    N: '⬆️',
    NE: '↗️',
    E: '➡️',
    SE: '↘️',
    S: '⬇️',
    SW: '↙️',
    W: '⬅️',
    NW: '↖️',
  };
  return arrows[direction];
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}
