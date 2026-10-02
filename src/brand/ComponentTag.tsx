/**
 * ComponentTag - the quiet label every showcase beat carries so the viewer knows which
 * component is on screen: a fog caps eyebrow (body size, so no third type size) at a fixed
 * spot in the shared column, bare text. Over footage a small feathered dark gradient (the
 * same `Scrim` as the text beats) keeps it legible; on a backing that is already dark
 * (`scrim={false}`: the dense chapter glass, the black outro) it is plain text. Pure fade
 * with the beat, no movement.
 */
import React from "react";
import { Reveal } from "./Reveal";
import { useIsShort } from "./motion";
import { Scrim, ShortBand } from "./TextBlock";
import { COLUMN_X } from "./tokens";
import { TAG_Y, useTypeStyles } from "./typography";

/**
 * `layer` lets BeatLayer paint the tag's scrim under the beats and its text above them, so a
 * beat's own scrim never dims the tag and the tag's scrim never dims a beat's text.
 */
export const ComponentTag: React.FC<{
  start: number;
  duration: number;
  label: string;
  scrim?: boolean;
  layer?: "both" | "scrim" | "text";
  /** Top of the tag (default: the frame's tag row). */
  y?: number;
  /** Vertical feather of the tag scrim. */
  scrimY?: number;
  /** Left edge of the tag (default: the format's text column). */
  x?: number;
}> = ({ start, duration, label, scrim = true, layer = "both", y = TAG_Y, scrimY = 120, x = COLUMN_X }) => {
  const { eyebrow } = useTypeStyles();
  const short = useIsShort();
  return (
    <Reveal start={start} duration={duration} noSlide>
      <div style={{ position: "absolute", left: x, top: y }}>
        <div style={{ position: "relative", isolation: "isolate", ...eyebrow }}>
          {scrim && layer !== "text" ? short ? <ShortBand x={x} /> : <Scrim y={scrimY} left={150} right={200} /> : null}
          <span style={{ visibility: layer === "scrim" ? "hidden" : "visible" }}>{label}</span>
        </div>
      </div>
    </Reveal>
  );
};
