/**
 * ValueCard (VALUE) - an exact value to copy (port, IP, setting): small label,
 * Geist Mono value.
 */
import React from "react";
import { MONO, SANS } from "./fonts";
import { Panel } from "./Panel";
import { Reveal } from "./Reveal";
import { COLOR, MARGIN, TYPE } from "./tokens";

export type ValueCardProps = {
  start: number;
  duration: number;
  label?: string;
  value?: string;
  x?: number;
  y?: number;
  hairline?: boolean;
};

export const ValueCard: React.FC<ValueCardProps> = ({
  start,
  duration,
  label = "Puerto",
  value = "4460",
  x = MARGIN,
  y = 380,
  hairline = true,
}) => (
  <Reveal start={start} duration={duration}>
    <Panel x={x} y={y} hairline={hairline} padding="20px 30px 22px 38px">
      <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
        <div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 500,
              fontSize: TYPE.meta,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: COLOR.fog,
              lineHeight: 1.25,
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontFamily: MONO,
              fontWeight: 500,
              fontSize: TYPE.value,
              lineHeight: 1.15,
              marginTop: 6,
              whiteSpace: "nowrap",
            }}
          >
            {value}
          </div>
        </div>
      </div>
    </Panel>
  </Reveal>
);
