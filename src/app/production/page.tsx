import { DataTable } from "@/components/DataTable";
import { PpcAdSlot, PpcLink, PpcPageHit } from "@/components/PpcLink";
import { Tools4MusicSaveForm } from "@/components/Tools4MusicSaveForm";
import { Kpi, Panel } from "@/components/Ui";
import { mixingCheatRules, mixingCheatSheet } from "@/lib/mixing-cheatsheet";
import { internetTemplateLinks, mixingTemplateMarkdown, mixingTemplates } from "@/lib/mixing-templates";
import { productionCategories, productionTools } from "@/lib/production-tools";
import { readStore } from "@/lib/store";

const CPC_GBP = 0.12;

export default async function ProductionPage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string }>;
}) {
  const { track: trackId } = await searchParams;
  const store = await readStore();
  const selected = store.tracks.find((item) => item.id === trackId) ?? store.tracks[0];
  const approvedVendor = (store.vendorProducts ?? []).filter((item) => item.status === "approved");
  const vendorByCategory = new Map<string, typeof approvedVendor>();
  for (const item of approvedVendor) {
    const list = vendorByCategory.get(item.category) ?? [];
    list.push(item);
    vendorByCategory.set(item.category, list);
  }
  const categories = [...new Set([...productionCategories, ...vendorByCategory.keys()])];
  const free = productionTools.filter((tool) => /free/i.test(tool.cost)).length;
  const paidLinks = internetTemplateLinks.filter((item) => item.kind === "paid-official");
  const freeLinks = internetTemplateLinks.filter((item) => item.kind === "free-official");
  const events = store.ppcEvents ?? [];
  const pageHits = events.filter((item) => item.kind === "pageview" && item.page === "/production").length;
  const clicks = events.filter((item) => item.kind === "click").length;
  const estimate = (clicks * CPC_GBP).toFixed(2);

  return (
    <div className="space-y-6">
      <PpcPageHit page="/production" />
      <div>
        <p className="text-xs tracking-[0.25em] text-fuchsia-300">STUDIO</p>
        <h1 className="mt-1 text-3xl font-semibold">Production suite</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">
          Mix recipes, cut/boost cheat sheet, and vendor links without leaving the desk. Vendors use the{" "}
          <a className="text-fuchsia-300 underline" href="/vendors">
            Vendor
          </a>{" "}
          button to upload a product; it stays queued until approval. Outbound shop clicks are logged as PPC.
        </p>
      </div>

      <PpcAdSlot />

      <Panel title="BPM / delay onto a vault cut">
        <p className="mb-3 text-sm text-zinc-400">
          Tap tempo and delay time on Tools 4 Music, then save here or on that desk. Notes land on the catalogue cut.
        </p>
        <Tools4MusicSaveForm tracks={store.tracks} selected={selected} loadPath="/production" />
      </Panel>

      <div className="grid gap-4 sm:grid-cols-4">
        <Kpi label="Page views" value={pageHits} />
        <Kpi label="PPC clicks" value={clicks} />
        <Kpi label="Est. CPC" value={`£${estimate}`} hint={`£${CPC_GBP} per logged click`} />
        <Kpi label="Recipes" value={mixingTemplates.length} hint={`${free} free-path tools`} />
      </div>

      <Panel title="Mixing cheat sheet — when to cut vs boost">
        <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-zinc-300">
          {mixingCheatRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
        <div className="grid gap-3 lg:grid-cols-2">
          {mixingCheatSheet.map((row) => (
            <article key={row.band} className="rounded-xl border border-white/10 bg-black/40 p-4">
              <p className="text-xs tracking-[0.18em] text-fuchsia-300">{row.hz}</p>
              <h3 className="mt-1 font-semibold">{row.band}</h3>
              <p className="mt-2 text-sm">
                <span className="text-fuchsia-200">Cut: </span>
                <span className="text-zinc-300">{row.cutWhen}</span>
              </p>
              <p className="mt-2 text-sm">
                <span className="text-fuchsia-200">Boost: </span>
                <span className="text-zinc-300">{row.boostWhen}</span>
              </p>
              <p className="mt-2 text-xs text-zinc-500">{row.amount}</p>
            </article>
          ))}
        </div>
      </Panel>

      <Panel title="Free from the internet (official)">
        <DataTable
          headers={["Template", "Vendor", "DAW", "Notes", "Source"]}
          rows={freeLinks.map((item) => [
            item.name,
            item.vendor,
            item.daw,
            item.notes,
            <PpcLink key={item.id} href={item.url} label="Open" />,
          ])}
        />
      </Panel>

      <Panel title="Paid — buy from the vendor">
        <DataTable
          headers={["Template", "Vendor", "DAW", "Notes", "Buy"]}
          rows={paidLinks.map((item) => [
            item.name,
            item.vendor,
            item.daw,
            item.notes,
            <PpcLink key={item.id} href={item.url} label="Shop" />,
          ])}
        />
      </Panel>

      {mixingTemplates.map((template) => {
        const markdown = mixingTemplateMarkdown(template);
        const downloadHref = `data:text/markdown;charset=utf-8,${encodeURIComponent(markdown)}`;
        return (
          <Panel
            key={template.id}
            title={template.name}
            action={
              <a
                href={downloadHref}
                download={`${template.id}.md`}
                className="rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-medium hover:bg-fuchsia-500"
              >
                Download recipe
              </a>
            }
          >
            <p className="mb-4 text-sm text-zinc-400">
              {template.daw} · {template.sampleRate} · {template.bitDepth}. {template.notes}
            </p>
            <h3 className="mb-2 text-sm font-semibold text-fuchsia-200">Buses</h3>
            <ul className="mb-6 list-disc space-y-1 pl-5 text-sm text-zinc-300">
              {template.buses.map((bus) => (
                <li key={bus}>{bus}</li>
              ))}
            </ul>
            <DataTable
              headers={["Channel", "Instrument", "Type", "Colour", "Output", "Sends", "Inserts"]}
              rows={template.channels.map((channel) => [
                channel.name,
                channel.instrument || "—",
                channel.type,
                channel.colour,
                channel.output,
                channel.sends,
                channel.inserts
                  .map((insert) => `${insert.slot}. ${insert.plugin} [${insert.house}] — ${insert.setting}`)
                  .join(" · "),
              ])}
            />
          </Panel>
        );
      })}

      {categories.map((category) => {
        const rows = productionTools.filter((tool) => tool.category === category);
        const vendorRows = vendorByCategory.get(category) ?? [];
        if (!rows.length && !vendorRows.length) return null;
        return (
          <Panel key={category} title={category}>
            <DataTable
              headers={["Tool", "Cost", "Fit", "Why it helps", "Source"]}
              rows={[
                ...rows.map((tool) => [
                  tool.name,
                  tool.cost,
                  tool.fit,
                  tool.why,
                  <PpcLink key={tool.id} href={tool.url} label="Open" />,
                ]),
                ...vendorRows.map((item) => [
                  `${item.productName} (${item.vendorName})`,
                  item.cost || "—",
                  "Vendor listing",
                  item.description,
                  item.productUrl ? (
                    <PpcLink key={item.id} href={item.productUrl} label="Open" />
                  ) : item.filePath ? (
                    <a key={item.id} className="text-fuchsia-300 underline" href={item.filePath}>
                      File
                    </a>
                  ) : (
                    "—"
                  ),
                ]),
              ]}
            />
          </Panel>
        );
      })}
    </div>
  );
}
