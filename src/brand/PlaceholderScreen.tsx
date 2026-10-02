/**
 * Placeholders for footage when a config has no source: `PlaceholderScreen` is a believable
 * settings window on the shared glass (title bar, labelled rows, toggles) that gives a Spotlight something
 * to point at. It fades in `MOCK_LEAD` frames before its beat and out with it, so the
 * callout arrives on a settled picture.
 */
import React from "react";
import { Easing, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { SANS } from "./fonts";
import { GLASS, GLASS_RADIUS, GlassRim } from "./glass";
import { enter, exit } from "./motion";
import type { Rect } from "./Spotlight";
import { COLOR } from "./tokens";

/** Frames the placeholder is on screen before its beat starts. */
export const MOCK_LEAD = 24;

/** Compact window under the Spotlight headline, on the x = 192 column (right edge x 770, clear of the speaker's glasses). */
const WIN = { x: 192, y: 420, w: 578, h: 408 };
/** UI text inside the mock: clearly secondary to the headline (26px is the floor). */
const UI_TEXT = 28;
const BAR_H = 64;
const ROW = { inset: 20, h: 56, gap: 8, top: 76 };

type MockRow = { label: string; kind: "value" | "off" | "on"; value?: string };
const ROWS: MockRow[] = [
  { label: "Resolución", kind: "value", value: "4K" },
  { label: "Formato", kind: "value", value: "MP4" },
  { label: "Aceleración por hardware", kind: "off" },
  { label: "Subtítulos automáticos", kind: "off" },
  { label: "Avisos al terminar", kind: "off" },
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

/** The row a Spotlight points at: it lifts to a lighter gray, then its toggle switches on (cyan track, white knob: the frame's only cyan). */
export const MOCK_TARGET = 2;
const LIFT_FROM = 16;
const SWITCH_FROM = 40;
const SWITCH_FRAMES = 14;
const ROW_LIFTED = "rgba(255,255,255,0.16)";
const ROW_REST = "rgba(255,255,255,0)";
const HAIRLINE = "rgba(255,255,255,0.16)";
const TOGGLE_OFF = "rgba(255,255,255,0.30)";
/** Secondary UI text on glass (fogGlass keeps it >= 4.5:1). */
const VALUE_TEXT = COLOR.fogGlass;

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
      background: interpolateColors(progress, [0, 1], [TOGGLE_OFF, onColor]),
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
        ...GLASS,
        borderRadius: GLASS_RADIUS,
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
          paddingLeft: 96,
          borderBottom: `1px solid ${HAIRLINE}`,
          color: COLOR.white,
          fontWeight: 700,
        }}
      >
        <div style={{ position: "absolute", left: 22, display: "flex", gap: 8 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: "rgba(255,255,255,0.34)" }} />
          ))}
        </div>
        Exportación
      </div>
      {MOCK_UI.rows.slice(0, -1).map((r, i) => (
        <div
          key={`rule${i}`}
          style={{
            position: "absolute",
            left: r.x - WIN.x,
            top: r.y - WIN.y + r.h + ROW.gap / 2,
            width: r.w,
            height: 1,
            background: HAIRLINE,
          }}
        />
      ))}
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
              background: i === MOCK_TARGET ? interpolateColors(lift, [0, 1], [ROW_REST, ROW_LIFTED]) : ROW_REST,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 18px",
              whiteSpace: "nowrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 18, color: i === MOCK_TARGET ? COLOR.white : COLOR.fogGlass, fontWeight: 500 }}>
              {row.label}
            </div>
            {row.kind === "value" ? (
              <div style={{ color: i === MOCK_TARGET ? COLOR.white : VALUE_TEXT, fontWeight: 500 }}>{`${row.value}  ›`}</div>
            ) : (
              <Toggle
                progress={i === MOCK_TARGET ? flip : row.kind === "on" ? 1 : 0}
                onColor={i === MOCK_TARGET ? COLOR.cyan : "#636366"}
              />
            )}
          </div>
        );
      })}
      <GlassRim />
    </div>
  );
};
