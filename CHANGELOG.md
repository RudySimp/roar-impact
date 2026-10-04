# Changelog

## 1.0.0 — Foundry VTT v12 Edition — 2026-10-04

- Backported the v14 production release to Foundry VTT v12.343.
- Adapted `getSceneControlButtons` from the v14 record/tool `onChange` shape to the v12 control/tool arrays and `onClick` callback.
- Preserved the v12 ApplicationV2, AudioHelper/Sound, Canvas, Token mesh, sockets, settings, profiles, media, and localized UI paths verified by the official v12 API documentation.
- Added a dedicated v12 manifest/update channel and v12-only release packaging.

## 1.0.0 — 2026-10-04

- Added seven monster-vocal profiles and layered audio engine.
- Added sixteen scene-space VP9 VFX assets with deterministic A/B selection.
- Added distance falloff and composable non-document token shake.
- Added validated multiplayer event synchronization.
- Added ApplicationV2 control panel, world/client settings, and EN/RU localization.
- Added procedural VFX fallback, teardown cleanup, validators, release build, and CI.
