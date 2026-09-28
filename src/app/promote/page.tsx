import { DataTable, WebLink } from "@/components/DataTable";
import { Kpi, Panel } from "@/components/Ui";
import { importSafariBookmarks, pushToPlaylist } from "@/lib/actions";
import { readStore } from "@/lib/store";

export default async function PromotePage() {
  const store = await readStore();
  const pushes = store.pitches.filter((pitch) => pitch.channel === "playlist");
  const withSpotify = store.playlists.filter((item) => item.spotifyUrl || item.deepLink).length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-[0.25em] text-fuchsia-300">SPOTIFY</p>
        <h1 className="mt-1 text-3xl font-semibold">Promotion — playlist push</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">
          Pitch a catalogue cut at Spotify editorial via for Artists, then push the same track at independent
          curators from your master playlist sheet. Research neighbours in{" "}
          <a className="text-fuchsia-300 underline" href="/spark">
            Non-Stop Spark
          </a>
          . Each push is logged in the pipeline.
        </p>
      </div>

      <Panel title="Import Safari Favourites">
        <p className="mb-3 text-sm text-zinc-400">
          Safari File → Export Bookmarks, then upload the HTML. Free Spotify playlist links and submit pages are
          merged into this board.
        </p>
        <form action={importSafariBookmarks} className="flex flex-wrap items-center gap-3">
          <input type="file" name="bookmarks" accept=".html,text/html" required className="text-sm" />
          <button className="rounded-lg border border-fuchsia-400/40 px-4 py-2 text-sm">Import bookmarks</button>
        </form>
      </Panel>

      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi label="Catalogue cuts" value={store.tracks.length} />
        <Kpi label="Playlist targets" value={store.playlists.length} />
        <Kpi label="With Spotify / deep link" value={withSpotify} />
      </div>

      <Panel
        title="1. Official Spotify editorial"
        action={
          <a
            href="https://artists.spotify.com/c/playlist/pitch"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-[#1DB954] px-4 py-2 text-sm font-semibold text-black"
          >
            Open Spotify for Artists pitch
          </a>
        }
      >
        <p className="text-sm text-zinc-400">
          This is the only way onto official Spotify playlists (New Music Friday, Dance Hits, etc.). Use the
          track&apos;s Spotify URI from the vault, pick markets, and submit from the artist account. Marquee ads
          are separate paid promotion inside for Artists.
        </p>
      </Panel>

      <Panel title="2. Push to independent Spotify curators">
        <form action={pushToPlaylist} className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            Track
            <select name="trackId" required className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2">
              {store.tracks.map((track) => (
                <option key={track.id} value={track.id}>
                  {track.title} — {track.artist}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Playlist / curator
            <select name="playlistId" required className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2">
              {store.playlists.map((playlist) => (
                <option key={playlist.id} value={playlist.id}>
                  {playlist.name}
                  {playlist.country ? ` · ${playlist.country}` : ""}
                  {playlist.genre ? ` · ${playlist.genre}` : ""}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm md:col-span-2">
            Pitch note
            <textarea
              name="notes"
              rows={4}
              defaultValue="Hi — pitching this DUTCHEYY RECORDS cut for your Spotify playlist. EPK + stream links in Non-Stop. Please add if it fits."
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2"
            />
          </label>
          <button className="rounded-lg bg-fuchsia-600 px-4 py-2 font-medium hover:bg-fuchsia-500 md:col-span-2">
            Log playlist push (opens submit URL in notes)
          </button>
        </form>
      </Panel>

      <Panel title="Curator board">
        <DataTable
          headers={["Curator", "Country", "Genre", "Submit", "Spotify", "Deep link"]}
          rows={store.playlists.slice(0, 80).map((playlist) => [
            playlist.name,
            playlist.country || "—",
            playlist.genre,
            <WebLink key={`${playlist.id}-u`} href={playlist.url} label="Submit" />,
            <WebLink
              key={`${playlist.id}-s`}
              href={playlist.spotifyUrl}
              label={playlist.spotifyUrl ? "Open playlist" : undefined}
            />,
            playlist.deepLink || "—",
          ])}
        />
        <p className="mt-2 text-xs text-zinc-500">Showing 80 of {store.playlists.length}. Full list: Playlist Intelligence.</p>
      </Panel>

      <Panel title="Logged Spotify playlist pushes">
        {pushes.length ? (
          <DataTable
            headers={["When", "Track", "Playlist", "Status", "Follow-up"]}
            rows={pushes.map((pitch) => [
              pitch.createdAt.slice(0, 10),
              pitch.trackTitle,
              pitch.targetName,
              pitch.status,
              pitch.followUpAt,
            ])}
          />
        ) : (
          <p className="text-zinc-400">No playlist pushes yet. Submit editorial, then log independent curator sends here.</p>
        )}
      </Panel>
    </div>
  );
}
