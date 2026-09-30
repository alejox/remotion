/**
 * PlantillaAlejox - the 16:9 template (1920x1080, 30 fps). Without source footage,
 * the showcase loops glass-test.mp4 behind the beats and shows a placeholder window
 * for the Spotlight. Other video-specific values come from `VideoConfig` (see `config.ts` and
 * `examples/showcase.config.ts`), which is also the composition's default props, so it
 * is editable in the Studio props panel. The duration comes from `calculateMetadata`
 * (`plantillaDuration`).
 */
import React, { useMemo } from "react";
import { AbsoluteFill, staticFile, useVideoConfig } from "remotion";
import { Video } from "@remotion/media";
import { z } from "zod";
import { BeatLayer, mapBeats, zoomSpecs } from "./BeatLayer";
import { BrandSfx, cuesFromBeats, cuesFromTimeline } from "./BrandSfx";
import { configDuration, outroStart, timelineFromConfig, videoConfigSchema, type VideoConfig } from "./config";
import { BrandTimeline, FootageAudio, FullPicture } from "./Footage";
import { Outro } from "./Outro";
import { PlaceholderScreen } from "./PlaceholderScreen";
import { SourceProvider } from "./Source";
import { ZoomStage } from "./Spotlight";
import { MOTION } from "./tokens";

export const plantillaSchema = z.object({ config: videoConfigSchema });
export type PlantillaProps = z.infer<typeof plantillaSchema>;

export const plantillaDuration = (config: VideoConfig): number => configDuration(config);

export const PlantillaAlejox: React.FC<PlantillaProps> = ({ config }) => {
  const { width, height } = useVideoConfig();
  const tl = useMemo(() => timelineFromConfig(config), [config]);
  const beats = useMemo(() => mapBeats(tl, config.beats), [tl, config.beats]);
  const zooms = useMemo(() => zoomSpecs(beats, (r) => r), [beats]);
  const stage = { x: 0, y: 0, w: width, h: height };
  const outroAt = outroStart(tl);
  const cues = useMemo(() => [...cuesFromTimeline(tl), ...cuesFromBeats(beats)], [tl, beats]);

  return (
    <SourceProvider source={config.source}>
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        <BrandTimeline
          tl={tl}
          cardTag="Sección"
          renderCardBackdrop={!config.source.file ? (card) => (
            <AbsoluteFill>
              <Video
                src={staticFile("glass-test.mp4")}
                trimBefore={card.start}
                loop
                muted
                objectFit="cover"
                style={{ width: "100%", height: "100%" }}
              />
            </AbsoluteFill>
          ) : undefined}
          renderSegment={(s) =>
            !config.source.file ? (
              <AbsoluteFill>
                <Video
                  src={staticFile("glass-test.mp4")}
                  trimBefore={s.fromFrame}
                  loop
                  muted
                  objectFit="cover"
                  style={{ width: "100%", height: "100%" }}
                />
              </AbsoluteFill>
            ) : s.kind === "screen" && zooms.length > 0 ? (
              <ZoomStage stage={stage} specs={zooms} frameOffset={s.start}>
                <FullPicture segment={s} />
              </ZoomStage>
            ) : (
              <FullPicture segment={s} />
            )
          }
        />
        <FootageAudio segments={tl.segments} audioDelayFrames={config.audioDelayFrames ?? MOTION.defaultAudioDelayFrames} />
        {config.source.file
          ? null
          : beats.map((m, i) =>
              m.beat.type === "spotlight" ? (
                <PlaceholderScreen key={i} start={m.start} duration={m.duration} />
              ) : null,
            )}
        <BeatLayer beats={beats} stage={stage} labels />
        <Outro
          start={outroAt}
          duration={Math.round(config.outro.seconds * MOTION.fps)}
          title={config.outro.title}
          slots={config.outro.slots}
          tag="Cierre"
        />
        <BrandSfx cues={cues} />
      </AbsoluteFill>
    </SourceProvider>
  );
};
