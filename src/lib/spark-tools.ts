export type SparkTool = {
  id: string;
  name: string;
  kind: "lists" | "map" | "scan";
  blurb: string;
  how: string;
  url: string;
  cta: string;
};

export const sparkSuiteName = "Non-Stop Spark";

export const sparkTools: SparkTool[] = [
  {
    id: "spark-lists",
    name: "Spark Lists",
    kind: "lists",
    blurb: "AI playlist builder. Seed a catalogue cut or a reference track and pull a related listening list for pitching and research.",
    how: "Paste a song or artist, generate, then copy the neighbours that fit Dutcheyy Records.",
    url: "https://www.chosic.com/playlist-generator/",
    cta: "Open Spark Lists",
  },
  {
    id: "spark-atlas",
    name: "Spark Atlas",
    kind: "map",
    blurb: "Artist neighbourhood map. See who sits next to a vault artist so you know which playlists and blogs to hit.",
    how: "Type an artist. Closer nodes are stronger neighbours — use those names in pitches.",
    url: "https://www.music-map.com/",
    cta: "Open Spark Atlas",
  },
  {
    id: "spark-kin",
    name: "Spark Kin",
    kind: "lists",
    blurb: "Find songs that sit next to a seed track — extra playlist ideas when Spark Lists is thin.",
    how: "Search a title, grab similar songs, then check Atlas for the artist cluster.",
    url: "https://www.chosic.com/music-similar-songs-finder/",
    cta: "Open Spark Kin",
  },
  {
    id: "spark-pulse",
    name: "Spark Pulse",
    kind: "scan",
    blurb: "Read a Spotify playlist’s shape (mood, energy, overlap) before you pitch the vault into it.",
    how: "Paste a playlist URL from Playlist Intelligence or Promotion.",
    url: "https://www.chosic.com/spotify-playlist-analyzer/",
    cta: "Open Spark Pulse",
  },
  {
    id: "spark-grid",
    name: "Spark Grid",
    kind: "scan",
    blurb: "Genre tags for a track or playlist — useful for sync metadata and curator targeting.",
    how: "Run a title, then copy genres into Metadata Centre.",
    url: "https://www.chosic.com/music-genre-finder/",
    cta: "Open Spark Grid",
  },
];

export function sparkAtlasUrl(artist: string) {
  const slug = artist.trim().toLowerCase().replace(/\s+/g, "+");
  return slug ? `https://www.music-map.com/${slug}` : "https://www.music-map.com/";
}
