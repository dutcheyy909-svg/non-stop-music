import { DataTable } from "@/components/DataTable";
import { Panel } from "@/components/Ui";
import { readStore } from "@/lib/store";

export default async function AnrPage() {
  const store = await readStore();
  const csv = [
    "name,role,rightsReady,commercial,creative,sync,revenue",
    ...store.prospects.map(
      (p) =>
        `${p.name},${p.role},${p.rightsReady},${p.commercialScore},${p.creativeScore},${p.syncScore},${p.revenueProjection}`,
    ),
  ].join("\n");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">A&R Business</h1>
          <p className="mt-2 text-zinc-400">Prospect CRM with rights readiness and commercial / creative / sync scores.</p>
        </div>
        <a
          className="rounded-lg border border-fuchsia-400/40 px-4 py-2 text-sm"
          href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}
          download="dutcheyy-anr-prospects.csv"
        >
          Export CSV
        </a>
      </div>
      <Panel title="Prospects">
        <DataTable
          headers={["Name", "Rights", "Commercial", "Creative", "Sync", "Revenue £"]}
          rows={store.prospects.map((p) => [
            p.name,
            p.rightsReady ? "Ready" : "Research",
            p.commercialScore,
            p.creativeScore,
            p.syncScore,
            p.revenueProjection,
          ])}
        />
      </Panel>
    </div>
  );
}
