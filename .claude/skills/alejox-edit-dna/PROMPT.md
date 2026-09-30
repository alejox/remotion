# Alejox Gaming edit DNA — Tech Clean v2

Attach `reference/channel-page.png`: take colours, logo, 20° seam only.

Small white Geist labels, flat dark panels, one cyan accent; footage is the star.

**WEIRD MOVE:** the 20° slash, the only non-orthogonal thing: top cut of every panel's 6px left bar, the section wipe, the lower-third tick.

## Moves
- Small text: labels are 3.2% of frame height, section titles 8%.
- Panels `#0E0E12` 90%, radius 12, flat; 1px white-8% hairline over busy footage.
- Accent: cyan `#25A1DC` only, under 2% of the frame. Grape `#5A2885` is only for the slash and section cards.
- SPOTLIGHT: dim the rest to 45%, draw a 2px cyan box and add a step chip. Zoom at most once per step: ≤1.8x over 18 frames, smooth.
- Motion: enter 12f ease-out, 16px slide + fade; exit 8f; zero overshoot.

## Bans
- Never condensed, skewed, outlined or shadowed type, and never ALL-CAPS titles.
- No yellow in video (thumbnails only).
- Never zoom the talking head. Never more than 1 zoom per step.
- No bounce, shake, scale-pop.
- Never more than 1 overlay at a time.
- Never cover the face or the UI being explained.
- No glows, textures, particles, emoji.

## Type
- Geist 500/700, sentence case, max 2 sizes/frame. Jost: brand only. Anton: thumbnails only.
- Geist Mono for ports, IPs, file names.

## Archetypes
TITLE, LOWER_THIRD, SECTION, KEYWORD, SPOTLIGHT, VALUE, CHECKLIST, COMPARE, OUTRO. In `src/brand/`.

## Self-check
- T1: cyan under 2%, no yellow.
- T2: 2 sizes at most.
- T3: text under 9% of frame height.
- T4: Geist, no stroke/shadow/skew.
- T5: slash on every panel.
- T6: inside the safe area.
- T7: enter in 12 frames, exit in 8.
- T8: no talking-head zoom.
- T9: text at least 26px at 1080 wide.
- T10: when you squint, the footage reads first.
- T11: logo centred in disc (measured).

> Before returning any output, run every test in the self-check. Name each test and its result. If any fails, repair the output and run them again. Never return output with a failing test and a note explaining it away.
