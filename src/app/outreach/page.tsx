import { DataTable } from "@/components/DataTable";
import { PitchForm } from "@/components/PitchForm";
import { Panel } from "@/components/Ui";
import { draftRadioPitch, suggestStations } from "@/lib/engine";
import { readStore } from "@/lib/store";

export default async function OutreachPage() {
  const store = await readStore();
  const suggested = suggestStations(store);
  const top = suggested[0]?.station;
  const draft = top && store.tracks[0] ? draftRadioPitch(store, top.id, store.tracks[0].id) : "";
  const targets = [
    ...store.radioStations.map((s) => `Radio · ${s.name}`),
    ...store.playlists.map((p) => `Playlist · ${p.name}`),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Outreach desk</h1>
        <p className="mt-2 text-zinc-400">
          Radio Database and playlist/library targets from the same master file. One send logs EPK + track in
          the pipeline.
        </p>
      </div>
      <PitchForm tracks={store.tracks} targets={targets} channel="radio" defaultNotes={draft} />
      <Panel title="Radio (master file)">
        <DataTable
          headers={["Station", "Country", "Type", "Contact"]}
          rows={store.radioStations.slice(0, 40).map((s) => [
            s.name,
            s.country,
            s.stationType,
            s.contact || "—",
          ])}
        />
        <p className="mt-2 text-xs text-zinc-500">Showing 40 of {store.radioStations.length}. Full list on /radio.</p>
      </Panel>
      <Panel title="Spotify / playlist pitch targets">
        <DataTable
          headers={["Name", "Platform", "Curator", "Status"]}
          rows={store.playlists.map((p) => [p.name, p.platform, p.curator, p.status])}
        />
      </Panel>
    </div>
  );
}
