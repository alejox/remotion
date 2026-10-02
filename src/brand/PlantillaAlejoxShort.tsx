/**
 * PlantillaAlejoxShort - the vertical template (1080x1920, 30 fps). Pure wiring: no
 * video-specific values. One `ShortConfig` (see `config.ts` and
 * `examples/deckboard.short.config.ts`) carries the source, segments, camera crop, screen
 * band, transcript words and beats. Captions run throughout; zoom exists only inside a
 * Spotlight; jump cuts are a `join: "cut"` on a segment.
 *
 * Framing rules baked in: the screen band is at most 860px wide (x 80..940) and captions
 * keep at least 32px of gap below it.
 */
import React, { useCallback, useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { z } from "zod";
import { BeatLayer, mapBeats, zoomSpecs } from "./BeatLayer";
import { BrandSfx, cuesFromBeats, cuesFromTimeline } from "./BrandSfx";
import { Captions } from "./Captions";
import {
  configDuration,
  outroStart,
  shortConfigSchema,
  timelineFromConfig,
  type ShortConfig,
} from "./config";
import { BrandTimeline, FootageAudio } from "./Footage";
import { Outro } from "./Outro";
import { SourcePicture, SourceProvider, useSource } from "./Source";
import { ZoomStage, type Rect } from "./Spotlight";
import type { BuiltSegment } from "./timeline";
import { Slash } from "./Panel";
import { COLOR, MOTION } from "./tokens";
import { TypeScaleProvider } from "./typography";

export const plantillaShortSchema = z.object({ config: shortConfigSchema });
export type PlantillaShortProps = z.infer<typeof plantillaShortSchema>;

export const plantillaShortDuration = (config: ShortConfig): number => configDuration(config);

/** Footage-space width of the screen recording (16:9 master mapped to 1920). */
const SCREEN_SPACE = { w: 1920, h: 1080 };
const FRAME_W = 1080;
const FRAME_H = 1920;

const CameraLayer: React.FC<{ segment: BuiltSegment; crop: ShortConfig["cameraCrop"] }> = ({
  segment,
  crop,
}) => {
  const source = useSource();
  // Scale so the crop window (crop.h tall) fills the 1920px frame height exactly.
  const k = FRAME_H / crop.h;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <SourcePicture
        trimBefore={segment.fromFrame}
        style={{
          position: "absolute",
          width: source.width * k,
          height: source.height * k,
          maxWidth: "none",
          left: -crop.x * k,
          top: -crop.y * k,
        }}
      />
    </AbsoluteFill>
  );
};

export const PlantillaAlejoxShort: React.FC<PlantillaShortProps> = ({ config }) => {
  const tl = useMemo(() => timelineFromConfig(config), [config]);
  const beats = useMemo(() => mapBeats(tl, config.beats), [tl, config.beats]);
  const words = useMemo(() => tl.mapWords(config.words), [tl, config.words]);
  // No `screen` in the config = a camera-only Short: the screen band falls back to the full footage.
  const { crop, face, split: splitCfg } = config.screen ?? { crop: { x: 0, y: 0, w: SCREEN_SPACE.w }, face: undefined, split: undefined };
  const split = splitCfg ?? 800;
  // Screen half: full width edge to edge from `split` down (no face -> the full frame).
  const stage: Rect = face ? { x: 0, y: split, w: FRAME_W, h: FRAME_H - split } : { x: 0, y: 0, w: FRAME_W, h: FRAME_H };
  const k = FRAME_W / crop.w;
  // Footage coordinates -> stage coordinates.
  const mapRect = useCallback(
    (r: Rect): Rect => ({
      x: (r.x - crop.x) * k,
      y: (r.y - crop.y) * k,
      w: r.w * k,
      h: r.h * k,
    }),
    [crop.x, crop.y, k],
  );
  const zooms = useMemo(() => zoomSpecs(beats, mapRect), [beats, mapRect]);
  const outroAt = outroStart(tl);
  const cues = useMemo(() => [...cuesFromTimeline(tl), ...cuesFromBeats(beats)], [tl, beats]);
  const screenRanges = tl.segments
    .filter((s) => s.kind === "screen")
    .map((s) => ({ from: s.start, to: s.start + s.length }));
  // Captions hold while a title or a subscribe card is up: never two overlays at once.
  const hideDuring: string[] = config.captions.hideDuring ?? ["title", "subscribe"];
  const quietWindows = beats
    .filter((m) => hideDuring.includes(m.beat.type))
    .map((m) => ({ from: m.start, to: m.start + m.duration }));
  const captionTop = (frame: number): number =>
    screenRanges.some((r) => frame >= r.from && frame < r.to) ? config.captions.screenY : config.captions.cameraY;

  return (
    <SourceProvider source={config.source}>
      <TypeScaleProvider scale={config.type}>
      <AbsoluteFill style={{ backgroundColor: COLOR.panel }}>
        <BrandTimeline
          tl={tl}
          renderSegment={(s) =>
            s.kind === "camera" ? (
              <CameraLayer segment={s} crop={config.cameraCrop} />
            ) : (
              <AbsoluteFill style={{ backgroundColor: COLOR.panel, overflow: "hidden" }}>
                {face ? null : (
                  // No face-cam: a blurred, darkened copy of the footage fills any leftover area.
                  <SourcePicture
                    trimBefore={s.fromFrame}
                    style={{
                      position: "absolute",
                      width: FRAME_H * (16 / 9),
                      height: FRAME_H,
                      maxWidth: "none",
                      left: (FRAME_W - FRAME_H * (16 / 9)) / 2,
                      top: 0,
                      filter: "blur(40px) brightness(0.4)",
                    }}
                  />
                )}
                {face ? (
                  <div style={{ position: "absolute", left: 0, top: 0, width: FRAME_W, height: split, overflow: "hidden" }}>
                    <SourcePicture
                      trimBefore={s.fromFrame}
                      style={{
                        position: "absolute",
                        width: SCREEN_SPACE.w * (FRAME_W / face.w),
                        height: SCREEN_SPACE.h * (FRAME_W / face.w),
                        maxWidth: "none",
                        left: -face.x * (FRAME_W / face.w),
                        top: -face.y * (FRAME_W / face.w),
                      }}
                    />
                  </div>
                ) : null}
                <ZoomStage stage={stage} specs={zooms} frameOffset={s.start}>
                  <SourcePicture
                    trimBefore={s.fromFrame}
                    style={{
                      position: "absolute",
                      width: SCREEN_SPACE.w * k,
                      height: SCREEN_SPACE.h * k,
                      maxWidth: "none",
                      left: -crop.x * k,
                      top: -crop.y * k,
                    }}
                  />
                </ZoomStage>
                {face ? (
                  // Divider: a straight edge; the brand slash marks its left end.
                  <div style={{ position: "absolute", left: 0, top: split - 32, width: 6, height: 64 }}>
                    <Slash />
                  </div>
                ) : null}
              </AbsoluteFill>
            )
          }
        />
        <FootageAudio segments={tl.segments} audioDelayFrames={config.audioDelayFrames ?? MOTION.defaultAudioDelayFrames} />
        <Captions words={words} top={captionTop} size={config.captions.size} toFrame={outroAt} hideRanges={quietWindows} />
        <BeatLayer beats={beats} short labels={config.labels} stage={stage} mapRect={mapRect} />
        <Outro
          start={outroAt}
          duration={Math.round(config.outro.seconds * MOTION.fps)}
          title={config.outro.title}
          slots={config.outro.slots}
        />
        <BrandSfx cues={cues} />
      </AbsoluteFill>
      </TypeScaleProvider>
    </SourceProvider>
  );
};
