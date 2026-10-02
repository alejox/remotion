/**
 * SectionCard (SECTION) - chapter change. Rendered as a `<TransitionSeries>` scene: the
 * grape/cyan diagonal wipe reveals a black frame, then a fog "01" and the section headline
 * in the shared column, with a large 20 degree brand slash on the right.
 * `duration` is the whole scene INCLUDING both wipes (`wipe` frames each); the text lives
 * between them.
 */
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { Reveal, Rise } from "./Reveal";
import { BrandSlash } from "./BrandSlash";
import { GLASS_DENSE } from "./glass";
import { TAG_GAP } from "./TextBlock";
import { MOTION } from "./tokens";
import { Column, eyebrowStyle, headStyle, lines } from "./typography";

export type SectionCardProps = {
  duration: number;
  number?: number | string;
  title?: string;
  wipe?: number;
  /** Component label at the top (showcase). */
  tag?: string;
  /** Optional scene backdrop, shown beneath the dense glass backing (`GLASS_DENSE`). */
  backdrop?: React.ReactNode;
};

/** The slash is the hero of the card: right of the text, inside the 8% margin (x + width <= 1766). */
const SLASH_X = 1400;
const SLASH_H = 620;

export const SectionCard: React.FC<SectionCardProps> = ({
  duration,
  number = "01",
  title = "Título de la sección",
  wipe = MOTION.wipeFrames,
  tag,
  backdrop,
}) => {
  const { height } = useVideoConfig();
  const num = typeof number === "number" && number < 10 ? `0${number}` : String(number);
  const rows = lines(title);
  const hold = Math.max(duration - 2 * wipe, MOTION.enterFrames + MOTION.exitFrames);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {backdrop}
      {backdrop ? (
        <AbsoluteFill style={GLASS_DENSE} />
      ) : null}
      <Reveal start={wipe} duration={hold} staged>
        <Column gap={TAG_GAP}>
          {/* The component tag, the chapter number and the headline are ONE group, one gap. */}
          <Rise index={0} style={eyebrowStyle}>
            {tag ? `${tag} ${num}` : num}
          </Rise>
          <div>
            {rows.map((line, i) => (
              <Rise key={i} index={i + 1} style={headStyle}>
                {line}
              </Rise>
            ))}
          </div>
        </Column>
        <Rise index={2} style={{ position: "absolute", left: SLASH_X, top: (height - SLASH_H) / 2 }}>
          <BrandSlash height={SLASH_H} />
        </Rise>
      </Reveal>
    </AbsoluteFill>
  );
};
