/**
 * PlantillaAlejox - the 16:9 template (1920x1080, 30 fps). Pure wiring: it holds NO
 * video-specific values. Everything comes from one `VideoConfig` (see `config.ts` and
 * `examples/deckboard.config.ts`), which is also the composition's default props, so it
 * is editable in the Studio props panel. The duration comes from `calculateMetadata`
 * (`plantillaDuration`).
 */
import React, { useMemo } from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { z } from "zod";
import { BeatLayer, mapBeats, zoomSpecs } from "./BeatLayer";
import { BrandSfx, cuesFromBeats, cuesFromTimeline } from "./BrandSfx";
import { configDuration, outroStart, timelineFromConfig, videoConfigSchema, type VideoConfig } from "./config";
import { BrandTimeline, FootageAudio, FullPicture } from "./Footage";
import { Outro } from "./Outro";
import { SourceProvider } from "./Source";
import { ZoomStage } from "./Spotlight";
import { COLOR, MOTION } from "./tokens";

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
      <AbsoluteFill style={{ backgroundColor: COLOR.panel }}>
        <BrandTimeline
          tl={tl}
          renderSegment={(s) =>
            s.kind === "screen" && zooms.length > 0 ? (
              <ZoomStage stage={stage} specs={zooms} frameOffset={s.start}>
                <FullPicture segment={s} />
              </ZoomStage>
            ) : (
              <FullPicture segment={s} />
            )
          }
        />
        <FootageAudio segments={tl.segments} audioDelayFrames={config.audioDelayFrames ?? MOTION.defaultAudioDelayFrames} />
        <BeatLayer beats={beats} stage={stage} />
        <Outro
          start={outroAt}
          duration={Math.round(config.outro.seconds * MOTION.fps)}
          title={config.outro.title}
          slots={config.outro.slots}
        />
        <BrandSfx cues={cues} />
      </AbsoluteFill>
    </SourceProvider>
  );
};
