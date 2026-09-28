import { DataTable, WebLink } from "@/components/DataTable";
import { Kpi, Panel } from "@/components/Ui";
import { applyMasteringToTrack, scanMasteringAdvice } from "@/lib/actions";
import { masteringPresets } from "@/lib/mastering";
import { readStore } from "@/lib/store";

export default async function MasteringPage() {
  const store = await readStore();
  const applied = store.tracks.filter((track) => track.masteringTarget).length;
  const advice = store.masteringAdvice ?? [];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-[0.25em] text-fuchsia-300">STUDIO</p>
        <h1 className="mt-1 text-3xl font-semibold">AI Mastering suite</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">
          Scan public mastering guidance (LUFS, true peak, EDM club vs streaming), then write a destination chain onto
          a catalogue cut. This does not bounce a WAV — it is the brief you take into Ozone, LANDR, or an engineer.
          Add a Tavily key as <code className="text-fuchsia-200">TAVILY_API_KEY</code> for deeper search; otherwise DuckDuckGo is used.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi label="Web hits stored" value={advice.length} />
        <Kpi label="Cuts with a target" value={applied} />
        <Kpi label="Destinations" value={masteringPresets.length} />
      </div>

      <Panel title="1. Scan the internet">
        <form action={scanMasteringAdvice} className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            name="query"
            defaultValue="dark driving EDM vocal mastering LUFS true peak Spotify club 2026"
            className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2"
          />
          <button className="rounded-lg bg-fuchsia-600 px-4 py-2 font-medium hover:bg-fuchsia-500">Scan recommendations</button>
        </form>
      </Panel>

      <Panel title="2. Destination presets (sourced public guidance)">
        <DataTable
          headers={["Destination", "LUFS", "True peak", "Notes", "Source"]}
          rows={masteringPresets.map((preset) => [
            preset.name,
            preset.lufs,
            preset.truePeak,
            preset.notes,
            <WebLink key={preset.id} href={preset.sourceUrl} label="Open" />,
          ])}
        />
      </Panel>

      <Panel title="3. Input onto a catalogue cut">
        <form action={applyMasteringToTrack} className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            Track
            <select name="trackId" required className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2">
              {store.tracks.map((track) => (
                <option key={track.id} value={track.id}>
                  {track.title} — {track.artist}
                  {track.masteringTarget ? ` (${track.masteringTarget})` : ""}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Destination
            <select name="presetId" required className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2">
              {masteringPresets.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>
          </label>
          <button className="rounded-lg bg-fuchsia-600 px-4 py-2 font-medium hover:bg-fuchsia-500 md:col-span-2">
            Apply scan + destination to track
          </button>
        </form>
      </Panel>

      <Panel title="Web scan results">
        {advice.length ? (
          <DataTable
            headers={["When", "Query", "Title", "LUFS found", "True peak", "Snippet", "Source"]}
            rows={advice.map((hit) => [
              hit.scannedAt.slice(0, 16).replace("T", " "),
              hit.query,
              hit.title,
              hit.lufs || "—",
              hit.truePeak || "—",
              hit.snippet,
              <WebLink key={hit.id} href={hit.url} label="Open" />,
            ])}
          />
        ) : (
          <p className="text-sm text-zinc-400">No scan yet. Run a query above.</p>
        )}
      </Panel>

      <Panel title="Vault mastering targets">
        <DataTable
          headers={["Track", "Destination", "LUFS", "True peak", "Chain"]}
          rows={store.tracks.map((track) => [
            track.title,
            track.masteringTarget || "—",
            track.masteringLufs || "—",
            track.masteringTruePeak || "—",
            track.masteringNotes || "—",
          ])}
        />
      </Panel>
    </div>
  );
}
