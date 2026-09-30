/**
 * SectionCard (SECTION) - chapter change. Rendered as a `<TransitionSeries>` scene: the
 * grape/cyan diagonal wipe reveals a black frame, then a fog "01" and the section headline
 * in the shared column, with a large 20 degree brand slash on the right.
 * `duration` is the whole scene INCLUDING both wipes (`wipe` frames each); the text lives
 * between them.
 */
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { ComponentTag } from "./ComponentTag";
import { Reveal, Rise } from "./Reveal";
import { BrandSlash } from "./BrandSlash";
import { MOTION } from "./tokens";
import { Column, eyebrowStyle, headStyle, lines } from "./typography";

export type SectionCardProps = {
  duration: number;
  number?: number | string;
  title?: string;
  wipe?: number;
  /** Component label at the top (showcase). */
  tag?: string;
  /** Optional scene backdrop, shown beneath the frosted chapter-card material. */
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
        <AbsoluteFill
          style={{
            background: "rgba(9, 14, 21, 0.68)",
            backdropFilter: "blur(26px) saturate(140%)",
            WebkitBackdropFilter: "blur(26px) saturate(140%)",
            borderTop: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
          }}
        />
      ) : null}
      {tag ? <ComponentTag start={wipe} duration={hold} label={tag} /> : null}
      <Reveal start={wipe} duration={hold} staged>
        <Column gap={20}>
          <Rise index={0} style={{ ...eyebrowStyle, letterSpacing: "0.06em" }}>
            {num}
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
