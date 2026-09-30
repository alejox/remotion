/**
 * Outro (OUTRO) - the last seconds on black: the brand mark, a headline and a fog line, in the
 * shared column (Shorts: the same trio on a centred axis around y 800-1000). Fades in
 * with the standard enter. `slots` is accepted for old configs and ignored: end-screen
 * placeholders are not drawn in showcase mode.
 */
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { BrandMark } from "./BrandMark";
import { ComponentTag } from "./ComponentTag";
import { Reveal, Rise } from "./Reveal";
import { COLUMN_X } from "./tokens";
import { bodyStyle, Column, headStyle } from "./typography";

export type OutroProps = {
  start: number;
  duration: number;
  title?: string;
  /** Second line under the headline. */
  subtitle?: string;
  /** Component label at the top (showcase). */
  tag?: string;
  /** Ignored (see above). */
  slots?: [string, string];
};

export const Outro: React.FC<OutroProps> = ({
  start,
  duration,
  title = "Gracias por ver.",
  subtitle = "Nos vemos en el próximo video.",
  tag,
}) => {
  const { width, height } = useVideoConfig();
  const short = height > width;
  const content = (
    <>
      <Rise index={0}>
        <BrandMark height={short ? 110 : 96} />
      </Rise>
      <div style={short ? { textAlign: "center" } : undefined}>
        <Rise index={1} style={headStyle}>
          {title}
        </Rise>
        <Rise index={2} style={{ ...bodyStyle, marginTop: 12 }}>
          {subtitle}
        </Rise>
      </div>
    </>
  );
  return (
    <Reveal start={start} duration={duration} staged>
      <AbsoluteFill style={{ backgroundColor: "#000" }} />
      {short ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 830,
            width,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 40,
          }}
        >
          {content}
        </div>
      ) : (
        <Column x={COLUMN_X} gap={32}>
          {content}
        </Column>
      )}
      {tag ? (
        <ComponentTag start={start} duration={duration} label={tag} />
      ) : null}
    </Reveal>
  );
};
