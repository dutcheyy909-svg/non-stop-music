export const tools4MusicHome = "https://tools4music.com";

export type Tools4MusicLink = {
  id: string;
  name: string;
  blurb: string;
  path: string;
};

export type Tools4MusicColumn = {
  id: string;
  title: string;
  blurb: string;
  tools: Tools4MusicLink[];
};

const site = (path: string) => `${tools4MusicHome}${path}`;

export const tools4MusicColumns: Tools4MusicColumn[] = [
  {
    id: "royalties",
    title: "Royalty calculators",
    blurb: "Stream payouts, reverse goals, publishing splits, sync and tour numbers.",
    tools: [
      { id: "streaming", name: "Streaming royalties", blurb: "Spotify, Apple, YouTube and 60+ platforms.", path: site("/calculators/streaming-royalty") },
      { id: "advanced", name: "Multi-track calculator", blurb: "Several cuts, territories and ownership %.", path: site("/calculators/advanced") },
      { id: "reverse", name: "Reverse royalties", blurb: "How many streams to hit an income goal.", path: site("/calculators/reverse") },
      { id: "target", name: "Target streams", blurb: "Monthly listeners and timeline projections.", path: site("/calculators/target-streams") },
      { id: "publishing", name: "Publishing split", blurb: "Writer / publisher splits and mechanicals.", path: site("/calculators/publishing-royalty-split") },
      { id: "sync-fee", name: "Sync licensing fee", blurb: "Ballpark fees for TV, film and ads.", path: site("/calculators/sync-licensing-fee") },
      { id: "tour", name: "Tour revenue", blurb: "Show income projections.", path: site("/calculators/tour-revenue") },
      { id: "merch", name: "Merch profit", blurb: "Margin on shirts and drops.", path: site("/calculators/merch-profit") },
      { id: "catalog", name: "Catalogue valuation", blurb: "What the vault might be worth.", path: site("/calculators/catalog-valuation") },
      { id: "advance", name: "Royalty advance", blurb: "Advance vs recoup maths.", path: site("/calculators/royalty-advance-calculator") },
    ],
  },
  {
    id: "studio",
    title: "Studio tools",
    blurb: "BPM, delay, reverb, frequency and sample-rate helpers in the browser.",
    tools: [
      { id: "bpm", name: "BPM tap", blurb: "Tap tempo for a vault cut.", path: site("/tools/bpm-tap") },
      { id: "delay", name: "Delay time", blurb: "Note values in ms from BPM.", path: site("/tools/delay-time") },
      { id: "reverb", name: "Reverb time", blurb: "Decay in time with the groove.", path: site("/tools/reverb-time") },
      { id: "freq", name: "Frequency", blurb: "Note to Hz for EQ moves.", path: site("/tools/frequency") },
      { id: "sr", name: "Sample rate", blurb: "Session sample-rate conversions.", path: site("/tools/sample-rate") },
      { id: "chord", name: "Chord wheel", blurb: "Key and relative chords.", path: site("/tools/chord-wheel") },
    ],
  },
  {
    id: "names",
    title: "Name generators",
    blurb: "Titles and brands when a release needs a name.",
    tools: [
      { id: "playlist", name: "Playlist names", blurb: "Curator-style list titles.", path: site("/name-generators/playlist") },
      { id: "song", name: "Song titles", blurb: "Working titles for the vault.", path: site("/name-generators/song") },
      { id: "album", name: "Album titles", blurb: "EP / LP names.", path: site("/name-generators/album") },
      { id: "artist", name: "Artist names", blurb: "Aliases and project names.", path: site("/name-generators/artist") },
      { id: "band", name: "Band names", blurb: "Group / alias generator.", path: site("/name-generators/band") },
      { id: "beat", name: "Beat names", blurb: "Instrumental file names.", path: site("/name-generators/beat") },
    ],
  },
  {
    id: "directories",
    title: "Directories",
    blurb: "PROs, sync, awards, festivals and schools.",
    tools: [
      { id: "pros", name: "PROs worldwide", blurb: "Performance societies including PRS.", path: site("/directories/pros") },
      { id: "sync", name: "Sync licensing", blurb: "Libraries and supervisors to research.", path: site("/directories/sync-licensing") },
      { id: "awards", name: "Music awards", blurb: "Award programmes.", path: site("/directories/music-awards") },
      { id: "festivals", name: "Festivals", blurb: "Festival directory.", path: site("/directories/music-festivals") },
      { id: "schools", name: "Music schools", blurb: "Courses and colleges.", path: site("/directories/music-schools") },
      { id: "glossary", name: "Glossary", blurb: "Industry terms.", path: site("/discover") },
    ],
  },
];

export function emptyTools4MusicFields() {
  return {
    royaltyStreamsTarget: "",
    royaltySplitPercent: "",
    royaltySyncFeeBand: "",
    delayMs: "",
    productionNotes: "",
  };
}

export function hydrateTools4MusicFields(track: {
  royaltyStreamsTarget?: string;
  royaltySplitPercent?: string;
  royaltySyncFeeBand?: string;
  delayMs?: string;
  productionNotes?: string;
}) {
  return {
    royaltyStreamsTarget: track.royaltyStreamsTarget ?? "",
    royaltySplitPercent: track.royaltySplitPercent ?? "",
    royaltySyncFeeBand: track.royaltySyncFeeBand ?? "",
    delayMs: track.delayMs ?? "",
    productionNotes: track.productionNotes ?? "",
  };
}

export function mergeProductionNotes(opts: {
  previous: string;
  explicit: string;
  bpm: string;
  delayMs: string;
}) {
  if (opts.explicit.trim()) return opts.explicit.trim();
  const bits: string[] = [];
  if (opts.bpm.trim()) bits.push(`${opts.bpm.trim()} BPM`);
  if (opts.delayMs.trim()) bits.push(`Delay ${opts.delayMs.trim()} ms`);
  if (!bits.length) return opts.previous;
  let next = opts.previous.trim();
  for (const bit of bits) {
    if (!next.toLowerCase().includes(bit.toLowerCase())) {
      next = next ? `${next} · ${bit}` : bit;
    }
  }
  return next;
}
