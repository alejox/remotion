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
import { COLUMN_X, MOTION } from "./tokens";

/** A spotlight headline starts this many frames before the callout and sits at this y. */
const HEADLINE_LEAD = 24;
const HEADLINE_Y = 196;

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
  short: {
    title: { x: 80, y: 170 },
    lowerThird: { x: 80, y: 1250 },
    keyword: { x: 80, y: 1250 },
    value: { x: 80, y: 1250 },
    checklist: { x: 80, y: 1250 },
    compare: { x: 80, y: 170 },
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
  return (
    <>
      {beats.map(({ beat: b, start, duration }, i) => {
        switch (b.type) {
          case "title":
            return (
              <TitleCard
                key={i}
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
                />
                {b.headline ? (
                  // The headline arrives first, as the placeholder window fades in, and sits above the dim.
                  <Keyword
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
                x={b.x}
                y={b.y}
              />
            );
          case "value":
            return (
              <ValueCard
                key={i}
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
      {labels
        ? beats.map(({ beat: b, start, duration }, i) => {
            const label = LABELS[b.type];
            return label ? (
              <ComponentTag
                key={`tag${i}`}
                start={start}
                duration={duration}
                label={label}
              />
            ) : null;
          })
        : null}
    </>
  );
};
