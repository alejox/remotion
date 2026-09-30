/**
 * Placeholders for footage when a config has no source: `PlaceholderScreen` is a believable
 * dark settings window (title bar, labelled rows, toggles) that gives a Spotlight something
 * to point at. It fades in `MOCK_LEAD` frames before its beat and out with it, so the
 * callout arrives on a settled picture.
 */
import React from "react";
import { Easing, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { SANS } from "./fonts";
import { enter, exit } from "./motion";
import type { Rect } from "./Spotlight";
import { COLOR, UI } from "./tokens";

/** Frames the placeholder is on screen before its beat starts. */
export const MOCK_LEAD = 24;

const WIN = { x: 670, y: 290, w: 900, h: 500 };
/** UI text inside the mock: clearly secondary to the headline (26px is the floor). */
const UI_TEXT = 28;
const BAR_H = 72;
const ROW = { inset: 28, h: 64, gap: 12, top: 96 };

type MockRow = { label: string; kind: "value" | "off" | "on"; value?: string };
const ROWS: MockRow[] = [
  { label: "Resolución", kind: "value", value: "4K" },
  { label: "Formato", kind: "value", value: "MP4" },
  { label: "Aceleración por hardware", kind: "off" },
  { label: "Subtítulos automáticos", kind: "on" },
  { label: "Avisos al terminar", kind: "on" },
];

/** Geometry of the mock, in frame pixels: point a Spotlight at `rows[i]`. */
export const MOCK_UI: { window: Rect; rows: Rect[] } = {
  window: { ...WIN },
  rows: ROWS.map((_, i) => ({
    x: WIN.x + ROW.inset,
    y: WIN.y + ROW.top + i * (ROW.h + ROW.gap),
    w: WIN.w - ROW.inset * 2,
    h: ROW.h,
  })),
};

/** The row a Spotlight points at: it lifts to a lighter gray, then its toggle switches on (light gray track, white knob). */
export const MOCK_TARGET = 2;
const LIFT_FROM = 16;
const SWITCH_FROM = 40;
const SWITCH_FRAMES = 14;
const ROW_LIFTED = "#3C3C3E";

/** Frame opacity for a placeholder tied to a beat window. Null when it is not on screen. */
const useLeadOpacity = (start: number, duration: number): number | null => {
  const local = useCurrentFrame() - start;
  if (local < -MOCK_LEAD || local >= duration) {
    return null;
  }
  return enter(local + MOCK_LEAD).opacity * exit(local, duration).opacity;
};

/** `progress` 0 = off, 1 = on; `onColor` is the track colour when on. */
const Toggle: React.FC<{ progress: number; onColor: string }> = ({ progress, onColor }) => (
  <div
    style={{
      position: "relative",
      width: 60,
      height: 34,
      borderRadius: 17,
      background: interpolateColors(progress, [0, 1], [UI.line, onColor]),
      flex: "none",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 3,
        left: 3 + 26 * progress,
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: COLOR.white,
      }}
    />
  </div>
);

export const PlaceholderScreen: React.FC<{ start: number; duration: number }> = ({ start, duration }) => {
  const opacity = useLeadOpacity(start, duration);
  const local = useCurrentFrame() - start;
  if (opacity === null) {
    return null;
  }
  const clampOut = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const lift = interpolate(local, [LIFT_FROM, LIFT_FROM + 14], [0, 1], { easing: Easing.out(Easing.cubic), ...clampOut });
  const flip = interpolate(local, [SWITCH_FROM, SWITCH_FROM + SWITCH_FRAMES], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
    ...clampOut,
  });
  return (
    <div
      style={{
        position: "absolute",
        left: WIN.x,
        top: WIN.y,
        width: WIN.w,
        height: WIN.h,
        boxSizing: "border-box",
        borderRadius: 24,
        background: UI.pill,
        border: `1px solid ${UI.row}`,
        fontFamily: SANS,
        fontSize: UI_TEXT,
        opacity,
      }}
    >
      <div
        style={{
          position: "relative",
          height: BAR_H,
          display: "flex",
          alignItems: "center",
          paddingLeft: 122,
          borderBottom: `1px solid ${UI.row}`,
          color: COLOR.white,
          fontWeight: 700,
        }}
      >
        <div style={{ position: "absolute", left: 28, display: "flex", gap: 10 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: "#48484A" }} />
          ))}
        </div>
        Exportación
      </div>
      {ROWS.map((row, i) => {
        const r = MOCK_UI.rows[i];
        return (
          <div
            key={row.label}
            style={{
              position: "absolute",
              left: r.x - WIN.x,
              top: r.y - WIN.y,
              width: r.w,
              height: r.h,
              boxSizing: "border-box",
              borderRadius: 14,
              background: i === MOCK_TARGET ? interpolateColors(lift, [0, 1], [UI.row, ROW_LIFTED]) : UI.row,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 22px",
              whiteSpace: "nowrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 18, color: "#F5F5F7", fontWeight: 500 }}>
              {row.label}
            </div>
            {row.kind === "value" ? (
              <div style={{ color: "#C7C7CC", fontWeight: 500 }}>{`${row.value}  ›`}</div>
            ) : (
              <Toggle
                progress={i === MOCK_TARGET ? flip : row.kind === "on" ? 1 : 0}
                onColor={i === MOCK_TARGET ? "#B4B4BA" : "#636366"}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
