/**
 * SubscribeCard - the channel's animated subscribe card (rebuilt from the Apple Motion
 * original burned into the master). One choreography, two looks:
 *  - "classic": faithful recreation - white card, grape-blue logo ring, Montserrat
 *    ExtraBold caps, red button, grey bell.
 *  - "clean": the same timing in DNA v2 - the shared glass card (same material, radius, rim
 *    and 1px accent as the LowerThird), the bare white BrandMark, the LowerThird's name and
 *    tagline styles, white line icons, and a cyan-edged glass button.
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
import { BrandMark } from "./BrandMark";
import { GLASS, GLASS_RADIUS, GlassRim } from "./glass";
import { LogoMark } from "./LogoMark";
import { CHANNEL, COLOR, COLUMN_X, TAGLINE_COLOR, TYPE } from "./tokens";
import { bodyStyle, nameStyle } from "./typography";

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

type Timing = { [K in keyof typeof T]: (typeof T)[K] extends readonly [number, number] ? readonly [number, number] : number };

/**
 * Clean timing: one thing moves at a time. Card rises, mark scales in, the name types, THEN
 * the tagline types, then the button grows, the bell pops, the cursor arrives, presses, moves
 * beside the bell, clicks (the bell rings while the cursor rests), and leaves.
 */
const TC: Timing = {
  cardIn: [0, 15],
  ring: [15, 27],
  mark: [20, 33],
  name: [30, 54],
  tagline: [54, 84],
  button: [88, 100],
  bell: [100, 112],
  cursorIn: [118, 136],
  press: 142,
  release: 154,
  cursorToBell: [160, 174],
  bellClick: 180,
  ring_swing: 24,
  cursorOut: [208, 220],
  contentOut: [222, 234],
  cardOut: [228, 246],
};

export const SUBSCRIBE_DURATION = 246;

export type SubscribeVariant = "classic" | "clean";

export type SubscribeCardProps = {
  variant?: SubscribeVariant;
  /** Absolute frame where the card starts (default 0). */
  start?: number;
  durationInFrames?: number;
  channelName?: string;
  tagline?: string;
  /** Card top-left in the frame. Default: classic centred low, clean on the x = 192 column, 100px above the bottom. */
  x?: number;
  y?: number;
  /** Uniform scale about the top-left corner (e.g. 0.66 to fit a Short's 860px safe width). */
  scale?: number;
  /** Sound cues: entrance whoosh, mouse clicks on button and bell, bell chime, exit whoosh. */
  sfx?: boolean;
  /** Clean only: "row" (16:9, default) or "stacked" (two rows, for 9:16 Shorts). */
  layout?: "row" | "stacked";
};

/** Clean card: gap under it (>= 8% of the frame height, 86px). */
const CLEAN_BOTTOM = 100;
/** Clean: one horizontal row - glass disc with the mark, name + tagline, button, bell. */
const CLEAN_PAD = 32;
const CLEAN_DISC = 124;
const CLEAN_MARK = 58;
const CLEAN_H = 188;
const CLEAN_CY = CLEAN_H / 2;
const CLEAN_TEXT_X = CLEAN_PAD + CLEAN_DISC + 26;
/** Tagline width at body size (Geist 500, 34px). */
const CLEAN_TEXT_W = 541;
const CLEAN_BTN = { x: CLEAN_TEXT_X + CLEAN_TEXT_W + 44, w: 300, h: 72 };
const CLEAN_BELL_X = CLEAN_BTN.x + CLEAN_BTN.w + 54;

type Dims = {
  W: number;
  H: number;
  /** Centre line of the bell and the button (and of the classic name block). */
  CY: number;
  /** Centre line of the logo disc and the name + tagline (equals `CY` on one row). */
  headCY: number;
  btn: { x: number; y: number; w: number; h: number };
  bellX: number;
  /** Cursor target points (card coordinates): on the button, beside the bell. */
  cursorBtn: { x: number; y: number };
  cursorBell: { x: number; y: number };
};

/** Classic: the faithful 1297 x 215 replica. */
const CLASSIC_DIMS: Dims = {
  W: 1297,
  H: 215,
  CY: 107.5,
  headCY: 107.5,
  btn: { x: 776, y: 107.5 - 38.5, w: 330, h: 77 },
  bellX: 1175,
  cursorBtn: { x: 776 + 165, y: 111.5 },
  cursorBell: { x: 1175, y: 105.5 },
};

/** Clean: a horizontal glass card sized to its row. */
const CLEAN_DIMS: Dims = {
  // Space after the bell glyph equals the space before the logo disc.
  W: CLEAN_BELL_X + 22 + CLEAN_PAD,
  H: CLEAN_H,
  CY: CLEAN_CY,
  headCY: CLEAN_CY,
  btn: { x: CLEAN_BTN.x, y: CLEAN_CY - CLEAN_BTN.h / 2, w: CLEAN_BTN.w, h: CLEAN_BTN.h },
  bellX: CLEAN_BELL_X,
  // Fingertip inside the pill, just below and right of the label so the hand doesn't hide the text.
  cursorBtn: { x: CLEAN_BTN.x + CLEAN_BTN.w - 46, y: CLEAN_CY + 16 },
  // ... and ON the bell's body at the click (the hand overlaps the icon there, as a real click would).
  cursorBell: { x: CLEAN_BELL_X, y: CLEAN_CY + 6 },
};

/**
 * Clean, stacked (9:16): the same pieces in two rows. Row 1 is the disc + name + tagline, row 2
 * the button (as wide as the row) + bell. Card width is the row's 755px, so it fits the 860px
 * Short safe width at scale 1.
 */
const STACK_W = CLEAN_TEXT_X + CLEAN_TEXT_W + CLEAN_PAD;
const STACK_HEAD_CY = CLEAN_PAD + CLEAN_DISC / 2;
const STACK_ROW2_CY = CLEAN_PAD + CLEAN_DISC + 28 + CLEAN_BTN.h / 2;
const STACK_BELL_X = STACK_W - CLEAN_PAD - 22;
const STACK_BTN = { x: CLEAN_PAD, w: STACK_BELL_X - 54 - CLEAN_PAD, h: CLEAN_BTN.h };
const CLEAN_STACKED_DIMS: Dims = {
  W: STACK_W,
  H: STACK_ROW2_CY + CLEAN_BTN.h / 2 + CLEAN_PAD,
  CY: STACK_ROW2_CY,
  headCY: STACK_HEAD_CY,
  btn: { x: STACK_BTN.x, y: STACK_ROW2_CY - STACK_BTN.h / 2, w: STACK_BTN.w, h: STACK_BTN.h },
  bellX: STACK_BELL_X,
  cursorBtn: { x: STACK_BTN.x + STACK_BTN.w - 46, y: STACK_ROW2_CY + 16 },
  cursorBell: { x: STACK_BELL_X, y: STACK_ROW2_CY + 6 },
};

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

/** The subscribed check on the clean button: draws on right after the release. */
const SmallCheck: React.FC<{ progress: number }> = ({ progress }) => {
  const path = "M4 12.5 L9.5 18 L20 6";
  const e = evolvePath(progress, path);
  return (
    // The slot is reserved from the press moment (the label never shifts); only the stroke draws in.
    <div style={{ width: 42, height: 30, overflow: "visible", flex: "none", display: "flex", alignItems: "center" }}>
    <svg width={30} height={30} viewBox="0 0 24 24" fill="none" style={{ flex: "none", marginLeft: 0 }}>
      <path d={path} stroke={COLOR.fogGlass} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={e.strokeDasharray} strokeDashoffset={e.strokeDashoffset} />
    </svg>
    </div>
  );
};

const Bell: React.FC<{ frame: number; classic: boolean; tm: Timing; d: Dims }> = ({ frame, classic, tm, d }) => {
  const pop = ramp(frame, tm.bell, Easing.out(Easing.cubic));
  const t = frame - tm.bellClick;
  const ringing = t >= 0 && t < tm.ring_swing;
  const rot = ringing ? 15 * Math.sin((2 * Math.PI * 3 * t) / tm.ring_swing) * (1 - t / tm.ring_swing) : 0;
  const rung = t >= 0;
  const marks = ramp(frame, [tm.bellClick, tm.bellClick + 6] as const);
  const color = classic ? (rung ? CLASSIC_RED : "#5B5B5B") : COLOR.white;
  const size = classic ? 100 : 80;
  return (
    <div
      style={{
        position: "absolute",
        left: d.bellX - size / 2,
        top: d.CY - size / 2,
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
        {(classic ? [-1, 1] : []).map((s) => (
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

const Cursor: React.FC<{ frame: number; classic: boolean; tm: Timing; boxH: number; btn: { x: number; y: number }; bell: { x: number; y: number } }> = ({
  frame,
  classic,
  tm,
  boxH,
  btn,
  bell,
}) => {
  const inP = ramp(frame, tm.cursorIn);
  const toBell = ramp(frame, tm.cursorToBell, Easing.inOut(Easing.cubic));
  const x = interpolate(inP, [0, 1], [btn.x + 70, btn.x]) + (bell.x - btn.x) * toBell;
  const y = interpolate(inP, [0, 1], [boxH + 130, btn.y]) + (bell.y - btn.y) * toBell;
  const opacity = ramp(frame, [tm.cursorIn[0], tm.cursorIn[0] + 4] as const, Easing.linear) * (1 - ramp(frame, tm.cursorOut, Easing.linear));
  const hand = frame >= tm.cursorIn[1];
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
          {classic ? <path d={HAND_RING} fill="none" /> : null}
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
  layout = "row",
}) => {
  const classic = variant === "classic";
  const frame = useCurrentFrame() - start;
  if (frame < 0 || frame >= durationInFrames) {
    return null;
  }
  const name = channelName ?? (classic ? "ALEJOXTECH" : CHANNEL.name);
  const tag = tagline ?? (classic ? "TUTORIALES - TECNOLOGIA - STREAMING" : CHANNEL.tagline);
  const left = x ?? (classic ? 318 : COLUMN_X);
  const d = classic ? CLASSIC_DIMS : layout === "stacked" ? CLEAN_STACKED_DIMS : CLEAN_DIMS;
  const { W, H } = d;
  const tm: Timing = classic ? T : TC;
  const top = y ?? (classic ? 815 : 1080 - CLEAN_BOTTOM - H);

  const pIn = ramp(frame, tm.cardIn, Easing.bezier(0.45, 0, 0.25, 1));
  const pOut = 1 - ramp(frame, tm.cardOut, Easing.in(Easing.cubic));
  const p = Math.min(pIn, pOut);
  const h = 8 + (H - 8) * p;
  const w = W * (0.35 + 0.65 * p);
  const insetX = (W - w) / 2;
  const radius = classic ? 32 : GLASS_RADIUS;
  const drop = (1 - pOut) * 70;
  const content = 1 - ramp(frame, tm.contentOut, Easing.linear);
  const contentScale = 0.92 + 0.08 * content;
  const cardOpacity = pOut < 1 ? Math.max(0, pOut * 1.4) : 1;
  const cardClip = `inset(${H - h}px ${insetX}px 0px ${insetX}px round ${radius}px)`;
  /** Clean: content fades per group (never on a wrapper of the glass button). */
  const fade: React.CSSProperties = { position: "absolute", inset: 0, opacity: content };

  // Button state.
  const grow = ramp(frame, tm.button);
  const pressed = frame >= tm.press && frame < tm.release;
  const done = frame >= tm.press;
  const btnLabel = classic ? (done ? "SUSCRITO" : "SUSCRIBIRSE") : done ? "Suscrito" : "Suscribirse";
  const btnBg = classic
    ? pressed
      ? PRESSED_CLASSIC
      : CLASSIC_RED
    : pressed
      ? "rgba(20,44,62,0.62)"
      : done
        ? "rgba(14,18,26,0.55)"
        : GLASS.background;
  const pressScale = pressed ? 0.965 : 1;

  const nameFont = classic
    ? { fontFamily: classicFont, fontWeight: 700, fontSize: 44, letterSpacing: "0.06em" }
    : { ...nameStyle, lineHeight: "69px" };
  const tagFont = classic
    ? { fontFamily: classicFont, fontWeight: 500, fontSize: 18, letterSpacing: "0.09em" }
    : { ...bodyStyle, lineHeight: "46px" };
  const nameFrom = classic ? [190, 190, 190] : [161, 161, 170];
  const nameTo = classic ? [0, 0, 0] : [255, 255, 255];
  const tagTo = classic ? [0, 0, 0] : [0, 2, 4].map((o) => parseInt(TAGLINE_COLOR.slice(1 + o, 3 + o), 16));

  const ringD = 168;
  const ringLeft = 75;
  const textLeft = classic ? 265 : CLEAN_TEXT_X;
  const ringP = ramp(frame, tm.ring);
  const circ = evolvePath(ringP, `M ${ringD / 2 - 2} 2 a ${ringD / 2 - 2} ${ringD / 2 - 2} 0 1 1 0 ${ringD - 4} a ${ringD / 2 - 2} ${ringD / 2 - 2} 0 1 1 0 ${-(ringD - 4)}`);
  const markP = ramp(frame, tm.mark);

  const cues = sfx
    ? [
        // Entrance: whoosh while the bar rises.
        { f: 0, s: "whoosh", g: 0.4, d: 14 },
        // Mouse clicks (press + release) on the button and on the bell.
        { f: tm.press, s: "click", g: 0.75, d: 4 },
        { f: tm.bellClick, s: "click", g: 0.65, d: 4 },
        { f: tm.bellClick + 3, s: "chime", g: 0.12, d: 34 },
        // Exit: reversed whoosh that ends as the card disappears.
        { f: tm.cardOut[1] - 14, s: "whoosh_out", g: 0.35, d: 14 },
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
          // Classic keeps its card effects on the root. In clean the root carries none: any
          // opacity / clip-path / backdrop-filter here would be a Backdrop Root and the glass
          // button inside would blur only this card instead of the footage (see glass.tsx).
          ...(classic
            ? {
                opacity: cardOpacity,
                clipPath: cardClip,
                borderRadius: radius,
                overflow: "hidden",
                background: "#FFFFFF",
              }
            : {}),
        }}
      >
        {classic ? null : (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              opacity: cardOpacity,
              clipPath: cardClip,
              borderRadius: radius,
              overflow: "hidden",
              ...GLASS,
            }}
          >
            <GlassRim radius={radius} />
          </div>
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: classic ? content : undefined,
            transform: `scale(${contentScale})`,
            transformOrigin: "50% 50%",
          }}
        >
          <div style={classic ? undefined : fade}>
          {classic ? (
            <div
              style={{
                position: "absolute",
                left: ringLeft,
                top: d.CY - ringD / 2,
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
          ) : null}
          <Typed text={name} frame={frame} range={tm.name} from={nameFrom} to={nameTo} style={{ position: "absolute", left: textLeft, top: classic ? d.CY - 40 : d.headCY - 57.5, ...(classic ? { lineHeight: "40px" } : {}), ...nameFont }} />
          <Typed text={tag} frame={frame} range={tm.tagline} from={nameFrom} to={tagTo} style={{ position: "absolute", left: textLeft, top: classic ? d.CY + 16 : d.headCY + 11.5, ...(classic ? { lineHeight: "30px" } : {}), ...tagFont }} />
          </div>
          {classic ? null : (
            // The logo disc is frosted glass of its own (a sibling of the card glass, like the
            // button: no Backdrop Root above it), ringed in the brand grape-to-cyan gradient.
            <div
              style={{
                ...GLASS,
                position: "absolute",
                left: CLEAN_PAD,
                top: d.headCY - CLEAN_DISC / 2,
                width: CLEAN_DISC,
                height: CLEAN_DISC,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${ringP})`,
                opacity: content,
              }}
            >
              <BrandMark height={CLEAN_MARK} />
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  padding: 2,
                  boxSizing: "border-box",
                  background: `linear-gradient(180deg, ${COLOR.grape}, ${COLOR.cyan})`,
                  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                  WebkitMaskComposite: "xor",
                  pointerEvents: "none",
                }}
              />
            </div>
          )}
          <div
            style={{
              position: "absolute",
              left: d.btn.x,
              top: d.btn.y,
              width: d.btn.w,
              height: d.btn.h,
              borderRadius: classic ? 8 : d.btn.h / 2,
              background: btnBg,
              ...(classic
                ? {}
                : {
                    ...GLASS,
                    // Pressed deepens the tint only; the cyan rim is the one accent.
                    background: btnBg,
                    // Subscribed is calmer: the rim dims, the label is fog, a small check replaces the caps.
                    border: `1px solid ${pressed ? "rgba(37,161,220,0.96)" : done ? "rgba(37,161,220,0.42)" : "rgba(37,161,220,0.78)"}`,
                    boxSizing: "border-box" as const,
                  }),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0,
              color: !classic && done ? COLOR.fogGlass : COLOR.white,
              transform: `scaleY(${0.04 + 0.96 * grow}) scale(${pressScale})`,
              opacity: grow > 0 ? (classic ? 1 : content) : 0,
              fontFamily: classic ? classicFont : sansFamily,
              fontWeight: classic ? 800 : 600,
              fontSize: classic ? 32 : TYPE.body,
              letterSpacing: classic ? "0.04em" : "-0.01em",
            }}
          >
            {classic ? null : <GlassRim radius={d.btn.h / 2} accent={false} />}
            {classic || !done ? null : <SmallCheck progress={ramp(frame, [tm.release, tm.release + 10] as const)} />}
            {btnLabel}
          </div>
          {/* Bell and cursor keep the card's box as their clip (the cursor rises from below it). */}
          <div style={classic ? undefined : { ...fade, clipPath: `inset(0 round ${radius}px)` }}>
            <Bell frame={frame} classic={classic} tm={tm} d={d} />
            <Cursor frame={frame} classic={classic} tm={tm} boxH={H} btn={d.cursorBtn} bell={d.cursorBell} />
          </div>
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
