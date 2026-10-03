import {LIMITS, MODULE_PATH} from "./config.js";
import {AudioEngine} from "./audio/audio-engine.js";
import {TokenShakeManager} from "./effects/token-shake.js";
import {VfxEngine} from "./vfx/vfx-engine.js";
import {emitEvent} from "./socket/socket.js";
import {clamp, hashSeed, sleep} from "./utils/math.js";
import {debug, setting} from "./settings/settings.js";

export class RoarEngine {
  constructor(){this.profiles=new Map();this.audio=new AudioEngine();this.shake=new TokenShakeManager();this.vfx=new VfxEngine(this.shake);this.active=new Map();this.seen=new Set();}
  get profileIds(){return new Set(this.profiles.keys());}
  async initialize(){
    const data=await fetch(`${MODULE_PATH}/data/roar-profiles.json`).then(r=>r.json());
    this.profiles=new Map(data.profiles.map(profile=>[profile.id,profile]));
    await this.vfx.initialize();
  }
  createEvent(source,options){
    const eventId=`ri-${Date.now().toString(36)}-${foundry.utils.randomID(12)}`;
    return {type:"roar",eventId,sceneId:canvas.scene.id,sourceTokenId:source.id,profileId:options.profileId,
      intensity:clamp(options.intensity,...LIMITS.intensity),radius:clamp(options.radius,...LIMITS.radius),quality:options.quality,
      mainVolume:clamp(options.mainVolume,...LIMITS.volume),depthVolume:clamp(options.depthVolume,...LIMITS.volume),
      audio:options.audio,vfx:options.vfx,shake:options.shake,randomize:options.randomize,seed:hashSeed(eventId),timestamp:Date.now()};
  }
  async broadcast(source,options){const event=this.createEvent(source,options);emitEvent(event);return this.playEvent(event);}
  async playEvent(event,{remote=false}={}){
    if(this.seen.has(event.eventId)||event.sceneId!==canvas.scene?.id)return;
    this.seen.add(event.eventId); if(this.seen.size>200)this.seen.delete(this.seen.values().next().value);
    const profile=this.profiles.get(event.profileId), source=canvas.tokens?.get(event.sourceTokenId);
    if(!profile||!source)return debug("Event source/profile unavailable",event);
    while(this.active.size>=clamp(setting("maxActiveEffects"),...LIMITS.maxActive))this.active.values().next().value.cleanup();
    const parts=[];let cleaned=false;
    const cleanup=()=>{if(cleaned)return;cleaned=true;for(const part of parts)part?.cleanup?.();this.audio.stop(event.eventId);this.active.delete(event.eventId);debug("cleanup",event.eventId);};
    this.active.set(event.eventId,{cleanup});
    debug("event",{remote,event,profile:profile.id});
    if(event.audio)this.audio.play(event,profile).catch(error=>debug("Audio event failed",error));
    const elapsed=Math.max(0,Date.now()-event.timestamp);
    await sleep(Math.max(0,profile.impactOffsetMs-elapsed));
    if(cleaned||canvas.scene?.id!==event.sceneId)return cleanup();
    const grid=Number(canvas.grid?.size??canvas.dimensions?.size)||100;
    if(event.shake&&setting("enableShake"))parts.push(this.shake.start(event.eventId,source,event.radius*grid,profile.sourceShake*event.intensity,profile.nearbyShake*event.intensity));
    if(event.vfx&&setting("enableVfx"))parts.push(await this.vfx.play(event,profile,source));
    setTimeout(cleanup,12000);
  }
  cleanupAll(){for(const event of [...this.active.values()])event.cleanup();this.vfx.cleanupAll();this.audio.stopAll();}
}
