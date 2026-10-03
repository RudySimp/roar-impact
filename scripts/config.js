export const MODULE_ID = "roar-impact";
export const MODULE_PATH = `modules/${MODULE_ID}`;
export const VERSION = "1.0.0";
export const SOCKET = `module.${MODULE_ID}`;
export const QUALITY = {
  low: new Set(["impulse", "shockwave", "dust", "ground"]),
  medium: new Set(["impulse", "shockwave", "dust", "ground", "particles", "debris", "residual"]),
  high: new Set(["impulse", "shockwave", "dust", "ground", "distortion", "particles", "debris", "residual"]),
  ultra: new Set(["impulse", "shockwave", "dust", "ground", "distortion", "particles", "debris", "residual"])
};
export const LIMITS = Object.freeze({intensity:[0.25,2], radius:[1,20], volume:[0,1], maxActive:[1,12]});
export const VFX_ORDER = ["impulse", "shockwave", "dust", "ground", "distortion", "debris", "particles", "residual"];
