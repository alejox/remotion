/**
 * SectionCard (SECTION) - chapter change. Rendered as a `<TransitionSeries>` scene: the
 * grape/cyan diagonal wipe reveals a dark frame, then "01" plus the section title,
 * left-aligned beside a large brand slash. `duration` is the whole scene INCLUDING both
 * wipes (`wipe` frames each); the text lives between them.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { SANS } from "./fonts";
import { Slash } from "./Panel";
import { Reveal } from "./Reveal";
import { COLOR, MARGIN, MOTION, TYPE } from "./tokens";

export type SectionCardProps = {
  duration: number;
  number?: number | string;
  title?: string;
  wipe?: number;
};

export const SectionCard: React.FC<SectionCardProps> = ({
  duration,
  number = "01",
  title = "Título de la sección",
  wipe = MOTION.wipeFrames,
}) => {
  const num = typeof number === "number" && number < 10 ? `0${number}` : String(number);
  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.panel }}>
      <Reveal start={wipe} duration={Math.max(duration - 2 * wipe, MOTION.enterFrames + MOTION.exitFrames)}>
        <div
          style={{
            position: "absolute",
            left: MARGIN,
            top: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative", paddingLeft: 48, fontFamily: SANS, color: COLOR.white }}>
            <Slash width={10} />
            <div
              style={{
                fontWeight: 500,
                fontSize: TYPE.label,
                letterSpacing: "0.14em",
                color: COLOR.cyan,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {num}
            </div>
            <div
              style={{
                fontWeight: 700,
                fontSize: TYPE.section,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                marginTop: 10,
                whiteSpace: "nowrap",
              }}
            >
              {title}
            </div>
          </div>
        </div>
      </Reveal>
    </AbsoluteFill>
  );
};
