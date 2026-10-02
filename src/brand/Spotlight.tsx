/**
 * Spotlight (SPOTLIGHT) - the functional screen callout. Dims everything outside the
 * target to 45%, draws a 2px white rounded box on the target with `evolvePath` (or, with `outline` off,
 * just leaves a soft rounded hole in the dim), then
 * brings in a dark-gray step pill (gray numbered dot + label) and can zoom the footage
 * (<= 1.8x, 18f in, 18f out, smooth, once per step).
 *
 * Coordinates: `target` is in STAGE coordinates (the footage rectangle the callout
 * lives in). `stage` is that rectangle in frame pixels (default: the whole frame).
 * The zoom itself is applied to the footage by `<ZoomStage>`, using the same
 * `zoomState` maths, so box and picture stay locked together.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { evolvePath } from "@remotion/paths";
import { SANS } from "./fonts";
import { drawProgress, enter, exit, smoothZoom, useReveal } from "./motion";
import { Pill } from "./Panel";
import { COLOR, MOTION, TYPE, UI } from "./tokens";

export type Rect = { x: number; y: number; w: number; h: number };

export type ZoomSpec = {
  /** Composition (or scene-local) frame where the step starts. */
  start: number;
  duration: number;
  target: Rect;
  /** Area the zoom centres on (default: the target). E.g. a whole menu around one row. */
  focus?: Rect;
  /** Zoom ceiling for this step, 1 = none, at most 1.8. */
  zoom?: number;
};

export type ZoomState = { scale: number; ox: number; oy: number; zooming: boolean };

const MARGIN = 40;

/** Origin that keeps the scaled target inside the stage (with a 40px margin). */
const axisOrigin = (a: number, b: number, size: number, z: number): number => {
  const center = (a + b) / 2;
  if (z <= 1) {
    return center;
  }
  const lo = (b * z - (size - MARGIN)) / (z - 1);
  const hi = (a * z - MARGIN) / (z - 1);
  const o = lo <= hi ? Math.min(Math.max(center, lo), hi) : (lo + hi) / 2;
  return Math.min(Math.max(o, 0), size);
};

/** Zoom for the active step at `frame` (1 when no step is active). */
export const zoomState = (
  frame: number,
  specs: ZoomSpec[],
  stage: { w: number; h: number },
): ZoomState => {
  for (const s of specs) {
    const max = Math.min(s.zoom ?? 1, MOTION.zoomMax);
    const local = frame - s.start;
    if (max <= 1 || local < 0 || local >= s.duration) {
      continue;
    }
    const scale = Math.min(smoothZoom(local, max), smoothZoom(s.duration - local, max));
    const f = s.focus ?? s.target;
    return {
      scale,
      ox: axisOrigin(f.x, f.x + f.w, stage.w, max),
      oy: axisOrigin(f.y, f.y + f.h, stage.h, max),
      zooming:
        local < MOTION.zoomFrames || local >= s.duration - MOTION.zoomFrames,
    };
  }
  return { scale: 1, ox: stage.w / 2, oy: stage.h / 2, zooming: false };
};

/**
 * ZoomStage - wraps the footage of a stage and applies the Spotlight zoom (only while
 * a step with `zoom` is active). CameraMotionBlur runs only during the 18f zoom moves.
 * `frameOffset` converts scene-local frames to the frames the specs use.
 */
export const ZoomStage: React.FC<{
  stage: Rect;
  specs: ZoomSpec[];
  frameOffset?: number;
  children: React.ReactNode;
}> = ({ stage, specs, frameOffset = 0, children }) => {
  const frame = useCurrentFrame() + frameOffset;
  const z = zoomState(frame, specs, stage);
  const content = (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transformOrigin: `${z.ox}px ${z.oy}px`,
        transform: z.scale === 1 ? undefined : `scale(${z.scale})`,
      }}
    >
      {children}
    </div>
  );
  return (
    <div
      style={{
        position: "absolute",
        left: stage.x,
        top: stage.y,
        width: stage.w,
        height: stage.h,
        overflow: "hidden",
      }}
    >
      {z.zooming ? (
        <CameraMotionBlur shutterAngle={180} samples={4}>
          {content}
        </CameraMotionBlur>
      ) : (
        content
      )}
    </div>
  );
};

/** The numbered dot inside the step pill. */
const Badge: React.FC<{ step: number; tone: string }> = ({ step, tone }) => (
  <span
    style={{
      width: 56,
      height: 56,
      borderRadius: "50%",
      background: tone,
      color: COLOR.white,
      fontFamily: SANS,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      fontSize: TYPE.body,
    }}
  >
    {step}
  </span>
);

const roundedRect = (x: number, y: number, w: number, h: number, r: number): string =>
  `M${x + r} ${y} H${x + w - r} A${r} ${r} 0 0 1 ${x + w} ${y + r} V${y + h - r} A${r} ${r} 0 0 1 ${x + w - r} ${y + h} H${x + r} A${r} ${r} 0 0 1 ${x} ${y + h - r} V${y + r} A${r} ${r} 0 0 1 ${x + r} ${y} Z`;

export type SpotlightProps = {
  start: number;
  duration: number;
  target: Rect;
  step?: number;
  label?: string;
  /** Zoom ceiling (<= 1.8). Omit for no zoom. */
  zoom?: number;
  /** The stage in frame pixels. Defaults to the whole frame. */
  stage?: Rect;
  /** Zoom focus (stage coordinates). Default: the target. */
  focus?: Rect;
  /**
   * Where the step chip sits. "auto" picks the side of the box with the most free
   * (dimmed) space; the chip never belongs over the UI being explained.
   */
  chipPlacement?: "auto" | "above" | "below" | "left" | "right";
  /** Explicit chip top-left in stage coordinates (overrides `chipPlacement`). */
  chipAt?: { x: number; y: number };
  /** Gap between chip and box for "left"/"right" placement. Default 18. */
  chipGap?: number;
  /** Hard 2px white outline on the target. False = soft focus (dim + rounded hole only). */
  outline?: boolean;
  /** Dim everything outside the target (default true). Off: the focus is carried by the row lift alone. */
  dim?: boolean;
};

const PAD = 6;
const RADIUS = 8;
const DRAW_FRAMES = 12;
/** Corner radius of the dim hole when there is no outline. */
const SOFT_RADIUS = 22;
/** Dim fade length, and when the pill enters after a soft focus (dim 14f, row lift 16-30f, toggle 40-54f). */
const DIM_FRAMES = 14;
const SOFT_CHIP_AT = 70;

export const Spotlight: React.FC<SpotlightProps> = ({
  start,
  duration,
  target,
  step = 1,
  label = "",
  zoom,
  stage,
  focus,
  chipPlacement = "auto",
  chipAt,
  chipGap = 18,
  outline = true,
  dim: dimOn = true,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const st = stage ?? { x: 0, y: 0, w: width, h: height };
  const reveal = useReveal(start, duration);
  if (!reveal.visible) {
    return null;
  }
  const local = reveal.local;
  const layer = enter(local, DIM_FRAMES).opacity * exit(local, duration).opacity;
  const z = zoomState(frame, [{ start, duration, target, focus, zoom }], st);
  const map = (v: number, o: number): number => o + (v - o) * z.scale;
  const x0 = map(target.x, z.ox) - PAD;
  const y0 = map(target.y, z.oy) - PAD;
  const x1 = map(target.x + target.w, z.ox) + PAD;
  const y1 = map(target.y + target.h, z.oy) + PAD;
  const bw = x1 - x0;
  const bh = y1 - y0;
  const boxPath = roundedRect(x0, y0, bw, bh, outline ? RADIUS : SOFT_RADIUS);
  const evolved = evolvePath(drawProgress(local, 0, DRAW_FRAMES), boxPath);
  const dim = `M0 0 H${st.w} V${st.h} H0 Z ${boxPath}`;

  const chipW = 130 + label.length * 17;
  const chipH = 80;
  // The pill waits for the box to finish drawing (or, with no outline, for the dim and the
  // row lift to settle): one thing moves at a time.
  const chipIn = enter(local - (outline ? DRAW_FRAMES : SOFT_CHIP_AT));
  const gap = 18;
  const free = {
    above: y0 - gap,
    below: st.h - y1 - gap,
    left: x0 - gap,
    right: st.w - x1 - gap,
  };
  const fits = {
    above: free.above >= chipH,
    below: free.below >= chipH,
    left: free.left >= chipW,
    right: free.right >= chipW,
  };
  let side: "above" | "below" | "left" | "right" = "below";
  if (chipPlacement !== "auto") {
    side = chipPlacement;
  } else {
    let best = -1;
    for (const k of ["below", "above", "right", "left"] as const) {
      if (fits[k] && free[k] > best) {
        best = free[k];
        side = k;
      }
    }
  }
  const anchorRight = (x0 + x1) / 2 > st.w / 2;
  const chipStyle: React.CSSProperties = chipAt
    ? { left: chipAt.x, top: chipAt.y }
    : side === "left"
      ? { right: st.w - x0 + chipGap, top: Math.max(y0, 0) }
      : side === "right"
        ? { left: x1 + chipGap, top: Math.max(y0, 0) }
        : {
            ...(anchorRight ? { right: st.w - x1 } : { left: x0 }),
            ...(side === "below" ? { top: y1 + gap } : { bottom: st.h - y0 + gap }),
          };
  return (
    <div
      style={{
        position: "absolute",
        left: st.x,
        top: st.y,
        width: st.w,
        height: st.h,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <svg width={st.w} height={st.h} style={{ position: "absolute", left: 0, top: 0, opacity: layer }}>
        {dimOn ? <path d={dim} fill={`rgba(0,0,0,${1 - MOTION.dimTo})`} fillRule="evenodd" /> : null}
        <path
          d={boxPath}
          fill="none"
          stroke={outline ? COLOR.white : "none"}
          strokeWidth={2}
          strokeDasharray={evolved.strokeDasharray}
          strokeDashoffset={evolved.strokeDashoffset}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          ...chipStyle,
          opacity: chipIn.opacity * exit(local, duration).opacity,
          transform: `translateY(${chipIn.y}px)`,
        }}
      >
        {label ? (
          <Pill style={{ fontFamily: SANS, whiteSpace: "nowrap" }}>
            <Badge step={step} tone={UI.line} />
            <span style={{ fontWeight: 500, fontSize: TYPE.body, letterSpacing: "-0.01em" }}>{label}</span>
          </Pill>
        ) : null}
      </div>
    </div>
  );
};
