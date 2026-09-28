import { slugId, text } from "./ids";
import type { PlaylistAnalysis, Track } from "./types";

const CHOOSIC_ANALYZER = "https://www.chosic.com/spotify-playlist-analyzer/";

export function sparkPulseUrl(playlistUrl?: string) {
  const url = text(playlistUrl).trim();
  if (!url) return CHOOSIC_ANALYZER;
  return `${CHOOSIC_ANALYZER}?playlist=${encodeURIComponent(url)}`;
}

function pct(value: number | null) {
  if (value == null || Number.isNaN(value)) return null;
  if (value <= 1) return Math.round(value * 100);
  return Math.round(value);
}

function grab(hay: string, labels: string[]) {
  for (const label of labels) {
    const pattern = new RegExp(`${label}\\s*[:\\-]?\\s*([0-9]+(?:\\.[0-9]+)?)\\s*%?`, "i");
    const match = hay.match(pattern);
    if (match) return Number(match[1]);
  }
  return null;
}

function grabText(hay: string, labels: string[]) {
  for (const label of labels) {
    const pattern = new RegExp(`${label}\\s*[:\\-]?\\s*([^\\n,;]+)`, "i");
    const match = hay.match(pattern);
    if (match) return text(match[1]).trim();
  }
  return "";
}

export function parsePlaylistAnalysis(raw: string): Partial<PlaylistAnalysis> {
  const trimmed = text(raw).trim();
  if (!trimmed) return {};

  try {
    const json = JSON.parse(trimmed) as Record<string, unknown>;
    const num = (keys: string[]) => {
      for (const key of keys) {
        const value = json[key];
        if (typeof value === "number") return value;
        if (typeof value === "string" && value.trim()) return Number(value.replace(/[^\d.]+/g, ""));
      }
      return null;
    };
    return {
      tracks: num(["tracks", "trackCount", "size"]) ?? undefined,
      bpm: num(["bpm", "tempo", "avgBpm", "averageTempo"]),
      energy: pct(num(["energy"])),
      danceability: pct(num(["danceability", "dance"])),
      valence: pct(num(["valence", "happiness", "positivity"])),
      acousticness: pct(num(["acousticness", "acoustic"])),
      instrumentalness: pct(num(["instrumentalness", "instrumental"])),
      speechiness: pct(num(["speechiness", "speech"])),
      loudness: text(json.loudness ?? json.lufs ?? ""),
      key: text(json.key ?? json.mode ?? ""),
      genres: Array.isArray(json.genres) ? json.genres.map(String).join(", ") : text(json.genres ?? json.genre ?? ""),
      spotifyUrl: text(json.url ?? json.spotifyUrl ?? json.playlist ?? ""),
      playlistName: text(json.name ?? json.playlistName ?? json.title ?? ""),
    };
  } catch {
    /* fall through to text parse */
  }

  const bpm = grab(trimmed, ["average tempo", "avg tempo", "avg bpm", "average bpm", "tempo", "bpm"]);
  return {
    tracks: grab(trimmed, ["tracks", "songs", "number of tracks"]),
    bpm,
    energy: pct(grab(trimmed, ["energy"])),
    danceability: pct(grab(trimmed, ["danceability", "danceable", "dance"])),
    valence: pct(grab(trimmed, ["valence", "happiness", "positivity", "happy"])),
    acousticness: pct(grab(trimmed, ["acousticness", "acoustic"])),
    instrumentalness: pct(grab(trimmed, ["instrumentalness", "instrumental"])),
    speechiness: pct(grab(trimmed, ["speechiness", "speech"])),
    loudness: grabText(trimmed, ["loudness", "lufs"]),
    key: grabText(trimmed, ["key", "mode"]),
    genres: grabText(trimmed, ["genres", "top genres", "genre"]),
    spotifyUrl: trimmed.match(/https?:\/\/open\.spotify\.com\/playlist\/[a-zA-Z0-9]+/i)?.[0] ?? "",
  };
}

export function analysisFromForm(form: {
  raw: string;
  playlistId: string;
  playlistName: string;
  spotifyUrl: string;
  tracks?: string;
  bpm?: string;
  energy?: string;
  danceability?: string;
  valence?: string;
  acousticness?: string;
  instrumentalness?: string;
  speechiness?: string;
  loudness?: string;
  key?: string;
  genres?: string;
}): PlaylistAnalysis {
  const parsed = parsePlaylistAnalysis(form.raw);
  const num = (value?: string, fallback?: number | null) => {
    const cleaned = String(value ?? "").replace(/[^\d.]+/g, "");
    if (!cleaned) return fallback ?? null;
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : (fallback ?? null);
  };
  return {
    id: slugId("plx", form.playlistName || parsed.playlistName || "analysis", Date.now()),
    playlistId: form.playlistId,
    playlistName: form.playlistName || parsed.playlistName || "Untitled playlist",
    spotifyUrl: form.spotifyUrl || parsed.spotifyUrl || "",
    tracks: num(form.tracks, parsed.tracks ?? null),
    bpm: num(form.bpm, parsed.bpm ?? null),
    energy: num(form.energy, parsed.energy ?? null),
    danceability: num(form.danceability, parsed.danceability ?? null),
    valence: num(form.valence, parsed.valence ?? null),
    acousticness: num(form.acousticness, parsed.acousticness ?? null),
    instrumentalness: num(form.instrumentalness, parsed.instrumentalness ?? null),
    speechiness: num(form.speechiness, parsed.speechiness ?? null),
    loudness: form.loudness || parsed.loudness || "",
    key: form.key || parsed.key || "",
    genres: form.genres || parsed.genres || "",
    raw: form.raw,
    capturedAt: new Date().toISOString(),
  };
}

export function keywordsFromAnalysis(analysis: PlaylistAnalysis) {
  const tags: string[] = [];
  if (analysis.bpm) tags.push(`${Math.round(analysis.bpm)}bpm`);
  if ((analysis.energy ?? 0) >= 70) tags.push("high energy", "hype", "sports promo");
  else if ((analysis.energy ?? 100) <= 35) tags.push("low energy", "underscore");
  if ((analysis.valence ?? 50) <= 35) tags.push("dark", "tension", "drama underscore");
  else if ((analysis.valence ?? 0) >= 70) tags.push("uplifting", "feel-good");
  if ((analysis.danceability ?? 0) >= 70) tags.push("dance", "club");
  if ((analysis.instrumentalness ?? 0) >= 60) tags.push("instrumental");
  else if ((analysis.instrumentalness ?? 100) <= 20) tags.push("vocal");
  if ((analysis.acousticness ?? 0) >= 50) tags.push("acoustic");
  if (analysis.genres) tags.push(...analysis.genres.split(/[,/]+/).map((part) => part.trim().toLowerCase()));
  return [...new Set(tags.filter(Boolean))];
}

export function trackFitToAnalysis(track: Track, analysis: PlaylistAnalysis) {
  const bpm = Number(String(track.bpm).replace(/[^\d.]/g, ""));
  let score = 40;
  const reasons: string[] = [];
  if (analysis.bpm && Number.isFinite(bpm) && bpm > 0) {
    const delta = Math.abs(bpm - analysis.bpm);
    const bpmScore = Math.max(0, 40 - delta);
    score += bpmScore;
    reasons.push(`BPM ${Math.round(bpm)} vs playlist ${Math.round(analysis.bpm)} (${Math.round(delta)} off)`);
  } else if (analysis.bpm) {
    reasons.push(`Playlist BPM ${Math.round(analysis.bpm)} — add BPM on the vault cut`);
  }
  const hay = `${track.mood} ${track.genre} ${track.tags.join(" ")} ${track.syncKeywords}`.toLowerCase();
  if ((analysis.valence ?? 50) <= 40 && /dark|tension|emot|noir/.test(hay)) {
    score += 12;
    reasons.push("Mood matches a darker playlist valence");
  }
  if ((analysis.valence ?? 50) >= 65 && /uplift|hope|anthem|feel/.test(hay)) {
    score += 12;
    reasons.push("Mood matches a brighter playlist valence");
  }
  if ((analysis.energy ?? 50) >= 70 && /driv|hype|aggress|sport|edm/.test(hay)) {
    score += 10;
    reasons.push("Energy lane matches");
  }
  const keywords = keywordsFromAnalysis(analysis);
  const overlap = keywords.filter((tag) => hay.includes(tag)).length;
  score += Math.min(18, overlap * 3);
  return { score: Math.min(99, Math.round(score)), reasons, keywords };
}
