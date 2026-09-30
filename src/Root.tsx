import "./index.css";
import React from "react";
import { Folder } from "remotion";
import { BrandShortComposition, BrandSubscribeComposition, BrandVideoComposition } from "./brand/register";
import { deckboardConfig } from "./brand/examples/deckboard.config";
import { deckboardShortConfig } from "./brand/examples/deckboard.short.config";

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="Plantilla">
      <BrandVideoComposition id="PlantillaAlejox" config={deckboardConfig} />
      <BrandSubscribeComposition />
      <BrandShortComposition id="PlantillaAlejoxShort" config={deckboardShortConfig} />
    </Folder>
  );
};
