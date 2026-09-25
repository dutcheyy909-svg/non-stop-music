import { DataTable } from "@/components/DataTable";
import { Panel } from "@/components/Ui";
import { readStore } from "@/lib/store";

export default async function CatalogPage() {
  const store = await readStore();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Catalogue Vault</h1>
      <p className="text-zinc-400">
        Cuts inferred from master placements. Upload audio later — metadata is first-class for the engine.
      </p>
      <Panel title={`${store.tracks.length} works`}>
        <DataTable
          headers={["Title", "Artist", "Genre", "Mood", "ISRC", "Rights", "Tags"]}
          rows={store.tracks.map((t) => [
            t.title,
            t.artist,
            t.genre,
            t.mood,
            t.isrc || "missing",
            t.rights,
            t.tags.join(", "),
          ])}
        />
      </Panel>
    </div>
  );
}
