/**
 * Footage - the item list as a `<TransitionSeries>` (diagonal wipes between items, plain
 * cuts where an item says `join: "cut"`) plus ONE audible track per segment, delayed by
 * `audioDelayFrames` (the master's audio leads its picture by ~3 frames).
 * AUDIO INVARIANT: pictures are muted (see `Source.tsx`); the only audible instances are
 * the `<Audio>` elements here, one per segment and never two at once.
 */
import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { SectionCard } from "./SectionCard";
import { SourcePicture, useSource, useSourceFile } from "./Source";
import type { BuiltCard, BuiltSegment, Timeline } from "./timeline";
import { diagonalWipe } from "./transitions/diagonalWipe";
import { MOTION } from "./tokens";

export const FootageAudio: React.FC<{ segments: BuiltSegment[]; audioDelayFrames?: number }> = ({
  segments,
  audioDelayFrames = MOTION.defaultAudioDelayFrames,
}) => {
  const src = useSourceFile();
  const { loop } = useSource();
  // A looped stand-in clip is picture only.
  if (!src || loop) {
    return null;
  }
  return (
    <>
      {segments.map((s, i) => {
        // Never two audible instances: stop where the next segment's audio starts.
        const next = segments[i + 1];
        const length = next ? Math.min(s.length, next.start - s.start) : s.length;
        return (
          <Sequence
            key={`audio-${s.fromFrame}-${s.start}`}
            name={`audio ${s.from}s (+${audioDelayFrames}f)`}
            from={s.start + audioDelayFrames}
            durationInFrames={length}
            layout="none"
          >
            <Audio src={src} trimBefore={s.fromFrame} />
          </Sequence>
        );
      })}
    </>
  );
};

/**
 * `renderSegment` draws a footage segment; cards render as `SectionCard`.
 * Scenes see SCENE-LOCAL frames: overlays that live inside a scene must subtract
 * `segment.start`.
 */
export const BrandTimeline: React.FC<{
  tl: Timeline;
  renderSegment: (segment: BuiltSegment) => React.ReactNode;
  /** Component label shown on section cards (showcase). */
  cardTag?: string;
  /** Optional backdrop for the chapter card; omitted for real-footage templates. */
  renderCardBackdrop?: (card: BuiltCard) => React.ReactNode;
}> = ({ tl, renderSegment, cardTag, renderCardBackdrop }) => (
  <TransitionSeries>
    {tl.items.flatMap((item, i) => {
      const nodes: React.ReactNode[] = [];
      if (i > 0 && item.join !== "cut") {
        nodes.push(
          <TransitionSeries.Transition
            key={`t${i}`}
            presentation={diagonalWipe()}
            timing={linearTiming({
              durationInFrames: tl.wipe,
              easing: Easing.inOut(Easing.cubic),
            })}
          />,
        );
      }
      if (item.kind === "card") {
        nodes.push(
          <TransitionSeries.Sequence
            key={`i${i}`}
            name="section card"
            durationInFrames={item.length}
          >
            <SectionCard
              duration={item.length}
              number={item.number}
              title={item.title}
              wipe={tl.wipe}
              tag={cardTag}
              backdrop={renderCardBackdrop?.(item)}
            />
          </TransitionSeries.Sequence>,
        );
      } else {
        nodes.push(
          <TransitionSeries.Sequence
            key={`i${i}`}
            name={`${item.kind} ${item.from}s-${item.to}s`}
            durationInFrames={item.length}
          >
            {renderSegment(item)}
          </TransitionSeries.Sequence>,
        );
      }
      return nodes;
    })}
  </TransitionSeries>
);

/** Full-frame 16:9 picture (cover). */
export const FullPicture: React.FC<{ segment: BuiltSegment }> = ({ segment }) => (
  <AbsoluteFill>
    <SourcePicture
      trimBefore={segment.fromFrame}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  </AbsoluteFill>
);
