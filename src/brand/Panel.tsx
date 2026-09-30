/**
 * Panel - the base of every overlay. `#0E0E12` at 90%, radius 12, flat, and the brand
 * slash: a 6px grape -> cyan vertical bar on the left edge whose top is cut on the
 * 20 degree seam. Optional 1px white-8% hairline for busy footage.
 */
import React from "react";
import { COLOR, HAIRLINE, PANEL_BG, PANEL_RADIUS, SEAM_TAN, SLASH_W } from "./tokens";

export type PanelProps = {
  children?: React.ReactNode;
  /** 1px white-8% hairline over busy footage. */
  hairline?: boolean;
  /** Absolute position in the frame. Omit to lay the panel out in flow. */
  x?: number;
  y?: number;
  width?: number;
  padding?: string;
  radius?: number;
  style?: React.CSSProperties;
};

/** The slash bar: 6px wide, top edge parallel to the 20 degree seam. */
export const Slash: React.FC<{ width?: number }> = ({ width = SLASH_W }) => {
  const cut = width / SEAM_TAN;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width,
        background: `linear-gradient(180deg, ${COLOR.grape}, ${COLOR.cyan})`,
        clipPath: `polygon(${width}px 0px, ${width}px 100%, 0px 100%, 0px ${cut}px)`,
      }}
    />
  );
};

export const Panel: React.FC<PanelProps> = ({
  children,
  hairline = false,
  x,
  y,
  width,
  padding = "22px 32px 22px 38px",
  radius = PANEL_RADIUS,
  style,
}) => (
  <div
    style={{
      position: x !== undefined || y !== undefined ? "absolute" : "relative",
      left: x,
      top: y,
      width,
      boxSizing: "border-box",
      padding,
      background: PANEL_BG,
      borderRadius: radius,
      border: hairline ? HAIRLINE : "1px solid transparent",
      overflow: "hidden",
      color: COLOR.white,
      ...style,
    }}
  >
    <Slash />
    {children}
  </div>
);
