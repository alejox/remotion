/**
 * BrandSlash - the brand's 20 degree slash as a heavy parallelogram (grape top to cyan
 * bottom, top leaning right like the wipe seam). Used large on the SectionCard.
 */
import React from "react";
import { COLOR, SEAM_TAN } from "./tokens";

export const BrandSlash: React.FC<{ height: number; weight?: number }> = ({ height, weight = 64 }) => {
  const lean = height * SEAM_TAN;
  return (
    <div
      style={{
        width: weight + lean,
        height,
        background: `linear-gradient(180deg, ${COLOR.grape}, ${COLOR.cyan})`,
        clipPath: `polygon(${lean}px 0px, ${lean + weight}px 0px, ${weight}px 100%, 0px 100%)`,
      }}
    />
  );
};
