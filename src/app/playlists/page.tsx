import { DataTable, WebLink } from "@/components/DataTable";
import { PitchForm } from "@/components/PitchForm";
import { Panel } from "@/components/Ui";
import { readStore } from "@/lib/store";

export default async function PlaylistsPage() {
  const store = await readStore();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Playlist Intelligence</h1>
        <p className="mt-2 text-zinc-400">
          {store.playlists.length} curator rows from the master <code>spotify playlists</code> sheet, with submission
          URL plus a Spotify / deep link when the URL is a playlist. Analyse numbers in{" "}
          <a className="text-fuchsia-300 underline" href="/analyser">
            Playlist analyser
          </a>{" "}
          then pitch from{" "}
          <a className="text-fuchsia-300 underline" href="/spark">
            Non-Stop Spark
          </a>
          .
        </p>
      </div>
      <PitchForm
        tracks={store.tracks}
        targets={store.playlists.map((p) => p.name)}
        channel="playlist"
        defaultNotes="Playlist pitch with EPK + track listen link."
      />
      <Panel title="Targets">
        <DataTable
          headers={["Curator", "Country", "Genre", "Status", "Submission URL", "Spotify", "Deep link"]}
          rows={store.playlists.map((p) => [
            p.name,
            p.country || "—",
            p.genre,
            p.status,
            <WebLink key={`${p.id}-u`} href={p.url} />,
            <WebLink key={`${p.id}-s`} href={p.spotifyUrl} label={p.spotifyUrl ? "Open Spotify" : undefined} />,
            p.deepLink || "—",
          ])}
        />
      </Panel>
    </div>
  );
}
