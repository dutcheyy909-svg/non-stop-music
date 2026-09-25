import { DataTable } from "@/components/DataTable";
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
          Spotify pitch playlists are stubbed from the Placements sheet in the master file. When you send the
          dedicated playlist tab, Data Management will replace this list.
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
          headers={["Name", "Platform", "Curator", "Status", "Notes"]}
          rows={store.playlists.map((p) => [p.name, p.platform, p.curator, p.status, p.notes])}
        />
      </Panel>
    </div>
  );
}
