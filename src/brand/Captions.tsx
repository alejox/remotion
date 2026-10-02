/**
 * Captions (Shorts only) - 2 to 4 words per chunk, split at phrase boundaries, centred
 * on the frame's vertical axis (x = 540 in a 1080 frame). Bare type: Geist 700, white, with
 * the word being spoken in cyan - no plate, border, slash or shadow. Legibility comes from a
 * soft, edgeless darkening band (`CaptionBand`) behind the caption zone while captions are
 * up. Each chunk rises in 4 frames (fade + 10px), no scale.
 * 16:9 long form never shows full subtitles: use Keyword there.
 *
 * Words are in COMPOSITION seconds; `timeline.mapWords` converts source transcript times.
 */
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS } from "./fonts";
import { COLOR, MOTION, TYPE } from "./tokens";

export type TimedWord = { w: string; start: number; end: number };

export type CaptionGroup = {
  words: TimedWord[];
  start: number;
  end: number;
  /** True when the chunk opens a sentence (first letter is capitalised). */
  sentenceStart: boolean;
};

const strip = (w: string): string => w.replace(/[.,;:!?¡¿"()]/g, "");

const key = (w: string): string =>
  strip(w)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/** Spanish function words: a chunk never ENDS on one (it belongs to what follows). */
const LIGHT = new Set(
  "un una unos unas el la los las lo de del al a en y o u que sin con por para su sus mi mis tu tus se es ya como pero si".split(" "),
);
const isLight = (w: string): boolean => LIGHT.has(key(w));

const len = (ws: TimedWord[]): number => ws.reduce((n, x) => n + strip(x.w).length + 1, 0) - 1;

/** Split a run into balanced chunks of 2..maxWords words (1 only if the run is 1 word). */
const chunkRun = (run: TimedWord[], maxWords: number, maxChars: number): TimedWord[][] => {
  let parts = Math.max(1, Math.ceil(run.length / maxWords));
  while (parts < run.length && Math.ceil(len(run) / parts) > maxChars) {
    parts += 1;
  }
  const chunks: TimedWord[][] = [];
  let at = 0;
  for (let i = 0; i < parts; i++) {
    const size = Math.ceil((run.length - at) / (parts - i));
    chunks.push(run.slice(at, at + size));
    at += size;
  }
  // Never end a chunk on a function word.
  for (let i = 0; i < chunks.length - 1; i++) {
    while (chunks[i].length > 1 && chunks[i + 1].length < maxWords && isLight(chunks[i][chunks[i].length - 1].w)) {
      chunks[i + 1].unshift(chunks[i].pop() as TimedWord);
    }
  }
  return chunks.filter((c) => c.length > 0);
};

/**
 * Group a word stream into 2..4 word chunks. Sentence ends, commas and pauses over
 * 0.35s always break; inside a run the split is balanced.
 */
export const groupWords = (words: TimedWord[], maxWords = 4, maxChars = 22): CaptionGroup[] => {
  const runs: TimedWord[][] = [];
  let run: TimedWord[] = [];
  words.forEach((word, i) => {
    run.push(word);
    const next = words[i + 1];
    if (/[.,?!;:]$/.test(word.w) || (next && next.start - word.end > 0.35)) {
      runs.push(run);
      run = [];
    }
  });
  if (run.length) {
    runs.push(run);
  }
  const groups: CaptionGroup[] = [];
  let sentenceStart = true;
  for (const r of runs) {
    chunkRun(r, maxWords, maxChars).forEach((c, ci) => {
      groups.push({
        words: c,
        start: c[0].start,
        end: c[c.length - 1].end,
        sentenceStart: sentenceStart && ci === 0,
      });
    });
    sentenceStart = /[.?!]$/.test(r[r.length - 1].w);
  }
  return groups.map((g, i) => {
    const next = groups[i + 1];
    const hold = g.end + 0.18;
    return { ...g, end: next ? Math.min(hold, next.start) : hold };
  });
};

export type CaptionsProps = {
  words: TimedWord[];
  /** Top of the caption line in px, or a function of the composition frame. */
  top?: number | ((frame: number) => number);
  size?: number;
  /** Only show chunks at/after this composition frame. */
  fromFrame?: number;
  /** Hide from this composition frame on (e.g. the outro). */
  toFrame?: number;
  /** Composition frame ranges where captions stay hidden (e.g. while a title is up). */
  hideRanges?: { from: number; to: number }[];
};

/** Darkening behind the caption zone: peak alpha, height, and the ramp (frames) when it comes and goes. */
const BAND = { alpha: 0.72, height: 520, fade: 10, joinGap: 0.6 } as const;

const smooth = (t: number): number => t * t * (3 - 2 * t);
const bandGradient = (): string => {
  const N = 14;
  const stops = Array.from({ length: N + 1 }, (_, i) => {
    const t = i / N;
    // Smoothstep up to the centre and back down: zero slope at both ends, so no edge shows.
    const a = BAND.alpha * smooth(1 - Math.abs(2 * t - 1));
    return `rgba(0,0,0,${a.toFixed(3)}) ${(t * 100).toFixed(1)}%`;
  });
  return `linear-gradient(180deg, ${stops.join(", ")})`;
};

/** 0..1 presence of the band at a frame: 1 while captions are up (short gaps bridged), ramped at the ends. */
const bandPresence = (
  groups: CaptionGroup[],
  frame: number,
  fps: number,
  hide: { from: number; to: number }[],
  toFrame: number,
): number => {
  const windows: { from: number; to: number }[] = [];
  for (const g of groups) {
    const last = windows[windows.length - 1];
    if (last && g.start * fps - last.to <= BAND.joinGap * fps) {
      last.to = g.end * fps;
    } else {
      windows.push({ from: g.start * fps, to: g.end * fps });
    }
  }
  let presence = 0;
  for (const w of windows) {
    presence = Math.max(
      presence,
      Math.min(
        interpolate(frame, [w.from - BAND.fade, w.from], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        interpolate(frame, [w.to, w.to + BAND.fade], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      ),
    );
  }
  for (const h of hide) {
    const away = Math.min(
      interpolate(frame, [h.from - BAND.fade, h.from], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      1,
    );
    presence *= frame < h.from ? away : frame < h.to ? 0 : interpolate(frame, [h.to, h.to + BAND.fade], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }
  return frame >= toFrame ? 0 : presence;
};

export const Captions: React.FC<CaptionsProps> = ({
  words,
  top = 1180,
  size = TYPE.caption,
  fromFrame = 0,
  toFrame = Number.POSITIVE_INFINITY,
  hideRanges = [],
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const t = frame / fps;
  const groups = groupWords(words);
  const y = typeof top === "function" ? top(frame) : top;
  const presence = frame < fromFrame ? 0 : bandPresence(groups, frame, fps, hideRanges, toFrame);
  const band = presence > 0 ? (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: 0,
        width,
        top: y + size * 0.6 - BAND.height / 2,
        height: BAND.height,
        background: bandGradient(),
        opacity: presence,
        pointerEvents: "none",
      }}
    />
  ) : null;
  const group = groups.find((g) => t >= g.start && t < g.end);
  if (!group || frame < fromFrame || frame >= toFrame || hideRanges.some((r) => frame >= r.from && frame < r.to)) {
    return band;
  }
  const local = frame - Math.round(group.start * fps);
  const rise = interpolate(local, [0, MOTION.captionRiseFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const activeIdx = group.words.reduce((acc, w, i) => (t >= w.start ? i : acc), 0);
  return (
    <>
      {band}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: y,
          width,
          display: "flex",
          justifyContent: "center",
          opacity: rise,
          transform: `translateY(${(1 - rise) * 10}px)`,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "fit-content",
            maxWidth: 920,
            textAlign: "center",
            whiteSpace: "nowrap",
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: size,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          {group.words.map((word, i) => {
            const text = strip(word.w);
            const shown = i === 0 && group.sentenceStart ? text.charAt(0).toUpperCase() + text.slice(1) : text;
            return (
              <span key={`${word.start}-${i}`} style={{ color: i === activeIdx ? COLOR.cyan : COLOR.white }}>
                {i > 0 ? " " : ""}
                {shown}
              </span>
            );
          })}
        </div>
      </div>
    </>
  );
};
