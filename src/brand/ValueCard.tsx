/**
 * ValueCard (VALUE) - the number is the payoff. An optional fog caps label and a white
 * supporting line (fog) come first; the figure follows on its own line at 340px, the loudest
 * and only coloured element (cyan), arriving last, with optional fog words on their own line under it.
 * Set directly on black in the shared column.
 */
import React from "react";
import { Reveal, Rise } from "./Reveal";
import { COLOR, COLUMN_X, TYPE } from "./tokens";
import { bodyStyle, Column, eyebrowStyle, headStyle, opticalShift } from "./typography";

export type ValueCardProps = {
  start: number;
  duration: number;
  label?: string;
  headline?: string;
  value?: string;
  suffix?: string;
  x?: number;
  y?: number;
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
}) => (
  <Reveal start={start} duration={duration} staged>
    <Column x={x} y={y} gap={16}>
      {label ? (
        <Rise index={0} style={eyebrowStyle}>
          {label}
        </Rise>
      ) : null}
      {headline ? (
        <Rise index={1} style={bodyStyle}>
          {headline}
        </Rise>
      ) : null}
      <Rise index={3}>
        <span
          style={{
            ...headStyle,
            display: "block",
            fontSize: TYPE.figure,
            letterSpacing: "-0.05em",
            lineHeight: 0.95,
            color: COLOR.cyan,
            marginLeft: opticalShift(value, TYPE.figure),
          }}
        >
          {value}
        </span>
      </Rise>
      {suffix ? (
        <Rise index={5} style={bodyStyle}>
          {suffix}
        </Rise>
      ) : null}
    </Column>
  </Reveal>
);
