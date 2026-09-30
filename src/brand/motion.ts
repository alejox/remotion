/**
 * Motion helpers (showcase mode, Apple-style). Everything is quiet, with zero overshoot:
 * enter 20f (ease-out cubic, 32px rise + fade, lines staggered 5f), exit 10f fade,
 * zoom 18f (in-out cubic).
 */
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { MOTION } from "./tokens";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const easeOut = Easing.out(Easing.cubic);

/** Entrance at beat-local frame `local`: 20f, 32px rise + fade. */
export const enter = (
  local: number,
  frames: number = MOTION.enterFrames,
): { progress: number; opacity: number; y: number } => {
  const progress = interpolate(local, [0, frames], [0, 1], { easing: easeOut, ...clamp });
  return { progress, opacity: progress, y: (1 - progress) * MOTION.slidePx };
};

/** Exit over the last 10f of a `duration`-long beat: a pure fade, no drift. */
export const exit = (
  local: number,
  duration: number,
  frames: number = MOTION.exitFrames,
): { progress: number; opacity: number; y: number } => {
  const progress = interpolate(local, [duration - frames, duration], [0, 1], {
    easing: Easing.in(Easing.cubic),
    ...clamp,
  });
  return { progress, opacity: 1 - progress, y: 0 };
};

/** Entrance of line `index` in a staggered text block (5f between lines). */
export const staggered = (local: number, index: number): { progress: number; opacity: number; y: number } =>
  enter(local - index * MOTION.staggerFrames);

/** Smooth zoom scale: 1 -> `to` over 18f with an in-out cubic. Never overshoots. */
export const smoothZoom = (
  local: number,
  to: number,
  frames: number = MOTION.zoomFrames,
): number => {
  const p = interpolate(local, [0, frames], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
    ...clamp,
  });
  return 1 + (Math.min(to, MOTION.zoomMax) - 1) * p;
};

/** Draw-on progress 0 -> 1 between two beat-local frames (used with `evolvePath`). */
export const drawProgress = (local: number, from: number, frames: number): number =>
  interpolate(local, [from, from + frames], [0, 1], { easing: Easing.inOut(Easing.cubic), ...clamp });

/**
 * Enter + exit for an overlay whose window is given in ABSOLUTE composition frames
 * (`start`, `duration`). `visible` is false outside the window.
 */
export const useReveal = (
  start: number,
  duration: number,
): { local: number; visible: boolean; opacity: number; y: number } => {
  const frame = useCurrentFrame();
  const local = frame - start;
  const visible = local >= 0 && local < duration;
  const e = enter(local);
  const x = exit(local, duration);
  return { local, visible, opacity: e.opacity * x.opacity, y: e.y + x.y };
};

export const useIsShort = (): boolean => {
  const { width, height } = useVideoConfig();
  return height > width;
};
