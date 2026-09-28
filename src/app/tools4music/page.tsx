import { SparkDesk } from "@/app/spark/SparkDesk";
import { Tools4MusicSaveForm } from "@/components/Tools4MusicSaveForm";
import { PpcLink, PpcPageHit } from "@/components/PpcLink";
import { Kpi, Panel } from "@/components/Ui";
import { readStore } from "@/lib/store";
import { tools4MusicColumns, tools4MusicHome } from "@/lib/tools4music";

export default async function Tools4MusicPage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string }>;
}) {
  const { track: trackId } = await searchParams;
  const store = await readStore();
  const selected = store.tracks.find((item) => item.id === trackId) ?? store.tracks[0];
  const withRoyalty = store.tracks.filter((item) => item.royaltyStreamsTarget || item.royaltySyncFeeBand).length;
  const withStudio = store.tracks.filter((item) => item.bpm || item.delayMs).length;

  return (
    <div className="space-y-6">
      <PpcPageHit page="/tools4music" />
      <div>
        <p className="text-xs tracking-[0.25em] text-fuchsia-300">TOOLS 4 MUSIC</p>
        <h1 className="mt-1 text-3xl font-semibold">Tools 4 Music</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">
          Pick a vault cut, run a calculator on{" "}
          <a className="text-fuchsia-300 underline" href={tools4MusicHome} target="_blank" rel="noreferrer">
            tools4music.com
          </a>
          , then save streams-to-goal, split %, sync fee band, BPM and delay onto that track.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi label="Cuts with royalty numbers" value={withRoyalty} />
        <Kpi label="Cuts with BPM / delay" value={withStudio} />
        <Kpi
          label="On this cut"
          value={selected?.royaltyStreamsTarget || selected?.bpm || "—"}
          hint={selected ? `${selected.title} · ${selected.royaltySyncFeeBand || "no fee band"}` : "No vault yet"}
        />
      </div>

      <Panel title="1. Pick a vault track and save the numbers">
        <Tools4MusicSaveForm tracks={store.tracks} selected={selected} loadPath="/tools4music" />
      </Panel>

      <Panel
        title="2. Desk"
        action={<PpcLink href={tools4MusicHome} label="Open tools4music.com" page="/tools4music" />}
      >
        <SparkDesk
          tool={{
            id: "t4m-home",
            name: "Tools 4 Music",
            kind: "scan",
            blurb: "",
            how: "",
            url: tools4MusicHome,
            cta: "Open Tools 4 Music",
          }}
          page="/tools4music"
        />
      </Panel>

      <div className="grid gap-4 lg:grid-cols-4">
        {tools4MusicColumns.map((column) => (
          <section
            key={column.id}
            id={column.id}
            className="rounded-2xl border border-white/10 bg-black/35 p-4"
          >
            <p className="text-[10px] tracking-[0.2em] text-fuchsia-300">{column.title.toUpperCase()}</p>
            <h2 className="mt-1 text-lg font-semibold">{column.title}</h2>
            <p className="mt-2 text-sm text-zinc-400">{column.blurb}</p>
            <ul className="mt-4 space-y-3">
              {column.tools.map((tool) => (
                <li key={tool.id} className="rounded-xl border border-white/10 bg-black/40 p-3">
                  <p className="font-medium">{tool.name}</p>
                  <p className="mt-1 text-xs text-zinc-500">{tool.blurb}</p>
                  <p className="mt-2">
                    <PpcLink href={tool.path} label="Open" page="/tools4music" />
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
