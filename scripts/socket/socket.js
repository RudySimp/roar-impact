import {LIMITS, SOCKET} from "../config.js";
import {clamp} from "../utils/math.js";
import {debug} from "../settings/settings.js";

const EVENT_ID = /^[A-Za-z0-9:_-]{8,100}$/;
const ID = /^[A-Za-z0-9_-]{1,64}$/;

export function validateEvent(payload, profileIds) {
  if (!payload || typeof payload !== "object") return null;
  if (!EVENT_ID.test(String(payload.eventId ?? ""))) return null;
  if (!ID.test(String(payload.sceneId ?? "")) || !ID.test(String(payload.sourceTokenId ?? ""))) return null;
  if (!profileIds.has(payload.profileId)) return null;
  return {
    type: "roar", eventId: String(payload.eventId), sceneId: String(payload.sceneId), sourceTokenId: String(payload.sourceTokenId),
    profileId: payload.profileId, intensity: clamp(payload.intensity, ...LIMITS.intensity), radius: clamp(payload.radius, ...LIMITS.radius),
    quality: ["low","medium","high","ultra"].includes(payload.quality) ? payload.quality : "high",
    mainVolume: clamp(payload.mainVolume, ...LIMITS.volume), depthVolume: clamp(payload.depthVolume, ...LIMITS.volume),
    audio: payload.audio !== false, vfx: payload.vfx !== false, shake: payload.shake !== false,
    randomize: payload.randomize !== false, seed: Number.isSafeInteger(payload.seed) ? payload.seed : 0,
    timestamp: clamp(payload.timestamp, 0, Number.MAX_SAFE_INTEGER)
  };
}

export function registerSocket(engine) {
  game.socket.on(SOCKET, payload => {
    if (payload?.senderId === game.user.id) return;
    if (!game.users.get(payload?.senderId)?.isGM) return debug("Rejected non-GM socket sender", payload?.senderId);
    const clean = validateEvent(payload, engine.profileIds);
    if (!clean || payload.type !== "roar") return debug("Rejected socket payload", payload);
    engine.playEvent(clean, {remote:true});
  });
}

export function emitEvent(event) { game.socket.emit(SOCKET, {...event, senderId:game.user.id}); }
