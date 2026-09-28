import { slugId } from "./ids";
import { col, parseDelimited } from "./table-import";
import type { Placement } from "./types";

export type ThatPitchRow = {
  trackTitle: string;
  artist: string;
  library: string;
  production: string;
  playlist: string;
  clientBrand: string;
  usage: string;
  date: string;
  income: string;
  isrc: string;
  status: string;
  notes: string;
  sourceUrl: string;
};

export function parseThatPitchTable(raw: string): ThatPitchRow[] {
  const { headers, rows } = parseDelimited(raw);
  if (!headers.length) return [];
  const out: ThatPitchRow[] = [];
  for (const cols of rows) {
    const trackTitle = col(headers, cols, ["track", "tracktitle", "title", "song", "recording", "name"]);
    if (!trackTitle) continue;
    out.push({
      trackTitle,
      artist: col(headers, cols, ["artist", "artists", "primaryartist"]),
      library: col(headers, cols, ["library", "destination", "catalog", "outlet", "company"]),
      production: col(headers, cols, ["production", "show", "project", "media", "placementtype", "type"]),
      playlist: col(headers, cols, ["episode", "campaign", "playlist"]),
      clientBrand: col(headers, cols, ["client", "brand", "curator"]),
      usage: col(headers, cols, ["usage", "use", "mediause"]),
      date: col(headers, cols, ["date", "placementdate", "airdate", "publishdate", "live", "accepted"]),
      income: col(headers, cols, ["income", "fee", "amount", "royalty", "payout"]),
      isrc: col(headers, cols, ["isrc"]).replace(/\s+/g, "").toUpperCase(),
      status: col(headers, cols, ["status", "state", "stage"]),
      notes: col(headers, cols, ["notes", "note", "comment"]),
      sourceUrl: col(headers, cols, ["url", "link", "source", "dashboard"]),
    });
  }
  return out;
}

export function placementKey(item: { trackTitle: string; library: string; date: string; production: string }) {
  return `${item.trackTitle}|${item.library}|${item.production}|${item.date}`.toLowerCase();
}

export function thatPitchToPlacement(row: ThatPitchRow, index: number): Placement {
  const notes = [row.status, row.notes].filter(Boolean).join(" · ");
  return {
    id: slugId("tp", `${row.trackTitle}-${row.library}`, index),
    trackTitle: row.trackTitle,
    artist: row.artist || "DUTCHEYY",
    type: "That Pitch library",
    production: row.production,
    playlist: row.playlist,
    library: row.library,
    clientBrand: row.clientBrand,
    supervisorContact: "",
    usage: row.usage,
    date: row.date,
    airPublishDate: row.date,
    endDate: "",
    masterFee: "",
    publishingFee: "",
    cueFee: "",
    incomePerPlacement: row.income,
    isrc: row.isrc,
    invoiceNo: "",
    paymentReceived: "",
    notes,
    source: "that-pitch",
    sourceUrl: row.sourceUrl || "https://app.thatpitch.com/dashboard",
  };
}
