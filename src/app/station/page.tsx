import { DataTable } from "@/components/DataTable";
import { Kpi, Panel } from "@/components/Ui";
import {
  addRadioRotation,
  logDutcheyyRadioSpin,
  submitToDutcheyyRadio,
  takeRadioSubmissionFee,
} from "@/lib/actions";
import { dutcheyyRadio, gbp } from "@/lib/dutcheyy-radio";
import { readStore } from "@/lib/store";

export default async function StationPage() {
  const store = await readStore();
  const submissions = store.radioSubmissions ?? [];
  const spins = store.radioSpins ?? [];
  const ledger = store.radioLedger ?? [];
  const income = ledger.filter((line) => line.direction === "in").reduce((sum, line) => sum + line.amountGbp, 0);
  const outgoing = ledger.filter((line) => line.direction === "out").reduce((sum, line) => sum + line.amountGbp, 0);
  const rotation = submissions.filter((item) => item.status === "rotation");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-[0.25em] text-fuchsia-300">ON AIR</p>
        <h1 className="mt-1 text-3xl font-semibold">{dutcheyyRadio.name}</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">
          {dutcheyyRadio.slogan} · {dutcheyyRadio.format} · {dutcheyyRadio.territory}. Submission fee{" "}
          {gbp(dutcheyyRadio.submissionFeeGbp)} · mechanical {gbp(dutcheyyRadio.mechanicalPerSpinGbp)} per spin ·
          society reserve {gbp(dutcheyyRadio.performanceReserveGbp)} per spin.
        </p>
        <p className="mt-2 max-w-3xl text-sm text-zinc-500">{dutcheyyRadio.notes}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Kpi label="Income" value={gbp(income)} hint="Fees + mechanicals in" />
        <Kpi label="Society reserve" value={gbp(outgoing)} hint="Hold for PRS / PPL" />
        <Kpi label="Net on desk" value={gbp(income - outgoing)} />
        <Kpi label="Spins logged" value={spins.length} />
      </div>

      <Panel title="Now playing / rotation">
        {rotation.length ? (
          <ul className="space-y-2 text-sm">
            {rotation.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 px-3 py-2">
                <span>
                  {item.trackTitle} — {item.artist}
                  {item.isrc ? ` · ${item.isrc}` : ""}
                </span>
                <form action={logDutcheyyRadioSpin}>
                  <input type="hidden" name="submissionId" value={item.id} />
                  <button className="rounded-lg bg-fuchsia-600 px-3 py-1.5 text-sm hover:bg-fuchsia-500">Log spin</button>
                </form>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-400">Nothing in rotation yet. Take a fee, then add to rotation.</p>
        )}
      </Panel>

      <Panel title="Submit a cut (submission fee)">
        <form action={submitToDutcheyyRadio} className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            Track
            <select name="trackId" required className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2">
              {store.tracks.map((track) => (
                <option key={track.id} value={track.id}>
                  {track.title} — {track.artist}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Notes
            <input name="notes" className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2" />
          </label>
          <label className="flex items-center gap-2 text-sm md:col-span-2">
            <input type="checkbox" name="paidNow" className="rounded" />
            Fee of {gbp(dutcheyyRadio.submissionFeeGbp)} already received
          </label>
          <button className="rounded-lg bg-fuchsia-600 px-4 py-2 font-medium hover:bg-fuchsia-500 md:col-span-2">
            Submit to Dutcheyy Radio
          </button>
        </form>
      </Panel>

      <Panel title="Inbox">
        <DataTable
          headers={["When", "Track", "Artist", "Owned", "Fee", "Status", "Action"]}
          rows={submissions.map((item) => [
            item.createdAt.slice(0, 16).replace("T", " "),
            item.trackTitle,
            item.artist,
            item.owned ? "Dutcheyy" : "Outside",
            gbp(item.submissionFeeGbp),
            item.status,
            item.status === "awaiting-fee" ? (
              <form key={`${item.id}-pay`} action={takeRadioSubmissionFee}>
                <input type="hidden" name="submissionId" value={item.id} />
                <button className="text-fuchsia-300 underline">Take fee</button>
              </form>
            ) : item.status === "paid" ? (
              <form key={`${item.id}-rot`} action={addRadioRotation}>
                <input type="hidden" name="submissionId" value={item.id} />
                <button className="text-fuchsia-300 underline">Add to rotation</button>
              </form>
            ) : (
              "—"
            ),
          ])}
        />
      </Panel>

      <Panel title="Ledger">
        <DataTable
          headers={["When", "Kind", "In/out", "Amount", "Detail"]}
          rows={ledger.map((line) => [
            line.at.slice(0, 16).replace("T", " "),
            line.kind,
            line.direction,
            gbp(line.amountGbp),
            line.detail,
          ])}
        />
      </Panel>
    </div>
  );
}
