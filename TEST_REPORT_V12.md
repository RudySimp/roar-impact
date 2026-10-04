# Roar Impact 1.0.0 — Foundry VTT v12 Test Report

Date: 2026-10-04

## PASS

- Backport is based on v14 production commit `76d14cffc865466211ae452ba3f0de7d5c4d4ceb`.
- Official v12 API documentation audited for ApplicationV2, Scene Controls, Canvas, Token mesh, AudioHelper/Sound, settings, sockets, and hooks.
- Scene Controls uses the v12 array/tool `onClick` structure; static audit rejects the v14 record structure.
- Manifest is `roar-impact` 1.0.0 and restricted to minimum/verified/maximum 12.
- Manifest uses the `foundry-v12` channel and `v1.0.0-foundry12` asset.
- Unit, JSON, profile, localization, asset-reference, security, syntax, media decode, build, and ZIP validations pass.

## FAIL

None known in functionality covered by static, media, integration, and package validation.

## NOT TESTED

- Live Foundry VTT 12.343 runtime.
- Square, hex, and gridless scenes in Foundry v12.
- Electron VP9-alpha rendering and autoplay policy in Foundry v12.
- Live multi-client socket timing in Foundry v12.
