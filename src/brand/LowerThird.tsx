/**
 * LowerThird - the presenter lockup on a restrained frosted panel, with a blue-to-purple
 * accent along its left edge.
 */
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { BrandMark } from "./BrandMark";
import { CHANNEL, COLOR, COLUMN_X } from "./tokens";
import { bodyStyle, Column } from "./typography";

export type LowerThirdProps = {
  start: number;
  duration: number;
  name?: string;
  tagline?: string;
  x?: number;
  y?: number;
};

/** The name leads the tagline: the lockup's second size (the tagline and the label use body). */
const NAME_SIZE = 60;

/** Bottom margin: 13% of the frame height. */
const BOTTOM = 140;
const RADIUS = 14;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const LowerThird: React.FC<LowerThirdProps> = ({
  start,
  duration,
  name = CHANNEL.name,
  tagline = CHANNEL.tagline,
  x = COLUMN_X,
  y,
}) => {
  const localFrame = useCurrentFrame() - start;
  if (localFrame < 0 || localFrame >= duration) {
    return null;
  }

  const closeStart = Math.max(48, duration - 48);
  const closeEnd = Math.min(duration - 14, closeStart + 34);
  const expandProgress = interpolate(localFrame, [12, 48], [0, 1], { easing: Easing.out(Easing.cubic), ...clamp });
  const collapseProgress = interpolate(localFrame, [closeStart, closeEnd], [0, 1], { easing: Easing.inOut(Easing.cubic), ...clamp });
  const panelProgress = localFrame < closeStart ? expandProgress : 1 - collapseProgress;
  const panelClip = `inset(0 ${(1 - panelProgress) * 100}% 0 0 round ${RADIUS}px)`;

  // The edge turns on, blinks twice, and stays visible while the panel expands and collapses.
  const openingBlink = interpolate(localFrame, [0, 2, 4, 6, 8, 10, 12], [0, 1, 0.08, 1, 0.08, 1, 1], clamp);
  const closingBlink = interpolate(
    localFrame,
    [closeEnd, closeEnd + 2, closeEnd + 4, closeEnd + 6, closeEnd + 8, duration],
    [1, 0.08, 1, 0.08, 1, 0],
    clamp,
  );
  const edgeOpacity = localFrame < 10 ? openingBlink : localFrame < closeEnd ? 1 : closingBlink;

  return (
    <AbsoluteFill
      style={{ pointerEvents: "none" }}
    >
      <Column x={x} y={y} bottom={y === undefined ? BOTTOM : undefined}>
        <div
          style={{
            position: "relative",
            display: "inline-flex",
            padding: "24px 36px 24px 30px",
            borderRadius: RADIUS,
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              boxSizing: "border-box",
              borderRadius: RADIUS,
              border: "none",
              opacity: panelProgress,
              background: "rgba(24,34,46,0.30)",
              backdropFilter: "blur(12px) saturate(155%)",
              WebkitBackdropFilter: "blur(12px) saturate(155%)",
              clipPath: panelClip,
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 6,
              opacity: edgeOpacity,
              background: "linear-gradient(180deg, #25A1DC, #756BFF)",
              zIndex: 2,
            }}
          />
          <div style={{ position: "relative", opacity: panelProgress, clipPath: panelClip }}>
            <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
              <BrandMark height={84} />
              <div>
                <div style={{ ...bodyStyle, fontSize: NAME_SIZE, lineHeight: 1.15, letterSpacing: "-0.02em", color: COLOR.white, fontWeight: 700 }}>
                  {name}
                </div>
                <div style={bodyStyle}>{tagline}</div>
              </div>
            </div>
          </div>
        </div>
      </Column>
    </AbsoluteFill>
  );
};
