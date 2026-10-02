/**
 * Keyword (KEYWORD) - a term the viewer must remember. Sparingly (max 1 per 30s).
 * Headline set directly on black; separate lines with "\n". One optional whole word in cyan.
 */
import React from "react";
import { Reveal, Rise } from "./Reveal";
import { TextBlock } from "./TextBlock";
import { COLOR, COLUMN_X } from "./tokens";
import { lines, useTypeStyles } from "./typography";

export type KeywordProps = {
  start: number;
  duration: number;
  text?: string;
  /** Whole word(s) of `text` rendered in cyan. */
  accent?: string;
  x?: number;
  y?: number;
  /** Component label, set as the first line of the group. */
  tag?: string;
};

export const Keyword: React.FC<KeywordProps> = ({
  start,
  duration,
  text = "Palabra clave",
  accent,
  x = COLUMN_X,
  y,
  tag,
}) => {
  const { head: headStyle } = useTypeStyles();
  // Colour WHOLE words only.
  const accentWords = new Set((accent ?? "").split(" ").filter(Boolean));
  return (
    <Reveal start={start} duration={duration} staged>
      <TextBlock x={x} y={y} tag={tag}>
        {lines(text).map((line, li) => (
          <Rise key={li} index={li} style={headStyle}>
            {line.split(" ").map((w, i) => (
              <React.Fragment key={i}>
                {i > 0 ? " " : null}
                <span style={{ color: accentWords.has(w) ? COLOR.cyan : COLOR.white }}>{w}</span>
              </React.Fragment>
            ))}
          </Rise>
        ))}
      </TextBlock>
    </Reveal>
  );
};
