/**
 * Captions (Shorts only) - 2 to 4 words per chunk, split at phrase boundaries, centred
 * on the frame's vertical axis (x = 540 in a 1080 frame). Geist 700, white, with the
 * word being spoken in cyan. Each chunk rises in 4 frames (fade + 10px), no scale.
 * 16:9 long form never shows full subtitles: use Keyword there.
 *
 * Words are in COMPOSITION seconds; `timeline.mapWords` converts source transcript times.
 */
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS } from "./fonts";
import { Slash } from "./Panel";
import { COLOR, MOTION, PANEL_BG, PANEL_RADIUS, TYPE } from "./tokens";

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
  const group = groupWords(words).find((g) => t >= g.start && t < g.end);
  if (!group || frame < fromFrame || frame >= toFrame || hideRanges.some((r) => frame >= r.from && frame < r.to)) {
    return null;
  }
  const local = frame - Math.round(group.start * fps);
  const rise = interpolate(local, [0, MOTION.captionRiseFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const activeIdx = group.words.reduce((acc, w, i) => (t >= w.start ? i : acc), 0);
  const y = typeof top === "function" ? top(frame) : top;
  return (
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
      {/* Flat plate keeps white text legible on bright walls; carries the brand slash. */}
      <div
        style={{
          position: "relative",
          boxSizing: "border-box",
          width: "fit-content",
          maxWidth: 860,
          textAlign: "center",
          padding: "8px 30px 10px 36px",
          borderRadius: PANEL_RADIUS,
          background: PANEL_BG,
          overflow: "hidden",
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: size,
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
        }}
      >
        <Slash />
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
  );
};
