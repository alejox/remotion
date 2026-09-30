/**
 * LowerThird - first on-camera appearance: LogoDisc + channel name + tagline in a
 * panel (the 20 degree cut is the panel slash). Bottom-left, 64px from the bottom edge.
 */
import React from "react";
import { SANS } from "./fonts";
import { LogoDisc } from "./LogoDisc";
import { Panel } from "./Panel";
import { Reveal } from "./Reveal";
import { CHANNEL, COLOR, EDGE, MARGIN, TYPE } from "./tokens";

export type LowerThirdProps = {
  start: number;
  duration: number;
  name?: string;
  tagline?: string;
  x?: number;
  y?: number;
  hairline?: boolean;
};

export const LowerThird: React.FC<LowerThirdProps> = ({
  start,
  duration,
  name = CHANNEL.name,
  tagline = CHANNEL.tagline,
  x = MARGIN,
  y,
  hairline = true,
}) => (
  <Reveal start={start} duration={duration}>
    <Panel x={x} y={y} hairline={hairline} padding="18px 34px 18px 32px" style={y === undefined ? { bottom: EDGE } : undefined}>
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <LogoDisc size={84} style={{ marginLeft: 6 }} />
        <div style={{ fontFamily: SANS, whiteSpace: "nowrap" }}>
          <div style={{ fontWeight: 700, fontSize: TYPE.label, letterSpacing: "-0.02em", lineHeight: 1.25 }}>
            {name}
          </div>
          <div style={{ fontWeight: 500, fontSize: TYPE.meta, color: COLOR.fog, lineHeight: 1.3, marginTop: 2 }}>
            {tagline}
          </div>
        </div>
      </div>
    </Panel>
  </Reveal>
);
