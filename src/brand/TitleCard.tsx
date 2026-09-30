/**
 * TitleCard (TITLE) - the video topic in the first seconds: a small caps meta label
 * plus a one-line sentence-case title in a panel. Place it top-left while a burned-in
 * source pill occupies the bottom; never centred.
 */
import React from "react";
import { SANS } from "./fonts";
import { Panel } from "./Panel";
import { Reveal } from "./Reveal";
import { COLOR, EDGE, MARGIN, TYPE } from "./tokens";

export type TitleCardProps = {
  start: number;
  duration: number;
  meta?: string;
  title?: string;
  x?: number;
  y?: number;
  hairline?: boolean;
};

export const TitleCard: React.FC<TitleCardProps> = ({
  start,
  duration,
  meta = "TUTORIAL · OBS",
  title = "Título del video",
  x = MARGIN,
  y = EDGE,
  hairline = true,
}) => (
  <Reveal start={start} duration={duration}>
    <Panel x={x} y={y} hairline={hairline}>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: TYPE.meta,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: COLOR.fog,
          lineHeight: 1.25,
          whiteSpace: "nowrap",
        }}
      >
        {meta}
      </div>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: TYPE.title,
          letterSpacing: "-0.02em",
          lineHeight: 1.25,
          marginTop: 6,
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </div>
    </Panel>
  </Reveal>
);
