# Alejox brand kit (`src/brand/`) - DNA v2 "Tech Clean"

Small white Geist labels on flat near-black panels, one cyan accent, a 20 degree
grape-to-cyan slash as the only flourish, footage untouched. Rules:
`.claude/skills/alejox-edit-dna/` (`PROMPT.md`, `dna.json`); constants: `tokens.ts`.

## New video in 5 steps
1. Put the master in `public/` (plus a light proxy for the Studio, same timestamps).
2. Copy `examples/deckboard.config.ts` (16:9) or `examples/deckboard.short.config.ts` (9:16)
   to `examples/<video>.config.ts` and set `source` (file, preview, size).
3. Set `items` from the transcript: `camera` / `screen` segments in SOURCE seconds,
   `section` cards, `join: "cut"` for jump cuts. Shorts also set `cameraCrop`, `screen`, `captions`.
4. List `beats` by source seconds (`at: 128.2`): `title`, `lowerThird`, `keyword`,
   `spotlight` (target in 1920x1080 screen coords, optional `zoom` <= 1.8), `value`,
   `checklist`, `compare`, `subscribe`. The engine maps them across segments and wipes.
5. Register in `src/Root.tsx`, one line (duration comes from `calculateMetadata`):
   `<BrandVideoComposition id="MiVideo" config={miConfig} />` or `<BrandShortComposition ... />`.

The config is the composition's default props with a zod schema, so it is editable in the
Studio props panel. Templates (`PlantillaAlejox*.tsx`) hold no video-specific values.

## Starting a new video from the template
Everything clip-specific lives in the config; components hold only format defaults.
- **16:9**: copy `examples/showcase.config.ts`. Replace `source.placeholder` (demo backdrop) with
  `source.file` (+ `preview`), set `items` (segments, section cards), `beats` (times in source
  seconds, copy, optional `x`/`y`) and `outro`.
- **9:16**: copy `examples/showcase.short.config.ts`. Set `source` (drop `loop` for a real master),
  `cameraCrop` (9:16 window so the face sits on the centre line), `words` (caption transcript),
  `captions.cameraY` (just under the chin) and `captions.hideDuring`, then the `beats`
  (text beats above the head, glass objects below the chin; the subscribe beat uses
  `layout: "stacked"`). Set `labels` off for a real video.
- Register with one line in `src/Root.tsx`. Check stills with `npx remotion still <id> out.png --frame=N`.

## Archetypes (one file each)
`TitleCard`, `LowerThird`, `SectionCard`, `Keyword`, `Spotlight` (+ `ZoomStage`), `ValueCard`,
`Checklist`, `Compare`, `Outro`, `Captions` (Shorts only), all built on `Panel` (the slash), plus
`SubscribeCard` (variants `classic` / `clean`, layouts `row` / `stacked`; used through the `subscribe` beat).

## Rules the kit enforces
- One overlay at a time; footage is never zoomed except inside a Spotlight (<= 1.8x, 18f).
- Enter 12f (ease-out, 16px slide + fade), exit 8f, wipe 14f, no overshoot, shake or scale-pop.
- Geist 500/700 + Geist Mono (Jost for brand moments, Anton only in thumbnails); no stroke/shadow/skew on type; text >= 26px.
- Audio: pictures muted, one audible `<Audio>` per segment, delayed `audioDelayFrames`.
- Logo: vector `LogoMark` (optical centring baked in) inside `LogoDisc`; margin system: `MARGIN` 96 / `EDGE` 64.
- Nearly full disk: render only stills: `npx remotion still <id> out.png --frame=N`.

## Fonts

Bundled locally in `public/fonts/` (variable TTFs) and loaded in `src/brand/fonts.ts` with `@remotion/fonts`, so renders work offline. Geist = video text, Geist Mono = values, Jost = brand moments, Anton = thumbnails only (shipped, not loaded). To change a font, drop the file in `public/fonts/` and edit `fonts.ts`.

## Overlays sueltos para DaVinci Resolve
`Overlay` (carpeta *Overlays* del Studio) renderiza UN beat sobre fondo transparente con el mismo `BeatLayer`
de las plantillas. `node scripts/render-overlays.mjs <beats.json> [outDir]` renderiza todos los beats de un
config como ProRes 4444 con alfa y escribe `overlays.manifest.json`; el repo
[resolve-silence-cutter](https://github.com/alejox/resolve-silence-cutter) los coloca en V2 mapeando cada `at`
a la timeline recortada. Sin video detrás, el vidrio (lowerThird, checklist, subscribe) pierde el desenfoque y queda
como panel oscuro translúcido; `spotlight` no se soporta (necesita el video). En una máquina sin Chrome de Remotion:
`BROWSER_EXECUTABLE=... CHROME_MODE=headless-shell`.
