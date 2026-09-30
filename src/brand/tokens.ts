/**
 * Alejox brand tokens (DNA v2 "Tech Clean") - the single source of truth for the kit.
 * Everything in `src/brand/` imports from here; nothing else hard-codes a colour,
 * angle, size or duration. Values come from `.claude/skills/alejox-edit-dna/dna.json`.
 */

export const COLOR = {
  /** Panels (used at 90% opacity, see `PANEL_BG`). */
  panel: "#0E0E12",
  /** Flat end-screen slots (one step lighter than the frame). */
  slot: "#17171D",
  white: "#FFFFFF",
  /** Secondary text and metadata. */
  fog: "#A1A1AA",
  /** THE accent: highlight boxes, active word, one emphasised word. Under 2% of the frame. */
  cyan: "#25A1DC",
  /** Brand only: the 20 degree slash, section cards, wipe. */
  grape: "#5A2885",
} as const;

/** Panel fill: #0E0E12 at 90%. Flat: no shadow, no glow, no texture. */
export const PANEL_BG = "rgba(14,14,18,0.9)";
/** Optional 1px hairline over busy footage. */
export const HAIRLINE = "1px solid rgba(255,255,255,0.08)";
export const PANEL_RADIUS = 12;
/** UI objects (pills, mock windows) sit on black in Apple's dark grays. */
export const UI = { pill: "#1D1D1F", row: "#2C2C2E", line: "#3A3A3C" } as const;
/** Width of the brand slash bar on every panel's left edge. */
export const SLASH_W = 6;

/** ONE margin system: left/right margin of every landscape overlay, card and outro (96px at 1920). */
export const MARGIN = 96;
/** Showcase column: every text block of a 16:9 frame shares this left edge (10% of 1920). */
export const COLUMN_X = 192;
/** Landscape top margin of top-anchored overlays, and bottom margin of bottom-anchored ones. */
export const EDGE = 64;

/** The brand seam leans 20 degrees off vertical, top to the right. */
export const SEAM_DEG = 20;
export const SEAM_TAN = Math.tan((SEAM_DEG * Math.PI) / 180);

/**
 * Safe areas. 16:9: 5% on every side (96px / 54px at 1920x1080).
 * Shorts: x 80..940, y 154..1498 of 1080x1920.
 */
export const SAFE = {
  landscape: { x0: 96, x1: 1824, y0: 54, y1: 1026 },
  short: { x0: 80, x1: 940, y0: 154, y1: 1498 },
} as const;

/**
 * Type sizes in px. Both formats have a 1080px side, so one scale serves both.
 * Rule: at most 2 sizes in one overlay; nothing under 26px; nothing over 9% of frame height.
 */
export const TYPE = {
  /** Meta labels in caps (+0.14em tracking) and secondary lines. */
  meta: 26,
  /** Labels and body lines (about 3.2% of a 1080px-tall frame). */
  label: 34,
  title: 46,
  value: 64,
  /** Section titles (8% of frame height). */
  section: 86,
  /** Shorts captions. */
  caption: 62,
  /** Showcase headline: 9.6% of frame height. */
  head: 104,
  /** Showcase body and eyebrow: the only other size on a frame (headline is 3x this). */
  body: 34,
  /** Showcase stat figure ("3x"): the loudest thing on a frame that has one (body is the only other size). */
  figure: 340,
} as const;

/** Frames at 30 fps. */
export const MOTION = {
  fps: 30,
  enterFrames: 20,
  exitFrames: 10,
  wipeFrames: 14,
  zoomFrames: 18,
  /** Enter slide distance in px. */
  slidePx: 32,
  /** Frames between two staggered lines of one text block. */
  staggerFrames: 5,
  /** Spotlight: everything outside the target keeps 45% of its brightness. */
  dimTo: 0.45,
  /** Spotlight zoom ceiling. */
  zoomMax: 1.8,
  /** Shorts caption rise. */
  captionRiseFrames: 4,
  /** The master's audio leads its picture by ~3 frames. */
  defaultAudioDelayFrames: 3,
} as const;

export const CHANNEL = {
  name: "Alejoxgaming",
  tagline: "Tutoriales · Tecnología · Streaming",
} as const;
