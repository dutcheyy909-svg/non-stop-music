export type MasteringAdvice = {
  id: string;
  query: string;
  title: string;
  snippet: string;
  url: string;
  lufs: string;
  truePeak: string;
  scannedAt: string;
};

export type MasteringPreset = {
  id: string;
  name: string;
  lufs: string;
  truePeak: string;
  notes: string;
  sourceUrl: string;
};

export const masteringPresets: MasteringPreset[] = [
  {
    id: "spotify",
    name: "Spotify (Normal)",
    lufs: "-14 LUFS integrated",
    truePeak: "-1 dBTP (−2 dBTP if louder than -14)",
    notes: "Playback normalises toward -14 LUFS. Louder masters are turned down, they are not rejected. Keep true peak safer when the master is hotter than -14.",
    sourceUrl: "https://audiolab.tools/insights/loudness-targets-streaming-platforms",
  },
  {
    id: "apple",
    name: "Apple Music Sound Check",
    lufs: "around -16 LUFS playback (no single public upload LUFS)",
    truePeak: "-1 dBTP",
    notes: "Sound Check matches playback loudness. Deliver a clean encode; do not slam just to win the meter.",
    sourceUrl: "https://soundforgepro.com/streaming-loudness-standards/",
  },
  {
    id: "youtube",
    name: "YouTube / YouTube Music",
    lufs: "-14 LUFS typical playback",
    truePeak: "-1 dBTP",
    notes: "YouTube turns loud files down and does not lift quiet ones. A hair under -14 is a safe delivery habit.",
    sourceUrl: "https://audiolab.tools/insights/loudness-targets-streaming-platforms",
  },
  {
    id: "streaming-edm",
    name: "EDM streaming-first",
    lufs: "-10 to -12 LUFS integrated",
    truePeak: "-1 dBTP",
    notes: "Density and punch can sit hotter than -14; platforms will turn the fader down. Build loudness in the mix, not only the limiter.",
    sourceUrl: "https://producerstack.com/blogs/the-stack/why-loudness-still-matters-in-edm-how-to-get-it-right",
  },
  {
    id: "club",
    name: "Club / Beatport-style",
    lufs: "-6 to -9 LUFS integrated",
    truePeak: "-0.3 to -1 dBTP",
    notes: "Intentional density for systems. Consider a separate streaming master so the club version is not the only bounce.",
    sourceUrl: "https://producerstack.com/blogs/the-stack/why-loudness-still-matters-in-edm-how-to-get-it-right",
  },
];

export function extractMeters(text: string) {
  const lufs = text.match(/-?\d{1,2}(?:\.\d+)?\s*LUFS/i)?.[0] ?? "";
  const truePeak = text.match(/-?\d(?:\.\d+)?\s*dB\s*TP/i)?.[0] ?? text.match(/-?\d(?:\.\d+)?\s*dBTP/i)?.[0] ?? "";
  return { lufs, truePeak };
}

export function chainFromAdvice(preset: MasteringPreset, hits: MasteringAdvice[]) {
  const web = hits
    .slice(0, 4)
    .map((hit, i) => `${i + 1}. ${hit.title}${hit.lufs ? ` — ${hit.lufs}` : ""}${hit.truePeak ? ` / ${hit.truePeak}` : ""}`)
    .join("\n");
  return [
    `Destination: ${preset.name}`,
    `Integrated: ${preset.lufs}`,
    `True peak: ${preset.truePeak}`,
    preset.notes,
    "Mono the sub below ~100 Hz; keep width above ~200 Hz.",
    "Limiter: 1–2 dB gain reduction; back off if it pumps the drop.",
    web ? `Web scan:\n${web}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}
