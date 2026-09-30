/**
 * Outro (OUTRO) - the last seconds: a dark frame, LogoDisc and "Gracias por ver".
 * Landscape adds two flat end-screen slots inside the 96px margins: a 16:9 video slot and a
 * circular slot for YouTube's subscribe element. Shorts have no end screens: just the
 * logo and the thanks, centred around y 800-1000. Fades in with the standard enter.
 */
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { SANS } from "./fonts";
import { LogoDisc } from "./LogoDisc";
import { Panel } from "./Panel";
import { Reveal } from "./Reveal";
import { COLOR, HAIRLINE, MARGIN, TYPE } from "./tokens";

export type OutroProps = {
  start: number;
  duration: number;
  title?: string;
  /** Meta labels of the two landscape end-screen slots (video, subscribe). */
  slots?: [string, string];
};

const Title: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: TYPE.section,
      letterSpacing: "-0.02em",
      whiteSpace: "nowrap",
      color: COLOR.white,
    }}
  >
    {text}
  </div>
);

const metaStyle: React.CSSProperties = {
  fontFamily: SANS,
  fontWeight: 500,
  fontSize: TYPE.meta,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: COLOR.fog,
};

export const Outro: React.FC<OutroProps> = ({
  start,
  duration,
  title = "Gracias por ver",
  slots = ["Siguiente video", "Suscríbete"],
}) => {
  const { width, height } = useVideoConfig();
  const short = height > width;
  // Landscape block: header 132 + gap 56 + row 585 = 773, centred vertically.
  const row = 585;
  const top = (height - (132 + 56 + row)) / 2;
  return (
    <Reveal start={start} duration={duration} noSlide>
      <AbsoluteFill style={{ backgroundColor: COLOR.panel }} />
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
          <LogoDisc size={132} />
          <Title text={title} />
        </div>
      ) : (
        <>
          <div style={{ position: "absolute", left: MARGIN, top, display: "flex", alignItems: "center", gap: 36 }}>
            <LogoDisc size={132} />
            <Title text={title} />
          </div>
          <Panel
            x={MARGIN}
            y={top + 132 + 56}
            width={1040}
            hairline
            padding="22px 30px 22px 38px"
            style={{ height: row, background: COLOR.slot }}
          >
            <div style={metaStyle}>{slots[0]}</div>
          </Panel>
          <div
            style={{
              position: "absolute",
              left: width - MARGIN - row,
              top: top + 132 + 56,
              width: row,
              height: row,
              boxSizing: "border-box",
              borderRadius: "50%",
              border: HAIRLINE,
              background: COLOR.slot,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={metaStyle}>{slots[1]}</div>
          </div>
        </>
      )}
    </Reveal>
  );
};
