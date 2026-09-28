import { DataTable, WebLink } from "@/components/DataTable";
import { PitchForm } from "@/components/PitchForm";
import { Panel } from "@/components/Ui";
import { djDesks, djKindLabel, type DjDeskKind } from "@/lib/dj-desks";
import { readStore } from "@/lib/store";

const kinds: Array<DjDeskKind | "all"> = ["all", "play", "remix", "both"];

export default async function DjsPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string }>;
}) {
  const { kind: rawKind } = await searchParams;
  const kind = kinds.includes(rawKind as DjDeskKind) ? (rawKind as DjDeskKind) : "all";
  const store = await readStore();
  const rows = kind === "all" ? djDesks : djDesks.filter((item) => item.kind === kind || item.kind === "both");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-[0.25em] text-fuchsia-300">PITCH</p>
        <h1 className="mt-1 text-3xl font-semibold">DJ submissions</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">
          Public desks where DJs, mix-show hosts, record pools and remix contests actually take music. Use{" "}
          <strong>Get it played</strong> for sets, radio and pools. Use <strong>Get a remix</strong> for stem contests
          (or to host stems of a vault cut). Do not cold-email private DJ inboxes scraped from Instagram.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {kinds.map((item) => (
          <a
            key={item}
    href={item === "all" ? "/djs" : `/djs?kind=${item}`}
            className={`rounded-full px-4 py-2 text-sm ${
              (kind === "all" && item === "all") || kind === item
                ? "bg-fuchsia-600 text-white"
                : "border border-fuchsia-400/40 text-zinc-300"
            }`}
          >
            {item === "all" ? "All desks" : djKindLabel[item]}
          </a>
        ))}
      </div>

      <PitchForm
        tracks={store.tracks}
        targets={rows.map((item) => item.name)}
        channel="dj"
        defaultNotes="WAV + streaming link + BPM/key. Ask for a play in the next mix, or a remix if they produce. No unlicensed stems."
      />

      <Panel title={`${rows.length} desks`}>
        <DataTable
          headers={["Desk", "For", "Region", "Genre", "Cost", "Notes", "Open"]}
          rows={rows.map((item) => [
            item.name,
            djKindLabel[item.kind],
            item.region,
            item.genre,
            item.cost,
            item.blurb,
            <WebLink key={item.id} href={item.url} label="Submit" />,
          ])}
        />
      </Panel>
      <p className="text-xs text-zinc-500">
        Dutcheyy Radio is in-app: open Studio → Dutcheyy Radio. Other desks are official public pages; check live
        credits, eligibility and contest rules before you pay.
      </p>
    </div>
  );
}
