# Alejox brand kit (edit identity)

**Objective**: A reusable editing identity for every future video. It has a DNA spec (`.claude/skills/alejox-edit-dna/`), a Remotion component kit (`src/brand/`) and demo compositions: `PlantillaAlejox` (16:9) and `PlantillaAlejoxShort` (9:16).
**Source of truth**: `.claude/skills/alejox-edit-dna/PROMPT.md` + `reference/channel-page.png` (the channel banner and thumbnails). The creator also wants a MrBeast-style rhythm layer.
**Constraints**:
- Do not modify existing edits.
- Leave the Deckboard Shorts unchanged.
- Demo footage comes from `public/deckboard.mp4`, with the audio delayed 3 frames.
- Leave the logo as a placeholder until the creator supplies `public/logo/alejox-logo.png`.
**TDD**: off. Checks are:
- `npx tsc --noEmit`
- `npx eslint src`
- stills
- `tools/check.py`
- the PROMPT.md self-check

## Tasks
- [x] T1 Extract the DNA (dna.json, PROMPT.md, SKILL.md, check.py). Route: inline.
- [x] T2 Build the brand kit components and the 2 template compositions. Route: delegated writer, because it touches 2+ non-trivial files.
- [ ] T3 Rebuild and diff: compare stills against the reference, then fold the gaps back into dna.json.

## Progress
- 2026-09-29: DNA captured. The user skipped the external bar, so the bar is the channel's own thumbnails, plus a MrBeast rhythm layer.
- 2026-09-29: T2 done (kit in src/brand, PlantillaAlejox 1198f, PlantillaAlejoxShort 857f; tsc+eslint clean). Direction changed to minimal design + MrBeast motion. Craft critic round 1 running.
- 2026-09-29: The user REJECTED v1 as too cartoonish, with zooms that distract. Round 2 was stopped. The DNA was rewritten as v2 "Tech Clean", combining MKBHD restraint with Harris Heller callouts; v1 is archived in `.claude/skills/alejox-edit-dna/history/`.
- [x] T4 Rebuild `src/brand` to DNA v2, including both templates. Route: delegated writer.
- [ ] T5 Craft critic on the v2 stills, fixing until it passes.
- [ ] T6 Final cleanup: remove whatever falls outside the approved v2 style. Confirm the list with the user before deleting anything.
- 2026-09-29: T4 done. v2 kit is config-driven: VideoConfig/ShortConfig, examples in src/brand/examples, calculateMetadata; PlantillaAlejox 1815f, Short 829f. tsc + eslint clean. LogoMark vector measured dx 0-0.6%, dy -3.0 to -3.4%. Craft critic round 1 of v2 running.
- [x] T7 Rebuild SubscribeCard (the Apple Motion subscribe animation) in Remotion: classic and clean variants, a SUBSCRIBE beat, and a standalone SuscribeteAlejox composition. Route: the same delegated writer, queued after round 2.
- 2026-09-29: T7 done: SubscribeCard (classic + clean), placed at the end of both templates. The Shorts split layout is done: face on top, screen below, no black. tsc is clean. The writer's final report was not received; this state was verified from the stills and tsc.
