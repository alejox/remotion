/**
 * Compare (COMPARE) - A vs B in one panel, two columns. The winner gets a cyan
 * hairline; the loser is gray with a white 60% strike drawn across its value with
 * `evolvePath`, clipped to the exact glyph width (measureText). Values are strings so a template can show "~$150" or "$0".
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { evolvePath } from "@remotion/paths";
import { measureText } from "@remotion/layout-utils";
import { sansFamily, SANS } from "./fonts";
import { drawProgress } from "./motion";
import { Panel } from "./Panel";
import { Reveal } from "./Reveal";
import { COLOR, MARGIN, EDGE, TYPE } from "./tokens";

export type CompareSide = { name: string; value: string };

export type CompareProps = {
  start: number;
  duration: number;
  a?: CompareSide;
  b?: CompareSide;
  /** Which side wins (gets the cyan hairline; the other is struck). */
  winner?: "a" | "b";
  x?: number;
  y?: number;
  hairline?: boolean;
};

const COL_W = 330;
const VALUE_H = 76;
/** Value text style (also used to measure the glyph width the strike must match). */
const VALUE_STYLE = { fontFamily: sansFamily, fontWeight: 700, fontSize: TYPE.value, letterSpacing: `${-0.02 * TYPE.value}px` };

const Column: React.FC<{ side: CompareSide; win: boolean; local: number }> = ({ side, win, local }) => {
  // Strike spans exactly the glyph width of the old price.
  const glyphW = win ? 0 : measureText({ text: side.value, ...VALUE_STYLE }).width;
  const strikePath = `M0 ${VALUE_H / 2} L${glyphW} ${VALUE_H / 2}`;
  const strike = evolvePath(drawProgress(local, 16, 12), strikePath);
  return (
    <div
      style={{
        width: COL_W,
        boxSizing: "border-box",
        padding: "16px 28px 18px",
        borderRadius: 8,
        border: win ? `1px solid ${COLOR.cyan}` : "1px solid transparent",
        fontFamily: SANS,
      }}
    >
      <div
        style={{
          fontWeight: 500,
          fontSize: TYPE.meta,
          color: COLOR.fog,
          whiteSpace: "nowrap",
        }}
      >
        {side.name}
      </div>
      <div style={{ position: "relative", height: VALUE_H, marginTop: 8 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: TYPE.value,
            lineHeight: `${VALUE_H}px`,
            letterSpacing: "-0.02em",
            color: win ? COLOR.white : COLOR.fog,
            whiteSpace: "nowrap",
          }}
        >
          {side.value}
        </div>
        {win ? null : (
          <svg width={Math.max(glyphW, 1)} height={VALUE_H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <path
              d={strikePath}
              stroke="rgba(255,255,255,0.6)"
              strokeWidth={3}
              strokeLinecap="butt"
              fill="none"
              strokeDasharray={strike.strokeDasharray}
              strokeDashoffset={strike.strokeDashoffset}
            />
          </svg>
        )}
      </div>
    </div>
  );
};

export const Compare: React.FC<CompareProps> = ({
  start,
  duration,
  a = { name: "Opción A", value: "$100" },
  b = { name: "Opción B", value: "$0" },
  winner = "b",
  x = MARGIN,
  y = EDGE,
  hairline = true,
}) => {
  const local = useCurrentFrame() - start;
  return (
    <Reveal start={start} duration={duration}>
      <Panel x={x} y={y} hairline={hairline} padding="12px 14px 12px 20px">
        <div style={{ display: "flex", gap: 12 }}>
          <Column side={a} win={winner === "a"} local={local} />
          <Column side={b} win={winner === "b"} local={local} />
        </div>
      </Panel>
    </Reveal>
  );
};
