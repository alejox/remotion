# Deckboard Shorts

**Objective**: 3 vertical (1080x1920, 30 fps) hook Shorts cut from `public/deckboard.mp4`, with strong animated overlays.
**Scope**: new folder `src/short_deckboard/`, registration in `src/Root.tsx` (`Shorts` folder). No changes to `src/video_deckboard/`.
**Constraints**: source 3840x2160; audio leads picture ~3 frames (use muted video + delayed `<Audio>` like `video_deckboard/BackgroundVideo.tsx`); only ONE audible instance per short; safe area x 80..940; `trimBefore`/`trimAfter`; no `<Sequence from={0}>`.
**TDD**: off (no test runner for compositions). Checks: `npx tsc --noEmit`, `npx eslint src`, still-frame renders.

## Shorts (source seconds)
1. `ShortDeckboardGratis` — "Stream Deck GRATIS con tu celular": intro 4.78–24.30 + demo 339.6–360.4.
2. `ShortDeckboardMicAire` — "Botón ON AIR para tu micrófono": 360.4–376.4 + 391.24–426.18.
3. `ShortDeckboardConectar` — "Conecta Deckboard a OBS": WebSocket 120.5–155.36 + QR 226.24–245.38.

## Tasks
- [x] T1 Build shared components + 3 compositions (route: delegated writer — 2+ non-trivial files)
- [x] T2 Register in Root, typecheck, lint, still renders verified

## Progress
- Created 2026-09-29.
- 2026-09-29: T1+T2 done. Gratis 1264f, MicAire 1579f, Conectar 1708f. tsc+eslint clean, stills reviewed. A/V by ear pending. Not committed (main has unrelated uncommitted work).
