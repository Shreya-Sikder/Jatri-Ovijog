import { LatLng } from '../types';

// Constants for fare calculation
const METRO_BASE_FARE = 20;
const METRO_PER_KM = 5;
const METRO_MAX_FARE = 100;
const BUS_PER_KM = 2.40;

export function calculateDistance(start: LatLng, end: LatLng): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(end.lat - start.lat);
  const dLon = toRad(end.lng - start.lng);
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(start.lat)) * Math.cos(toRad(end.lat)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI/180);
}

export function calculateMetroFare(distance: number, isStudent: boolean = false, hasRapidPass: boolean = false): number {
  let fare = METRO_BASE_FARE + (distance * METRO_PER_KM);
  fare = Math.min(fare, METRO_MAX_FARE);
  
  if (isStudent) {
    fare *= 0.5; // 50% student discount
  }
  if (hasRapidPass) {
    fare *= 0.9; // 10% Rapid Pass discount
  }
  
  return Math.round(fare);
}

export function calculateBusFare(distance: number, isStudent: boolean = false): number {
  let fare = distance * BUS_PER_KM;
  if (isStudent) {
    fare *= 0.5; // 50% student discount
  }
  return Math.round(fare);
}