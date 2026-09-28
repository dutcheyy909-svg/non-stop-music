import { DataTable, WebLink } from "@/components/DataTable";
import { Panel } from "@/components/Ui";
import { readStore } from "@/lib/store";

export default async function LibrariesPage() {
  const store = await readStore();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Libraries</h1>
      <p className="text-zinc-400">
        Music and sync companies from the master book, with the next public funding window that can support pitching,
        catalogue or company growth. Confirm eligibility on the funder site before applying.
      </p>
      <Panel title="Outlets + funding">
        <DataTable
          headers={["Name", "Category", "Genre", "Funding", "Deadline", "Status", "Fund link", "Company URL"]}
          rows={(store.libraries ?? []).map((item) => [
            item.name,
            item.category,
            item.genre,
            item.funding,
            item.fundingDeadline,
            item.fundingStatus,
            <WebLink key={`${item.id}-f`} href={item.fundingUrl} label="Apply / guidance" />,
            <WebLink key={`${item.id}-u`} href={item.url} />,
          ])}
        />
      </Panel>
    </div>
  );
}
