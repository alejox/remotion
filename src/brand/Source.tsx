/**
 * Source - the footage file(s) a template plays. The template reads them from its config
 * (`source.file`, plus a light `source.preview` proxy for the Studio) and provides them
 * through context, so nothing below hard-codes a file name. Without a file, pictures are
 * solid black and there is no footage audio.
 *
 * AUDIO INVARIANT: every picture is muted; the only audible instances are the delayed
 * `<Audio>` elements in `Footage.tsx`, one per segment and never two at once.
 */
import React, { createContext, useContext } from "react";
import { OffthreadVideo, staticFile, useRemotionEnvironment } from "remotion";
import { Video as MediaVideo } from "@remotion/media";

export type SourceInfo = {
  /** File in `public/` used for rendering (the full-resolution master). Omit for black. */
  file?: string;
  /** File in `public/` used in the Studio (a light proxy with the same timestamps). */
  preview?: string;
  /** Master pixel size. */
  width: number;
  height: number;
};

const SourceContext = createContext<SourceInfo | null>(null);

export const SourceProvider: React.FC<{ source: SourceInfo; children: React.ReactNode }> = ({
  source,
  children,
}) => <SourceContext.Provider value={source}>{children}</SourceContext.Provider>;

export const useSource = (): SourceInfo => {
  const source = useContext(SourceContext);
  if (!source) {
    throw new Error("useSource must be used inside <SourceProvider>");
  }
  return source;
};

/**
 * Public URL of the file that backs the footage (master when rendering, proxy in the Studio),
 * or `null` when the config has no footage.
 */
export const useSourceFile = (): string | null => {
  const env = useRemotionEnvironment();
  const source = useSource();
  const file = env.isRendering ? source.file : (source.preview ?? source.file);
  return file ? staticFile(file) : null;
};

/**
 * A MUTED picture-only instance of the source. Render: `@remotion/media` (WebCodecs),
 * because `OffthreadVideo` hands frames to Chrome as blobs and this repo's nearly-full
 * disk makes Chromium refuse them. Studio: `OffthreadVideo` on the proxy.
 */
export const SourcePicture: React.FC<{
  trimBefore: number;
  style: React.CSSProperties;
}> = ({ trimBefore, style }) => {
  const env = useRemotionEnvironment();
  const src = useSourceFile();

  if (!src) {
    return <div style={{ ...style, backgroundColor: "#000" }} />;
  }

  if (env.isRendering) {
    return (
      <MediaVideo
        src={src}
        trimBefore={trimBefore}
        muted
        objectFit="cover"
        disallowFallbackToOffthreadVideo
        style={style}
      />
    );
  }

  return <OffthreadVideo src={src} trimBefore={trimBefore} muted style={style} />;
};
