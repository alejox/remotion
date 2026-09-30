/**
 * BrandMark - the Alejox mark as a premium lockup: the vector `LogoMark` in white straight
 * on black, no disc. The box is trimmed to the mark's own bounds so its left edge sits
 * exactly on the column (LogoMark keeps 20% padding on each side inside its view box).
 */
import React from "react";
import { LogoMark, MARK_RATIO } from "./LogoMark";
import { COLOR } from "./tokens";

/** Mark width / height in the source art. */
const ASPECT = 763.73 / 766.34;

export const BrandMark: React.FC<{ height?: number }> = ({ height = 96 }) => {
  const side = height / MARK_RATIO;
  const pad = (side - height) / 2;
  const width = height * ASPECT;
  return (
    <div style={{ width, height, flex: "none", position: "relative", overflow: "visible" }}>
      <LogoMark
        size={side}
        color={COLOR.white}
        style={{ position: "absolute", left: -(side - width) / 2, top: -pad }}
      />
    </div>
  );
};
