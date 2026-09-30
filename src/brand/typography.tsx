/**
 * Showcase typography and placement (Apple product-page style): ONE headline size and ONE
 * body size per frame, headline at least 2.5x the body. Emphasis is luminance: white for
 * the key phrase, fog for supporting copy. Text sits directly on black in one column.
 */
import React from "react";
import { sansFamily, SANS } from "./fonts";
import { COLOR, COLUMN_X, TYPE } from "./tokens";

export const headStyle: React.CSSProperties = {
  fontFamily: SANS,
  fontWeight: 700,
  fontSize: TYPE.head,
  letterSpacing: "-0.03em",
  lineHeight: 1.06,
  color: COLOR.white,
  whiteSpace: "nowrap",
};

export const bodyStyle: React.CSSProperties = {
  fontFamily: SANS,
  fontWeight: 500,
  fontSize: TYPE.body,
  letterSpacing: "-0.01em",
  lineHeight: 1.35,
  color: COLOR.fog,
  whiteSpace: "nowrap",
};

/** Small caps line above a headline: same size as the body, so it costs no extra size. */
export const eyebrowStyle: React.CSSProperties = {
  ...bodyStyle,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
};

/**
 * A text column at the shared left edge. Without `y` it is centred vertically; with
 * `bottom` it hangs from the bottom edge.
 */
export const Column: React.FC<{
  x?: number;
  y?: number;
  bottom?: number;
  gap?: number;
  children: React.ReactNode;
}> = ({ x = COLUMN_X, y, bottom, gap = 0, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y ?? (bottom === undefined ? 0 : undefined),
      bottom: y === undefined && bottom !== undefined ? bottom : y === undefined ? 0 : undefined,
      display: "flex",
      flexDirection: "column",
      justifyContent: y === undefined && bottom === undefined ? "center" : "flex-start",
      gap,
    }}
  >
    {children}
  </div>
);

/** Split a string on "\n" into headline lines. */
export const lines = (text: string): string[] => text.split("\n");

/** Top of the small component label every showcase beat carries (11% of frame height). */
export const TAG_Y = 120;

/**
 * Optical left alignment for display figures: the negative margin (px) that puts the first
 * glyph's ink edge exactly on the column instead of one side bearing to its right.
 */
export const opticalShift = (text: string, fontSize: number, weight = 700): number => {
  const ctx = typeof document === "undefined" ? null : document.createElement("canvas").getContext("2d");
  if (!ctx || !text) {
    return 0;
  }
  ctx.font = `${weight} ${fontSize}px ${sansFamily}`;
  // actualBoundingBoxLeft is negative when the ink starts right of the origin.
  return Math.min(0, ctx.measureText(text.charAt(0)).actualBoundingBoxLeft);
};
