import { CopyBlock } from "@/components/CopyBlock";
import { DataTable, WebLink } from "@/components/DataTable";
import { Panel } from "@/components/Ui";
import {
  buildSubmitTemplates,
  businessLinkGroups,
  businessLinks,
} from "@/lib/business-tools";
import { readStore } from "@/lib/store";

export default async function BusinessPage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string }>;
}) {
  const { track: trackId } = await searchParams;
  const store = await readStore();
  const track = store.tracks.find((item) => item.id === trackId) ?? store.tracks[0];
  const templates = buildSubmitTemplates(store, track);
  const submit = templates.filter((item) => item.group === "submit");
  const taxDocs = templates.filter((item) => item.group === "tax");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-[0.25em] text-fuchsia-300">BUSINESS</p>
        <h1 className="mt-1 text-3xl font-semibold">Business tools</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">
          UK tax desks, collections, and pre-made submit / invoice templates filled from the EPK and a vault track.
          This is a filing kit, not advice — confirm figures with HMRC or an accountant before you send a return.
        </p>
      </div>

      <form className="flex flex-wrap items-end gap-3">
        <label className="text-sm">
          Fill templates with track
          <select
            name="track"
            defaultValue={track?.id}
            className="mt-1 block min-w-[240px] rounded-lg border border-white/10 bg-black/60 px-3 py-2"
          >
            {store.tracks.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title} — {item.artist}
              </option>
            ))}
          </select>
        </label>
        <button className="rounded-lg border border-fuchsia-400/40 px-4 py-2 text-sm">Update templates</button>
      </form>

      {businessLinkGroups.map((group) => (
        <Panel key={group.id} title={group.title}>
          <DataTable
            headers={["Tool", "What it is for", "Open"]}
            rows={businessLinks
              .filter((item) => item.group === group.id)
              .map((item) => [item.name, item.blurb, <WebLink key={item.id} href={item.url} label="Open" />])}
          />
        </Panel>
      ))}

      <Panel title="Pre-made submit templates">
        <p className="mb-4 text-sm text-zinc-400">
          Copy into Groover, SubmitHub, radio forms, DJ remix briefs, blogs, or sync. Replace anything in [brackets].
        </p>
        <div className="grid gap-4 lg:grid-cols-2">
          {submit.map((item) => (
            <article key={item.id} className="rounded-xl border border-white/10 bg-black/40 p-4">
              <h3 className="font-semibold">{item.name}</h3>
              <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap text-xs text-zinc-300">{item.body}</pre>
              <CopyBlock text={item.body} filename={`${item.id}-${track?.id || "vault"}.${item.ext}`} />
            </article>
          ))}
        </div>
      </Panel>

      <Panel title="Tax paperwork templates">
        <div className="grid gap-4 lg:grid-cols-2">
          {taxDocs.map((item) => (
            <article key={item.id} className="rounded-xl border border-white/10 bg-black/40 p-4">
              <h3 className="font-semibold">{item.name}</h3>
              <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap text-xs text-zinc-300">{item.body}</pre>
              <CopyBlock text={item.body} filename={`${item.id}-${track?.id || "vault"}.${item.ext}`} />
            </article>
          ))}
        </div>
      </Panel>
    </div>
  );
}
