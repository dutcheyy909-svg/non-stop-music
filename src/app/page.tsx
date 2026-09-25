import Link from "next/link";
import { BrandLockup } from "@/components/BrandLockup";
import { Kpi, Panel } from "@/components/Ui";
import { PitchForm } from "@/components/PitchForm";
import { readStore } from "@/lib/store";

export default async function DashboardPage() {
  const store = await readStore();
  const pipelineValue = store.opportunities.reduce((sum, item) => sum + item.forecastGbp, 0);
  const conversion =
    store.placements.length && store.pitches.length
      ? Math.round((store.placements.length / (store.pitches.length + store.placements.length)) * 100)
      : store.placements.length
        ? 100
        : 0;
  const targets = [
    ...store.radioStations.map((s) => `Radio · ${s.name}`),
    ...store.playlists.map((p) => `Playlist · ${p.name}`),
    ...store.supervisors.map((s) => `Supervisor · ${s.name}`),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-5 rounded-3xl border border-fuchsia-400/30 bg-black/40 p-6 md:flex-row md:items-center">
        <BrandLockup size={120} />
        <div>
          <p className="text-xs tracking-[0.25em] text-fuchsia-300">MORE THAN MUSIC</p>
          <h1 className="mt-1 text-3xl font-semibold">Dutcheyy Records · Levitate</h1>
          <p className="mt-2 max-w-2xl text-zinc-400">
            One desk: master-file radio, Spotify playlist stubs, sync briefs, catalogue and EPK pitches.
          </p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Kpi label="Opportunities" value={store.opportunities.length} hint="Live briefs" />
        <Kpi label="Pipeline value" value={`£${pipelineValue.toLocaleString()}`} hint="Listed fees" />
        <Kpi label="Conversion" value={`${conversion}%`} hint="Placements vs pitches" />
        <Kpi label="A&R prospects" value={store.prospects.length} />
        <Kpi label="Radio + playlists" value={store.radioStations.length + store.playlists.length} />
      </div>
      <Panel title="Unified pitch (radio · playlist · supervisor)">
        <PitchForm
          tracks={store.tracks}
          targets={targets}
          channel="other"
          defaultNotes="EPK + track from the merged Levitate / Non-Stop desk."
        />
      </Panel>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Engine monitor">
          <ul className="space-y-3">
            {store.monitorActions.map((action) => (
              <li key={action.id}>
                <Link href={action.href} className="block rounded-xl border border-white/10 p-3 hover:border-fuchsia-400/40">
                  <p className="font-medium">{action.title}</p>
                  <p className="text-sm text-zinc-400">{action.reason}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Loaded from master file">
          <p className="text-4xl font-semibold text-fuchsia-200">{store.radioStations.length}</p>
          <p className="text-sm text-zinc-400">radio stations</p>
          <p className="mt-4 text-4xl font-semibold">{store.playlists.length}</p>
          <p className="text-sm text-zinc-400">playlist / library pitch targets</p>
          <p className="mt-4 text-4xl font-semibold">{store.supervisors.length}</p>
          <p className="text-sm text-zinc-400">supervisors</p>
        </Panel>
      </div>
    </div>
  );
}
