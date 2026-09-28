export function playlistDeepLink(url: unknown) {
  const raw = typeof url === "string" ? url : "";
  const id = raw.match(/playlist\/([a-zA-Z0-9]+)/i)?.[1];
  if (!id) {
    return {
      spotifyUrl: raw.startsWith("http") ? raw : "",
      deepLink: raw.startsWith("spotify:") ? raw : "",
    };
  }
  return {
    spotifyUrl: `https://open.spotify.com/playlist/${id}`,
    deepLink: `spotify:playlist:${id}`,
  };
}

const knownPlaylists: Record<string, string> = {
  "trap nation": "https://open.spotify.com/playlist/0NCspsyf0OS4BsPgGhkQXM",
};

export function knownSpotifyPlaylist(name: unknown) {
  const key = typeof name === "string" ? name.trim().toLowerCase() : "";
  return knownPlaylists[key] || "";
}
