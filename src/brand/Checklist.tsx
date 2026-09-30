/**
 * Checklist (CHECKLIST) - requirements or recap: 2 to 4 rows, cyan checks that draw
 * on one by one (@remotion/paths `evolvePath`), text in white. Optional small caps title.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { evolvePath } from "@remotion/paths";
import { SANS } from "./fonts";
import { drawProgress } from "./motion";
import { Panel } from "./Panel";
import { Reveal } from "./Reveal";
import { COLOR, MARGIN, TYPE } from "./tokens";

export type ChecklistProps = {
  start: number;
  duration: number;
  /** 2 to 4 rows. */
  items?: string[];
  title?: string;
  x?: number;
  y?: number;
  hairline?: boolean;
};

const CHECK_PATH = "M4 12.5 L9.5 18 L20 6";
/** Frames between two checks starting to draw, and how long one check takes. */
const STEP = 10;
const DRAW = 10;
const FIRST = 10;

const Check: React.FC<{ progress: number; size?: number }> = ({ progress, size = 34 }) => {
  const evolved = evolvePath(progress, CHECK_PATH);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flex: "none" }}>
      <path
        d={CHECK_PATH}
        stroke={COLOR.cyan}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={evolved.strokeDasharray}
        strokeDashoffset={evolved.strokeDashoffset}
      />
    </svg>
  );
};

const Rows: React.FC<{ start: number; items: string[]; title?: string }> = ({ start, items, title }) => {
  const local = useCurrentFrame() - start;
  return (
    <>
      {title ? (
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: TYPE.meta,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: COLOR.fog,
            marginBottom: 12,
          }}
        >
          {title}
        </div>
      ) : null}
      {items.slice(0, 4).map((item, i) => (
        <div
          key={item}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            height: 52,
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: TYPE.label,
            whiteSpace: "nowrap",
          }}
        >
          <Check progress={drawProgress(local, FIRST + i * STEP, DRAW)} />
          <span>{item}</span>
        </div>
      ))}
    </>
  );
};

export const Checklist: React.FC<ChecklistProps> = ({
  start,
  duration,
  items = ["Primer requisito", "Segundo requisito"],
  title,
  x = MARGIN,
  y = 300,
  hairline = true,
}) => (
  <Reveal start={start} duration={duration}>
    <Panel x={x} y={y} hairline={hairline} padding="20px 34px 20px 38px">
      <Rows start={start} items={items} title={title} />
    </Panel>
  </Reveal>
);
