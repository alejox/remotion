# Template showcase (Apple-led design loop)

## Objective
Turn the brand templates into a generic component showcase restyled in Apple product-page style while keeping only the Alejox logo and colour tokens, and prove it with the design-loop critics. T3 uses the user-specified `glass-test.mp4` backdrop to evaluate the glass control; this is a scoped exception to the black canvas for that visual review.

## Why
There is no source footage anymore; the templates exist to demonstrate how each component works. The user chose apple.com/macbook-pro as the quality bar.

## Scope / constraints
- Keep: LogoMark/LogoDisc, colour tokens in `src/brand/tokens.ts`.
- Change: type scale, layout, spacing, motion, component look (see `design-system.md` section 0).
- Generic neutral LatAm Spanish demo copy; no Deckboard references in showcase configs.
- SubscribeCard `classic` stays a replica; `clean` gets restyled.
- The intro LowerThird gets a translucent frosted backing and a subtle blue-to-purple left accent. Match the subscribe button's 38px curve and 30% fill opacity; keep the accent 1px thick and omit an outline around the frosted surface. Animate the border in first with a brief flicker, reveal content right-to-left, and reverse the sequence on close so it retracts into the border before exiting.
- For T3, use the looping `glass-test.mp4` video as the backdrop so the Liquid Glass control can be evaluated over rich content. T4's chapter change around second 10 should also reveal a more opaque frosted-glass backing over its scene backdrop instead of opaque black; this is scoped to the chapter card and must not change unrelated black-canvas beats.
- TDD: off (no test runner configured in the project). Checks: `npx tsc --noEmit`, `npx eslint src`, `npx remotion still` renders, critic filmstrips.
- Delivery strategy: ask-on-risk. Branch `feat/alejox-brand-kit`.

## Loop artifacts
- Bar: `design-loop/bar.md`, reference frames `design-loop/reference/`.
- System: `design-system.md`.
- Progress: `design-loop/progress.md`.

## Tasks
- [x] T0 Footage optional, black fallback (inline; commit "feat(brand): make source footage optional...").
- [ ] T1 16:9 showcase: restyle shared components + generic showcase config for PlantillaAlejox (delegated writer). Intro LowerThird also needs a frosted backing and blue-to-purple left accent matching the subscribe button's 38px corner curve, 30% fill opacity, and 1px edge; animate edge-in/flicker, content reveal right-to-left, and reverse collapse on exit.
- [ ] T2 9:16 Short showcase (delegated writer).
- [ ] T3 Restyle the clean subscribe button with a restrained Apple Liquid Glass look and show it inside the 16:9 showcase (delegated direct; this follow-up is delegated because it also touches the non-trivial LowerThird component). Classic stays a replica. Reopened after visual round 3: increase the button's frosted quality and remove the white blemish above the subscribed button while keeping visible footage detail and cyan rim; avoid a blown-out specular streak.
- [ ] T4 Apple-style transition in brand colours, with a more opaque frosted-glass underlay for the chapter card around second 10 (delegated writer; scene/card backdrop integration). Implementation and functional checks pass; design-loop critic review and an isolated work-unit commit remain pending because the touched template files also contain uncommitted T1 work.
- [ ] T5 Apple-style captions (subtitles), demoed in the Short (delegated writer; with T2).

## Acceptance
Each piece passes Brief, System and Craft critics (binary) on rendered frames; tsc and eslint clean.

## Progress / evidence
- New authorized refinement: make the clean CTA visibly more frosted, remove the white mark above its subscribed state, and apply the glass principle to the intro LowerThird with a backing and blue-to-purple left rule. Forecast: about 80 authored changed lines across two non-trivial components. Route: delegated direct; writer trigger: `SubscribeCard.tsx` and `LowerThird.tsx` both need substantive visual changes. TDD remains off; run `npx tsc --noEmit`, `npx eslint src`, and render both showcase beats for visual verification.
- LowerThird edge refinement: user found its left accent looked different from the subscribe button border. Match the CTA's thin and restrained rim behavior while retaining the blue-purple brand color; one small inline edit in `LowerThird.tsx`.
- LowerThird edge refinement verified: reduced the accent to a 1px blue-purple hairline, removed the glow, and aligned its inset with the CTA's thin rim. `npx tsc --noEmit`, `npx eslint src`, and `git diff --check` pass; frame 190 rendered to `/private/tmp/plantilla-lowerthird-glass.png` and visually inspected. SubscribeCard was also rendered at frame 1320 to `/private/tmp/plantilla-subscribe-frost.png`; both materials show the underlying video, and its former bright stripe is replaced by a subtle edge. Critics and an isolated commit remain pending.
- Latest clarification implemented: the LowerThird panel now uses the CTA's 38px corner curve; its blue-purple accent remains 1px wide and follows the clipped rounded edge. `npx tsc --noEmit`, `npx eslint src`, and `git diff --check` pass; frame 190 re-rendered and visually inspected at `/private/tmp/plantilla-lowerthird-glass.png`.
- New animation scope: choreograph the lower-third edge first, flicker it briefly, reveal the content from right to left, then retract the content into the edge and dismiss the edge on close. Match the CTA's verified clean fill (`rgba(24,34,46,0.30)`) and `38px` radius while keeping the accent at `1px`. Route: inline, one component; TDD off, validate TypeScript/ESLint and render the intro open/close frames.
- LowerThird animation implemented in `LowerThird.tsx`: rounded border draws in and flickers, the frosted fill fades in, content reveals right-to-left; on exit the content retracts into the left edge before the shell collapses away. Uses the CTA's exact `38px` radius and `rgba(24,34,46,0.30)` fill with a 1px blue-purple accent. TypeScript, ESLint, and `git diff --check` pass. Rendered/inspected frame 165 (edge), 194 (partial content reveal), and 268 (closing shell): `/private/tmp/lowerthird-motion-edge.png`, `/private/tmp/lowerthird-motion-content.png`, `/private/tmp/lowerthird-motion-close.png`.
- T4 clarified by the user: “la que cambia la escena y muestra el capitulo en el segundo 10 aproximadamente” refers to the chapter/scene transition, not the T3 subscribe button. Current evidence: `SectionCard` has an opaque black fill; showcase footage is rendered inside segment sequences, so the frosted card needs access to the backdrop rather than merely a translucent tint over black.
- T4 implementation: the no-source showcase passes looping `glass-test.mp4` into the chapter card only; the card overlays a 68%-opaque dark frosted surface (`blur(26px)`, saturation, subtle top edge). Real-source cards and unrelated beats keep their existing backgrounds. `npx tsc --noEmit`, `npx eslint src`, and `git diff --check` passed. Rendered frame 330 (around the 10-second chapter) to `/private/tmp/plantilla-chapter-frost.png` after sandbox port allocation failed; the image shows the background through a blurred, darkened layer. Design-loop critics remain pending.
- T0: tsc + eslint OK, stills render black.
- T3 round 1: `77c5f9a` added the clean glass treatment; the standalone task note was recorded by `0f7ec25`. Subsequent blind visual review: Brief PASS, System FAIL, Craft FAIL. System cited the black-only rule even though the user explicitly requested a video background for this review; Craft found the pill too opaque.
- T3 round 2: increased the panel's translucency and added a brighter specular edge. `npx tsc --noEmit`, `npx eslint src`, `git diff --check`, and a render of `PlantillaAlejox` frame 1320 at 50% (`/private/tmp/plantilla-suscribe-glass-round2.png`) passed. Blind review: Brief PASS, System FAIL due the same now-outdated black-only requirement, Craft FAIL because the button still reads opaque. Next: document the scoped video-background exception and refine the material before another rendered review. `showcase.config.ts` remains uncommitted with T1's showcase work. Receipt-driven development was globally off.
- T3 round 3: documented a T3-only video-backdrop exception in `design-system.md`; `SubscribeCard.tsx` now uses a more transparent face and brighter top highlight. `npx tsc --noEmit`, `npx eslint src`, `git diff --check`, and render at `/private/tmp/plantilla-suscribe-glass-round3.png` passed. Blind review: Brief PASS and System PASS, but Craft FAIL because the pill still appears too opaque and its edge reads white rather than cyan. Next: improve visible footage detail, add a cyan rim and strengthen the narrow top reflection without glow. `showcase.config.ts` remains uncommitted with T1's showcase work.

- LowerThird timing/material refinement: lengthened the edge flickers and panel reveal/collapse modestly, and removed the thin outline around the frosted background while preserving the left accent. `npx tsc --noEmit`, `npx eslint src`, and `git diff --check` pass; visual render remains pending.

## Next step
Run design-loop critics on the animated LowerThird/CTA and create an isolated work-unit commit when it can be separated safely from already-pending T1 work. T4 critic review, T1 round 7, and T2+T5 remain pending.
