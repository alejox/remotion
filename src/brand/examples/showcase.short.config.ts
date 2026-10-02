/**
 * Showcase config for `PlantillaAlejoxShort` (9:16): a tour of the vertical template over the
 * looping stand-in clip `public/glass-test.mp4`. COPY THIS FILE for a new Short and change only
 * the values marked "PER VIDEO"; everything else is a framing default for a talking head.
 *
 * All times are in SOURCE seconds (here the clip plays once from 0, so they are also
 * timeline seconds). Nothing in the components depends on this clip.
 */
import type { ShortConfig } from "../config";

/**
 * PER VIDEO - captions. Replace with your transcript: one entry per spoken sentence, `at` =
 * source second where it starts. Word times are spread by word length here; with a real
 * transcript use `{ w, start, end }` words straight from the transcript file instead.
 */
const SCRIPT: { at: number; text: string }[] = [
  { at: 0.5, text: "Hola, hoy te muestro cómo crear videos verticales." },
  { at: 4.5, text: "Soy Alejo, y esto es Alejoxtech." },
  { at: 8.6, text: "Exporta tus videos más rápido, hasta tres veces." },
  { at: 13.4, text: "Elige una plantilla, escribe tu mensaje y listo." },
  { at: 18.6, text: "Si te sirvió, suscríbete y activa la campana." },
];

const words = SCRIPT.flatMap(({ at, text }) => {
  let t = at;
  return text.split(" ").map((w) => {
    const start = t;
    const end = start + 0.14 + 0.04 * w.replace(/[^\p{L}\p{N}]/gu, "").length;
    t = end + (/[,.]$/.test(w) ? 0.28 : 0.04);
    return { w, start, end };
  });
});

export const showcaseShortConfig: ShortConfig = {
  // PER VIDEO - the master. `file` is played muted under the overlays here because it is a
  // short stand-in (`loop: true`); for a real video drop `loop`, set the real file/preview
  // (same timestamps) and the master's pixel size.
  source: { file: "glass-test.mp4", loop: true, width: 1920, height: 1080 },
  audioDelayFrames: 3,
  // PER VIDEO - segments (camera/screen) and section cards; here one camera segment.
  items: [{ kind: "camera", from: 0, to: 26.6 }],
  // PER VIDEO - the 9:16 window of the master, in source pixels (`h` tall, w = h * 9 / 16),
  // placed so the speaker's face sits on the frame's centre line.
  cameraCrop: { x: 626.5, y: 0, h: 1080 },
  words,
  captions: {
    // PER VIDEO - top of the caption line: just under the speaker's chin (y px in the 1920 frame).
    cameraY: 1200,
    screenY: 1200,
    // Captions step aside for the glass objects that sit in the same zone.
    hideDuring: ["lowerThird", "subscribe"],
  },
  labels: true,
  beats: [
    // PER VIDEO - beat times and copy. `y` positions are framing choices: text beats above the
    // head (y 170), glass objects below the chin. Omit `y` to use the format defaults.
    { type: "title", at: 0.4, dur: 3.6, y: 170, meta: "", title: "Tu Short\nempieza aquí." },
    { type: "lowerThird", at: 4.4, dur: 3.8, y: 1330, name: "Alejoxtech", tagline: "Tutoriales · Tecnología · Streaming" },
    {
      type: "value",
      at: 8.6,
      dur: 4.4,
      y: 170,
      headline: "Exporta tus videos\nmás rápido, hasta",
      value: "3x",
    },
    { type: "checklist", at: 13.4, dur: 4.6, y: 170, items: ["Elige una plantilla", "Escribe tu mensaje", "Exporta en 4K"] },
    // Stacked glass CTA (two rows) inside the Short safe area (x 80..940, y 154..1498).
    { type: "subscribe", at: 18.4, dur: 8.2, variant: "clean", layout: "stacked", x: 80, y: 1210 },
  ],
  outro: { seconds: 4, title: "Gracias\npor ver." },
};
