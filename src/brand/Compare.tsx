/**
 * Compare (COMPARE) - a before/after told in time, in the shared column. The loser enters
 * first as a large dim-gray display figure with its fog label; a white strike draws across
 * it, the frame holds, then the loser fades out and the winner takes its place in cyan at
 * the same display size, the last element to arrive. One display figure is on screen at a
 * time. The strike is drawn with `evolvePath`, clipped to the exact glyph width
 * (measureText). Values are strings so a template can show "~$150" or "$0".
 */
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { evolvePath } from "@remotion/paths";
import { measureText } from "@remotion/layout-utils";
import { sansFamily } from "./fonts";
import { drawProgress } from "./motion";
import { Reveal, Rise } from "./Reveal";
import { COLOR, COLUMN_X, MOTION, TYPE } from "./tokens";
import { bodyStyle, Column, headStyle, opticalShift } from "./typography";

export type CompareSide = { name: string; value: string };

export type CompareProps = {
  start: number;
  duration: number;
  a?: CompareSide;
  b?: CompareSide;
  /** Which side wins (cyan display figure, arrives last; the other is dim and struck). */
  winner?: "a" | "b";
  x?: number;
  y?: number;
};

const FIGURE_H = Math.round(TYPE.figure * 0.95);
const LABEL_H = Math.round(TYPE.body * 1.35) + 8;
/** Loser figure style (also used to measure the glyph width the strike must match). */
const FIGURE_STYLE = {
  fontFamily: sansFamily,
  fontWeight: 700,
  fontSize: TYPE.figure,
  letterSpacing: `${-0.05 * TYPE.figure}px`,
};
/** Beat-local frames: the strike draws, the frame holds ~0.5s, the loser fades, the winner enters. */
const STRIKE_FROM = 30;
const STRIKE_FRAMES = 18;
const FADE_FROM = STRIKE_FROM + STRIKE_FRAMES + 15;
const FADE_FRAMES = 10;
const WINNER_AT = FADE_FROM + FADE_FRAMES + 2;

const figureStyle: React.CSSProperties = {
  ...headStyle,
  fontSize: TYPE.figure,
  letterSpacing: "-0.05em",
  lineHeight: 0.95,
};

const Loser: React.FC<{ side: CompareSide; local: number }> = ({ side, local }) => {
  const shift = opticalShift(side.value, TYPE.figure);
  const glyphW = measureText({ text: side.value, ...FIGURE_STYLE }).width;
  const y = LABEL_H + FIGURE_H * 0.56;
  const strikePath = `M0 ${y} L${glyphW} ${y}`;
  const strike = evolvePath(drawProgress(local, STRIKE_FROM, STRIKE_FRAMES), strikePath);
  const out = interpolate(local, [FADE_FROM, FADE_FROM + FADE_FRAMES], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity: out }}>
      <Rise index={0}>
        <div style={{ ...bodyStyle, marginBottom: 8 }}>{side.name}</div>
        <div style={{ ...figureStyle, color: COLOR.fog, opacity: 0.55, marginLeft: shift }}>{side.value}</div>
        <svg
          width={Math.max(glyphW, 1)}
          height={LABEL_H + FIGURE_H}
          style={{ position: "absolute", left: shift, top: 0, overflow: "visible" }}
        >
          <path
            d={strikePath}
            stroke="rgba(255,255,255,0.7)"
            strokeWidth={9}
            strokeLinecap="butt"
            fill="none"
            strokeDasharray={strike.strokeDasharray}
            strokeDashoffset={strike.strokeDashoffset}
          />
        </svg>
      </Rise>
    </div>
  );
};

/** "20 min": the number is cyan, the unit stays fog (same size) so cyan covers < 5% of the frame. */
const Winner: React.FC<{ side: CompareSide }> = ({ side }) => {
  const [num, ...unit] = side.value.split(" ");
  return (
    <div style={{ position: "absolute", left: 0, top: 0 }}>
      <Rise index={WINNER_AT / MOTION.staggerFrames}>
        <div style={{ ...bodyStyle, color: COLOR.white, marginBottom: 8 }}>{side.name}</div>
        <div style={{ ...figureStyle, whiteSpace: "pre", marginLeft: opticalShift(side.value, TYPE.figure) }}>
          <span style={{ color: COLOR.cyan }}>{num}</span>
          {unit.length ? <span style={{ color: COLOR.fog }}>{` ${unit.join(" ")}`}</span> : null}
        </div>
      </Rise>
    </div>
  );
};

export const Compare: React.FC<CompareProps> = ({
  start,
  duration,
  a = { name: "Opción A", value: "$100" },
  b = { name: "Opción B", value: "$0" },
  winner = "b",
  x = COLUMN_X,
  y,
}) => {
  const local = useCurrentFrame() - start;
  const [lose, win] = winner === "b" ? [a, b] : [b, a];
  return (
    <Reveal start={start} duration={duration} staged>
      <Column x={x} y={y}>
        <div style={{ position: "relative", height: LABEL_H + FIGURE_H, width: 1300 }}>
          <Loser side={lose} local={local} />
          <Winner side={win} />
        </div>
      </Column>
    </Reveal>
  );
};
