import {MODULE_ID} from "../config.js";

export function registerSettings() {
  const register = (key, data) => game.settings.register(MODULE_ID, key, data);
  register("defaultQuality", {name:"ROAR.Settings.Quality", hint:"ROAR.Settings.QualityHint", scope:"client", config:true, type:String, choices:{low:"ROAR.Quality.Low",medium:"ROAR.Quality.Medium",high:"ROAR.Quality.High",ultra:"ROAR.Quality.Ultra"}, default:"high"});
  register("masterVolume", {name:"ROAR.Settings.Volume", hint:"ROAR.Settings.VolumeHint", scope:"client", config:true, type:Number, range:{min:0,max:1,step:0.05}, default:0.8});
  register("defaultRadius", {name:"ROAR.Settings.Radius", hint:"ROAR.Settings.RadiusHint", scope:"world", config:true, restricted:true, type:Number, range:{min:1,max:20,step:1}, default:6});
  register("enableVfx", {name:"ROAR.Settings.VFX", hint:"ROAR.Settings.VFXHint", scope:"client", config:true, type:Boolean, default:true});
  register("enableShake", {name:"ROAR.Settings.Shake", hint:"ROAR.Settings.ShakeHint", scope:"client", config:true, type:Boolean, default:true});
  register("debug", {name:"ROAR.Settings.Debug", hint:"ROAR.Settings.DebugHint", scope:"client", config:true, type:Boolean, default:false});
  register("maxActiveEffects", {name:"ROAR.Settings.MaxActive", hint:"ROAR.Settings.MaxActiveHint", scope:"client", config:true, type:Number, range:{min:1,max:12,step:1}, default:4});
}

export const setting = key => game.settings.get(MODULE_ID, key);
export function debug(...args) { if (setting("debug")) console.debug("Roar Impact |", ...args); }
