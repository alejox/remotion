import "./index.css";
import React from "react";
import { Folder } from "remotion";
import { BrandShortComposition, BrandSubscribeComposition, BrandVideoComposition } from "./brand/register";
import { showcaseConfig } from "./brand/examples/showcase.config";
import { deckboardShortConfig } from "./brand/examples/deckboard.short.config";

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="Plantilla">
      <BrandVideoComposition id="PlantillaAlejox" config={showcaseConfig} />
      <BrandSubscribeComposition />
      <BrandShortComposition id="PlantillaAlejoxShort" config={deckboardShortConfig} />
    </Folder>
  );
};
