/**
 * diagonalWipe - the brand's 20 degree wipe as a `<TransitionSeries>` presentation.
 * The entering scene is revealed left -> right behind a slanted edge parallel to the
 * seam; a grape band leads and a cyan band follows (hard edges, no blur), so the wipe
 * reads as the channel banner sliding through. 14 frames (DNA), driven by the timing in
 * `Footage.tsx`. The only loud moment of the edit.
 */
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { COLOR, SEAM_TAN } from "../tokens";

export type DiagonalWipeProps = {
  /** Width in px of each brand band riding the edge (grape, then cyan). */
  band?: number;
} & Record<string, unknown>;

const poly = (xb: number, t: number, w: number, h: number, side: "left" | "right") =>
  side === "left"
    ? `polygon(0px 0px, ${xb + t}px 0px, ${xb}px ${h}px, 0px ${h}px)`
    : `polygon(${xb + t}px 0px, ${w}px 0px, ${w}px ${h}px, ${xb}px ${h}px)`;

const Presentation: React.FC<TransitionPresentationComponentProps<DiagonalWipeProps>> = ({
  children,
  presentationProgress,
  presentationDirection,
  passedProps,
}) => {
  const { width: w, height: h } = useVideoConfig();
  const band = passedProps.band ?? 30;
  const t = h * SEAM_TAN;

  if (presentationDirection === "exiting") {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }

  // Leading (grape) edge travels from fully off-left to band*2 past the right edge.
  const lead = -t + presentationProgress * (w + t + band * 2);
  const reveal = lead - band * 2;
  const live = presentationProgress > 0 && presentationProgress < 1;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: poly(reveal, t, w, h, "left") }}>{children}</AbsoluteFill>
      {live ? (
        <>
          <AbsoluteFill
            style={{
              background: COLOR.cyan,
              clipPath: `polygon(${reveal - 2 + t}px 0px, ${reveal + band + t}px 0px, ${reveal + band}px ${h}px, ${reveal - 2}px ${h}px)`,
            }}
          />
          <AbsoluteFill
            style={{
              background: COLOR.grape,
              clipPath: `polygon(${reveal + band + t}px 0px, ${lead + t}px 0px, ${lead}px ${h}px, ${reveal + band}px ${h}px)`,
            }}
          />
        </>
      ) : null}
    </AbsoluteFill>
  );
};

export const diagonalWipe = (
  props: DiagonalWipeProps = {},
): TransitionPresentation<DiagonalWipeProps> => ({
  component: Presentation,
  props,
});
