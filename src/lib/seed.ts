import type { Store } from "./types";
import { excelSerialToIso, parseBudget, slugId } from "./ids";
import raw from "../../data/master-import.json";

type Row = Record<string, string>;
type Master = {
  radioStations: Row[];
  supervisors: Row[];
  opportunities: Row[];
  placements: Row[];
};

function tokenize(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((part) => part.length > 2);
}

function fitScore(opportunity: { genre: string; mood: string }, catalogTags: string[]) {
  const hay = new Set(catalogTags.map((t) => t.toLowerCase()));
  const needles = [...tokenize(opportunity.genre), ...tokenize(opportunity.mood)];
  if (!needles.length) return 42;
  const hits = needles.filter((n) => hay.has(n) || [...hay].some((h) => h.includes(n)));
  return Math.min(98, Math.round(35 + (hits.length / needles.length) * 65));
}

export function buildStoreFromMaster(master: Master): Store {
  const radioStations = master.radioStations.map((row, i) => ({
    id: slugId("radio", row["Station / Platform"], i),
    name: row["Station / Platform"],
    country: row.Country,
    stationType: row["Station Type"],
    verification: row["Verification Level"],
    genreFit: row["Genre / Show Fit"],
    website: row["Official Website"],
    submissionPage: row["Submission Page"],
    contact: row["Public Contact"],
    submissionFormat: row["Submission Format"],
    accepting: row["Accepting Now?"],
    priority: row.Priority,
    status: row.Status || "research",
    notes: row.Notes,
    source: row["Research Source"],
  }));

  const supervisors = master.supervisors.map((row, i) => ({
    id: slugId("sup", row.Supervisor, i),
    name: row.Supervisor,
    organisation: row["Organisation / Source"],
    region: row.Region,
    role: row["Verified Role / Context"],
    credits: row["Selected Credits / Notes"],
    unsolicited: row["Unsolicited Submissions Verified?"],
    contact: row["Public Business Contact / Route"],
    sourceUrl: row["Source URL"],
    status: row["DUTCHHEYY Status"],
    priority: row.Priority,
    notes: row["Response / Notes"],
  }));

  const placements = master.placements.map((row, i) => ({
    id: slugId("plc", row["Placement ID"] || row["Track Title"], i),
    trackTitle: row["Track Title"],
    artist: row.Artist,
    type: row["Placement Type"],
    production: row["Production / Playlist / Station"],
    playlist: row["Episode / Campaign / Playlist"],
    library: row["Library / Agency"],
    date: excelSerialToIso(row["Placement Date"]),
    notes: row.Notes,
  }));

  const trackMap = new Map<string, { title: string; artist: string }>();
  for (const p of placements) {
    const key = `${p.trackTitle}|${p.artist}`.toLowerCase();
    if (p.trackTitle) {
      trackMap.set(key, { title: p.trackTitle, artist: p.artist || "DUTCHEYY" });
    }
  }

  const defaultTags = ["edm", "electronic", "house", "dark", "driving", "vocal"];
  const tracks = [...trackMap.values()].map((t, i) => ({
    id: slugId("trk", t.title, i),
    title: t.title,
    artist: t.artist,
    isrc: "",
    writers: "Duncan",
    tags: defaultTags,
    mood: "dark / driving",
    genre: "EDM",
    duration: "",
    rights: "Master + publishing — confirm splits",
    spotifyUri: "",
    fileName: "",
  }));

  const catalogTags = tracks.flatMap((t) => t.tags);

  const opportunities = master.opportunities.map((row, i) => {
    const budget = parseBudget(row["Budget / Fee"]);
    const genre = row["Genre / Style"];
    const mood = row["Mood / Energy"];
    return {
      id: slugId("opp", row["Brief / Project"], i),
      priority: row.Priority,
      title: row["Brief / Project"],
      source: row["Source / Platform"],
      mediaType: row["Media Type"],
      genre,
      mood,
      vocal: row["Vocal / Instrumental"],
      usage: row["Usage / Scene"],
      deadline: row.Deadline,
      budget: row["Budget / Fee"],
      territory: row.Territory,
      rights: row["Rights Required"],
      fitScore: fitScore({ genre, mood }, catalogTags),
      forecastGbp: budget,
      status: "open",
    };
  });

  const playlistNames = new Set<string>();
  const playlists = placements
    .filter((p) => p.production || p.playlist || p.library)
    .map((p, i) => {
      const name = p.playlist || p.production || p.library;
      if (playlistNames.has(name.toLowerCase())) return null;
      playlistNames.add(name.toLowerCase());
      return {
        id: slugId("pl", name, i),
        name,
        platform: /spotify/i.test(name) ? "Spotify" : "Pitch / library",
        curator: p.library || p.artist,
        genre: "EDM",
        followers: "",
        url: "",
        status: "target",
        notes: "Imported from master placements. Drop full Spotify playlist metadata in Data Management when ready.",
        sourcePlacement: p.id,
      };
    })
    .filter((row) => row !== null);

  const prospects = supervisors.slice(0, 12).map((s, i) => ({
    id: slugId("anr", s.name, i),
    name: s.name,
    role: "supervisor" as const,
    rightsReady: /email|@/.test(s.contact),
    commercialScore: s.priority === "High" ? 82 : 64,
    creativeScore: 70 + (i % 20),
    syncScore: 68 + (i % 25),
    revenueProjection: 1500 + i * 250,
    notes: s.credits,
  }));

  return {
    tracks,
    radioStations,
    supervisors,
    opportunities,
    playlists,
    placements,
    pitches: [],
    prospects,
    monitorActions: [],
    epk: {
      name: "DUTCHEYY RECORDS",
      shortBio: "Independent. Global. Future focused. Real music, real people, real progress.",
      longBio:
        "Dutcheyy Records is a music, publishing, sync and artist-development house. More than music — create, release, publish, sync, grow, repeat.",
      location: "United Kingdom",
      genres: "EDM, electronic, house, hip-hop",
      website: "",
      spotify: "",
      instagram: "",
    },
  };
}

export const seededStore = buildStoreFromMaster(raw as Master);
