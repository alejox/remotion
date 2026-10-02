/**
 * ValueCard (VALUE) - the number is the payoff. An optional fog caps label and a white
 * supporting line (fog) come first; the figure follows on its own line at 340px, the loudest
 * and only coloured element (cyan), arriving last, with optional fog words on their own line under it.
 * Set directly on black in the shared column.
 */
import React from "react";
import { Reveal, Rise } from "./Reveal";
import { TextBlock } from "./TextBlock";
import { COLOR, COLUMN_X } from "./tokens";
import { lines, opticalShift, useTypeStyles } from "./typography";

export type ValueCardProps = {
  start: number;
  duration: number;
  label?: string;
  headline?: string;
  value?: string;
  suffix?: string;
  x?: number;
  y?: number;
  /** Component label, set as the first line of the group. */
  tag?: string;
};

export const ValueCard: React.FC<ValueCardProps> = ({
  start,
  duration,
  label,
  headline,
  value = "4460",
  suffix,
  x = COLUMN_X,
  y,
  tag,
}) => {
  const { eyebrow: eyebrowStyle, head: headStyle, lead: leadStyle, scale } = useTypeStyles();
  return (
  <Reveal start={start} duration={duration} staged>
    <TextBlock x={x} y={y} tag={tag} gap={16}>
      {label ? (
        <Rise index={0} style={eyebrowStyle}>
          {label}
        </Rise>
      ) : null}
      {headline
        ? lines(headline).map((line, i) => (
            <Rise key={i} index={1 + i} style={{ ...leadStyle, marginTop: i > 0 ? -16 : 0 }}>
              {line}
            </Rise>
          ))
        : null}
      <Rise index={9} style={{ marginTop: -13 }}>
        <span
          style={{
            ...headStyle,
            display: "block",
            fontSize: scale.figure,
            letterSpacing: "-0.05em",
            lineHeight: 0.95,
            color: COLOR.cyan,
            marginLeft: opticalShift(value, scale.figure),
          }}
        >
          {value}
        </span>
      </Rise>
      {suffix ? (
        <Rise index={10} style={{ ...leadStyle, marginTop: -16 }}>
          {suffix}
        </Rise>
      ) : null}
    </TextBlock>
  </Reveal>
  );
};
