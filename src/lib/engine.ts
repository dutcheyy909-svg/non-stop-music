import type { Store } from "./types";
import { slugId } from "./ids";

export function runMonitor(store: Store): Store {
  const actions = [
    {
      id: "mon-radio",
      type: "radio",
      title: `${store.radioStations.length} radio stations loaded from the master file`,
      reason: "Confirm emails and submission pages before sending EPK + track.",
      href: "/radio",
      status: "open" as const,
    },
    {
      id: "mon-meta",
      type: "metadata",
      title: `${store.tracks.filter((t) => !t.isrc).length} catalogue cuts still need ISRC`,
      reason: "Incomplete metadata blocks radio and sync pitches.",
      href: "/metadata",
      status: "open" as const,
    },
    {
      id: "mon-opp",
      type: "opportunity",
      title: `${store.opportunities.filter((o) => o.fitScore >= 70).length} briefs score 70+ against the vault`,
      reason: "Open Opportunity Finder and pitch the best-fit tracks.",
      href: "/opportunities",
      status: "open" as const,
    },
    {
      id: "mon-playlist",
      type: "playlist",
      title: "Spotify pitch playlists are stubbed from placements",
      reason: "Import the playlist sheet from the master file in Data Management.",
      href: "/playlists",
      status: "open" as const,
    },
  ];

  if (!store.pitches.length) {
    actions.push({
      id: "mon-pitch",
      type: "pipeline",
      title: "No pitches logged yet",
      reason: "Create a radio or licensing pitch so the engine can track follow-ups.",
      href: "/pipeline",
      status: "open",
    });
  }

  return { ...store, monitorActions: actions };
}

export function draftRadioPitch(store: Store, stationId: string, trackId: string) {
  const station = store.radioStations.find((s) => s.id === stationId);
  const track = store.tracks.find((t) => t.id === trackId);
  if (!station || !track) return "Pick a station and a track first.";
  return `Hi ${station.name} team,

I'm pitching ${track.title} by ${track.artist} for ${station.genreFit || station.stationType} programming.

Genre / mood: ${track.genre} — ${track.mood}
Rights: ${track.rights}

EPK: attached in Levitate. Stream / download link will sit on the listen page.

Dutcheyy Records — independent, global, future focused.`;
}

export function matchOpportunities(store: Store) {
  return [...store.opportunities].sort((a, b) => b.fitScore - a.fitScore);
}

export function suggestStations(store: Store, trackId?: string) {
  const track = store.tracks.find((t) => t.id === trackId) ?? store.tracks[0];
  const tags = new Set((track?.tags ?? []).map((t) => t.toLowerCase()));
  return store.radioStations
    .map((station) => {
      const hay = `${station.genreFit} ${station.stationType} ${station.name}`.toLowerCase();
      const hits = [...tags].filter((t) => hay.includes(t)).length;
      return { station, score: hits * 20 + (station.country === "United Kingdom" ? 15 : 5) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
}

export function newPitchId(label: string, count: number) {
  return slugId("pitch", label, count);
}
