import Link from "next/link";
import { DataTable, WebLink } from "@/components/DataTable";
import { Panel } from "@/components/Ui";
import { readStore } from "@/lib/store";

export default async function CatalogPage() {
  const store = await readStore();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Catalogue Vault</h1>
      <p className="text-zinc-400">
        Cuts inferred from master placements. Upload audio later — metadata is first-class for the engine. Royalty and
        studio numbers come from{" "}
        <Link href="/tools4music" className="text-fuchsia-300 underline">
          Tools 4 Music
        </Link>
        .
      </p>
      <Panel title={`${store.tracks.length} works`}>
        <DataTable
          headers={[
            "Title",
            "Artist",
            "Genre",
            "ISRC",
            "Streams goal",
            "Split %",
            "Sync fee",
            "BPM",
            "Delay",
            "Notes",
            "Pre-release",
          ]}
          rows={store.tracks.map((t) => [
            <Link key={t.id} href={`/tools4music?track=${t.id}`} className="text-fuchsia-200 underline">
              {t.title}
            </Link>,
            t.artist,
            t.genre,
            t.isrc || "missing",
            t.royaltyStreamsTarget || "—",
            t.royaltySplitPercent || "—",
            t.royaltySyncFeeBand || "—",
            t.bpm || "—",
            t.delayMs || "—",
            t.productionNotes || "—",
            <WebLink key={`${t.id}-pre`} href={t.preReleaseLink} label="Open" />,
          ])}
        />
      </Panel>
    </div>
  );
}
