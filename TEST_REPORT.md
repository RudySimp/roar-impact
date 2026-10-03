# Roar Impact 1.0.0 — Test Report

Date: 2026-10-04

## PASS

- Four supplied archives extracted without modifying the originals.
- Source macro, source reports, sorted audio manifest, depth documentation, VFX player, VFX manifest, and VFX settings audited.
- Module manifest JSON, data JSON, and EN/RU localization JSON parse successfully.
- Manifest identity and version are consistent: `roar-impact` 1.0.0, Foundry minimum/verified/maximum 14.
- Seven unique profile IDs; every main/depth reference resolves; each profile uses one to three depth layers.
- Sixteen ASCII-named runtime VFX references resolve (eight categories × two variants).
- Node.js test runner: 3/3 tests pass (clamp, falloff, deterministic variant choice).
- JavaScript syntax check passes for all ten runtime modules and both Node.js validation files.
- Node.js package validator passes: seven profiles, sixteen VFX, manifest fields, JSON, asset references, depth counts, and unsafe-construct scan.
- FFprobe validates all 21 audio files (11 MP3 and 10 Vorbis); durations range from 1.653 to 41.639 seconds.
- FFmpeg fully decodes all 21 audio files without errors.
- FFprobe validates all 16 WebM files as VP9, 1024×1024, with `alpha_mode=1`; durations range from 0.4 to 2.7 seconds.
- FFmpeg fully decodes all 16 WebM files without errors.
- Socket payload uses an allowlist profile ID, strict IDs, boolean normalization, and clamped numeric values.
- Source contains no `eval`, `Function()`, arbitrary dynamic imports, or document-coordinate mutations.
- Release build excludes extraction data, tests, build cache, source archives, Git data, and raw WAV masters.
- ZIP root contains `module.json` and all runtime references.

## FAIL

None known in the production functionality covered by static and package validation.

## NOT TESTED

- Live Foundry VTT v14 graphical runtime.
- Actual square, hex, and gridless canvas rendering in Foundry.
- Browser-specific VP9 alpha compositing and audio autoplay behavior.
- Live multi-client socket timing.

These runtime items require a licensed running Foundry VTT v14 client and are not reported as passing.
