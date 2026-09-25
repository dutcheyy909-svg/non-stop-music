import { DataTable } from "@/components/DataTable";
import { Kpi, Panel } from "@/components/Ui";
import { readStore } from "@/lib/store";

export default async function PipelinePage() {
  const store = await readStore();
  const value = store.opportunities.reduce((sum, item) => sum + item.forecastGbp, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Sync Pipeline</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi label="Open briefs" value={store.opportunities.length} />
        <Kpi label="Logged pitches" value={store.pitches.length} />
        <Kpi label="Forecast" value={`£${value.toLocaleString()}`} />
      </div>
      <Panel title="Pitches">
        {store.pitches.length ? (
          <DataTable
            headers={["When", "Track", "Target", "Channel", "Status", "Follow-up"]}
            rows={store.pitches.map((pitch) => [
              pitch.createdAt.slice(0, 10),
              pitch.trackTitle,
              pitch.targetName,
              pitch.channel,
              pitch.status,
              pitch.followUpAt,
            ])}
          />
        ) : (
          <p className="text-zinc-400">No pitches yet. Send from Radio, Playlists, or Opportunity Finder.</p>
        )}
      </Panel>
      <Panel title="Placements from master">
        <DataTable
          headers={["Track", "Artist", "Library / playlist", "Date"]}
          rows={store.placements.map((item) => [
            item.trackTitle,
            item.artist,
            item.library || item.production || item.playlist,
            item.date,
          ])}
        />
      </Panel>
    </div>
  );
}
