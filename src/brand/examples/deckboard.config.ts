/**
 * Demo config for `PlantillaAlejox` (16:9): the Deckboard + OBS tutorial.
 * Times are SOURCE seconds from `src/brand/examples/deckboard.transcript.json`.
 * Copy this file for a new video and change only the values.
 */
import type { VideoConfig } from "../config";

export const deckboardConfig: VideoConfig = {
  source: {
    file: "deckboard.mp4",
    preview: "deckboard-preview.mp4",
    width: 3840,
    height: 2160,
  },
  audioDelayFrames: 3,
  items: [
    // Camera intro. The source's burned-in "SUSCRITO" pill is up during 2.3-9.6s
    // (bottom centre): nothing overlaps it, the title sits top-left, the lower third waits.
    { kind: "camera", from: 4.78, to: 24.3 },
    { kind: "section", number: "01", title: "Conecta Deckboard con OBS" },
    // OBS WebSocket settings on screen.
    // Runs to 163.7s so the subscribe card can play fully after the recap.
    { kind: "screen", from: 120.5, to: 163.7 },
  ],
  beats: [
    // Title starts after the burned-in pill (source 2.3-9.6s) is gone.
    {
      type: "title",
      at: 9.7,
      dur: 3,
      meta: "TUTORIAL · OBS",
      title: "Stream Deck gratis con tu celular",
    },
    // >= 2s of clean footage after the title, bottom-left.
    { type: "lowerThird", at: 14.8, dur: 2.8 },
    // The price is illustrative, not a quote.
    {
      type: "compare",
      at: 18,
      dur: 3.6,
      a: { name: "Stream Deck físico", value: "~$150" },
      b: { name: "Deckboard", value: "$0" },
      winner: "b",
    },
    // A term to remember, just before the first screen callout.
    { type: "keyword", at: 121.1, dur: 1.9, text: "Servidor WebSocket", accent: "WebSocket", x: 96, y: 380 },
    // Targets are in the 1920x1080 space of the screen recording.
    // Step 1: box wraps ONLY the "Ajustes del servidor WebSocket" row; the zoom is centred
    // on the whole dropdown (menu bar included) and is the only zoom of the video.
    {
      type: "spotlight",
      at: 123.25,
      dur: 2.85,
      target: { x: 443, y: 224, w: 264, h: 30 },
      focus: { x: 440, y: 28, w: 272, h: 230 },
      step: 1,
      label: "Herramientas → Ajustes del servidor WebSocket",
      zoom: 1.8,
    },
    // Step 2: chip in the dimmed black preview left of the dialog, not over its title bar.
    {
      type: "spotlight",
      at: 130.7,
      dur: 3.6,
      target: { x: 792, y: 288, w: 206, h: 24 },
      step: 2,
      label: "Habilita el servidor",
      chipAt: { x: 80, y: 270 },
    },
    { type: "value", at: 135.7, dur: 4.6, label: "Puerto", value: "4460" },
    {
      type: "checklist",
      at: 149.8,
      dur: 5.5,
      items: ["Misma red Wi-Fi", "WebSocket habilitado", "Puerto 4460"],
    },
    // Animated subscribe card at the end, right before the outro: alone on screen, left-aligned
    // to clear the recorded face bubble, and far from the burned-in original (source 2-10s).
    { type: "subscribe", at: 155.4, dur: 8.2, variant: "clean" },
  ],
  outro: { seconds: 5 },
};
