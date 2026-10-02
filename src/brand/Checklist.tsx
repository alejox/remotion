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
import { TextPanel } from "./TextPanel";
import { COLOR, COLUMN_X } from "./tokens";
import { useIsShort } from "./motion";
import { lines, useTypeStyles } from "./typography";

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

const Check: React.FC<{ progress: number; size: number; pending?: boolean }> = ({ progress, size, pending = false }) => {
  const evolved = evolvePath(progress, CHECK_PATH);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flex: "none" }}>
      {/* Pending state (Shorts): a dim empty circle that the check then fills in. */}
      {pending ? <circle cx={12} cy={12} r={10.5} stroke="rgba(255,255,255,0.4)" strokeWidth={1.6} opacity={1 - progress} /> : null}
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

const Rows: React.FC<{ start: number; items: string[]; topGap: number }> = ({ start, items, topGap }) => {
  const local = useCurrentFrame() - start;
  const short = useIsShort();
  const { body, scale } = useTypeStyles();
  const rowH = Math.round(scale.body * 2);
  return (
    <div style={{ marginTop: topGap }}>
      {items.slice(0, 4).map((item, i) => {
        const progress = drawProgress(local, FIRST + i * STEP, DRAW);
        return (
          <Rise
            key={item}
            index={i + 2}
            style={{ display: "flex", alignItems: "center", gap: 20, height: short ? rowH : 68, ...body }}
          >
            <Check progress={progress} size={scale.body + 6} pending={short} />
            {/* Until its check draws, the row reads as pending: dimmed. */}
            <span style={{ opacity: short ? 0.55 + 0.45 * progress : 1 }}>{item}</span>
          </Rise>
        );
      })}
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
  <Reveal start={start} duration={duration} staged fadeLayer={false}>
    <TextPanel x={x} y={y}>
      <ChecklistBody start={start} items={items} title={title} />
    </TextPanel>
  </Reveal>
);

const ChecklistBody: React.FC<{ start: number; items: string[]; title?: string }> = ({ start, items, title }) => {
  const { head: headStyle } = useTypeStyles();
  return (
    <>
      {title
        ? lines(title).map((line, i) => (
            <Rise key={i} index={i} style={headStyle}>
              {line}
            </Rise>
          ))
        : null}
      {/* Without a title the rows are the panel's only content: no extra space above them. */}
      <Rows start={start} items={items} topGap={title ? 44 : 0} />
    </>
  );
};
