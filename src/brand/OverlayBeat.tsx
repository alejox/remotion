/**
 * OverlayBeat - ONE beat on a transparent canvas, for compositing outside Remotion
 * (DaVinci Resolve via `scripts/render-overlays.mjs`). It is the same `BeatLayer` the
 * templates use, so the look is identical; only the footage behind it is missing.
 *
 * Glass: `backdrop-filter` samples what is behind it, and with no footage there is
 * nothing to blur, so glass beats (lowerThird, checklist, subscribe) render as the plain
 * smoked tint. Bare-type beats (title, keyword, value, compare) are unaffected.
 * Spotlight needs footage (dim + zoom) and is not supported here.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { z } from "zod";
import { BeatLayer } from "./BeatLayer";
import { beatSchema, type Beat } from "./config";
import { MOTION } from "./tokens";

export const overlaySchema = z.object({ beat: beatSchema });
export type OverlayProps = z.infer<typeof overlaySchema>;

export const overlayDuration = (beat: Beat): number =>
  Math.max(1, Math.round(beat.dur * MOTION.fps));

export const OverlayBeat: React.FC<OverlayProps> = ({ beat }) => {
  if (beat.type === "spotlight") {
    throw new Error(
      "Spotlight needs footage; it cannot be rendered as a standalone overlay.",
    );
  }
  return (
    <AbsoluteFill>
      <BeatLayer
        beats={[{ beat, start: 0, duration: overlayDuration(beat) }]}
      />
    </AbsoluteFill>
  );
};
