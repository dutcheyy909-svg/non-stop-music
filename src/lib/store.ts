import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { seededStore } from "./seed";
import { runMonitor } from "./engine";
import { STORE_SCHEMA_VERSION, type Store } from "./types";

const dataDir = path.join(process.cwd(), "data");
const storePath = path.join(dataDir, "store.json");

export async function readStore(): Promise<Store> {
  try {
    const text = await readFile(storePath, "utf8");
    const parsed = JSON.parse(text) as Store;
    if (
      parsed.schemaVersion !== STORE_SCHEMA_VERSION ||
      !parsed.radioStations?.length ||
      !Array.isArray(parsed.fundingRounds) ||
      !Array.isArray(parsed.libraries)
    ) {
      const fresh = runMonitor({ ...seededStore, pitches: parsed.pitches ?? [] });
      await writeStore(fresh);
      return fresh;
    }
    return {
      ...parsed,
      tracks: (parsed.tracks ?? []).map((track) => ({
        ...track,
        upc: track.upc ?? "",
        preReleaseLink: track.preReleaseLink ?? "",
        masteringTarget: track.masteringTarget ?? "",
        masteringLufs: track.masteringLufs ?? "",
        masteringTruePeak: track.masteringTruePeak ?? "",
        masteringNotes: track.masteringNotes ?? "",
        masteringSources: track.masteringSources ?? "",
        bpm: track.bpm ?? "",
        syncDescription: track.syncDescription ?? "",
        syncKeywords: track.syncKeywords ?? "",
        syncSuggestedUse: track.syncSuggestedUse ?? "",
        syncPlaylists: {
          tvDrama: track.syncPlaylists?.tvDrama ?? [],
          gamingTrailer: track.syncPlaylists?.gamingTrailer ?? [],
          sportsPromo: track.syncPlaylists?.sportsPromo ?? [],
          fashionAdvert: track.syncPlaylists?.fashionAdvert ?? [],
        },
      })),
      placements: (parsed.placements ?? []).map((item) => ({
        ...item,
        source: item.source ?? "master",
        sourceUrl: item.sourceUrl ?? "",
      })),
      masteringAdvice: Array.isArray(parsed.masteringAdvice) ? parsed.masteringAdvice : [],
      ppcEvents: Array.isArray(parsed.ppcEvents) ? parsed.ppcEvents : [],
      radioSubmissions: Array.isArray(parsed.radioSubmissions) ? parsed.radioSubmissions : [],
      radioSpins: Array.isArray(parsed.radioSpins) ? parsed.radioSpins : [],
      radioLedger: Array.isArray(parsed.radioLedger) ? parsed.radioLedger : [],
      fanLeads: Array.isArray(parsed.fanLeads) ? parsed.fanLeads : [],
      promoOrders: Array.isArray(parsed.promoOrders) ? parsed.promoOrders : [],
      vendorProducts: Array.isArray(parsed.vendorProducts) ? parsed.vendorProducts : [],
      playlistAnalyses: Array.isArray(parsed.playlistAnalyses) ? parsed.playlistAnalyses : [],
      browseAiRobotId: parsed.browseAiRobotId ?? "",
      browseAiOriginUrl: parsed.browseAiOriginUrl ?? "",
    };
  } catch {
    const fresh = runMonitor(seededStore);
    await writeStore(fresh);
    return fresh;
  }
}

export async function writeStore(store: Store) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(storePath, JSON.stringify(store, null, 2));
}

export async function updateStore(mutator: (store: Store) => Store) {
  const current = await readStore();
  const next = runMonitor(mutator(current));
  await writeStore(next);
  return next;
}
