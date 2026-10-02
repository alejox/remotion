/**
 * Glass - the ONE frosted-glass material of the kit: LowerThird, every text beat, the
 * subscribe card and button, the Spotlight mock window and the tag chips all use ONLY these
 * exports (recipe, radius, rim incl. 1px accent). The chapter card backing is the single
 * allowed variation: `GLASS_DENSE`, the same recipe with a denser tint. A blur that keeps
 * the footage recognisable, a dark smoked tint and brightness pull so white and fog text
 * reach >= 4.5:1 even over a bright wall, a thin specular rim and a soft depth shadow.
 * No glow, no streak.
 *
 * BACKDROP ROOT RULE: `backdrop-filter` only samples up to its nearest ancestor that is a
 * Backdrop Root (opacity < 1, filter, clip-path, mask, backdrop-filter, mix-blend-mode,
 * will-change of those). A glass surface must therefore have NO such ancestor between it and
 * the footage: animate opacity / clip / size on the glass element itself, never on a wrapper.
 */
import React from "react";
import { COLOR } from "./tokens";

/** Corner radius of every glass surface. */
export const GLASS_RADIUS = 14;

const BLUR = "blur(18px) saturate(150%) brightness(0.62)";

/** Fill, blur, and depth shadow of a glass surface. Apply to the element that is animated. */
export const GLASS: React.CSSProperties = {
  background: "rgba(14,18,26,0.42)",
  backdropFilter: BLUR,
  WebkitBackdropFilter: BLUR,
  boxShadow: "0 12px 32px rgba(0,0,0,0.24), 0 2px 6px rgba(0,0,0,0.16)",
};

/** The one variation: the full-frame chapter card backing (same blur, denser tint). */
export const GLASS_DENSE: React.CSSProperties = {
  ...GLASS,
  background: "rgba(2,3,5,0.76)",
};

/** Shared 1px ring: fills the glass element, inherits its radius, shows only the border box minus content box. */
const ringBase = (radius: number): React.CSSProperties => ({
  position: "absolute",
  inset: 0,
  borderRadius: radius,
  padding: 1,
  boxSizing: "border-box",
  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
  pointerEvents: "none",
});

/**
 * THE rim spec of every glass object: a 1px specular ring (bright along the top edge, faint
 * down the sides, a touch brighter at the bottom) plus the 1px grape-to-cyan brand accent on
 * the left edge. The accent is part of the same rounded ring, so it bends round the corners
 * and fades out before the top and bottom edges: never a square-ended border. Place inside the
 * glass element (it fills it and inherits its radius). `accent={false}` only for the small CTA
 * button, which carries its own cyan rim. `accentOpacity` lets a beat fade the accent in/out.
 */
export const GlassRim: React.FC<{ radius?: number; accent?: boolean; accentOpacity?: number }> = ({
  radius = GLASS_RADIUS,
  accent = true,
  accentOpacity = 1,
}) => {
  const fade = `linear-gradient(90deg, #000 0, #000 2px, transparent ${GLASS_RADIUS + 6}px)`;
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          ...ringBase(radius),
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.06) 68%, rgba(255,255,255,0.20) 100%)",
        }}
      />
      {accent ? (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            opacity: accentOpacity,
            WebkitMaskImage: fade,
            maskImage: fade,
            pointerEvents: "none",
          }}
        >
          <div style={{ ...ringBase(radius), background: `linear-gradient(180deg, ${COLOR.grape}, ${COLOR.cyan})` }} />
        </div>
      ) : null}
    </>
  );
};
