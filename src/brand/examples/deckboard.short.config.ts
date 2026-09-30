/**
 * Demo config for `PlantillaAlejoxShort` (9:16): a camera intro plus a screen demo.
 * Times are SOURCE seconds from `src/brand/examples/deckboard.transcript.json`.
 * Copy this file for a new Short and change only the values.
 */
import transcript from "./deckboard.transcript.json";
import type { ShortConfig } from "../config";

/** Source ranges that make it into the Short (segments below), used to trim the transcript. */
const RANGES: [number, number][] = [
  [4.78, 12.48],
  [17.8, 22.2],
  [339.6, 354.6],
];

const words = (transcript as { words: { w: string; start: number; end: number }[] }[])
  .flatMap((s) => s.words)
  .filter((w) => RANGES.some(([a, b]) => w.start >= a && w.start < b));

export const deckboardShortConfig: ShortConfig = {
  source: {
    file: "deckboard.mp4",
    preview: "deckboard-preview.mp4",
    width: 3840,
    height: 2160,
  },
  audioDelayFrames: 3,
  items: [
    // The source's burned-in "SUSCRITO" pill is up during 2.3-9.6s at the bottom: the
    // camera crop below ends above it (master y 1600 < 1630), so it is never in frame.
    { kind: "camera", from: 4.78, to: 12.48 },
    // Jump cut: skip the tangent, land on the payoff.
    { kind: "camera", from: 17.8, to: 22.2, join: "cut" },
    { kind: "screen", from: 339.6, to: 354.6 },
  ],
  // 9:16 window of the master, in source pixels: 900x1600 at (1470, 0), face centred.
  cameraCrop: { x: 1470, y: 0, h: 1600 },
  screen: {
    // UI crop inside the Deckboard window chrome (x 812..1356, right of the grey sidebar),
    // scaled to the full 1080 width; the bottom half of the frame.
    crop: { x: 812, y: 246, w: 544 },
    // The recorded webcam rectangle (x 1408..1874) fills the top half edge to edge.
    face: { x: 1408, y: 335, w: 466, h: 345 },
    split: 800,
  },
  words,
  // Camera: captions above the head. Screen: on the divider (y 800), centred.
  captions: { cameraY: 470, screenY: 754 },
  beats: [
    {
      type: "title",
      at: 4.78,
      dur: 2,
      meta: "TUTORIAL · OBS",
      title: "Stream Deck gratis",
    },
    // "iniciar": the button to press, one smooth zoom inside the Spotlight.
    {
      type: "spotlight",
      at: 342.3,
      dur: 3.6,
      target: { x: 815, y: 375, w: 100, h: 100 },
      step: 1,
      label: "Toca Iniciar",
      zoom: 1.3,
      // Chip in the empty board header above the grid.
      chipPlacement: "above",
    },
    // Animated subscribe card after the demo: 0.66x fits the 860px safe width, below the captions.
    { type: "subscribe", at: 346.2, dur: 8.2, variant: "clean", x: 80, y: 1300, scale: 0.66 },
  ],
  outro: { seconds: 4 },
};
