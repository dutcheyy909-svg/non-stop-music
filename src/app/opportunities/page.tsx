import { headers } from "next/headers";
import { DataTable, WebLink } from "@/components/DataTable";
import { Panel } from "@/components/Ui";
import { PitchForm } from "@/components/PitchForm";
import { importBrowseAiJson, importBrowseAiOpportunities, runBrowseAiSyncJob } from "@/lib/actions";
import { listedFee } from "@/lib/pipeline";
import { matchOpportunities } from "@/lib/engine";
import { readStore } from "@/lib/store";

export default async function OpportunitiesPage() {
  const store = await readStore();
  const rows = matchOpportunities(store);
  const browseRows = store.opportunities.filter((item) => /browse ai/i.test(item.source));
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "localhost:3001";
  const proto = requestHeaders.get("x-forwarded-proto") || (host.includes("localhost") || host.startsWith("127.") ? "http" : "https");
  const webhookUrl = `${proto}://${host}/api/browse-ai/webhook`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Opportunity Finder</h1>
        <p className="mt-2 text-zinc-400">
          Sync briefs from the master file plus Browse AI robots. Train the robot in Browse AI on public sync boards
          you are allowed to extract. Do not paste someone else&apos;s login cookies.
        </p>
      </div>

      <Panel title="Browse AI — sync licensing scrape">
        <p className="mb-3 text-sm text-zinc-400">
          Open your robot on{" "}
          <a className="text-fuchsia-300 underline" href="https://dashboard.browse.ai/" target="_blank" rel="noreferrer">
            dashboard.browse.ai
          </a>
          . Copy the robot page URL or the UUID from it. API key comes from{" "}
          <a className="text-fuchsia-300 underline" href="https://dashboard.browse.ai/api" target="_blank" rel="noreferrer">
            dashboard.browse.ai/api
          </a>
          . Webhook URL for this app:{" "}
          <code className="break-all text-fuchsia-200">{webhookUrl}</code>
          . Paste that full address into Browse AI. A path by itself is not a website. Cloud robots cannot call
          localhost — use a public HTTPS tunnel or your live domain with the same path.
        </p>
        <form className="grid gap-3">
          <label className="text-sm">
            Robot ID or robot URL
            <input
              name="robotId"
              defaultValue={store.browseAiRobotId}
              placeholder="https://dashboard.browse.ai/robots/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 font-mono text-sm"
            />
          </label>
          <label className="text-sm">
            Origin URL (optional — the page the robot should open)
            <input
              name="originUrl"
              defaultValue={store.browseAiOriginUrl}
              placeholder="https://syce.me/… (only if your robot takes originUrl)"
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2"
            />
          </label>
          <label className="text-sm">
            API key (leave blank if BROWSE_AI_API_KEY is already set)
            <input
              name="apiKey"
              type="password"
              autoComplete="off"
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 font-mono text-sm"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button formAction={runBrowseAiSyncJob} className="rounded-lg border border-fuchsia-400/40 px-4 py-2 text-sm">
              Run robot
            </button>
            <button
              formAction={importBrowseAiOpportunities}
              className="rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-medium hover:bg-fuchsia-500"
            >
              Pull latest captured briefs
            </button>
          </div>
        </form>
        <form action={importBrowseAiJson} className="grid gap-3">
          <textarea
            name="browseAiJson"
            rows={6}
            placeholder="Paste a Browse AI task JSON (capturedLists / capturedTexts) exported from the dashboard."
            className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 font-mono text-sm"
          />
          <button className="w-fit rounded-lg border border-white/15 px-4 py-2 text-sm">Import pasted JSON</button>
        </form>
        <p className="mt-3 text-xs text-zinc-500">{browseRows.length} briefs currently tagged from Browse AI.</p>
      </Panel>

      <PitchForm
        tracks={store.tracks}
        targets={rows.map((item) => item.title)}
        channel="licensing"
        defaultNotes="Pitch pack + EPK for this brief."
      />
      <Panel title="Fit-scored briefs">
        <DataTable
          headers={["Fit", "Fee type", "Priority", "Brief", "Source", "Source of truth", "Genre", "Budget", "Deadline"]}
          rows={rows.map((item) => [
            item.fitScore,
            listedFee(item.budget).kind,
            item.priority,
            item.title,
            item.source,
            <WebLink key={item.id} href={item.sourceOfTruthUrl} label="Check deadline" />,
            item.genre,
            item.budget,
            item.deadline,
          ])}
        />
      </Panel>
    </div>
  );
}
