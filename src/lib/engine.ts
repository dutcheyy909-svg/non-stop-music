import type { Store } from "./types";
import { slugId } from "./ids";

export function runMonitor(store: Store): Store {
  const nextFunding = [...(store.fundingRounds ?? [])]
    .filter((round) => round.status === "open" && /^\d{4}-\d{2}-\d{2}$/.test(round.deadline))
    .sort((a, b) => a.deadline.localeCompare(b.deadline))[0];

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
      id: "mon-that-pitch",
      type: "licensing",
      title: `${(store.placements ?? []).filter((item) => item.source === "that-pitch").length} That Pitch placement rows tracked`,
      reason: "Paste the dashboard table on Sync Pipeline to keep library placements current.",
      href: "/pipeline",
      status: "open" as const,
    },
    {
      id: "mon-master",
      type: "metadata",
      title: `${store.tracks.filter((t) => !t.masteringTarget).length} cuts have no mastering target`,
      reason: "Scan the web on the AI Mastering suite, then apply a destination to the vault.",
      href: "/mastering",
      status: "open" as const,
    },
    {
      id: "mon-fund",
      type: "funding",
      title: nextFunding
        ? `${nextFunding.funder}: ${nextFunding.programme} due ${nextFunding.deadline}`
        : "No dated funding rounds loaded",
      reason: "Check Libraries / Funding for company-level grants and deadlines.",
      href: "/funding",
      status: "open" as const,
    },
  ];

  const pendingVendors = (store.vendorProducts ?? []).filter((item) => item.status === "pending").length;
  if (pendingVendors) {
    actions.push({
      id: "mon-vendors",
      type: "pipeline",
      title: `${pendingVendors} vendor product${pendingVendors === 1 ? "" : "s"} waiting for approval`,
      reason: "Review uploads before they appear on the production suite.",
      href: "/vendors/review",
      status: "open",
    });
  }

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

EPK: attached in Non-Stop. Stream / download link will sit on the listen page.

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
      const hay = `${station.genreFit ?? ""} ${station.stationType ?? ""} ${station.name ?? ""}`.toLowerCase();
      const hits = [...tags].filter((t) => hay.includes(t)).length;
      return { station, score: hits * 20 + (station.country === "United Kingdom" ? 15 : 5) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
}

export function newPitchId(label: string, count: number) {
  return slugId("pitch", label, count);
}
