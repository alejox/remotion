/**
 * TitleCard (TITLE) - the video topic: a small caps eyebrow plus a one- or two-line
 * sentence-case headline, set directly on black in the shared column. Lines rise in one
 * by one (separate lines with "\n").
 */
import React from "react";
import { Reveal, Rise } from "./Reveal";
import { COLUMN_X } from "./tokens";
import { Column, eyebrowStyle, headStyle, lines } from "./typography";

export type TitleCardProps = {
  start: number;
  duration: number;
  meta?: string;
  title?: string;
  x?: number;
  y?: number;
};

export const TitleCard: React.FC<TitleCardProps> = ({
  start,
  duration,
  meta = "TUTORIAL · OBS",
  title = "Título del video",
  x = COLUMN_X,
  y,
}) => (
  <Reveal start={start} duration={duration} staged>
    <Column x={x} y={y} gap={20}>
      <Rise index={0} style={eyebrowStyle}>
        {meta}
      </Rise>
      <div>
        {lines(title).map((line, i) => (
          <Rise key={i} index={i + 1} style={headStyle}>
            {line}
          </Rise>
        ))}
      </div>
    </Column>
  </Reveal>
);
