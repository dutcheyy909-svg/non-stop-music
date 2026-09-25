import { DataTable } from "@/components/DataTable";
import { Panel } from "@/components/Ui";
import { readStore } from "@/lib/store";

export default async function MetadataPage() {
  const store = await readStore();
  const missing = store.tracks.filter((t) => !t.isrc).length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Metadata Centre</h1>
      <p className="text-zinc-400">
        {missing} works still need ISRC. The engine uses genre, mood and tags to score briefs and radio.
      </p>
      <Panel title="Vault metadata health">
        <DataTable
          headers={["Title", "ISRC", "Writers", "Tags", "Rights"]}
          rows={store.tracks.map((t) => [
            t.title,
            t.isrc || "MISSING",
            t.writers,
            t.tags.join(" · "),
            t.rights,
          ])}
        />
      </Panel>
    </div>
  );
}
