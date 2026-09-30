/**
 * Timeline maths for footage templates. A timeline is a list of ITEMS laid end to end.
 * Neighbours are joined by a diagonal wipe (`wipe` frames of overlap, exactly what
 * `<TransitionSeries>` does) or, with `join: "cut"`, by a hard jump cut (no overlap).
 * Items are footage segments (a range of SOURCE seconds) or cards (a section card).
 * `tl.frame(sourceSeconds)` answers "where is source second X in the composition?" so
 * beats and captions are anchored to transcript word times.
 */
import { MOTION } from "./tokens";
import type { TimedWord } from "./Captions";

export type SegmentSpec = {
  kind: "camera" | "screen";
  /** Source seconds. */
  from: number;
  to: number;
  /** How this item joins the previous one. Default "wipe". */
  join?: "wipe" | "cut";
};

export type CardSpec = {
  kind: "card";
  /** Frames the card scene lasts INCLUDING both wipes. */
  length: number;
  number: number | string;
  title: string;
  join?: "wipe" | "cut";
};

export type ItemSpec = SegmentSpec | CardSpec;

export type BuiltSegment = SegmentSpec & {
  fromFrame: number;
  start: number;
  length: number;
};

export type BuiltCard = CardSpec & { start: number };

export type BuiltItem = BuiltSegment | BuiltCard;

export type Timeline = {
  items: BuiltItem[];
  /** Footage segments only (audio and captions map through these). */
  segments: BuiltSegment[];
  /** Overlap frames of a wipe join. */
  wipe: number;
  /** Total frames of the item list. */
  footageFrames: number;
  /** Composition frame of a source second. Throws when it is outside every segment. */
  frame: (sourceSeconds: number) => number;
  /** Composition seconds of a source second. */
  sec: (sourceSeconds: number) => number;
  /** Map transcript words (source seconds) to composition seconds; drops words outside every segment. */
  mapWords: (words: TimedWord[]) => TimedWord[];
};

export const buildTimeline = (
  specs: ItemSpec[],
  wipe: number = MOTION.wipeFrames,
  fps: number = MOTION.fps,
): Timeline => {
  let cursor = 0;
  const items = specs.map((spec, i): BuiltItem => {
    const overlap = i === 0 || spec.join === "cut" ? 0 : wipe;
    const start = cursor - overlap;
    let built: BuiltItem;
    if (spec.kind === "card") {
      built = { ...spec, start };
      cursor = start + spec.length;
    } else {
      const fromFrame = Math.round(spec.from * fps);
      const length = Math.round(spec.to * fps) - fromFrame;
      built = { ...spec, fromFrame, start, length };
      cursor = start + length;
    }
    return built;
  });
  const segments = items.filter((i): i is BuiltSegment => i.kind !== "card");

  const frame = (sourceSeconds: number): number => {
    const f = Math.round(sourceSeconds * fps);
    for (const s of segments) {
      if (f >= s.fromFrame && f <= s.fromFrame + s.length) {
        return s.start + f - s.fromFrame;
      }
    }
    throw new Error(`Source second ${sourceSeconds} is outside every segment of the timeline`);
  };

  return {
    items,
    segments,
    wipe,
    footageFrames: cursor,
    frame,
    sec: (s) => frame(s) / fps,
    mapWords: (words) =>
      words.flatMap((w) => {
        const f0 = Math.round(w.start * fps);
        const seg = segments.find((s) => f0 >= s.fromFrame && f0 < s.fromFrame + s.length);
        if (!seg) {
          return [];
        }
        const shift = (seg.start - seg.fromFrame) / fps;
        return [{ w: w.w, start: w.start + shift, end: w.end + shift }];
      }),
  };
};
