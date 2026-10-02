/**
 * LowerThird - the presenter lockup on the shared glass panel with its 1px grape-to-cyan
 * accent along the left edge.
 */
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { BrandMark } from "./BrandMark";
import { GLASS, GLASS_RADIUS, GlassRim } from "./glass";
import { CHANNEL, COLUMN_X, TAGLINE_COLOR } from "./tokens";
import { bodyStyle, Column, nameStyle } from "./typography";

export type LowerThirdProps = {
  start: number;
  duration: number;
  name?: string;
  tagline?: string;
  x?: number;
  y?: number;
};

/** Bottom margin: 13% of the frame height. */
const BOTTOM = 140;
const RADIUS = GLASS_RADIUS;
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
            padding: "24px 32px 24px 26px",
            borderRadius: RADIUS,
          }}
        >
          {/* The glass element carries its own reveal (width + opacity): no Backdrop-Root ancestor. */}
          <div
            aria-hidden="true"
            style={{
              ...GLASS,
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${panelProgress * 100}%`,
              borderRadius: RADIUS,
              opacity: panelProgress,
            }}
          >
            <GlassRim radius={RADIUS} accentOpacity={edgeOpacity} />
          </div>
          <div style={{ position: "relative", opacity: panelProgress, clipPath: panelClip }}>
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <BrandMark height={72} />
              <div>
                <div style={nameStyle}>{name}</div>
                <div style={{ ...bodyStyle, color: TAGLINE_COLOR }}>{tagline}</div>
              </div>
            </div>
          </div>
        </div>
      </Column>
    </AbsoluteFill>
  );
};
