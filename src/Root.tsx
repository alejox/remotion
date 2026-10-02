import "./index.css";
import React from "react";
import { Composition, Folder } from "remotion";
import {
  OverlayBeat,
  overlayDuration,
  overlaySchema,
} from "./brand/OverlayBeat";
import { BrandShortComposition, BrandVideoComposition } from "./brand/register";
import { showcaseConfig } from "./brand/examples/showcase.config";
import { showcaseShortConfig } from "./brand/examples/showcase.short.config";
import { MOTION } from "./brand/tokens";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Plantilla">
        <BrandVideoComposition id="PlantillaAlejox" config={showcaseConfig} />
        <BrandShortComposition
          id="PlantillaAlejoxShort"
          config={showcaseShortConfig}
        />
      </Folder>
      <Folder name="Overlays">
        <Composition
          id="Overlay"
          component={OverlayBeat}
          schema={overlaySchema}
          defaultProps={{
            beat: {
              type: "keyword" as const,
              at: 0,
              dur: 3,
              text: "Hola mundo",
            },
          }}
          width={1920}
          height={1080}
          fps={MOTION.fps}
          durationInFrames={90}
          calculateMetadata={({ props }) => ({
            durationInFrames: overlayDuration(props.beat),
          })}
        />
      </Folder>
    </>
  );
};
