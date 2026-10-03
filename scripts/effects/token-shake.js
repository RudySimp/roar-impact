import {smoothFalloff} from "../utils/math.js";

export class TokenShakeManager {
  constructor() { this.states = new Map(); }
  visual(token) { return token?.mesh?.position ? token.mesh : token; }
  set(effectId, token, dx, dy) {
    const visual = this.visual(token);
    const id = token?.id;
    if (!id || !visual?.position || visual.destroyed) return;
    let state = this.states.get(id);
    if (!state || state.visual !== visual) {
      state = {visual, baseX:visual.position.x, baseY:visual.position.y, contributions:new Map()};
      this.states.set(id, state);
    }
    state.contributions.set(effectId, {dx,dy});
    this.#apply(state);
  }
  remove(effectId, token) {
    const state = this.states.get(token?.id);
    if (!state) return;
    state.contributions.delete(effectId);
    if (!state.visual || state.visual.destroyed) return void this.states.delete(token.id);
    if (!state.contributions.size) {
      state.visual.position.set(state.baseX, state.baseY);
      this.states.delete(token.id);
    } else this.#apply(state);
  }
  #apply(state) {
    let x = 0, y = 0;
    for (const offset of state.contributions.values()) { x += offset.dx; y += offset.dy; }
    state.visual.position.set(state.baseX + x, state.baseY + y);
  }
  start(effectId, source, radiusPx, sourceAmplitude, nearbyAmplitude, durationMs = 1050) {
    const origin = source.center;
    const affected = [];
    for (const token of canvas.tokens?.placeables ?? []) {
      const distance = Math.hypot(token.center.x-origin.x, token.center.y-origin.y);
      const amplitude = token === source ? sourceAmplitude : nearbyAmplitude * smoothFalloff(distance, radiusPx);
      if (amplitude > 0.02) affected.push({token, amplitude, phase:Math.random()*Math.PI*2});
    }
    let raf = 0, stopped = false;
    const start = performance.now();
    const cleanup = () => {
      if (stopped) return;
      stopped = true;
      cancelAnimationFrame(raf);
      for (const item of affected) this.remove(effectId, item.token);
    };
    const frame = now => {
      if (stopped || !canvas?.ready) return cleanup();
      const p = (now-start)/durationMs;
      if (p >= 1) return cleanup();
      const envelope = Math.pow(1-p, 2.4) * Math.min(1,p/0.04);
      for (const item of affected) {
        const t = now/38 + item.phase;
        this.set(effectId, item.token, Math.sin(t*1.71)*item.amplitude*envelope, Math.cos(t*2.13)*item.amplitude*envelope);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return {cleanup, affected:affected.length};
  }
  cleanupAll() {
    for (const state of this.states.values()) if (state.visual && !state.visual.destroyed) state.visual.position.set(state.baseX,state.baseY);
    this.states.clear();
  }
}
