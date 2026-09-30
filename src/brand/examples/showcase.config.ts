/**
 * Showcase config for `PlantillaAlejox` (16:9): a black-canvas tour of every component,
 * with no source footage. Times are SOURCE seconds; with no footage the "segments" are
 * just black stretches that carry the beats. Copy this file for a new video.
 */
import type { VideoConfig } from "../config";
import { MOCK_UI } from "../PlaceholderScreen";

export const showcaseConfig: VideoConfig = {
  source: {
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
      at: 0.6,
      dur: 4.2,
      meta: "Plantilla Alejox",
      title: "Tu próximo video\nempieza aquí.",
    },
    {
      type: "lowerThird",
      at: 5.2,
      dur: 4,
      name: "Alejoxgaming.",
      tagline: "Tutoriales · Tecnología · Streaming",
    },
    { type: "keyword", at: 10.6, dur: 4.4, text: "Sin ruido.\nSolo claridad.", accent: "claridad." },
    {
      type: "value",
      at: 15.6,
      dur: 4.6,
      headline: "Exporta tus videos hasta",
      value: "3x",
      suffix: "más rápido.",
    },
    {
      type: "checklist",
      at: 20.8,
      dur: 6.2,
      title: "Todo en orden.",
      items: ["Elige una plantilla", "Escribe tu mensaje", "Exporta en 4K"],
    },
    {
      type: "compare",
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
      // The numbered badge alone, level with the row and 28px left of its box.
      label: "",
      chipAt: { x: MOCK_UI.rows[2].x - 6 - 28 - 56, y: MOCK_UI.rows[2].y + MOCK_UI.rows[2].h / 2 - 28 },
      outline: false,
      headline: "Un clic\ny listo.",
      // Cap line of the headline level with the window's top edge.
      headlineY: MOCK_UI.window.y - 15,
    },
    // Liquid-glass subscribe control, shown alone after the component tour.
    { type: "subscribe", at: 39.5, dur: 8.2, variant: "clean" },
  ],
  outro: { seconds: 5, title: "Gracias por ver." },
};
