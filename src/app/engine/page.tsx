import { Panel } from "@/components/Ui";
import { suggestStations } from "@/lib/engine";
import { readStore } from "@/lib/store";

export default async function EnginePage() {
  const store = await readStore();
  const stations = suggestStations(store);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">AI Engine</h1>
        <p className="mt-2 text-zinc-400">
          Help, track and monitor using catalogue metadata, radio rows, briefs and listen outcomes. Brian AI
          from the master file lands here as the rule log.
        </p>
      </div>
      <Panel title="Next actions">
        <ul className="space-y-3">
          {store.monitorActions.map((item) => (
            <li key={item.id} className="rounded-xl border border-white/10 p-3">
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-zinc-400">{item.reason}</p>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Metadata-ranked radio">
        <ol className="space-y-2 text-sm">
          {stations.map((row) => (
            <li key={row.station.id}>
              <span className="text-fuchsia-300">{row.score}</span> — {row.station.name} ({row.station.country})
            </li>
          ))}
        </ol>
      </Panel>
    </div>
  );
}
