/**
 * Showcase config for `PlantillaAlejox` (16:9): a tour of every component over a looping
 * sample clip (no source footage: the segments are just stretches that carry the beats). Copy this file for a new video.
 */
import type { VideoConfig } from "../config";
import { MOCK_UI } from "../PlaceholderScreen";

export const showcaseConfig: VideoConfig = {
  source: {
    // Demo backdrop looped under the beats. For a real video set `file` (and `preview`) instead.
    placeholder: "glass-test.mp4",
    width: 1920,
    height: 1080,
  },
  audioDelayFrames: 3,
  items: [
    // Title + lower third.
    { kind: "camera", from: 0, to: 10 },
    { kind: "section", number: "01", title: "Un capítulo\nnuevo.", seconds: 3 },
    // Keyword, value, checklist, compare and the spotlight, one after another.
    { kind: "screen", from: 10, to: 47.7, join: "wipe" },
  ],
  beats: [
    {
      type: "title",
      y: 310,
      at: 0.6,
      dur: 4.2,
      // No card eyebrow: the beat's component tag is the single caps line.
      meta: "",
      title: "Tu video\nempieza aquí.",
    },
    {
      type: "lowerThird",
      at: 5.2,
      dur: 4,
      name: "Alejoxtech",
      tagline: "Tutoriales · Tecnología · Streaming",
    },
    { type: "keyword", at: 10.6, dur: 4.4, y: 326, text: "Sin ruido.\nSolo claridad.", accent: "claridad." },
    {
      type: "value",
      // Top-anchored above the mic boom so the figure clears it.
      y: 200,
      at: 15.6,
      dur: 4.6,
      headline: "Exporta tus videos\nmás rápido, hasta",
      value: "3x",
    },
    {
      type: "checklist",
      at: 20.8,
      dur: 6.2,
      title: "Todo listo.",
      items: ["Elige una plantilla", "Escribe tu mensaje", "Exporta en 4K"],
    },
    {
      type: "compare",
      y: 220,
      at: 27.2,
      dur: 5,
      a: { name: "Editar a mano", value: "4 horas" },
      b: { name: "Con la plantilla", value: "20 min" },
      winner: "b",
    },
    // Points at the third row of the placeholder window.
    {
      type: "spotlight",
      at: 33,
      dur: 5.6,
      target: MOCK_UI.rows[2],
      step: 1,
      // No chip: the toggle switching on is the payoff.
      label: "",
      outline: false,
      headline: "Un clic\ny listo.",
      // Label + headline group above the compact window (both on the x = 192 column, in the left zone).
      headlineY: 126,
      // The window does not cover the speaker, so nothing needs dimming: the row lift carries the focus.
      dim: false,
    },
    // Liquid-glass subscribe control, shown alone after the component tour.
    { type: "subscribe", at: 39.5, dur: 8.2, variant: "clean" },
  ],
  outro: { seconds: 5, title: "Gracias\npor ver." },
};
