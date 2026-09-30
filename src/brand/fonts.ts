/**
 * Single font entry point for the kit. The fonts are bundled locally in `public/fonts/`
 * as variable TTFs, so renders never depend on Google Fonts or the network.
 * `@remotion/fonts` holds the render until each face is loaded.
 *
 * Brand type system:
 * - Geist ........ all video text (titles, labels, captions, callouts)
 * - Geist Mono ... ports, IPs, file names, values
 * - Jost ......... brand moments (Futura-style, matches the ALEJOXGAMING wordmark)
 * - Anton ........ thumbnails only: shipped in public/fonts, never loaded in video
 */
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

type Face = { family: string; file: string; style: "normal" | "italic" };

const FACES: Face[] = [
  { family: "Geist", file: "fonts/Geist-VariableFont_wght.ttf", style: "normal" },
  { family: "Geist", file: "fonts/Geist-Italic-VariableFont_wght.ttf", style: "italic" },
  { family: "Geist Mono", file: "fonts/GeistMono-VariableFont_wght.ttf", style: "normal" },
  { family: "Geist Mono", file: "fonts/GeistMono-Italic-VariableFont_wght.ttf", style: "italic" },
  { family: "Jost", file: "fonts/Jost-VariableFont_wght.ttf", style: "normal" },
  { family: "Jost", file: "fonts/Jost-Italic-VariableFont_wght.ttf", style: "italic" },
];

for (const face of FACES) {
  // Variable fonts: one file serves the whole weight axis.
  loadFont({ family: face.family, url: staticFile(face.file), style: face.style, weight: "100 900", format: "truetype" });
}

export const sansFamily = "Geist";
export const monoFamily = "Geist Mono";
export const brandFamily = "Jost";

/** All video text. */
export const SANS = `${sansFamily}, system-ui, -apple-system, "Segoe UI", Arial, sans-serif`;
/** Ports, IPs, file names, values. */
export const MONO = `${monoFamily}, ui-monospace, Menlo, monospace`;
/** Brand moments (wordmark, classic subscribe card). */
export const BRAND = `${brandFamily}, Futura, "Century Gothic", sans-serif`;
