import { DataTable, WebLink } from "@/components/DataTable";
import { Kpi, Panel } from "@/components/Ui";
import { importThatPitchPlacements } from "@/lib/actions";
import { moneyGbp, summarisePipeline } from "@/lib/pipeline";
import { readStore } from "@/lib/store";

export default async function PipelinePage() {
  const store = await readStore();
  const pipeline = summarisePipeline(store);
  const thatPitch = store.placements.filter((item) => item.source === "that-pitch");
  const paid = store.placements.filter((item) => item.paymentReceived && item.paymentReceived !== "—").length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Sync Pipeline</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Kpi label="Open briefs" value={pipeline.openCount} />
        <Kpi label="Logged pitches" value={store.pitches.length} />
        <Kpi label="That Pitch rows" value={thatPitch.length} />
        <Kpi label="Cash listed" value={moneyGbp(pipeline.cashListed)} hint="Not won" />
        <Kpi label="Fit-weighted" value={moneyGbp(pipeline.weighted)} hint="Cash × fit %" />
      </div>
      <p className="text-sm text-zinc-500">
        {pipeline.cashCount} cash-listed briefs, {pipeline.splitCount} split deals, {pipeline.tbcCount} fee TBC.
        Cash listed is the pound figure on the listing. Fit-weighted knocks that down by how well the vault matches.
      </p>

      <Panel
        title="That Pitch — library placements"
        action={
          <a
            href="https://app.thatpitch.com/dashboard"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-medium hover:bg-fuchsia-500"
          >
            Open That Pitch dashboard
          </a>
        }
      >
        <p className="mb-3 text-sm text-zinc-400">
          That Pitch has no public API. Copy the placements table from{" "}
          <a className="text-fuchsia-300 underline" href="https://app.thatpitch.com/dashboard" target="_blank" rel="noreferrer">
            app.thatpitch.com/dashboard
          </a>{" "}
          (or export CSV) and paste it here. Header row required. Tracked separately from master-workbook placements.
          {paid ? ` ${paid} master rows already show a payment received flag.` : ""}
        </p>
        <form action={importThatPitchPlacements} className="grid gap-3">
          <textarea
            name="thatPitchTable"
            required
            rows={8}
            placeholder={"Track,Artist,Library,Status,Date,Income\nSICK-live,DUTCHEYY,Epidemic,Accepted,2026-09-01,£0"}
            className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 font-mono text-sm"
          />
          <button className="w-fit rounded-lg bg-fuchsia-600 px-4 py-2 font-medium hover:bg-fuchsia-500">
            Import That Pitch placements
          </button>
        </form>
      </Panel>

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
          <p className="text-zinc-400">No pitches yet. Send from Outreach, Radio, Playlists, or Opportunity Finder.</p>
        )}
      </Panel>
      <Panel title="Placements (master + That Pitch)">
        <DataTable
          headers={[
            "Source",
            "Track",
            "Artist",
            "Library",
            "Client / brand",
            "Supervisor / contact",
            "Usage",
            "Air / publish date",
            "End date",
            "Publishing fee",
            "Master fee",
            "Cue fee",
            "Income / placement",
            "ISRC",
            "Invoice no.",
            "Payment received",
            "Link",
          ]}
          rows={store.placements.map((item) => [
            item.source || "master",
            item.trackTitle,
            item.artist,
            item.library || item.production || "—",
            item.clientBrand || "—",
            item.supervisorContact || "—",
            item.usage || "—",
            item.airPublishDate || "—",
            item.endDate || "—",
            item.publishingFee || "—",
            item.masterFee || "—",
            item.cueFee || "—",
            item.incomePerPlacement || "—",
            item.isrc || "—",
            item.invoiceNo || "—",
            item.paymentReceived || "—",
            <WebLink key={`${item.id}-src`} href={item.sourceUrl} />,
          ])}
        />
      </Panel>
    </div>
  );
}
