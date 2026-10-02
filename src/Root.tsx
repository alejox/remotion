import "./index.css";
import React from "react";
import { Folder } from "remotion";
import { BrandShortComposition, BrandVideoComposition } from "./brand/register";
import { showcaseConfig } from "./brand/examples/showcase.config";
import { showcaseShortConfig } from "./brand/examples/showcase.short.config";

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="Plantilla">
      <BrandVideoComposition id="PlantillaAlejox" config={showcaseConfig} />
      <BrandShortComposition id="PlantillaAlejoxShort" config={showcaseShortConfig} />
    </Folder>
  );
};
