/**
 * Template configs. A whole video is ONE typed, zod-validated object: the source file,
 * the segments and section cards, the audio delay and the beats list. The template
 * components (`PlantillaAlejox`, `PlantillaAlejoxShort`) hold no video-specific values;
 * they read a config, so it is also editable in the Studio props panel.
 *
 * TIME: every `at` (and segment `from`/`to`) is in SOURCE seconds - use transcript word
 * times directly. The engine converts them to timeline frames across segments and wipes.
 * `dur` is in seconds of the finished video.
 */
import { z } from "zod";
import { buildTimeline, type ItemSpec, type Timeline } from "./timeline";
import { MOTION } from "./tokens";

const num = z.number();

/** A rectangle in footage coordinates (the 1920x1080 space of the screen recording). */
export const rectSchema = z.object({ x: num, y: num, w: num, h: num });

/** Optional pixel position of an overlay. Omit to use the format's default slot. */
const pos = { x: num.optional(), y: num.optional() };
const base = { at: num, dur: num };

export const beatSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("title"), ...base, ...pos, meta: z.string(), title: z.string() }),
  z.object({
    type: z.literal("lowerThird"),
    ...base,
    ...pos,
    name: z.string().optional(),
    tagline: z.string().optional(),
  }),
  z.object({
    type: z.literal("keyword"),
    ...base,
    ...pos,
    text: z.string(),
    accent: z.string().optional(),
  }),
  z.object({
    type: z.literal("spotlight"),
    ...base,
    /** Target in footage coordinates (1920x1080 of the screen recording). */
    target: rectSchema,
    step: num,
    label: z.string(),
    /** Zoom ceiling, at most 1.8. Omit for none. */
    zoom: num.optional(),
    /** Zoom focus in footage coordinates (default: the target). */
    focus: rectSchema.optional(),
    /** Step chip side; "auto" (default) picks the side with the most free dimmed space. */
    chipPlacement: z.enum(["auto", "above", "below", "left", "right"]).optional(),
    /** Explicit chip top-left in footage coordinates. */
    chipAt: z.object({ x: num, y: num }).optional(),
  }),
  z.object({
    type: z.literal("subscribe"),
    ...base,
    ...pos,
    variant: z.enum(["classic", "clean"]).optional(),
    scale: num.optional(),
    channelName: z.string().optional(),
    tagline: z.string().optional(),
  }),
  z.object({ type: z.literal("value"), ...base, ...pos, label: z.string(), value: z.string() }),
  z.object({
    type: z.literal("checklist"),
    ...base,
    ...pos,
    title: z.string().optional(),
    items: z.array(z.string()).min(2).max(4),
  }),
  z.object({
    type: z.literal("compare"),
    ...base,
    ...pos,
    a: z.object({ name: z.string(), value: z.string() }),
    b: z.object({ name: z.string(), value: z.string() }),
    winner: z.enum(["a", "b"]).optional(),
  }),
]);
export type Beat = z.infer<typeof beatSchema>;

const segmentItem = z.object({
  kind: z.enum(["camera", "screen"]),
  from: num,
  to: num,
  /** "cut" = jump cut, no wipe. Default "wipe". */
  join: z.enum(["wipe", "cut"]).optional(),
});
const sectionItem = z.object({
  kind: z.literal("section"),
  number: z.string(),
  title: z.string(),
  /** Scene length in seconds including both wipes. Default 2.4. */
  seconds: num.optional(),
  join: z.enum(["wipe", "cut"]).optional(),
});
export const itemSchema = z.union([segmentItem, sectionItem]);
export type ConfigItem = z.infer<typeof itemSchema>;

export const sourceSchema = z.object({
  /** File in `public/` used when rendering. */
  file: z.string(),
  /** File in `public/` used in the Studio (light proxy, same timestamps). */
  preview: z.string(),
  width: num,
  height: num,
});

export const outroSchema = z.object({
  seconds: num,
  title: z.string().optional(),
  slots: z.tuple([z.string(), z.string()]).optional(),
});

export const videoConfigSchema = z.object({
  source: sourceSchema,
  /** The master's audio leads its picture by this many frames. */
  audioDelayFrames: num,
  items: z.array(itemSchema),
  beats: z.array(beatSchema),
  outro: outroSchema,
});
export type VideoConfig = z.infer<typeof videoConfigSchema>;

export const wordSchema = z.object({ w: z.string(), start: num, end: num });

export const shortConfigSchema = videoConfigSchema.extend({
  /** Camera framing: a 9:16 window of the master, in source pixels (`h` tall, `w = h * 9 / 16`). */
  cameraCrop: z.object({ x: num, y: num, h: num }),
  screen: z.object({
    /** Tight crop of the UI, in footage coordinates (1920 space); scaled to the full 1080 width. */
    crop: z.object({ x: num, y: num, w: num }),
    /**
     * The speaker's face-cam burned into the recording (1920 space, aspect ~1080:800), shown edge
     * to edge in the top half. Omit when the recording has none: the screen crop then covers the
     * full frame over a blurred, darkened copy of itself.
     */
    face: z.object({ x: num, y: num, w: num, h: num }).optional(),
    /** Y of the divider between the face half and the screen half (default 800). */
    split: num.optional(),
  }),
  /** Transcript words in SOURCE seconds. */
  words: z.array(wordSchema),
  captions: z.object({
    /** Top of the caption line over camera segments, and over the screen band. */
    cameraY: num,
    screenY: num,
  }),
});
export type ShortConfig = z.infer<typeof shortConfigSchema>;

const SECTION_DEFAULT_SECONDS = 2.4;

/** Config items -> timeline specs. */
export const itemSpecs = (items: ConfigItem[], fps: number = MOTION.fps): ItemSpec[] =>
  items.map((it): ItemSpec => {
    if (it.kind === "section") {
      return {
        kind: "card",
        number: it.number,
        title: it.title,
        length: Math.round((it.seconds ?? SECTION_DEFAULT_SECONDS) * fps),
        join: it.join,
      };
    }
    return it;
  });

export const timelineFromConfig = (config: VideoConfig): Timeline =>
  buildTimeline(itemSpecs(config.items));

/** The outro fades in over the last frames of the footage. */
export const OUTRO_OVERLAP = MOTION.enterFrames;

export const outroStart = (tl: Timeline): number => tl.footageFrames - OUTRO_OVERLAP;

/** Composition length in frames, computed from the config (use in `calculateMetadata`). */
export const configDuration = (config: VideoConfig): number => {
  const tl = timelineFromConfig(config);
  return outroStart(tl) + Math.round(config.outro.seconds * MOTION.fps);
};
