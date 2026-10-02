/**
 * BeatLayer - renders a config's beats with the matching archetype. Beats arrive already
 * mapped to timeline frames (`mapBeats`); positions default to the format's slots.
 * Also derives the Spotlight zoom specs the footage stage needs and the SFX cues.
 */
import React from "react";
import { Checklist } from "./Checklist";
import { ComponentTag } from "./ComponentTag";
import { Compare } from "./Compare";
import type { Beat } from "./config";
import { Keyword } from "./Keyword";
import { LowerThird } from "./LowerThird";
import { SubscribeCard } from "./SubscribeCard";
import { Spotlight, type Rect, type ZoomSpec } from "./Spotlight";
import { TitleCard } from "./TitleCard";
import type { Timeline } from "./timeline";
import { ValueCard } from "./ValueCard";
import { COLUMN_X, MOTION, SHORT_COLUMN_X } from "./tokens";

/** A spotlight headline starts this many frames before the callout and sits at this y. */
const HEADLINE_LEAD = 24;
const HEADLINE_Y = 196;
/** Lower third: its tag sits just above the panel (1080 - 140 bottom - 163 panel - 24 gap - 46 tag). */
const LT_TAG_Y = 707;
/** Checklist: its tag sits just above the vertically centred glass panel (title lines, rows, paddings; 24 gap, 46 tag). */
const checklistTagY = (b: { title?: string; items?: string[]; y?: number }): number => {
  const titleLines = b.title ? b.title.split("\n").length : 0;
  const h = titleLines * 93 + (titleLines ? 44 : 0) + 68 * Math.min(4, b.items?.length ?? 2) + 72;
  return (b.y ?? (1080 - h) / 2) - 24 - 46;
};

export type MappedBeat = { beat: Beat; start: number; duration: number };

/** Convert beats (source seconds) to timeline frames. Throws on a time outside every segment. */
export const mapBeats = (
  tl: Timeline,
  beats: Beat[],
  fps: number = MOTION.fps,
): MappedBeat[] =>
  beats.map((beat) => ({
    beat,
    start: tl.frame(beat.at),
    duration: Math.max(1, Math.round(beat.dur * fps)),
  }));

type Slots = {
  title: { x: number; y: number | undefined };
  lowerThird: { x: number; y: number | undefined };
  keyword: { x: number; y: number | undefined };
  value: { x: number; y: number | undefined };
  checklist: { x: number; y: number | undefined };
  compare: { x: number; y: number | undefined };
};

/**
 * Default anchors: landscape text shares the x = 192 column and centres vertically (no `y`);
 * Shorts stay inside x 80..940.
 */
export const SLOTS: { landscape: Slots; short: Slots } = {
  landscape: {
    title: { x: COLUMN_X, y: undefined },
    lowerThird: { x: COLUMN_X, y: undefined },
    keyword: { x: COLUMN_X, y: undefined },
    value: { x: COLUMN_X, y: undefined },
    checklist: { x: COLUMN_X, y: undefined },
    compare: { x: COLUMN_X, y: undefined },
  },
  // Typical talking-head framing: text beats sit above the head, glass objects below the chin.
  // Override per beat with `x` / `y` when the footage is framed differently.
  short: {
    title: { x: SHORT_COLUMN_X, y: 170 },
    lowerThird: { x: SHORT_COLUMN_X, y: 1330 },
    keyword: { x: SHORT_COLUMN_X, y: 170 },
    value: { x: SHORT_COLUMN_X, y: 170 },
    checklist: { x: SHORT_COLUMN_X, y: 170 },
    compare: { x: SHORT_COLUMN_X, y: 170 },
  },
};

/** Zoom specs of every Spotlight that asks for a zoom (target mapped into the stage). */
export const zoomSpecs = (
  mapped: MappedBeat[],
  mapRect: (r: Rect) => Rect,
): ZoomSpec[] =>
  mapped.flatMap((m) =>
    m.beat.type === "spotlight" && m.beat.zoom && m.beat.zoom > 1
      ? [
          {
            start: m.start,
            duration: m.duration,
            target: mapRect(m.beat.target),
            focus: m.beat.focus ? mapRect(m.beat.focus) : undefined,
            zoom: m.beat.zoom,
          },
        ]
      : [],
  );

/** On-screen names of the components, shown as a quiet label when `labels` is on. */
const LABELS: Record<Beat["type"], string | undefined> = {
  title: "Tarjeta de título",
  lowerThird: "Tercio inferior",
  keyword: "Palabra clave",
  spotlight: "Foco",
  subscribe: undefined,
  value: "Valor",
  checklist: "Lista",
  compare: "Comparación",
};

/** Types whose label is the first line of their own text group (the rest keep a label above their glass). */
const inlineTag = (b: Beat): boolean =>
  b.type === "title" || b.type === "keyword" || b.type === "value" || b.type === "compare" || (b.type === "spotlight" && !!b.headline);

export const BeatLayer: React.FC<{
  beats: MappedBeat[];
  short?: boolean;
  /** Label each beat with its component name (showcase). */
  labels?: boolean;
  /** The stage Spotlights live in (frame px). Default: the whole frame. */
  stage?: Rect;
  /** Footage coordinates -> stage coordinates. Default: identity. */
  mapRect?: (r: Rect) => Rect;
}> = ({ beats, short = false, labels = false, stage, mapRect = (r) => r }) => {
  const slots = short ? SLOTS.short : SLOTS.landscape;
  // The tag of a glass object sits 70px above it (24 gap + 46 tag line); landscape has fixed rows.
  const tagX = short ? SHORT_COLUMN_X : undefined;
  const glassTagY = (b: Beat): number | undefined => {
    if (b.type === "lowerThird") {
      return short ? (b.y ?? slots.lowerThird.y ?? 0) - 70 : LT_TAG_Y;
    }
    if (b.type === "checklist") {
      return short ? (b.y ?? slots.checklist.y ?? 0) - 70 : checklistTagY(b);
    }
    return undefined;
  };
  const tagFor = (b: Beat): string | undefined => (labels && inlineTag(b) ? LABELS[b.type] : undefined);
  return (
    <>
      {/* Tag scrims paint under every beat (a beat's text is never dimmed by them). */}
      {labels
        ? beats.map(({ beat: b, start, duration }, i) => {
            const label = inlineTag(b) ? undefined : LABELS[b.type];
            // A Spotlight's headline and window arrive before its beat: its tag arrives with them.
            const lead = b.type === "spotlight" && b.headline ? HEADLINE_LEAD : 0;
            return label ? (
              <ComponentTag
                key={`tag-scrim-${i}`}
                start={start - lead}
                duration={duration + lead}
                label={label}
                layer="scrim"
                scrim={b.type === "lowerThird" || (short && b.type === "checklist")}
                y={glassTagY(b)}
                x={tagX}
                scrimY={b.type === "lowerThird" ? 60 : undefined}
              />
            ) : null;
          })
        : null}
      {beats.map(({ beat: b, start, duration }, i) => {
        switch (b.type) {
          case "title":
            return (
              <TitleCard
                key={i}
                tag={tagFor(b)}
                start={start}
                duration={duration}
                meta={b.meta}
                title={b.title}
                x={b.x ?? slots.title.x}
                y={b.y ?? slots.title.y}
              />
            );
          case "lowerThird":
            return (
              <LowerThird
                key={i}
                start={start}
                duration={duration}
                name={b.name}
                tagline={b.tagline}
                x={b.x ?? slots.lowerThird.x}
                y={b.y ?? slots.lowerThird.y}
              />
            );
          case "keyword":
            return (
              <Keyword
                key={i}
                tag={tagFor(b)}
                start={start}
                duration={duration}
                text={b.text}
                accent={b.accent}
                x={b.x ?? slots.keyword.x}
                y={b.y ?? slots.keyword.y}
              />
            );
          case "spotlight":
            return (
              <React.Fragment key={i}>
                <Spotlight
                  start={start}
                  duration={duration}
                  target={mapRect(b.target)}
                  step={b.step}
                  label={b.label}
                  zoom={b.zoom}
                  focus={b.focus ? mapRect(b.focus) : undefined}
                  chipPlacement={b.chipPlacement}
                  chipAt={
                    b.chipAt
                      ? {
                          x: mapRect({ ...b.chipAt, w: 0, h: 0 }).x,
                          y: mapRect({ ...b.chipAt, w: 0, h: 0 }).y,
                        }
                      : undefined
                  }
                  stage={stage}
                  chipGap={b.chipGap}
                  outline={b.outline}
                  dim={b.dim}
                />
                {b.headline ? (
                  // The headline arrives first, as the placeholder window fades in, and sits above the dim.
                  <Keyword
                    tag={tagFor(b)}
                    start={start - HEADLINE_LEAD}
                    duration={duration + HEADLINE_LEAD}
                    text={b.headline}
                    y={b.headlineY ?? HEADLINE_Y}
                  />
                ) : null}
              </React.Fragment>
            );
          case "subscribe":
            return (
              <SubscribeCard
                key={i}
                start={start}
                durationInFrames={duration}
                variant={b.variant ?? "clean"}
                scale={b.scale}
                channelName={b.channelName}
                tagline={b.tagline}
                layout={b.layout}
                x={b.x}
                y={b.y}
              />
            );
          case "value":
            return (
              <ValueCard
                key={i}
                tag={tagFor(b)}
                start={start}
                duration={duration}
                label={b.label}
                headline={b.headline}
                value={b.value}
                suffix={b.suffix}
                x={b.x ?? slots.value.x}
                y={b.y ?? slots.value.y}
              />
            );
          case "checklist":
            return (
              <Checklist
                key={i}
                start={start}
                duration={duration}
                title={b.title}
                items={b.items}
                x={b.x ?? slots.checklist.x}
                y={b.y ?? slots.checklist.y}
              />
            );
          case "compare":
            return (
              <Compare
                key={i}
                tag={tagFor(b)}
                start={start}
                duration={duration}
                a={b.a}
                b={b.b}
                winner={b.winner}
                x={b.x ?? slots.compare.x}
                y={b.y ?? slots.compare.y}
              />
            );
        }
      })}
      {/* Tag text paints above every beat scrim. */}
      {labels
        ? beats.map(({ beat: b, start, duration }, i) => {
            const label = inlineTag(b) ? undefined : LABELS[b.type];
            // A Spotlight's headline and window arrive before its beat: its tag arrives with them.
            const lead = b.type === "spotlight" && b.headline ? HEADLINE_LEAD : 0;
            return label ? (
              <ComponentTag
                key={`tag-text-${i}`}
                start={start - lead}
                duration={duration + lead}
                label={label}
                layer="text"
                y={glassTagY(b)}
                x={tagX}
              />
            ) : null;
          })
        : null}
    </>
  );
};
