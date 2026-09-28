import { DataTable, WebLink } from "@/components/DataTable";
import { Panel } from "@/components/Ui";
import { readStore } from "@/lib/store";

export default async function FundingPage() {
  const store = await readStore();
  const rounds = [...(store.fundingRounds ?? [])].sort((a, b) =>
    String(a.deadline ?? "").localeCompare(String(b.deadline ?? "")),
  );
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Funding & deadlines</h1>
      <p className="text-zinc-400">
        Public funds that can sit alongside library and company outreach (Help Musicians, Arts Council, Creative
        Scotland, PRS Foundation). Dates checked September 2026 — always reconfirm on the source URL.
      </p>
      <Panel title="Programme calendar">
        <DataTable
          headers={["Deadline", "Status", "Funder", "Programme", "Amount", "Fit", "Source"]}
          rows={rounds.map((round) => [
            round.deadline,
            round.status,
            round.funder,
            round.programme,
            round.amount,
            round.fit,
            <WebLink key={round.id} href={round.url} label="Open" />,
          ])}
        />
      </Panel>
    </div>
  );
}
