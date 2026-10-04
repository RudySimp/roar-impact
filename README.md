# Roar Impact

Roar Impact 1.0.0 on this branch is the standalone, system-agnostic edition for **Foundry Virtual Tabletop v12** (reference build 12.343). The current Foundry v14 edition remains on [`main`](https://github.com/RudySimp/roar-impact/tree/main).

## Features

- Seven tuned profiles: Colossal Dragon, Mutant Beast, Low Monster Growl, Long Monster Vocal, Dinosaur Vocal, Demon Scream, and Spectral Hiss.
- Main audio plus one to three low-volume depth layers with per-layer timing and gain.
- Eight VFX categories with deterministic A/B variation: impulse, shockwave, dust, ground reaction, distortion, debris, particles, and residual dust.
- Low, Medium, High, and Ultra client-side quality presets.
- Smooth distance falloff and stronger source-token reaction.
- Compact GM panel in Token scene controls.
- Foundry module socket synchronization; clients reconstruct the event from a validated compact payload.
- English and Russian localization.
- No required Sequencer, JB2A, socketlib, or libWrapper dependency.

## Installation

In Foundry VTT v12, choose **Add-on Modules → Install Module**, paste this v12-only manifest URL, and install:

`https://raw.githubusercontent.com/RudySimp/roar-impact/foundry-v12/module.json`

Foundry v12 release: [Roar Impact v1.0.0 - Foundry VTT v12](https://github.com/RudySimp/roar-impact/releases/tag/v1.0.0-foundry12). Foundry v14 users must use the [main v14 release](https://github.com/RudySimp/roar-impact/releases/tag/v1.0.0).

Enable **Roar Impact** in the world's module management screen.

## Use

1. Open a Scene and select exactly one source token.
2. Choose the Token controls and click the dragon icon.
3. Select a profile and tune intensity, radius, quality, audio, VFX, shake, and A/B variation.
4. Click **ROAR**. Only a GM may broadcast an event; every connected client renders it locally.

The module never updates token coordinates or actor/scene documents. Token shake is a temporary composable render-object offset which is restored during normal completion, scene teardown, or effect cleanup.

## Settings

Client settings control quality, master volume, VFX, token shake, debug logging, and the maximum number of concurrent effects. The world setting controls the default radius. All defaults are usable immediately.

## API

After Foundry's `ready` hook:

```js
game.modules.get("roar-impact").api.open();
await game.modules.get("roar-impact").api.play({profileId: "colossal-dragon"});
```

The `play` API is GM-only and accepts a Token via `token` plus the same optional controls exposed by the panel.

## Compatibility and limitations

- Intended for Foundry VTT v12 only; the manifest prevents installation as a v13/v14 build.
- A live Foundry v12.343 graphical runtime was not available during the automated release checks; see `TEST_REPORT_V12.md` for the exact verification boundary.
- Client autoplay policy may require a first browser interaction before audio can start.
- The supplied media are bundled runtime assets; their licensing is separate from the source-code license described in `LICENSE`.

Russian documentation: [README_RU.md](README_RU.md)

## Development

With Node.js 22 and PowerShell available:

```text
npm test
npm run validate
npm run build
```

## License

Source code is MIT-licensed. Bundled audio and VFX assets are excluded from the MIT grant; see `LICENSE`.
