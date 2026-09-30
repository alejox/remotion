# Template showcase (Apple-led design loop)

## Objective
Turn the brand templates into a generic component showcase on black, restyled 100% in Apple product-page style while keeping only the Alejox logo and colour tokens, and prove it with the design-loop critics.

## Why
There is no source footage anymore; the templates exist to demonstrate how each component works. The user chose apple.com/macbook-pro as the quality bar.

## Scope / constraints
- Keep: LogoMark/LogoDisc, colour tokens in `src/brand/tokens.ts`.
- Change: type scale, layout, spacing, motion, component look (see `design-system.md` section 0).
- Generic neutral LatAm Spanish demo copy; no Deckboard references in showcase configs.
- SubscribeCard `classic` stays a replica; `clean` gets restyled.
- TDD: off (no test runner configured in the project). Checks: `npx tsc --noEmit`, `npx eslint src`, `npx remotion still` renders, critic filmstrips.
- Delivery strategy: ask-on-risk. Branch `feat/alejox-brand-kit`.

## Loop artifacts
- Bar: `design-loop/bar.md`, reference frames `design-loop/reference/`.
- System: `design-system.md`.
- Progress: `design-loop/progress.md`.

## Tasks
- [x] T0 Footage optional, black fallback (inline; commit "feat(brand): make source footage optional...").
- [ ] T1 16:9 showcase: restyle shared components + generic showcase config for PlantillaAlejox (delegated writer).
- [ ] T2 9:16 Short showcase (delegated writer).
- [x] T3 Restyle the clean subscribe button with a restrained Apple Liquid Glass look and show it inside the 16:9 showcase (delegated direct; writer trigger: two non-trivial files, `SubscribeCard.tsx` and `showcase.config.ts`). Classic stays a replica.
- [ ] T4 Apple-style transition in brand colours (delegated writer).
- [ ] T5 Apple-style captions (subtitles), demoed in the Short (delegated writer; with T2).

## Acceptance
Each piece passes Brief, System and Craft critics (binary) on rendered frames; tsc and eslint clean.

## Progress / evidence
- T0: tsc + eslint OK, stills render black.
- T3: clean CTA uses a dark translucent, backdrop-blurred glass pill with a cyan edge/tint, a crisp white label and a subtle specular highlight; the classic variant remains unchanged. Added an 8.2s clean subscribe beat to the 16:9 showcase (the new `showcase.config.ts` remains uncommitted with T1's showcase work). `npx tsc --noEmit`, `npx eslint src`, and `git diff --check` passed. Visual check: `PlantillaAlejox` frame 1320 at 50% (`/private/tmp/plantilla-suscribe-glass.png`); Brief/System/Craft pass on the rendered frame. Receipt-driven development was globally off.
- T3 work-unit commit: `77c5f9a` (`feat(brand): add liquid-glass subscribe CTA`); contains `SubscribeCard.tsx` and the T3 task/review notes.

## Next step
T1 round 7: craft fix listed under 'P1 round 6' in design-loop/progress.md (Brief and System pass). T1 changes are uncommitted. Then T4, T2+T5.
