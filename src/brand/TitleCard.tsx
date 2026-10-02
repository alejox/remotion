/**
 * TitleCard (TITLE) - the video topic: a small caps eyebrow plus a one- or two-line
 * sentence-case headline, set directly on black in the shared column. Lines rise in one
 * by one (separate lines with "\n").
 */
import React from "react";
import { Reveal, Rise } from "./Reveal";
import { TextBlock } from "./TextBlock";
import { COLUMN_X } from "./tokens";
import { lines, useTypeStyles } from "./typography";

export type TitleCardProps = {
  start: number;
  duration: number;
  meta?: string;
  title?: string;
  x?: number;
  y?: number;
  /** Component label, set as the first line of the group. */
  tag?: string;
};

export const TitleCard: React.FC<TitleCardProps> = ({
  start,
  duration,
  meta = "TUTORIAL · OBS",
  title = "Título del video",
  x = COLUMN_X,
  y,
  tag,
}) => {
  const { eyebrow: eyebrowStyle, head: headStyle } = useTypeStyles();
  return (
  <Reveal start={start} duration={duration} staged>
    <TextBlock x={x} y={y} tag={tag} gap={20}>
      {meta ? (
        <Rise index={0} style={eyebrowStyle}>
          {meta}
        </Rise>
      ) : null}
      <div>
        {lines(title).map((line, i) => (
          <Rise key={i} index={i + 1} style={headStyle}>
            {line}
          </Rise>
        ))}
      </div>
    </TextBlock>
  </Reveal>
  );
};
