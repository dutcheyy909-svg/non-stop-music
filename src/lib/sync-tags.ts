import { text } from "./ids";
import type { SyncPlaylistPack, Track } from "./types";

const RULES: Array<{ test: RegExp; tags: string[] }> = [
  { test: /dark|noir|shadow|grim/i, tags: ["dark"] },
  { test: /emot(ion)?|sad|heart|melancho/i, tags: ["emotional"] },
  { test: /cinematic|trailer|score|orchestr/i, tags: ["cinematic"] },
  { test: /trap/i, tags: ["trap", "cinematic trap"] },
  { test: /instrumental|no vocal|underscore/i, tags: ["instrumental"] },
  { test: /\bvocal\b|sung|topline/i, tags: ["vocal"] },
  { test: /tension|suspense|uneasy|anxious/i, tags: ["tension"] },
  { test: /sport|stadium|promo|hype|espn/i, tags: ["sports promo"] },
  { test: /drill/i, tags: ["drill"] },
  { test: /house|deep house/i, tags: ["house"] },
  { test: /edm|electro|electronic/i, tags: ["edm", "electronic"] },
  { test: /uplift|hope|inspire|anthem/i, tags: ["uplifting"] },
  { test: /aggress|rage|heavy|hard/i, tags: ["aggressive"] },
  { test: /chill|lofi|ambient/i, tags: ["chill"] },
  { test: /hybrid|trailer/i, tags: ["hybrid trailer"] },
  { test: /game|esport/i, tags: ["gaming"] },
  { test: /drama|underscore/i, tags: ["drama underscore"] },
  { test: /brand|advert|commercial|fashion|runway/i, tags: ["advert"] },
  { test: /driving|pulse|motor/i, tags: ["driving"] },
  { test: /bloom|night|city|redline|sick/i, tags: ["night", "urban"] },
];

export type SyncMetaInput = {
  title: string;
  artist: string;
  bpm: string;
  vocal: string;
  genre: string;
  mood: string;
  usage: string;
  notes: string;
  fileName: string;
  duration?: string;
  tags?: string[];
};

export type SyncLaneId = "tv-drama" | "gaming-trailer" | "sports-promo" | "fashion-advert";

export type SyncLane = {
  id: SyncLaneId;
  label: string;
  score: number;
  why: string;
  suggestedUse: string;
  playlistCategories: string[];
};

export type SyncMetaResult = {
  tags: string[];
  mood: string;
  genre: string;
  bpm: string;
  vocal: string;
  syncLine: string;
  description: string;
  keywords: string[];
  suggestedUse: string;
  lanes: SyncLane[];
  playlists: SyncPlaylistPack;
};

export const emptySyncPlaylists = (): SyncPlaylistPack => ({
  tvDrama: [],
  gamingTrailer: [],
  sportsPromo: [],
  fashionAdvert: [],
});

export function emptySyncFields() {
  return {
    syncDescription: "",
    syncKeywords: "",
    syncSuggestedUse: "",
    syncPlaylists: emptySyncPlaylists(),
  };
}

function unique(tags: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const tag of tags) {
    const clean = tag.toLowerCase().replace(/\s+/g, " ").trim();
    if (!clean || seen.has(clean)) continue;
    seen.add(clean);
    out.push(clean);
  }
  return out;
}

function bpmTag(raw: string) {
  const n = Number(String(raw).replace(/[^\d.]/g, ""));
  if (!Number.isFinite(n) || n < 40 || n > 220) return [];
  const rounded = Math.round(n);
  const extra =
    rounded < 90 ? ["slow"] : rounded < 120 ? ["mid-tempo"] : rounded < 150 ? ["driving"] : ["fast"];
  return [`${rounded}bpm`, ...extra];
}

function haystack(input: SyncMetaInput) {
  return [
    input.title,
    input.artist,
    input.genre,
    input.mood,
    input.usage,
    input.notes,
    input.fileName,
    input.vocal,
    ...(input.tags ?? []),
  ]
    .map((value) => text(value))
    .join(" ");
}

function pick(categories: Array<{ test: RegExp; label: string }>, hay: string, fallback: string[]) {
  const hits = categories.filter((item) => item.test.test(hay)).map((item) => item.label);
  return unique(hits.length ? hits : fallback).slice(0, 8);
}

function scoreLane(hay: string, tags: string[], tests: RegExp[]) {
  let score = 12;
  for (const test of tests) {
    if (test.test(hay) || tags.some((tag) => test.test(tag))) score += 18;
  }
  return Math.min(98, score);
}

export function generateSyncMetadata(input: SyncMetaInput): SyncMetaResult {
  const hay = haystack(input);
  const tags: string[] = [...(input.tags ?? [])];
  for (const rule of RULES) {
    if (rule.test.test(hay)) tags.push(...rule.tags);
  }
  tags.push(...bpmTag(input.bpm));

  const vocal = text(input.vocal).toLowerCase();
  if (vocal.includes("instrument")) tags.push("instrumental");
  else if (vocal.includes("both")) tags.push("vocal", "instrumental");
  else if (vocal.includes("vocal")) tags.push("vocal");

  if (/dark/.test(hay) && /emot/.test(hay)) tags.push("dark emotional");
  if (/cinematic/.test(hay) && /trap/.test(hay)) tags.push("cinematic trap");

  const mood =
    text(input.mood) ||
    unique(["dark", "emotional", "tension", "uplifting", "aggressive", "driving"].filter((m) => tags.includes(m))).join(
      " / ",
    );
  const genre =
    text(input.genre) ||
    unique(["cinematic trap", "trap", "edm", "house", "electronic"].filter((g) => tags.includes(g))).join(" / ");

  const finalTags = unique([
    ...tags,
    ...text(input.usage)
      .split(/[,/]+/)
      .map((part) => part.trim())
      .filter(Boolean),
  ]);

  const bpmBits = bpmTag(input.bpm);
  const vocalWord = finalTags.includes("instrumental") && !finalTags.includes("vocal")
    ? "instrumental"
    : finalTags.includes("vocal")
      ? "vocal"
      : "mix-ready";

  const tvDrama = pick(
    [
      { test: /crime|noir|dark|tension/i, label: "Crime / investigation underscore" },
      { test: /emot|sad|heart|family/i, label: "Emotional family / relationship scene" },
      { test: /night|city|urban/i, label: "Night-time city montage" },
      { test: /flash|memory/i, label: "Flashback" },
      { test: /title|open/i, label: "Opening titles" },
      { test: /end|credit/i, label: "End credits" },
      { test: /hospital|medical/i, label: "Medical drama bed" },
      { test: /legal|court/i, label: "Legal thriller pulse" },
    ],
    hay,
    ["Drama underscore", "Character walking scene", "Episode teaser sting"],
  );

  const gaming = pick(
    [
      { test: /trailer|cinematic|hybrid/i, label: "CG / cinematic trailer" },
      { test: /aggress|rage|hard|combat/i, label: "Combat / boss drop" },
      { test: /menu|chill|ambient/i, label: "Menu / character select" },
      { test: /win|uplift|anthem/i, label: "Victory / ranked win" },
      { test: /esport|sport/i, label: "Esports hype pack" },
      { test: /night|dark/i, label: "Night mission / stealth" },
      { test: /drive|race|motor/i, label: "Racing / chase" },
    ],
    hay,
    ["Hero reveal trailer", "In-game montage", "Launch trailer sting"],
  );

  const sports = pick(
    [
      { test: /hype|aggress|fast|drop/i, label: "Season-open hype" },
      { test: /player|hero|anthem/i, label: "Player / athlete montage" },
      { test: /goal|highlight/i, label: "Goal / try / highlight pack" },
      { test: /night|city/i, label: "Night fixture promo" },
      { test: /brand|advert/i, label: "Broadcast sting / ident" },
      { test: /slow|emot/i, label: "Injury / underdog story" },
    ],
    hay,
    ["Sports promo bed", "Broadcast bumper", "Social highlight clip"],
  );

  const fashion = pick(
    [
      { test: /runway|fashion|model/i, label: "Runway walk" },
      { test: /beauty|close/i, label: "Beauty close-up" },
      { test: /night|club|city/i, label: "Night-out lookbook" },
      { test: /luxury|brand/i, label: "Luxury product film" },
      { test: /street|youth|urban/i, label: "Street / youth campaign" },
      { test: /chill|emot/i, label: "Soft editorial / perfume" },
    ],
    hay,
    ["Fashion advert bed", "Lookbook montage", "Brand social cutdown"],
  );

  const lanes: SyncLane[] = [
    {
      id: "tv-drama",
      label: "TV drama",
      score: scoreLane(hay, finalTags, [/drama|underscore|emot|dark|tension|cinematic|noir/i]),
      why: "Beds and pulses that sit under dialogue without stealing the scene.",
      suggestedUse: `${tvDrama[0]} — ${vocalWord} ${genre || "electronic"} bed for series and soaps.`,
      playlistCategories: tvDrama,
    },
    {
      id: "gaming-trailer",
      label: "Gaming trailer",
      score: scoreLane(hay, finalTags, [/game|esport|trailer|cinematic|aggress|hybrid|drop/i]),
      why: "Drops and risers that match reveal, combat and launch trailers.",
      suggestedUse: `${gaming[0]} — timed hits for picture cuts and logo stings.`,
      playlistCategories: gaming,
    },
    {
      id: "sports-promo",
      label: "Sports promo",
      score: scoreLane(hay, finalTags, [/sport|hype|stadium|promo|aggress|driving|fast|anthem/i]),
      why: "Energy for montages, fixtures and broadcast idents.",
      suggestedUse: `${sports[0]} — picture-to-downbeat for athlete and club films.`,
      playlistCategories: sports,
    },
    {
      id: "fashion-advert",
      label: "Fashion advert",
      score: scoreLane(hay, finalTags, [/fashion|advert|brand|runway|night|chill|urban|luxury/i]),
      why: "Attitude and groove for lookbooks, beauty and luxury spots.",
      suggestedUse: `${fashion[0]} — loop-friendly groove for picture lock and social cutdowns.`,
      playlistCategories: fashion,
    },
  ];
  lanes.sort((a, b) => b.score - a.score);

  const top = lanes[0];
  const description = [
    `${text(input.title) || "This cut"} by ${text(input.artist) || "DUTCHEYY"} is a ${mood || "dark / driving"} ${genre || "EDM"} ${vocalWord}${bpmBits[0] ? ` at ${bpmBits[0].replace("bpm", " BPM")}` : ""}.`,
    `Best first use: ${top.suggestedUse}`,
    `Also fits ${lanes
      .slice(1, 3)
      .map((lane) => lane.label.toLowerCase())
      .join(" and ")}.`,
    text(input.notes) ? `Producer notes: ${text(input.notes)}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const keywords = unique([
    ...finalTags,
    ...lanes.flatMap((lane) => [lane.label.toLowerCase(), ...lane.playlistCategories.map((item) => item.toLowerCase())]),
    text(input.title),
    text(input.artist),
  ]).slice(0, 24);

  const suggestedUse = lanes
    .map((lane) => `${lane.label} (${lane.score}%): ${lane.suggestedUse}`)
    .join("\n");

  const syncLine = [
    input.title,
    genre || mood,
    vocalWord,
    bpmBits[0] || "",
    top.label,
    finalTags.filter((tag) => ["tension", "sports promo", "dark emotional", "cinematic trap"].includes(tag)).join(", "),
  ]
    .filter(Boolean)
    .join(" · ");

  return {
    tags: finalTags,
    mood: mood || "dark / driving",
    genre: genre || "EDM",
    bpm: text(input.bpm),
    vocal: text(input.vocal) || vocalWord,
    syncLine,
    description,
    keywords,
    suggestedUse,
    lanes,
    playlists: {
      tvDrama: tvDrama,
      gamingTrailer: gaming,
      sportsPromo: sports,
      fashionAdvert: fashion,
    },
  };
}

export function inputFromTrack(track: Track, extraNotes = ""): SyncMetaInput {
  return {
    title: track.title,
    artist: track.artist,
    bpm: track.bpm,
    vocal: track.tags.some((tag) => /vocal/i.test(tag)) ? "vocal" : track.tags.some((tag) => /instrument/i.test(tag)) ? "instrumental" : "",
    genre: track.genre,
    mood: track.mood,
    usage: extraNotes,
    notes: extraNotes,
    fileName: track.fileName,
    duration: track.duration,
    tags: track.tags,
  };
}

export function applySyncResult(track: Track, result: SyncMetaResult): Track {
  return {
    ...track,
    tags: unique([...track.tags, ...result.tags]),
    mood: result.mood || track.mood,
    genre: result.genre || track.genre,
    bpm: result.bpm || track.bpm,
    syncDescription: result.description,
    syncKeywords: result.keywords.join(", "),
    syncSuggestedUse: result.suggestedUse,
    syncPlaylists: result.playlists,
  };
}
