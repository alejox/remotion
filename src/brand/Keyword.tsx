/**
 * Keyword (KEYWORD) - a term the viewer must remember. Sparingly (max 1 per 30s).
 * Small panel, term in white, one optional cyan word.
 */
import React from "react";
import { SANS } from "./fonts";
import { Panel } from "./Panel";
import { Reveal } from "./Reveal";
import { COLOR, EDGE, MARGIN, TYPE } from "./tokens";

export type KeywordProps = {
  start: number;
  duration: number;
  text?: string;
  /** Whole word(s) of `text` rendered in cyan. */
  accent?: string;
  x?: number;
  y?: number;
  hairline?: boolean;
};

export const Keyword: React.FC<KeywordProps> = ({
  start,
  duration,
  text = "Palabra clave",
  accent,
  x = MARGIN,
  y,
  hairline = true,
}) => {
  // Colour WHOLE words only.
  const accentWords = new Set((accent ?? "").split(" ").filter(Boolean));
  const words = text.split(" ");
  return (
    <Reveal start={start} duration={duration}>
      <Panel x={x} y={y} hairline={hairline} padding="16px 30px 16px 36px" style={y === undefined ? { bottom: EDGE } : undefined}>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: TYPE.label,
            letterSpacing: "-0.02em",
            lineHeight: 1.25,
            whiteSpace: "nowrap",
          }}
        >
          {words.map((w, i) => (
            <React.Fragment key={i}>
              {i > 0 ? " " : null}
              <span style={{ color: accentWords.has(w) ? COLOR.cyan : COLOR.white }}>{w}</span>
            </React.Fragment>
          ))}
        </div>
      </Panel>
    </Reveal>
  );
};
