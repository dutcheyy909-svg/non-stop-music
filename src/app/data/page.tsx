import { resetFromMaster } from "@/lib/actions";
import { Panel } from "@/components/Ui";
import { readStore } from "@/lib/store";

export default async function DataPage() {
  const store = await readStore();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Data Management</h1>
      <p className="text-zinc-400">
        Live workspace is <code className="text-fuchsia-200">data/store.json</code>. Canonical extract from the
        master workbook is <code className="text-fuchsia-200">data/master-import.json</code> (Radio Database,
        Music Supervisors, Sync Briefs, Placements).
      </p>
      <Panel title="Current counts">
        <ul className="grid gap-2 sm:grid-cols-2 text-sm">
          <li>Radio stations: {store.radioStations.length}</li>
          <li>Supervisors: {store.supervisors.length}</li>
          <li>Opportunities: {store.opportunities.length}</li>
          <li>Playlists / pitch targets: {store.playlists.length}</li>
          <li>Catalogue works: {store.tracks.length}</li>
          <li>Pitches: {store.pitches.length}</li>
        </ul>
      </Panel>
      <Panel title="Spotify playlist sheet">
        <p className="text-sm text-zinc-400">
          Playlist Intelligence currently uses placement names. To load the full Spotify pitch-playlist
          metadata from the master file, add or replace rows in master-import.json under a future
          `playlists` key, then reset.
        </p>
      </Panel>
      <form action={resetFromMaster}>
        <button className="rounded-lg bg-fuchsia-600 px-4 py-2 font-medium hover:bg-fuchsia-500">
          Reset workspace from master import
        </button>
      </form>
    </div>
  );
}
