# Foundry VTT v12 Compatibility Report

Reference target: Foundry VTT 12.343. Audit source: official Foundry VTT v12 API documentation.

| Component | v14 implementation | v12 compatibility | Action taken | Status |
|---|---|---|---|---|
| Manifest | v14-only compatibility | Same package fields | Restricted min/verified/max to 12; dedicated URLs | PASS |
| Initialization | `init`, `ready` | Present | None | PASS |
| Settings | `game.settings.register`, client/world | Present with used options | None | PASS |
| Application/UI | ApplicationV2 + Handlebars mixin | Present under `foundry.applications.api` | Retained supported API | PASS |
| Dialog | Not used | No dependency | None | PASS |
| Scene Controls | v14 keyed records and `onChange` | v12 `SceneControl[]`, `tools[]`, `onClick` | Replaced with array lookup/push | PASS |
| Canvas | interface/stage scene-space container | Present | Retained stage fallback | PASS |
| PIXI | Container, Sprite, Texture, Graphics | Present; v12 legacy Graphics API | Existing feature detection selects legacy path | PASS |
| Video VFX | Video-backed PIXI Texture | Supported mechanism | Media reused; cleanup retained | PASS (static/media) |
| Audio | AudioHelper preload; Sound play/stop | Required methods present | None | PASS |
| Token rendering | Temporary `token.mesh.position` contributions | Token mesh present | No document mutation | PASS |
| Hooks | init, ready, canvas teardown, controls | Present | Controls handler adapted | PASS |
| Sockets | package namespace via `game.socket` | Supported | Validation retained | PASS |
| Localization | manifest languages, `game.i18n` | Supported | None | PASS |
| Cleanup | RAF, PIXI, video and audio handles | Used methods present | Legacy fallback retained | PASS |

Live Canvas behavior, Electron VP9-alpha rendering, audio autoplay, and multi-client timing require a running Foundry VTT 12.343 installation and are NOT TESTED.
