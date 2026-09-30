/**
 * LogoMark - the Alejox "AG" triangle as inline vector (source: public/logo/alejox.svg).
 *
 * Centring is baked into the viewBox, so a parent only has to give this SVG the
 * same box as the disc: no offsets, no transforms.
 *
 * Geometry (source units, mark drawn in 0..763.73 x 0..766.34):
 * - bbox centre ........ (381.9, 383.2)
 * - area centroid ...... (379.0, 508.5)  -> the apex-up triangle is bottom-heavy
 * - optical anchor ..... bbox centre moved 35% of the way to the centroid:
 *                        (381.9, 427.0). That anchor sits at the centre of the view box,
 *                        which lifts the mark ~3.4% of the disc above geometric centre.
 * - scale .............. the mark height (766.34) is MARK_RATIO of the view box side.
 */
import React from "react";

/** Mark height as a fraction of the disc diameter. */
export const MARK_RATIO = 0.6;

const MARK_H = 766.34;
const ANCHOR_X = 381.9;
const ANCHOR_Y = 427.0;
const SIDE = MARK_H / MARK_RATIO;
const VIEW_BOX = `${ANCHOR_X - SIDE / 2} ${ANCHOR_Y - SIDE / 2} ${SIDE} ${SIDE}`;

const PATH =
  "m753.61,766.34H10.12c-7.51,0-12.4-7.9-9.05-14.62L372.82,5.6c3.72-7.47,14.38-7.47,18.1,0l185.74,372.8c3.35,6.72-1.54,14.62-9.05,14.62h-79.34c-3.83,0-7.34-2.17-9.05-5.6l-88.3-177.24c-3.72-7.47-14.38-7.47-18.1,0l-223.29,448.17c-3.35,6.72,1.54,14.62,9.05,14.62h446.58c7.51,0,12.4-7.9,9.05-14.62l-36.34-72.93c-1.71-3.43-5.21-5.6-9.05-5.6h-269.03c-7.51,0-12.4-7.9-9.05-14.62l82.07-164.74c3.72-7.47,14.38-7.47,18.1,0l40.03,80.36c1.71,3.43,5.21,5.6,9.05,5.6h184.22c3.83,0,7.34,2.17,9.05,5.6l129.4,259.71c3.35,6.72-1.54,14.62-9.05,14.62Z";

export type LogoMarkProps = {
  /** Side of the square box, normally the disc diameter. */
  size: number;
  /** Single-colour override (e.g. "#FFFFFF" on a dark background). Default: brand gradient. */
  color?: string;
  style?: React.CSSProperties;
};

export const LogoMark: React.FC<LogoMarkProps> = ({ size, color, style }) => {
  // Unique per instance so two marks on screen never share a gradient id.
  const gradientId = React.useId().replace(/:/g, "");
  return (
    <svg width={size} height={size} viewBox={VIEW_BOX} style={{ display: "block", ...style }}>
      {color ? null : (
        <defs>
          <linearGradient
            id={gradientId}
            x1="-45.85"
            y1="795.89"
            x2="783.35"
            y2="238.13"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#662d91" />
            <stop offset=".2" stopColor="#643093" />
            <stop offset=".38" stopColor="#5f3b9a" />
            <stop offset=".54" stopColor="#564ca5" />
            <stop offset=".7" stopColor="#4a65b5" />
            <stop offset=".86" stopColor="#3a85ca" />
            <stop offset="1" stopColor="#29abe2" />
          </linearGradient>
        </defs>
      )}
      <path d={PATH} fill={color ?? `url(#${gradientId})`} />
    </svg>
  );
};
