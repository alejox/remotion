# Alejox Gaming Design System - "Tech Clean" (DNA v2)

Sources of truth: `src/brand/tokens.ts`, `motion.ts`, `fonts.ts`, `.claude/skills/alejox-edit-dna/dna.json`.
Soul: small white Geist labels on flat near-black panels, ONE cyan accent, a 20 degree grape-to-cyan slash as the only flourish, footage untouched (MKBHD restraint + functional screen callouts). Adjectives: calm, precise, technical, trustworthy.
Where code and dna.json prose disagree, the code value wins (noted as "conflict"). Anything not listed is "not specified".

## 0. Showcase mode (Apple-led) - OVERRIDES everything below where they conflict
Decision (2026-09-29): the templates are a component showcase on black, no footage, except for the scoped T3 Liquid Glass review frame. The brand keeps ONLY its logo (LogoMark/LogoDisc) and its colour tokens (white, fog, cyan, grape, panel/slot). Everything else - type scale, layout, spacing, motion, component look - is 100% Apple product-page style. Where a rule below conflicts with this section, this section wins.

- **Canvas**: pure black `#000000`. At least 55% of every frame is empty black. **T3-only exception**: show the clean SubscribeCard review beat over the user's looping `public/glass-test.mp4` so the Liquid Glass control can be judged over real, visually rich footage; keep black canvas for every other showcase beat. Do not generalize this exception to other components.
- **No text panels**: text sits directly on black. `Panel` boxes are only for UI objects (Spotlight step chip, subscribe button/bar). UI objects are dark-gray (`#1D1D1F`-ish) rounded pills; cyan is the only interaction colour.
- **Brand slash**: only on the diagonal wipe and the SectionCard. Not on every overlay.
- **Type scale**: at most 2 sizes per frame (a headline that wraps onto 2 lines at one size counts as ONE size; the 2.5x ratio applies between headline and body/eyebrow only) (a small caps eyebrow counts as one of them). Headline is at least 2.5x the body size; headline may reach 12% of frame height (replaces T3's 9% cap). Exception - display figure: ONE numeric figure per frame (a stat like "3x" or "20 min") may be set at display size up to 35% of frame height; all display figures in the piece share one size. Headlines are 1-2 short lines, sentence case, may end in a period. Minimum text 26px.
- **Opacity**: colour tokens may be used at reduced opacity for de-emphasis (e.g. a dimmed "before" value); that is not a new colour.
- **Emphasis by luminance**: supporting copy in fog `#A1A1AA`, key phrase in white. Cyan on at most ONE element or line per frame (usually the number/stat). Cyan coverage < 5% of the frame.
- **One column**: every text block in a frame shares one left edge (16:9: x = 192; 9:16: x = 96) or one centred axis, never mixed. Nothing within 8% of a frame edge.
- **Motion**: entrance = fade + rise of 24-40px, `Easing.out(Easing.cubic)` (or `bezier(0.16,1,0.3,1)`), 16-24 frames; multi-line text staggers 4-6f per line; exit = fade 10-12f, no drift beyond 12px. Hold at least 2x the entrance time. Only one element moving at any moment. Still zero overshoot/bounce/scale-pop.
- **Content**: generic, product-neutral demo copy in neutral LatAm Spanish (tú). No references to Deckboard or any real product.
- **Suspended**: rules about footage (squint test on footage, never covering the speaker/UI, burned-in graphics, Shorts flat-dark <= 8%, T5 slash on every panel, T3 9% cap, left margin 96).
- SubscribeCard `classic` stays a replica of the original (brand-moment exception); only `clean` follows showcase mode.
- **T3 Liquid Glass control**: the clean subscribe CTA is its own distinct control layer, used sparingly over the T3 rich-video backdrop. Use the clear/translucent material only in this context; recognizable footage must remain visibly apparent through the button itself (not merely behind a frosted card). Preserve high-contrast white label text, use cyan as the sole interaction accent, and use no red in clean. A narrow, restrained specular reflection along the pill's top edge may define the glass surface; avoid an opaque gray pill, heavy blur, glow, or decorative color gradients. `classic` remains visually identical to its replica.

## 1. Color tokens
| Token | Hex | Role | Allowed where |
|---|---|---|---|
| panel | `#0E0E12` | Panel fill at 90% opacity (`rgba(14,14,18,0.9)`); also SectionCard and Outro full-frame background | Panels, section/outro frames |
| slot | `#17171D` | Flat end-screen slots | Outro only |
| white | `#FFFFFF` | All primary text; LogoDisc fill | Any text |
| fog | `#A1A1AA` | Secondary text, meta labels, taglines | Meta/secondary lines only |
| cyan | `#25A1DC` | THE accent | Spotlight box + step chip, active caption word, ONE emphasised whole word in Keyword, checks, section number, winner hairline, slash bottom |
| grape | `#5A2885` | Brand only | Slash top, wipe leading band, nothing else |

- Frame coverage target: footage 85%, panels 9%, white/gray type 4%, cyan 1.5% (must be < 2%), grape 0.5%.
- Panel hairline (optional, over busy footage): `1px solid rgba(255,255,255,0.08)`. Panel radius 12px. Slash width 6px.
- Banned colors/effects: yellow in overlays (thumbnails only), gradients on text, neon glows, any accent other than cyan (no red, no green: checks are cyan; loser strike is white 60%). Only allowed gradient: the slash bar (grape top to cyan bottom).
- Conflict: dna.json archetype text mentions "green checks", "red strike", "JetBrains Mono", "Inter 700"; the code and bans use cyan checks, white-60% strike, Geist Mono, Geist 700. Follow code.
- Exception: SubscribeCard variant `classic` (replica of the burned-in original) uses white card, red `#FE2100` and blue ring `#3D4DA6`; variant `clean` follows the palette above. Classic is a brand moment, not the default.

## 2. Typography
- Geist (weights 500, 700): all video text. Geist Mono (500): ports, IPs, file names, values only. Jost (500, 700): brand moments only (wordmark, classic subscribe card). Anton: thumbnails ONLY, never in video. No other family (Inter/Montserrat not used except classic SubscribeCard).
- Fallbacks: Geist -> system-ui; Geist Mono -> ui-monospace/Menlo; Jost -> Futura/Century Gothic.
- Size scale (px, same for 1920x1080 and 1080x1920; both have a 1080px side):

| Role | px | Weight | Family | Case / tracking |
|---|---|---|---|---|
| meta (labels, step chip "PASO n", taglines) | 26 | 500 (chip number 700) | Geist | CAPS `+0.14em` for meta labels; tagline in sentence case |
| label (body lines, Keyword, name, checklist rows, chip text) | 34 | 500 or 700 | Geist | sentence case, `-0.02em` (chip text `-0.01em`) |
| title (TitleCard) | 46 | 700 | Geist | sentence case, `-0.02em` |
| value (ValueCard value, Compare price) | 64 | 500 mono / 700 Geist | Geist Mono / Geist | `-0.02em` for Compare |
| section (SectionCard, Outro headline) | 86 | 700 | Geist | sentence case, `-0.02em` |
| caption (Shorts) | 62 | 700 | Geist | sentence case, `-0.02em`, centred |

- Line height 1.25 (captions 1.2). Numerals tabular; section numbers "01", "02".
- Case: sentence case everywhere; CAPS only for small meta labels (e.g. "TUTORIAL · OBS", "PASO 2", ValueCard label).
- Checkable: min text 26px; max 2 distinct type sizes per overlay/frame; largest overlay text < 9% of frame height (86px = 8%); labels max 32 characters, one line; no stroke, shadow, skew, condensed or outlined display type; no partial-word coloring.
- Voice: neutral LatAm Spanish (tú), labels 2-6 words, statements like "Conecta Deckboard con OBS". Banned words: increíble, brutal, épico, INSANO.

## 3. Layout
Canvas: 16:9 = 1920x1080; Shorts 9:16 = 1080x1920; 30 fps.

**16:9 safe area**: x 96..1824, y 54..1026 (5% each side). MARGIN (left/right) = 96px for every archetype; EDGE = 64px (top of top-anchored, bottom of bottom-anchored overlays). Gutter 1.5%.
**9:16 safe area**: x 80..940, y 154..1498 of 1080x1920.

Rules:
- Overlays anchor to the lower-left or upper-left corner; left-aligned text, never centred in 16:9 (only Shorts captions centred, at x = 540).
- ONE overlay on screen at a time (Shorts: captions + at most one other). At least 3s of clean footage between talking-head overlays.
- Never cover the speaker's face or the UI being explained. Never place a chip/label over the UI element it explains. Never place an overlay over a burned-in source graphic (e.g. SUSCRITO banner/pill): TitleCard goes top-left when the bottom is occupied.
- Squint test: footage, not graphics, is the first thing seen.

Default positions (top-left of panel unless "bottom"):
| Component | 16:9 | 9:16 |
|---|---|---|
| TitleCard | x 96, y 64 | x 80, y 170 |
| LowerThird | x 96, bottom 64 | x 80, y 1250 |
| Keyword | x 96, bottom 64 | x 80, y 1250 |
| ValueCard | x 96, y 380 | x 80, y 1250 |
| Checklist | x 96, y 300 | x 80, y 1250 |
| Compare | x 96, y 64 | x 80, y 170 |
| Captions | not used in long form | top 1180, centred, plate max width 860 |
| SectionCard | full frame; content left at x 96, vertically centred | same template |
| Outro | full frame; content inside 96px margins | logo/text only, no end-screen slots |
| Spotlight | anchors to its target; chip auto-placed below, else above/right/left with gap, never on target | same |

Shorts layout: screen segments use a SPLIT: top ~42% speaker (face-cam crop, edge to edge), bottom ~58% screen crop edge to edge, straight divider with the slash at its left end, captions on the divider. Fallback: full-bleed screen crop over a blurred 40%-dark copy of itself. Flat #111/#0E0E12 area must be <= 8% of a Short frame (outro excepted). No end-screen cards in Shorts.

## 4. Motion
- Easing: `Easing.out(Easing.cubic)` for entrances; `Easing.in(Easing.cubic)` for exits; `Easing.inOut(Easing.cubic)` for zoom and draw-on. Springs (if any): `damping: 200` (critically damped). ZERO overshoot, bounce, shake, or scale-pop anywhere.
- Durations (30 fps): enter 12f (0.4s); exit 8f (0.27s); wipe 14f; zoom 18f in and 18f out; box/check draw-on 10-12f (Spotlight box 12f; Checklist row step 10f, draw 10f, first delay 10f); Shorts caption rise 4f; hold minimum 2s (60f).
- Enter: 16px slide up + fade (opacity 0->1). Exit: fade over last 8f + 8px drift up. Bars use width reveal; highlight boxes and checks use stroke draw-on (`evolvePath`).
- Text never moves once settled. Talking-head framing never moves: 0 zooms, 0 punch-ins.
- Zoom: only inside Spotlight on screen captures; scale 1.0 -> max 1.8 (`zoomMax`), 18f, at most once per step, centred on the target (no dead space), smooth (no overshoot). Motion blur (CameraMotionBlur) only on the section wipe and screen zooms.
- Spotlight dim: everything outside target keeps 45% brightness (`dimTo` 0.45). Highlight box: 2px cyan stroke, radius 8, padding 6, wraps only the target row.
- Diagonal wipe (between segments/sections, not on `join: "cut"` jump cuts): 14f, edge leans 20 degrees off vertical (top to the right), reveals left to right; leading band grape, following band cyan (band width 30px, hard edges, no blur). It is the ONLY loud moment.
- SectionCard: scene = wipe in + text + wipe out; section text hold approx 1.5s between wipes.
- Beat cadence: KEYWORD max 1 per 30s. CHECKLIST 2-4 rows. Audio leads picture by ~3f (`defaultAudioDelayFrames`); one audible track per segment.

## 5. Sound (`public/sfx/*.wav`, quiet, voice has priority)
| Motion | SFX | Gain | Length |
|---|---|---|---|
| Any overlay beat start (title, lowerThird, keyword, value, checklist, compare, spotlight) | `swipe` | 0.25 | 6f |
| Spotlight box finished drawing (start + 12f) | `pop` | 0.20 | 4f |
| Each diagonal wipe (not jump cuts, which are silent) | `whoosh` | 0.30 | 14f |
| SubscribeCard entrance | `whoosh` | 0.40 | 14f |
| SubscribeCard button press / bell click | `click` | 0.75 / 0.65 | 4f |
| SubscribeCard after bell click (+3f) | `chime` | 0.12 | 34f |
| SubscribeCard exit | `whoosh_out` | 0.35 | 14f |
| SubscribeCard beat itself | no swipe cue | - | - |
Available but unmapped in code: blip_didit, charge, impact, impact_big, pop_accent, riser, sparkle, stamp. No SFX is specified for Captions, Outro, or Shorts caption rise.

## 6. Component inventory (`src/brand/`)
- **Panel**: base of every overlay. `#0E0E12` 90%, radius 12, flat, no shadow; padding default 22/32/22/38; 6px slash on left edge with top cut at 20 degrees.
- **Reveal**: wraps one overlay in enter 12f / exit 8f. No visual of its own.
- **TitleCard (TITLE)**: first ~3s topic. Panel, caps meta label (26, fog, +0.14em, e.g. "TUTORIAL · OBS") + one-line sentence-case title (46/700). Top-left.
- **LowerThird**: first on-camera appearance. Panel with LogoDisc (84px) + "Alejoxgaming" (34/700) + "Tutoriales · Tecnología · Streaming" (26, fog). Bottom-left.
- **SectionCard (SECTION)**: chapter change. Full `#0E0E12` frame; left 10px slash, cyan "01" number (meta 34/500 caps tracking), 86/700 white title, left-aligned; wipes in/out.
- **Keyword (KEYWORD)**: term to remember. Small panel, 34/700, white; optional whole-word cyan (never part of a word). Bottom-left.
- **Captions (Shorts only)**: 2-4 words per chunk, Geist 700 62px, white with currently spoken word cyan, flat panel plate with slash, centred, 4f rise (fade + 10px), no scale. Never in 16:9 long form.
- **Checklist (CHECKLIST)**: 2-4 rows (row height 52, 34px text), optional small caps title, cyan checks drawn on one by one.
- **Compare (COMPARE)**: two columns (330px each) in one panel; meta caps label + 64/700 value; winner has 1px cyan hairline, loser gray with white-60% strike drawn across exact glyph width.
- **ValueCard (VALUE)**: caps fog label (26) + Geist Mono 64/500 value, exact copyable text (port, IP, setting).
- **Spotlight (SPOTLIGHT) + ZoomStage**: functional screen callout: dim to 45%, 2px cyan rounded box drawn on target, hairline Panel chip "PASO n · label" (meta caps + label 34/500), optional zoom <= 1.8x / 18f.
- **Outro (OUTRO)**: last ~10s. Full `#0E0E12` frame, LogoDisc, "Gracias por ver" (86/700), fog meta line; landscape adds two flat `#17171D` slots (16:9 video slot + circular subscribe slot) inside the 96px margins; Shorts: no slots.
- **SubscribeCard**: animated subscribe card (`subscribe` beat, standalone comp `SuscribeteAlejox`, transparent/ProRes 4444). Variants `classic` (replica) and `clean` (panel + slash + LogoDisc). Choreography: bar rises, button press, bell click, exit.
- **LogoMark**: inline vector "AG" triangle from `public/logo/alejox.svg`; optical centring baked into viewBox.
- **LogoDisc**: solid white disc holding LogoMark exactly (no padding/border/offset/transform). Mark bbox centre within 1.5% of disc diameter horizontally, 2-4% ABOVE disc centre vertically (test T11).
- **BeatLayer / BrandSfx / Footage / Source / register / timeline / transitions/diagonalWipe / PlantillaAlejox(+Short)**: engine wiring (beats mapping, SFX cues, segment series with wipes, config-driven compositions). No visual rules beyond those above.
- Logos in `public/logo`: `alejox.svg` (vector source), `alejox-logo.png`, `alejox-mark.png`.

## 7. Don'ts (DNA bans)
1. Never condensed, skewed, outlined or shadowed display type.
2. Never yellow in video overlays.
3. Never a punch-in or zoom on the talking head.
4. Never more than one zoom per screen-capture step.
5. Never overshoot, bounce, shake, or scale-pop entrances.
6. Never ALL CAPS titles (caps only for small meta labels).
7. Never more than one overlay on screen at once (Shorts: captions + at most one other).
8. Never cover the speaker's face or the UI element being explained.
9. Never glows, textures, particles, emoji, or gradients except the brand slash.
10. Never full subtitles in 16:9 long form.
11. Never place a chip/label over the UI element being explained.
12. Never partial-word coloring.
13. Never end-screen cards in Shorts.
14. Never an overlay while a burned-in source graphic is on screen.
15. Never flat black/empty areas over ~8% of a Short frame (outro excepted).
16. Never restyle components for a single video; never reuse v1 (Anton, MrBeast/thumbnail) style from `history/`.
17. No drop shadows, no textures; icons Lucide-style line, 2px stroke, white or cyan.

## 8. Mechanical test list (from dna.json)
T1 cyan < 2% of frame, no yellow. T2 <= 2 type sizes per frame. T3 largest overlay text < 9% of frame height. T4 Geist/Geist Mono (Jost brand moments), sentence case, no stroke/shadow/skew. T5 every panel has the 20 degree grape-to-cyan slash on its left edge. T6 overlays inside safe area. T7 entrances 12f, exits 8f, zero overshoot. T8 zero talking-head zooms; max one zoom per SPOTLIGHT step. T9 smallest text >= 26px. T10 squint test. T11 logo optical centring. T12 Shorts flat dark area <= 8%.
