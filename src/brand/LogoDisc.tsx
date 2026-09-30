/**
 * LogoDisc - solid white disc holding the vector logo (`LogoMark`), which fills the disc
 * exactly: optical centring is baked into LogoMark's viewBox, so there is no padding,
 * border, offset or transform here. Static: the parent overlay owns the entrance.
 */
import React from "react";
import { LogoMark } from "./LogoMark";
import { COLOR } from "./tokens";

export type LogoDiscProps = {
  size?: number;
  style?: React.CSSProperties;
};

export const LogoDisc: React.FC<LogoDiscProps> = ({ size = 96, style }) => (
  <div
    style={{
      position: "relative",
      width: size,
      height: size,
      flex: "none",
      borderRadius: "50%",
      backgroundColor: COLOR.white,
      overflow: "hidden",
      ...style,
    }}
  >
    <LogoMark size={size} style={{ position: "absolute", left: 0, top: 0, display: "block" }} />
  </div>
);
