import Link from "next/link";
import { BrandLockup } from "@/components/BrandLockup";
import { DataTable } from "@/components/DataTable";
import { Kpi, Panel } from "@/components/Ui";
import { PitchForm } from "@/components/PitchForm";
import { collectCalendarEvents, googleTemplateUrl, upcomingEvents } from "@/lib/calendar";
import { readStore } from "@/lib/store";

export default async function DashboardPage() {
  const store = await readStore();
  const pipelineValue = store.opportunities.reduce((sum, item) => sum + item.forecastGbp, 0);
  const withRoyalty = store.tracks.filter((t) => t.royaltyStreamsTarget || t.royaltySyncFeeBand);
  const withStudio = store.tracks.filter((t) => t.bpm || t.delayMs);
  const calendarSoon = upcomingEvents(collectCalendarEvents(store), undefined, 6);
  const targets = [
    ...store.radioStations.map((s) => `Radio · ${s.name}`),
    ...store.playlists.map((p) => `Playlist · ${p.name}`),
    ...store.supervisors.map((s) =>
      s.organisation ? `${s.name} — ${s.organisation}` : s.name,
    ),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-5 rounded-3xl border border-fuchsia-400/30 bg-black/40 p-6 md:flex-row md:items-center">
        <BrandLockup size={120} />
        <div>
          <p className="text-xs tracking-[0.25em] text-fuchsia-300">MORE THAN MUSIC</p>
          <h1 className="mt-1 text-3xl font-semibold">Dutcheyy Records · Non-Stop</h1>
          <p className="mt-2 max-w-2xl text-zinc-400">
            Catalogue is the vault. Tools 4 Music numbers (streams goal, split, sync fee, BPM, delay) save onto each
            cut and show here.{" "}
            <Link href="/tools4music" className="text-fuchsia-300 underline">
              Save estimates
            </Link>
          </p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Kpi label="Opportunities" value={store.opportunities.length} hint="Live briefs" />
        <Kpi label="Pipeline value" value={`£${pipelineValue.toLocaleString("en-GB")}`} hint="Listed fees" />
        <Kpi
          label="Cuts with royalty numbers"
          value={withRoyalty.length}
          hint={`${store.tracks.length - withRoyalty.length} still empty`}
        />
        <Kpi label="Cuts with BPM / delay" value={withStudio.length} hint="Studio maths from Tools 4 Music" />
        <Kpi label="Radio + playlists" value={store.radioStations.length + store.playlists.length} />
      </div>

      <Panel
        title="Tools 4 Music on the vault"
        action={
          <Link href="/tools4music" className="text-sm text-fuchsia-300 underline">
            Open desk
          </Link>
        }
      >
        <DataTable
          headers={["Track", "Streams to goal", "Split %", "Sync fee band", "BPM", "Delay", "Notes"]}
          rows={store.tracks.map((t) => [
            <Link key={t.id} href={`/tools4music?track=${t.id}`} className="text-fuchsia-200 underline">
              {t.title}
            </Link>,
            t.royaltyStreamsTarget || "—",
            t.royaltySplitPercent || "—",
            t.royaltySyncFeeBand || "—",
            t.bpm || "—",
            t.delayMs || "—",
            t.productionNotes || "—",
          ])}
        />
      </Panel>

      <Panel
        title="Coming up"
        action={
          <Link href="/calendar" className="text-sm text-fuchsia-300 underline">
            Calendar + Google
          </Link>
        }
      >
        {calendarSoon.length ? (
          <ul className="space-y-2">
            {calendarSoon.map((event) => (
              <li key={event.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2 last:border-0">
                <div>
                  <p className="text-xs text-fuchsia-300">
                    {event.date}
                    {event.time ? ` · ${event.time}` : ""}
                  </p>
                  <p className="text-sm">{event.title}</p>
                </div>
                <a
                  href={googleTemplateUrl(event)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-fuchsia-200 underline"
                >
                  Add to Google
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-500">
            No dated follow-ups yet.{" "}
            <Link href="/calendar" className="text-fuchsia-300 underline">
              Add a reminder
            </Link>
            .
          </p>
        )}
      </Panel>

      <Panel title="Unified pitch (radio · playlist · supervisor)">
        <PitchForm
          tracks={store.tracks}
          targets={targets}
          channel="other"
          defaultNotes="EPK + track from the Non-Stop desk."
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
