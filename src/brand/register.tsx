/**
 * One-liner registration: `<BrandVideoComposition id="MiVideo" config={miConfig} />`
 * inside Root.tsx. Width, height, fps, schema (Studio props panel) and the duration
 * (`calculateMetadata`, computed from the config) are all wired here.
 */
import React from "react";
import { Composition } from "remotion";
import type { VideoConfig, ShortConfig } from "./config";
import { PlantillaAlejox, plantillaDuration, plantillaSchema } from "./PlantillaAlejox";
import {
  PlantillaAlejoxShort,
  plantillaShortDuration,
  plantillaShortSchema,
} from "./PlantillaAlejoxShort";
import { MOTION } from "./tokens";

export const BrandVideoComposition: React.FC<{ id: string; config: VideoConfig }> = ({ id, config }) => (
  <Composition
    id={id}
    component={PlantillaAlejox}
    schema={plantillaSchema}
    defaultProps={{ config }}
    width={1920}
    height={1080}
    fps={MOTION.fps}
    durationInFrames={plantillaDuration(config)}
    calculateMetadata={({ props }) => ({ durationInFrames: plantillaDuration(props.config) })}
  />
);

export const BrandShortComposition: React.FC<{ id: string; config: ShortConfig }> = ({ id, config }) => (
  <Composition
    id={id}
    component={PlantillaAlejoxShort}
    schema={plantillaShortSchema}
    defaultProps={{ config }}
    width={1080}
    height={1920}
    fps={MOTION.fps}
    durationInFrames={plantillaShortDuration(config)}
    calculateMetadata={({ props }) => ({ durationInFrames: plantillaShortDuration(props.config) })}
  />
);
