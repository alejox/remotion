/**
 * BrandSfx - quiet sound design (DNA v2: calm, the voice is the priority). A soft swipe
 * under every overlay, a whoosh on each diagonal wipe, one pop when a Spotlight box
 * finishes drawing. Cues live inside the composition (audible in the Studio, single
 * render pass). Sound files are the channel's own in `public/sfx/`.
 */
import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import type { MappedBeat } from "./BeatLayer";
import type { Timeline } from "./timeline";

export type BrandCue = {
  frame: number;
  sound: string;
  gain: number;
  durationInFrames: number;
};

const DUR: Record<string, number> = {
  whoosh: 14,
  pop: 4,
  swipe: 6,
  chime: 34,
};

export const cue = (frame: number, sound: string, gain: number): BrandCue => ({
  frame: Math.max(0, Math.round(frame)),
  sound,
  gain,
  durationInFrames: DUR[sound] ?? 10,
});

/** A swipe at each overlay start; Spotlights add a pop when the box has drawn. */
export const cuesFromBeats = (beats: MappedBeat[]): BrandCue[] =>
  beats.flatMap((m) => {
    if (m.beat.type === "subscribe") {
      return [];
    }
    const cues = [cue(m.start, "swipe", 0.25)];
    if (m.beat.type === "spotlight") {
      cues.push(cue(m.start + 12, "pop", 0.2));
    }
    return cues;
  });

/** A whoosh at every diagonal wipe (jump cuts stay silent). */
export const cuesFromTimeline = (tl: Timeline): BrandCue[] =>
  tl.items.flatMap((item, i) => (i > 0 && item.join !== "cut" ? [cue(item.start, "whoosh", 0.3)] : []));

export const BrandSfx: React.FC<{ cues: BrandCue[] }> = ({ cues }) => (
  <>
    {cues.map((c, i) => (
      <Sequence
        key={i}
        name={`sfx ${c.sound}`}
        {...(c.frame > 0 ? { from: c.frame } : {})}
        durationInFrames={c.durationInFrames}
        layout="none"
      >
        <Audio src={staticFile(`sfx/${c.sound}.wav`)} volume={() => c.gain} />
      </Sequence>
    ))}
  </>
);
