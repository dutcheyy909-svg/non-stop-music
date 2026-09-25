import { DataTable } from "@/components/DataTable";
import { Panel } from "@/components/Ui";
import { PitchForm } from "@/components/PitchForm";
import { matchOpportunities } from "@/lib/engine";
import { readStore } from "@/lib/store";

export default async function OpportunitiesPage() {
  const store = await readStore();
  const rows = matchOpportunities(store);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Opportunity Finder</h1>
        <p className="mt-2 text-zinc-400">
          Sync briefs from the master file, scored against catalogue metadata. Weekly refresh can replace this JSON feed later.
        </p>
      </div>
      <PitchForm
        tracks={store.tracks}
        targets={rows.map((item) => item.title)}
        channel="licensing"
        defaultNotes="Pitch pack + EPK for this brief."
      />
      <Panel title="Fit-scored briefs">
        <DataTable
          headers={["Fit", "Priority", "Brief", "Source", "Genre", "Budget", "Deadline"]}
          rows={rows.map((item) => [
            item.fitScore,
            item.priority,
            item.title,
            item.source,
            item.genre,
            item.budget,
            item.deadline,
          ])}
        />
      </Panel>
    </div>
  );
}
