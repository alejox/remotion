/**
 * Checklist (CHECKLIST) - requirements or recap: 2 to 4 rows in fog with white checks that
 * draw on one by one (@remotion/paths `evolvePath`), under an optional headline. Set
 * directly on black in the shared column.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { evolvePath } from "@remotion/paths";
import { drawProgress } from "./motion";
import { Reveal, Rise } from "./Reveal";
import { COLOR, COLUMN_X, TYPE } from "./tokens";
import { bodyStyle, Column, headStyle, lines } from "./typography";

export type ChecklistProps = {
  start: number;
  duration: number;
  /** 2 to 4 rows. */
  items?: string[];
  title?: string;
  x?: number;
  y?: number;
};

const CHECK_PATH = "M4 12.5 L9.5 18 L20 6";
/** Frames between two checks starting to draw, how long one takes, and when the first starts (after the rows rose in). */
const STEP = 12;
const DRAW = 12;
const FIRST = 46;

const Check: React.FC<{ progress: number; size?: number }> = ({ progress, size = TYPE.body + 6 }) => {
  const evolved = evolvePath(progress, CHECK_PATH);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flex: "none" }}>
      <path
        d={CHECK_PATH}
        stroke={COLOR.white}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={evolved.strokeDasharray}
        strokeDashoffset={evolved.strokeDashoffset}
      />
    </svg>
  );
};

const Rows: React.FC<{ start: number; items: string[] }> = ({ start, items }) => {
  const local = useCurrentFrame() - start;
  return (
    <div style={{ marginTop: 44 }}>
      {items.slice(0, 4).map((item, i) => (
        <Rise
          key={item}
          index={i + 2}
          style={{ display: "flex", alignItems: "center", gap: 20, height: 68, ...bodyStyle }}
        >
          <Check progress={drawProgress(local, FIRST + i * STEP, DRAW)} />
          <span>{item}</span>
        </Rise>
      ))}
    </div>
  );
};

export const Checklist: React.FC<ChecklistProps> = ({
  start,
  duration,
  items = ["Primer requisito", "Segundo requisito"],
  title,
  x = COLUMN_X,
  y,
}) => (
  <Reveal start={start} duration={duration} staged>
    <Column x={x} y={y}>
      {title
        ? lines(title).map((line, i) => (
            <Rise key={i} index={i} style={headStyle}>
              {line}
            </Rise>
          ))
        : null}
      <Rows start={start} items={items} />
    </Column>
  </Reveal>
);
