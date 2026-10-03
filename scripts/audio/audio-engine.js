import {MODULE_PATH} from "../config.js";
import {clamp, sleep} from "../utils/math.js";
import {debug, setting} from "../settings/settings.js";

export class AudioEngine {
  constructor() { this.active = new Map(); this.cache = new Map(); }
  path(relative) { return `${MODULE_PATH}/${relative}`; }
  async preloadProfile(profile) {
    const files = [profile.mainAudio, ...profile.depthLayers.map(layer => layer.file)];
    await Promise.allSettled(files.map(async file => {
      if (!this.cache.has(file)) this.cache.set(file, await foundry.audio.AudioHelper.preloadSound(this.path(file)));
      return this.cache.get(file);
    }));
  }
  async #playOne(file, volume, delayMs = 0, fadeInMs = 0) {
    if (delayMs) await sleep(delayMs);
    const src = this.path(file);
    let sound = this.cache.get(file);
    try {
      if (!sound || sound.playing) sound = await foundry.audio.AudioHelper.preloadSound(src);
      await sound.play({volume:clamp(volume,0,1), fade:Math.max(0,fadeInMs)});
      this.cache.set(file, sound);
      return sound;
    } catch (error) { debug("Audio failed", src, error); return null; }
  }
  async play(event, profile) {
    const master = setting("masterVolume");
    const handles = [];
    const tasks = [this.#playOne(profile.mainAudio, profile.mainGain * event.mainVolume * master)];
    for (const layer of profile.depthLayers) tasks.push(this.#playOne(layer.file, layer.gain * event.depthVolume * master, layer.delayMs, layer.fadeInMs));
    const settled = await Promise.all(tasks);
    handles.push(...settled.filter(Boolean));
    this.active.set(event.eventId, handles);
    return handles;
  }
  async stop(eventId) {
    const handles = this.active.get(eventId) ?? [];
    this.active.delete(eventId);
    await Promise.allSettled(handles.map(sound => sound.stop({fade:120})));
  }
  async stopAll() { await Promise.allSettled([...this.active.keys()].map(id => this.stop(id))); }
}
