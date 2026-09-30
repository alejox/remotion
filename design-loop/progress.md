# Design loop progress

Bar: Apple MacBook Pro page · System: design-system.md (section 0 overrides)

| Piece | Round | Brief | System | Craft | Status |
|---|---|---|---|---|---|
| P1 16:9 showcase (PlantillaAlejox) | 6 | PASS | PASS | FAIL | paused (usage limit) |
| P3 Subscribe button, glass (in 16:9 showcase) | 3 | PASS | PASS | FAIL | iterate |
| P4 Transition, Apple style | 0 | - | - | - | pending |
| P2 9:16 showcase + captions, Apple style | 0 | - | - | - | pending |

## Gap history

### P1 round 1
- Brief: components are not named on screen; keyword/title/section/stat read as the same text slide; lower third on black reads as a bare lockup.
- System: two-line headline read as a size-ratio violation (f0390) - rule clarified: a multi-line headline at one size is one size.
- Craft (B = Apple better): stat frame spends cyan on the whole line; "3x" has no stage. Next: skeleton mock UI too crude; logo disc reads as avatar sticker; mono "01" is a third voice.

### P1 round 2
- Brief: spotlight pill not visibly connected to its target; lower third reads as a full-screen card.
- System: flagged 3-4 type sizes and cyan checks - verified false by orchestrator (checks white, labels = body size); valid: empty placeholder panel (f0150).
- Craft (B better): lower third inside a full-frame bordered box breaks "black is the stage". Also: every Apple frame has a hero object; ours hug the left.

### P1 round 3
- Brief: PASS (weakest: spotlight callout still weak).
- System: FAIL claimed 3 type sizes - disproved by pixel measurement (label cap height 26px = cap height of 34px body). Haiku misread 3 rounds in a row; system critic moves to Sonnet.
- Craft (B better): FOCO frame - hard white box, pill butted to panel, target toggle reads OFF, no headline leader.

### P1 round 4
- Brief: PASS (weakest: compare reads as a stack; spotlight pill has no connector).
- System (now Sonnet, measured): only fail = "3x" figure over the 12% headline cap -> doc gap; added a display-figure exception (one figure/frame, <=35% height, one shared size).
- Craft (B better): compare payoff - "4 horas" barely registers, "20 min" arrives before the strike finishes and is smaller than "3x". Secondary: section slash reads as a thin border, not a diagonal slash.

### P1 round 5
- Brief: PASS (weakest: value/checklist read as plain slides).
- System: "20 min" cyan 5.63% > 5%; loser colour dimmed (doc now allows tokens at reduced opacity); figure glyphs 15-20px off the column.
- Craft (B better): Foco - pill duplicates the row text, weak hierarchy, badge gray, pill still moving while toggle flips, top-heavy. Lower third name/tagline same size.

Scope change (user, 2026-09-29): add a glass (Apple Liquid Glass) subscribe button inside the 16:9 showcase, an Apple-style transition, and Apple-style captions.

### P3 round 1
- Rendered `PlantillaAlejox` frame 1320 at 50% to `/private/tmp/plantilla-suscribe-glass.png`.
- Brief: PASS — clear subscribe CTA integrated into the 16:9 component showcase.
- System: FAIL — later independent review found that this video-background showcase frame diverges from the current black-canvas-only rule. User explicitly requested video for the Liquid Glass review; document a narrowly scoped exception.
- Craft: FAIL — pill fill reads as opaque; video translucency and a specular edge are too subtle.

### P3 round 2
- Rendered `PlantillaAlejox` frame 1320 at 50% to `/private/tmp/plantilla-suscribe-glass-round2.png`.
- Brief: PASS — CTA stays legible and distinct.
- System: FAIL — cited the same black-canvas rule, which must be scoped for the user's video-backed glass review.
- Craft: FAIL — pill still reads as opaque against the frosted parent card; strengthen visible translucency and the narrow top-edge reflection.

### P3 round 3
- Updated `design-system.md` with a scoped T3 video-background exception and rendered `/private/tmp/plantilla-suscribe-glass-round3.png` at 50%.
- Brief: PASS — the CTA is legible over the requested video.
- System: PASS — current rule now explicitly allows this single video-backed T3 review; other showcase beats remain black.
- Craft: FAIL — footage is visible through the pill but still too muted; the idle edge reads white instead of cyan and the reflection is too thin. Strengthen transparency/detail and cyan/specular cues, without glow.

### P1 round 6
- Brief: PASS. System: PASS (minor: strike starts at x=184).
- Craft (B better): accent is on the annotation, not the interaction. Next fix: remove the "1" badge; the toggle track turns cyan when ON (iOS-style); window title white; rows as hairline separators on one dark surface; in Valor, "más rápido." arrives BEFORE "3x".
- Note: opticalShift measures fonts at render time (returns 0 if font not loaded) - replace with a fixed constant before shipping.
