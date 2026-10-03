import {MODULE_PATH, QUALITY, VFX_ORDER} from "../config.js";
import {clamp, seededChoice, sleep} from "../utils/math.js";
import {debug} from "../settings/settings.js";

export class VfxEngine {
  constructor(shake) { this.shake = shake; this.manifest = null; this.active = new Map(); }
  async initialize() { this.manifest = await fetch(`${MODULE_PATH}/data/vfx-manifest.json`).then(r => r.json()); }
  getGridSize() { return Number(canvas.grid?.size ?? canvas.dimensions?.size) || 100; }
  getScale(source, profile, event) {
    const size = Math.sqrt(Math.max(1, Number(source.document?.width || 1) * Number(source.document?.height || 1)));
    return clamp(profile.vfxScale * event.intensity * (0.72 + 0.28*Math.sqrt(size)), 0.45, 3.2);
  }
  async #videoSprite(category, variant, origin, sizePx, scale, config) {
    const video = document.createElement("video");
    video.src = `${MODULE_PATH}/assets/vfx/roar/roar_${category}_${variant}.webm`;
    video.muted = true; video.playsInline = true; video.preload = "auto"; video.crossOrigin = "anonymous";
    await new Promise((resolve,reject) => { video.addEventListener("loadeddata",resolve,{once:true}); video.addEventListener("error",reject,{once:true}); });
    const texture = PIXI.Texture.from(video);
    const sprite = new PIXI.Sprite(texture);
    sprite.anchor.set(0.5); sprite.position.set(origin.x,origin.y);
    const diameter = sizePx * config.scale * scale;
    sprite.width = diameter; sprite.height = diameter; sprite.alpha = config.opacity;
    sprite.blendMode = category === "distortion" ? "screen" : "normal";
    await video.play();
    return {sprite, video, texture};
  }
  #fallback(origin, radiusPx, intensity) {
    const g = new PIXI.Graphics();
    g.position.set(origin.x,origin.y); g.alpha = 0.7;
    if (typeof g.circle === "function") g.circle(0,0,radiusPx*0.15).stroke({width:3,color:0xe8ded0,alpha:0.55});
    else { g.lineStyle(3,0xe8ded0,0.55); g.drawCircle(0,0,radiusPx*0.15); }
    let raf=0, stopped=false; const start=performance.now(), duration=1000;
    const frame=now=>{ const p=(now-start)/duration; if(stopped||p>=1) return cleanup(); g.scale.set(0.2+0.8*p); g.alpha=(1-p)*0.65*intensity; raf=requestAnimationFrame(frame); };
    const cleanup=()=>{if(stopped)return; stopped=true;cancelAnimationFrame(raf);g.removeFromParent?.();g.destroy?.();};
    (canvas.interface ?? canvas.stage).addChild(g); raf=requestAnimationFrame(frame); return {cleanup};
  }
  async play(event, profile, source) {
    const root = new PIXI.Container();
    root.name = `RoarImpact:${event.eventId}`; root.eventMode = "none"; root.sortableChildren = true;
    (canvas.interface ?? canvas.stage).addChild(root);
    const origin = {x:source.center.x,y:source.center.y};
    const grid = this.getGridSize();
    const radiusPx = event.radius * grid;
    const scale = this.getScale(source,profile,event);
    const resources=[]; const timers=[]; let cleaned=false;
    const cleanup=()=>{
      if(cleaned)return; cleaned=true;
      for(const timer of timers) clearTimeout(timer);
      for(const resource of resources){ try { resource.cleanup?.(); resource.video?.pause(); resource.sprite?.removeFromParent?.(); resource.texture?.destroy?.(true); } catch(error){ debug("VFX cleanup warning",error); } }
      try { root.removeFromParent?.(); root.destroy?.({children:true}); } catch(error){ debug("VFX root cleanup warning",error); }
      this.active.delete(event.eventId);
    };
    this.active.set(event.eventId,{cleanup});
    let loaded=0;
    const allowed=QUALITY[event.quality] ?? QUALITY.high;
    for(const [index,category] of VFX_ORDER.entries()) {
      if(!allowed.has(category)||!profile.enabledVfx.includes(category)) continue;
      const config=this.manifest.categories[category];
      const variant=event.randomize ? seededChoice(["a","b"],event.seed+index) : "a";
      const timer=setTimeout(async()=>{
        if(cleaned)return;
        try { const resource=await this.#videoSprite(category,variant,origin,grid*5,scale,config); if(cleaned){resource.video.pause();resource.texture.destroy(true);return;} resource.sprite.zIndex=index;root.addChild(resource.sprite);resources.push(resource);loaded++; }
        catch(error){ debug("VFX asset fallback",category,error); }
      },config.delayMs);
      timers.push(timer);
    }
    await sleep(220);
    if(!loaded && !cleaned) resources.push(this.#fallback(origin,radiusPx,event.intensity));
    const lifetime=Math.max(...Object.values(this.manifest.categories).map(c=>c.delayMs+c.durationMs))+500;
    timers.push(setTimeout(cleanup,lifetime));
    return {cleanup,radiusPx};
  }
  cleanupAll(){for(const effect of [...this.active.values()])effect.cleanup();this.shake.cleanupAll();}
}
