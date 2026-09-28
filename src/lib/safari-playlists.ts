import { playlistDeepLink } from "./spotify";
import { slugId, text } from "./ids";
import type { PlaylistTarget } from "./types";

export function parseBookmarkFile(html: string): PlaylistTarget[] {
  const hrefs = [...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([^<]*)/gi)];
  const out: PlaylistTarget[] = [];
  const seen = new Set<string>();
  let i = 0;
  for (const match of hrefs) {
    const url = text(match[1]);
    const title = text(match[2]) || url;
    const lower = url.toLowerCase();
    const isPlaylist =
      /open\.spotify\.com\/playlist\//.test(lower) ||
      lower.startsWith("spotify:playlist:") ||
      /submithub\.com|groover\.co|submitlink\.io|playlistdock\.com|dailyplaylists|hypeddit\.com/.test(lower);
    if (!isPlaylist) continue;
    const key = lower.split("?")[0];
    if (seen.has(key)) continue;
    seen.add(key);
    const links = playlistDeepLink(url);
    out.push({
      id: slugId("safari", title, i),
      name: title.slice(0, 80) || "Safari playlist",
      platform: links.deepLink ? "Spotify (Safari favourite)" : "Playlist submit (Safari favourite)",
      curator: title.slice(0, 80),
      genre: "From Safari Favourites",
      followers: "",
      url,
      spotifyUrl: links.spotifyUrl,
      deepLink: links.deepLink,
      email: "",
      country: "",
      status: "safari-import",
      notes: "Imported from Safari bookmarks export. Confirm it is a free submission route before pitching.",
      sourcePlacement: "Safari Favourites",
    });
    i += 1;
  }
  return out;
}
