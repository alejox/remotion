/**
 * Showcase typography and placement (Apple product-page style): ONE headline size and ONE
 * body size per frame, headline at least 2.5x the body. Emphasis is luminance: white for
 * the key phrase, fog for supporting copy. Text sits in one column (on a glass panel over footage).
 */
import React, { createContext, useContext } from "react";
import { SANS } from "./fonts";
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
  color: COLOR.fogGlass,
  whiteSpace: "nowrap",
};

/** Lead-in / subline on bare beats: a step below the white key phrase (see `COLOR.fogLead`). */
export const leadStyle: React.CSSProperties = { ...bodyStyle, color: COLOR.fogLead };

/** The presenter name: the lockup's second size, shared by the lower third and the subscribe card. */
export const NAME_SIZE = 60;
export const nameStyle: React.CSSProperties = {
  ...bodyStyle,
  fontSize: NAME_SIZE,
  lineHeight: 1.15,
  letterSpacing: "-0.02em",
  color: COLOR.white,
  fontWeight: 700,
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
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ x = COLUMN_X, y, bottom, gap = 0, style, children }) => (
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
      ...style,
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
 * Optical left alignment for display figures (Geist 700, TYPE.figure, -0.05em): px to pull the
 * first glyph's ink onto the column. Pre-measured on a render (PIL: ink left edge vs x = 192).
 */
// Measured: ink starts 16px (3), 20px (2), 8px (4) right of x = 192 at 340px.
const FIGURE_SIDE_BEARING: Record<string, number> = { "3": -16, "2": -20, "4": -8 };
const FIGURE_MEASURED_AT = 340;

/** Negative margin (px) for a display figure, by its first glyph. 0 for an unmeasured glyph. */
export const opticalShift = (text: string, figure: number = TYPE.figure): number =>
  Math.round(((FIGURE_SIDE_BEARING[text.charAt(0)] ?? 0) * figure) / FIGURE_MEASURED_AT);

/**
 * Format type scale: headline, body/eyebrow and display-figure sizes. 16:9 uses the `TYPE`
 * defaults; a Short config may set larger sizes for phone screens (`config.type`), provided by
 * the template so every text beat reads them with `useTypeStyles()`. Keep headline >= 2.5x body.
 */
export type TypeScale = { head: number; body: number; figure: number };
export const DEFAULT_SCALE: TypeScale = { head: TYPE.head, body: TYPE.body, figure: TYPE.figure };
const TypeScaleContext = createContext<TypeScale>(DEFAULT_SCALE);
export const TypeScaleProvider: React.FC<{ scale?: Partial<TypeScale>; children: React.ReactNode }> = ({ scale, children }) => (
  <TypeScaleContext.Provider value={{ ...DEFAULT_SCALE, ...scale }}>{children}</TypeScaleContext.Provider>
);

/** The head / body / lead / eyebrow styles at the current format scale. */
export const useTypeStyles = (): { scale: TypeScale; head: React.CSSProperties; body: React.CSSProperties; lead: React.CSSProperties; eyebrow: React.CSSProperties } => {
  const scale = useContext(TypeScaleContext);
  return {
    scale,
    head: { ...headStyle, fontSize: scale.head },
    body: { ...bodyStyle, fontSize: scale.body },
    lead: { ...leadStyle, fontSize: scale.body },
    eyebrow: { ...eyebrowStyle, fontSize: scale.body },
  };
};
