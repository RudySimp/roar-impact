export const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || 0));
export const smoothFalloff = (distance, radius, power = 1.55) => {
  if (!(radius > 0) || distance >= radius) return 0;
  return Math.pow(1 - clamp(distance / radius, 0, 1), power);
};
export const hashSeed = text => {
  let hash = 2166136261;
  for (const char of String(text)) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return hash >>> 0;
};
export const seededChoice = (items, seed) => items[Math.abs(seed) % items.length];
export const sleep = ms => new Promise(resolve => setTimeout(resolve, Math.max(0, ms)));
