/**
 * TextBlock - bare big type over footage in the shared column (title, keyword, value, compare,
 * Spotlight headline). No glass: a soft, feathered, low-contrast dark gradient sits behind the
 * text so it stays legible over a bright room. It is a mask-feathered rectangle (no hard edge,
 * not a panel), sized to the text, and it fades with the beat because it lives inside the
 * beat's `<Reveal>` layer. Portrait Shorts keep bare text with no scrim.
 */
import React from "react";
import { useVideoConfig } from "remotion";
import { useIsShort } from "./motion";
import { COLUMN_X } from "./tokens";
import { Column, useTypeStyles } from "./typography";

/** Scrim colour/strength, and how far it extends past the text (the feather) on each side. */
export const SCRIM = { rgb: "6,9,14", alpha: 0.68, left: 240, right: 160, y: 220, pad: 44 } as const;

/** Smoothstep ramp stops (zero slope at both ends) so the feather has no visible edge. */
const feather = (dir: string, a: number, b: number): string => {
  const N = 10;
  const smooth = (t: number): number => t * t * (3 - 2 * t);
  const up = Array.from({ length: N + 1 }, (_, i) => `rgba(0,0,0,${smooth(i / N).toFixed(3)}) ${((a * i) / N).toFixed(1)}px`);
  const down = Array.from({ length: N + 1 }, (_, i) => `rgba(0,0,0,${(1 - smooth(i / N)).toFixed(3)}) calc(100% - ${((b * (N - i)) / N).toFixed(1)}px)`);
  return `linear-gradient(${dir}, ${[...up, ...down].join(", ")})`;
};

/** The feathered dark gradient. Place inside a `position: relative` box with `isolation: isolate`. */
export const Scrim: React.FC<{ left?: number; right?: number; y?: number; alpha?: number; pad?: number }> = ({
  left = SCRIM.left,
  right = SCRIM.right,
  y = SCRIM.y,
  alpha = SCRIM.alpha,
  pad = SCRIM.pad,
}) => {
  const mask = `${feather("90deg", left, right)}, ${feather("180deg", y, y)}`;
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        // Plateau = the text block plus `pad`; the feather ramps outside it.
        top: -(y + pad),
        bottom: -(y + pad),
        left: -(left + pad),
        right: -(right + pad),
        zIndex: -1,
        pointerEvents: "none",
        background: `rgba(${SCRIM.rgb},${alpha})`,
        WebkitMaskImage: mask,
        maskImage: mask,
        WebkitMaskComposite: "source-in",
        maskComposite: "intersect",
      }}
    />
  );
};

/**
 * LeftScrim - ONE wide, neutral-black vignette anchored to the frame's left edge: flat behind
 * the text column, then a smoothstep ease-out to nothing by `SCRIM_END`. No vertical edges, no
 * shape: it reads as a natural falloff of the room's brightness. It must sit in a full-frame
 * layer (the beat's `<Reveal>`), so it fades with its beat.
 */
const SCRIM_A = 0.6;
const SCRIM_PLATEAU = 720;
const SCRIM_END = 1120;
/** Wider/stronger variant for beats whose display type runs far right (compare's "4 horas"). */
export type ScrimSpec = { alpha: number; plateau: number; end: number };
const DEFAULT_SCRIM: ScrimSpec = { alpha: SCRIM_A, plateau: SCRIM_PLATEAU, end: SCRIM_END };
const leftStops = ({ alpha, plateau, end }: ScrimSpec): string => {
  const smooth = (t: number): number => t * t * (3 - 2 * t);
  const stops = [`rgba(0,0,0,${alpha}) 0px`, `rgba(0,0,0,${alpha}) ${plateau}px`];
  const N = 16;
  for (let i = 1; i <= N; i++) {
    const t = i / N;
    stops.push(`rgba(0,0,0,${(alpha * (1 - smooth(t))).toFixed(4)}) ${(plateau + (end - plateau) * t).toFixed(1)}px`);
  }
  return stops.join(", ");
};
export const LeftScrim: React.FC<{ opacity?: number; spec?: ScrimSpec }> = ({ opacity = 1, spec = DEFAULT_SCRIM }) => (
  <div
    aria-hidden="true"
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: spec.end,
      background: `linear-gradient(90deg, ${leftStops(spec)})`,
      opacity,
      pointerEvents: "none",
    }}
  />
);

/** One rule for every component label: a fixed gap above its content group, on the column. */
export const TAG_GAP = 24;
/**
 * Portrait darkening: a full-width band, feathered top and bottom only (no side edges, so it
 * can never read as a panel), centred on the text group. Place in the group's `isolate` box.
 */
const SHORT_BAND = { alpha: 0.7, feather: 170, pad: 30 } as const;
export const ShortBand: React.FC<{ x: number; z?: number; opacity?: number }> = ({ x, z = -1, opacity = 1 }) => {
  const { width } = useVideoConfig();
  const mask = feather("180deg", SHORT_BAND.feather, SHORT_BAND.feather);
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        zIndex: z,
        left: -x,
        width,
        top: -(SHORT_BAND.feather + SHORT_BAND.pad),
        bottom: -(SHORT_BAND.feather + SHORT_BAND.pad),
        background: `rgba(0,0,0,${SHORT_BAND.alpha})`,
        WebkitMaskImage: mask,
        maskImage: mask,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

export const TextBlock: React.FC<{
  x?: number;
  y?: number;
  gap?: number;
  /** Component label, set as the first line of the group (caps eyebrow). */
  tag?: string;
  scrim?: ScrimSpec;
  children: React.ReactNode;
}> = ({ x = COLUMN_X, y, gap = 0, tag, scrim, children }) => {
  const short = useIsShort();
  const { eyebrow: eyebrowStyle } = useTypeStyles();
  if (short) {
    // Portrait: the same edgeless darkening, one feathered gradient round the text group (no panel).
    return (
      <Column x={x} y={y} gap={tag ? TAG_GAP : 0}>
        <div style={{ position: "relative", isolation: "isolate", display: "flex", flexDirection: "column", gap: TAG_GAP }}>
          <ShortBand x={x} />
          {tag ? <div style={eyebrowStyle}>{tag}</div> : null}
          <div style={{ display: "flex", flexDirection: "column", gap }}>{children}</div>
        </div>
      </Column>
    );
  }
  return (
    <>
      <LeftScrim spec={scrim} />
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
        <div style={{ display: "flex", flexDirection: "column", gap: TAG_GAP }}>
          {tag ? <div style={eyebrowStyle}>{tag}</div> : null}
          <div style={{ display: "flex", flexDirection: "column", gap }}>{children}</div>
        </div>
      </div>
    </>
  );
};
