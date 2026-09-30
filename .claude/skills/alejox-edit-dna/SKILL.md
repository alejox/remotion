---
name: alejox-edit-dna
description: Alejox Gaming "Tech Clean" editing identity for Remotion. It combines MKBHD restraint with functional screen callouts. Use it whenever you edit or create overlays, Shorts, titles, lower thirds, captions or screen callouts for this channel's videos.
---

# Alejox edit DNA (v2, Tech Clean)

1. Before designing anything, read `PROMPT.md` and look at `reference/channel-page.png`. Take only its colours, logo and the 20° seam from it. The thumbnails stay loud, and the video does not copy them.
2. Build with `src/brand/` only. Do not restyle the components for a single video, because they are the identity.
3. To start a new video, follow "New video in 5 steps" in `src/brand/README.md`. Copy an example config from `src/brand/examples/`, then map the transcript beats to archetypes: TITLE, LOWER_THIRD, SECTION, KEYWORD, SPOTLIGHT, VALUE, CHECKLIST, COMPARE and OUTRO. The template components never hold video-specific values.
4. Render a still of every archetype you used.
   - Run the self-check in `PROMPT.md`.
   - Run `python3 .claude/skills/alejox-edit-dna/tools/check.py <still.png>`, adding `--short` for vertical stills.
   - Fix every failure before you deliver.

`dna.json` is the full record and is not meant to be pasted into a prompt. `history/` holds the rejected v1 "thumbnail/MrBeast" style. Do not reuse it.
