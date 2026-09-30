/**
 * SubscribeCard - the channel's animated subscribe card (rebuilt from the Apple Motion
 * original burned into the master). One choreography, two looks:
 *  - "classic": faithful recreation - white card, grape-blue logo ring, Montserrat
 *    ExtraBold caps, red button, grey bell.
 *  - "clean": the same timing in DNA v2 - flat #0E0E12 panel with the slash, LogoDisc,
 *    Geist, white line icons, and a restrained cyan-edged liquid-glass button.
 *
 * Choreography (30 fps, t = 0 at `start`): card rises from a thin bar (0-0.5s) -> logo
 * ring draws, mark scales in (0.4-1.1s) -> name types letter by letter (1.2-2.4s), tagline
 * (1.8-3.0s), button grows from a line (1.2-1.6s), bell pops -> cursor arrives (2.4-3.0s),
 * turns into a hand, click: button pressed grey "SUSCRITO" (3.2s) then red (3.6s) -> cursor
 * to the bell, click (4.2s), bell rings, ring marks -> hold -> exit reverses (7.4-8.2s).
 * Timings live in the `T` table below. Transparent background: no fill outside the card.
 */
import React from "react";
import { Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { evolvePath } from "@remotion/paths";
import { brandFamily, sansFamily } from "./fonts";
import { LogoDisc } from "./LogoDisc";
import { LogoMark } from "./LogoMark";
import { Slash } from "./Panel";
import { COLOR, EDGE, MARGIN } from "./tokens";

// Jost (Futura-style) is the brand font: the closest free match to the Apple Motion original.
const classicFont = brandFamily;

/** Frame table (30 fps, relative to the card's start). */
export const T = {
  cardIn: [0, 15],
  ring: [12, 27],
  mark: [20, 33],
  name: [36, 72],
  tagline: [54, 104],
  button: [36, 48],
  bell: [42, 54],
  cursorIn: [72, 90],
  press: 96,
  release: 108,
  cursorToBell: [108, 120],
  bellClick: 126,
  ring_swing: 24,
  cursorOut: [156, 168],
  contentOut: [222, 234],
  cardOut: [228, 246],
} as const;

export const SUBSCRIBE_DURATION = 246;

export type SubscribeVariant = "classic" | "clean";

export type SubscribeCardProps = {
  variant?: SubscribeVariant;
  /** Absolute frame where the card starts (default 0). */
  start?: number;
  durationInFrames?: number;
  channelName?: string;
  tagline?: string;
  /** Card top-left in the frame. Default: classic centred low, clean left margin / 64px bottom. */
  x?: number;
  y?: number;
  /** Uniform scale about the top-left corner (e.g. 0.66 to fit a Short's 860px safe width). */
  scale?: number;
  /** Sound cues: entrance whoosh, mouse clicks on button and bell, bell chime, exit whoosh. */
  sfx?: boolean;
};

const W = 1297;
const H = 215;
const CY = H / 2;
const BTN = { x: 776, w: 330, h: 77 };
const BELL = { x: 1175 };
const CLASSIC_RED = "#FE2100"; // sampled from the original
const PRESSED_CLASSIC = "#585858";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ramp = (f: number, [a, b]: readonly [number, number], easing = Easing.out(Easing.cubic)): number =>
  interpolate(f, [a, b], [0, 1], { easing, ...clamp });

const mix = (a: number[], b: number[], t: number): string =>
  `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`;

const BELL_PATHS = [
  "M10.268 21a2 2 0 0 0 3.464 0",
  "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
];
/**
 * "Tap" hand cursor traced from the creator's reference icon: index finger with a tap
 * ring around the tip, three separated fingers, thumb out to the left, round palm.
 * White fill + black outline. Coordinates are stroke centres in ViewBox units.
 */
const HAND =
  "M79 178V85a13.3 13.3 0 0 1 26.6 0v47a14 14 0 0 1 27.9 0v11a13.5 13.5 0 0 1 27 0v10a13.5 13.5 0 0 1 27 0v59c0 35-27.5 59-61.5 59c-25 0-40-9-51-26L42 176a11 11 0 0 1 20-13L79 178Z";
const HAND_CREASES = ["M105.6 132V155", "M133.5 143V166", "M160.5 153V173"];
const HAND_RING = "M65.5 100A34.5 34.5 0 1 1 119.5 100";
const HAND_BOX = { x: 30, y: 38, w: 166, h: 240 };
const HAND_TIP = { x: 92.3, y: 71.7 };
const HAND_HEIGHT = 66; // px at 1920x1080
const ARROW = "M5 3 L5 19 L9.2 15.2 L12.2 21.5 L14.8 20.3 L11.9 14.2 L17.5 14 Z";

/** Typed text: each letter fades from grey to its final colour. */
const Typed: React.FC<{
  text: string;
  frame: number;
  range: readonly [number, number];
  from: number[];
  to: number[];
  style: React.CSSProperties;
}> = ({ text, frame, range, from, to, style }) => {
  const n = text.length;
  const step = (range[1] - range[0]) / n;
  return (
    <div style={{ whiteSpace: "pre", ...style }}>
      {text.split("").map((ch, i) => {
        const p = ramp(frame, [range[0] + i * step, range[0] + i * step + 6] as const, Easing.linear);
        return (
          <span key={i} style={{ color: mix(from, to, p), opacity: Math.min(1, p * 3) }}>
            {ch}
          </span>
        );
      })}
    </div>
  );
};

const Bell: React.FC<{ frame: number; classic: boolean }> = ({ frame, classic }) => {
  const pop = ramp(frame, T.bell, Easing.out(Easing.cubic));
  const t = frame - T.bellClick;
  const ringing = t >= 0 && t < T.ring_swing;
  const rot = ringing ? 15 * Math.sin((2 * Math.PI * 3 * t) / T.ring_swing) * (1 - t / T.ring_swing) : 0;
  const rung = t >= 0;
  const marks = ramp(frame, [T.bellClick, T.bellClick + 6] as const);
  const color = classic ? (rung ? CLASSIC_RED : "#5B5B5B") : COLOR.white;
  const size = classic ? 100 : 80;
  return (
    <div
      style={{
        position: "absolute",
        left: BELL.x - size / 2,
        top: CY - size / 2,
        width: size,
        height: size,
        transform: `scale(${pop}) rotate(${rot}deg)`,
        transformOrigin: "50% 12%",
      }}
    >
      <svg width={size} height={size} viewBox="-6 -6 36 36" fill="none" style={{ overflow: "visible" }}>
        {BELL_PATHS.map((d) => (
          <path
            key={d}
            d={d}
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={classic && d.length > 40 ? color : "none"}
          />
        ))}
        {[-1, 1].map((s) => (
          <path
            key={s}
            d={s < 0 ? "M-3 3 C-4.5 6 -4.5 9 -3 12" : "M27 3 C28.5 6 28.5 9 27 12"}
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            opacity={marks}
          />
        ))}
      </svg>
    </div>
  );
};

const Cursor: React.FC<{ frame: number; classic: boolean; btn: { x: number; y: number }; bell: { x: number; y: number } }> = ({
  frame,
  classic,
  btn,
  bell,
}) => {
  const inP = ramp(frame, T.cursorIn);
  const toBell = ramp(frame, T.cursorToBell, Easing.inOut(Easing.cubic));
  const x = interpolate(inP, [0, 1], [btn.x + 70, btn.x]) + (bell.x - btn.x) * toBell;
  const y = interpolate(inP, [0, 1], [H + 130, btn.y]) + (bell.y - btn.y) * toBell;
  const opacity = ramp(frame, [T.cursorIn[0], T.cursorIn[0] + 4] as const, Easing.linear) * (1 - ramp(frame, T.cursorOut, Easing.linear));
  const hand = frame >= T.cursorIn[1];
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity, pointerEvents: "none" }}>
      {hand ? (
        <svg
          width={(HAND_HEIGHT * HAND_BOX.w) / HAND_BOX.h}
          height={HAND_HEIGHT}
          viewBox={`${HAND_BOX.x} ${HAND_BOX.y} ${HAND_BOX.w} ${HAND_BOX.h}`}
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth={6.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            display: "block",
            marginLeft: (-(HAND_TIP.x - HAND_BOX.x) * HAND_HEIGHT) / HAND_BOX.h,
            marginTop: (-(HAND_TIP.y - HAND_BOX.y) * HAND_HEIGHT) / HAND_BOX.h,
          }}
        >
          <path d={HAND_RING} fill="none" />
          <path d={HAND} />
          {HAND_CREASES.map((d) => (
            <path key={d} d={d} fill="none" />
          ))}
        </svg>
      ) : (
        <svg width={48} height={48} viewBox="0 0 24 24" fill={classic ? "#000" : "none"} stroke={classic ? "#fff" : COLOR.white} strokeWidth={classic ? 1.4 : 2} strokeLinejoin="round" style={{ marginLeft: -6, marginTop: -3 }}>
          <path d={ARROW} />
        </svg>
      )}
    </div>
  );
};

export const SubscribeCard: React.FC<SubscribeCardProps> = ({
  variant = "classic",
  start = 0,
  durationInFrames = SUBSCRIBE_DURATION,
  channelName,
  tagline,
  x,
  y,
  scale = 1,
  sfx = true,
}) => {
  const classic = variant === "classic";
  const frame = useCurrentFrame() - start;
  if (frame < 0 || frame >= durationInFrames) {
    return null;
  }
  const name = channelName ?? (classic ? "ALEJOXGAMING" : "Alejoxgaming");
  const tag = tagline ?? (classic ? "TUTORIALES - TECNOLOGIA - STREAMING" : "Tutoriales · Tecnología · Streaming");
  const left = x ?? (classic ? 318 : MARGIN);
  const top = y ?? (classic ? 815 : 1080 - EDGE - H);

  const pIn = ramp(frame, T.cardIn, Easing.bezier(0.45, 0, 0.25, 1));
  const pOut = 1 - ramp(frame, T.cardOut, Easing.in(Easing.cubic));
  const p = Math.min(pIn, pOut);
  const h = 8 + (H - 8) * p;
  const w = W * (0.35 + 0.65 * p);
  const insetX = (W - w) / 2;
  const radius = classic ? 32 : 12;
  const drop = (1 - pOut) * 70;
  const content = 1 - ramp(frame, T.contentOut, Easing.linear);
  const contentScale = 0.92 + 0.08 * content;

  // Button state.
  const grow = ramp(frame, T.button);
  const pressed = frame >= T.press && frame < T.release;
  const done = frame >= T.press;
  const btnLabel = done ? "SUSCRITO" : "SUSCRIBIRSE";
  const btnBg = classic
    ? pressed
      ? PRESSED_CLASSIC
      : CLASSIC_RED
    : pressed
      ? "rgba(24,43,58,0.46)"
      : "rgba(24,34,46,0.30)";
  const pressScale = pressed ? 0.965 : 1;

  const nameFont = classic
    ? { fontFamily: classicFont, fontWeight: 700, fontSize: 44, letterSpacing: "0.06em" }
    : { fontFamily: sansFamily, fontWeight: 700, fontSize: 40, letterSpacing: "-0.02em" };
  const tagFont = classic
    ? { fontFamily: classicFont, fontWeight: 500, fontSize: 18, letterSpacing: "0.09em" }
    : { fontFamily: sansFamily, fontWeight: 500, fontSize: 26 };
  const nameFrom = classic ? [190, 190, 190] : [161, 161, 170];
  const nameTo = classic ? [0, 0, 0] : [255, 255, 255];
  const tagTo = classic ? [0, 0, 0] : [161, 161, 170];

  const ringD = 168;
  const ringLeft = classic ? 75 : 40;
  const textLeft = classic ? 265 : 236;
  const ringP = ramp(frame, T.ring);
  const circ = evolvePath(ringP, `M ${ringD / 2 - 2} 2 a ${ringD / 2 - 2} ${ringD / 2 - 2} 0 1 1 0 ${ringD - 4} a ${ringD / 2 - 2} ${ringD / 2 - 2} 0 1 1 0 ${-(ringD - 4)}`);
  const markP = ramp(frame, T.mark);
  const discD = 150;

  const cues = sfx
    ? [
        // Entrance: whoosh while the bar rises.
        { f: 0, s: "whoosh", g: 0.4, d: 14 },
        // Mouse clicks (press + release) on the button and on the bell.
        { f: T.press, s: "click", g: 0.75, d: 4 },
        { f: T.bellClick, s: "click", g: 0.65, d: 4 },
        { f: T.bellClick + 3, s: "chime", g: 0.12, d: 34 },
        // Exit: reversed whoosh that ends as the card disappears.
        { f: T.cardOut[1] - 14, s: "whoosh_out", g: 0.35, d: 14 },
      ]
    : [];

  return (
    <>
      <div
        style={{
          position: "absolute",
          left,
          top,
          width: W,
          height: H,
          transform: `translateY(${drop}px) scale(${scale})`,
          transformOrigin: "0 0",
          opacity: pOut < 1 ? Math.max(0, pOut * 1.4) : 1,
          clipPath: `inset(${H - h}px ${insetX}px 0px ${insetX}px round ${radius}px)`,
          borderRadius: radius,
          overflow: "hidden",
          background: classic ? "#FFFFFF" : "rgba(14,14,18,0.20)",
          backdropFilter: classic ? undefined : "blur(2px) saturate(115%)",
          WebkitBackdropFilter: classic ? undefined : "blur(2px) saturate(115%)",
        }}
      >
        {classic ? null : <Slash />}
        <div style={{ position: "absolute", inset: 0, opacity: content, transform: `scale(${contentScale})`, transformOrigin: "50% 50%" }}>
          {classic ? (
            <div
              style={{
                position: "absolute",
                left: ringLeft,
                top: CY - ringD / 2,
                width: ringD,
                height: ringD,
              }}
            >
              <svg width={ringD} height={ringD} style={{ position: "absolute", inset: 0 }}>
                <path d={`M ${ringD / 2 - 2} 2 a ${ringD / 2 - 2} ${ringD / 2 - 2} 0 1 1 0 ${ringD - 4} a ${ringD / 2 - 2} ${ringD / 2 - 2} 0 1 1 0 ${-(ringD - 4)}`} fill="none" stroke="#3D4DA6" strokeWidth={4} strokeDasharray={circ.strokeDasharray} strokeDashoffset={circ.strokeDashoffset} />
              </svg>
              <div style={{ position: "absolute", inset: 0, transform: `scale(${markP})` }}>
                <LogoMark size={ringD * 1.05} style={{ position: "absolute", left: -ringD * 0.025, top: -ringD * 0.025 }} />
              </div>
            </div>
          ) : (
            <div style={{ position: "absolute", left: ringLeft, top: CY - discD / 2, transform: `scale(${ringP})` }}>
              <LogoDisc size={discD} />
            </div>
          )}
          <Typed text={name} frame={frame} range={T.name} from={nameFrom} to={nameTo} style={{ position: "absolute", left: textLeft, top: CY - (classic ? 40 : 46), lineHeight: "40px", ...nameFont }} />
          <Typed text={tag} frame={frame} range={T.tagline} from={nameFrom} to={tagTo} style={{ position: "absolute", left: textLeft, top: CY + (classic ? 16 : 10), lineHeight: "30px", ...tagFont }} />
          <div
            style={{
              position: "absolute",
              left: BTN.x,
              top: CY - BTN.h / 2,
              width: BTN.w,
              height: BTN.h,
              borderRadius: classic ? 8 : 38,
              background: btnBg,
              ...(classic
                ? {}
                : {
                    border: `1px solid ${pressed ? "rgba(37,161,220,0.96)" : "rgba(37,161,220,0.78)"}`,
                    boxSizing: "border-box" as const,
                    backdropFilter: "blur(12px) saturate(155%)",
                    WebkitBackdropFilter: "blur(12px) saturate(155%)",
                    boxShadow:
                      "0 8px 24px rgba(0,0,0,0.20), inset 0 1px 0 rgba(213,241,255,0.28), inset 0 -1px 0 rgba(0,0,0,0.18)",
                  }),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: COLOR.white,
              transform: `scaleY(${0.04 + 0.96 * grow}) scale(${pressScale})`,
              opacity: grow > 0 ? 1 : 0,
              fontFamily: classic ? classicFont : sansFamily,
              fontWeight: classic ? 800 : 700,
              fontSize: classic ? 32 : 26,
              letterSpacing: classic ? "0.04em" : "0.14em",
            }}
          >
            {!classic ? (
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: 8,
                  right: 8,
                  top: 2,
                  height: 1,
                  borderRadius: 37,
                  background: "linear-gradient(90deg, rgba(167,223,255,0.08), rgba(167,223,255,0.38) 50%, rgba(167,223,255,0.08))",
                  pointerEvents: "none",
                }}
              />
            ) : null}
            {btnLabel}
          </div>
          <Bell frame={frame} classic={classic} />
          <Cursor frame={frame} classic={classic} btn={{ x: BTN.x + BTN.w / 2, y: CY + 4 }} bell={{ x: BELL.x, y: CY - 2 }} />
        </div>
      </div>
      {cues.map((c) => (
        <Sequence key={c.s + c.f} from={start + c.f} durationInFrames={c.d} layout="none" name={`sfx ${c.s}`}>
          <Audio src={staticFile(`sfx/${c.s}.wav`)} volume={() => c.g} />
        </Sequence>
      ))}
    </>
  );
};
