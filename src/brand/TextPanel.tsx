/**
 * TextPanel - the shared glass panel of every text beat over footage (title, keyword, value,
 * checklist, compare, Spotlight headline, outro). Sized to its content, on the column edge
 * (x = 192), with generous padding, the shared 1px accent and rim. It fades in as part of
 * the beat (pure opacity, 16f) while its lines rise on top; the layer that holds it must not
 * fade (`<Reveal fadeLayer={false}>`), so the panel's own opacity is the only one and its
 * backdrop blur keeps seeing the footage. Portrait Shorts use the same panel (no left vignette).
 */
import React from "react";
import { enter, exit, useIsShort } from "./motion";
import { LeftScrim, ShortBand } from "./TextBlock";
import { GLASS, GlassRim, GLASS_RADIUS } from "./glass";
import { useBeatTiming } from "./Reveal";
import { COLUMN_X } from "./tokens";

/** Panel padding: top/bottom 36, left/right 44 (a 708px left zone leaves 620px of text). */
const PAD = "36px 44px";
/** Portrait: the same padding on all four sides. */
const SHORT_PAD = "40px";
const FADE_FRAMES = 16;

export const TextPanel: React.FC<{
  x?: number;
  /** Top of the panel. Omit to centre it vertically. */
  y?: number;
  gap?: number;
  children: React.ReactNode;
}> = ({ x = COLUMN_X, y, gap = 0, children }) => {
  const { local, duration } = useBeatTiming();
  const short = useIsShort();
  const out = exit(local, duration).opacity;
  return (
    <>
    {short ? null : <LeftScrim opacity={enter(local).opacity * out} />}
    <div
      style={{
        position: "absolute",
        left: x,
        top: y ?? 0,
        bottom: y === undefined ? 0 : undefined,
        display: "flex",
        alignItems: y === undefined ? "center" : "flex-start",
      }}
    >
      {/* Portrait has no left vignette: a feathered band under the glass stands in for it. */}
      {short ? <ShortBand x={x} z={0} opacity={enter(local).opacity * out} /> : null}
      <div
        style={{
          ...GLASS,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap,
          padding: short ? SHORT_PAD : PAD,
          borderRadius: GLASS_RADIUS,
          opacity: enter(local, FADE_FRAMES).opacity * out,
        }}
      >
        {children}
        <GlassRim />
      </div>
    </div>
    </>
  );
};
