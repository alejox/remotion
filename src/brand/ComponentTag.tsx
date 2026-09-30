/**
 * ComponentTag - the quiet label every showcase beat carries so the viewer knows which
 * component is on screen: a fog caps eyebrow (body size, so no third type size) at a fixed
 * spot in the shared column. Pure fade with the beat, no movement.
 */
import React from "react";
import { Reveal } from "./Reveal";
import { COLUMN_X } from "./tokens";
import { Column, eyebrowStyle, TAG_Y } from "./typography";

export const ComponentTag: React.FC<{ start: number; duration: number; label: string }> = ({
  start,
  duration,
  label,
}) => (
  <Reveal start={start} duration={duration} noSlide>
    <Column x={COLUMN_X} y={TAG_Y}>
      <div style={eyebrowStyle}>{label}</div>
    </Column>
  </Reveal>
);
